const { 
  Client, 
  Collection, 
  Events, 
  GatewayIntentBits, 
  PermissionFlagsBits, 
  Partials, 
  EmbedBuilder
} = require("discord.js");
const { readdirSync } = require("fs");
const moment = require("moment");
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v10');
const express = require("express");
const db = require("croxydb");

// ==== CLIENT ====
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMessageReactions,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.DirectMessages
  ],
  shards: "auto",
  partials: [
    Partials.Message,
    Partials.Channel,
    Partials.GuildMember,
    Partials.Reaction,
    Partials.User
  ]
});

// 🔑 Token
const token = process.env.token;
const rest = new REST({ version: '10' }).setToken(token);

// Koleksiyonlar
client.slashcommands = new Collection();

const log = (x) => console.log(`[${moment().format("DD-MM-YYYY HH:mm:ss")}] ${x}`);

// ==== SLASH COMMAND HANDLER ====
const slashcommands = [];
readdirSync('./src/commands').forEach(file => {
  const command = require(`./src/commands/${file}`);
  slashcommands.push(command.data.toJSON());
  client.slashcommands.set(command.data.name, command);
});

// ==== KOMUT YÜKLEME ====
client.once(Events.ClientReady, async () => {
  try {
    await rest.put(
      Routes.applicationGuildCommands(client.user.id, "1408511083232362547"), 
      { body: slashcommands }
    );
    log(`${slashcommands.length} komut test sunucuna yüklendi ✅`);

    await rest.put(
      Routes.applicationCommands(client.user.id),
      { body: slashcommands }
    );
    log(`${slashcommands.length} komut global yüklendi 🌍`);
  } catch (error) {
    console.error(error);
  }

  log(`${client.user.username} aktif edildi!`);
});

// ==== KOMUT ÇALIŞTIRMA ====
client.on(Events.InteractionCreate, async interaction => {
  if (!interaction.isChatInputCommand()) return;

  const command = client.slashcommands.get(interaction.commandName);
  if (!command) return;

  try {
    if (typeof command.execute === "function") {
      await command.execute(interaction, client);
    } else if (typeof command.run === "function") {
      await command.run(interaction, client);
    } else {
      throw new Error(`Komut ${interaction.commandName} içinde execute/run fonksiyonu yok.`);
    }
  } catch (error) {
    console.error(`[ERROR] ${interaction.commandName}:`, error);
    if (!interaction.replied && !interaction.deferred) {
      await interaction.reply({ content: "❌ Komut çalıştırılırken bir hata oluştu.", ephemeral: true });
    } else {
      await interaction.editReply({ content: "❌ Komut çalıştırılırken bir hata oluştu." });
    }
  }
});

// ==== NODE.JS LISTENERS ====
process.on("unhandledRejection", e => console.log(e));
process.on("uncaughtException", e => console.log(e));
process.on("uncaughtExceptionMonitor", e => console.log(e));

// ==== OTOROL ====
client.on("guildMemberAdd", member => {
  const rol = db.get(`otorol_${member.guild.id}`);
  if (!rol) return;
  member.roles.add(rol).catch(err => {
    console.error(`[OTOROL] ${member.user.tag} için rol verilemedi:`, err);
  });
});

// ==== REKLAM ENGEL ====
client.on("messageCreate", async (message) => {
  if (!message.guild || message.author.bot) return;

  let reklamEngel = db.get(`reklamengel_${message.guild.id}`);
  if (!reklamEngel) return;

  const linkler = [
    ".com", ".net", ".org", ".xyz", ".gg", ".tk", ".cf", ".ml", ".ga", ".gq",
    "http://", "https://", "www.", ".io", ".co", ".pw", ".us", ".uk"
  ];

  if (linkler.some(link => message.content.toLowerCase().includes(link))) {
    if (message.member.permissions.has(PermissionFlagsBits.ManageMessages)) return;

    try {
      await message.delete();
      const embed = new EmbedBuilder()
        .setColor("Red")
        .setTitle("🚫 Reklam Engellendi!")
        .setDescription(`<@${message.author.id}>, reklam yapmak yasaktır.`)
        .setTimestamp();
      await message.channel.send({ embeds: [embed] });
    } catch (err) {
      console.error("[REKLAM ENGEL] Mesaj silinirken hata:", err);
    }
  }
});

// ==== BOT LOGIN ====
client.login(token);

// ==== EXPRESS (Render için) ====
const app = express();
const port = 3000;
app.get('/', (req, res) => res.sendStatus(200));
app.listen(port, () => {
  console.log(`Sunucu ${port} numaralı bağlantı noktasında yürütülüyor.`);
});
//////////////////////////////////////////////////////
client.on("messageReactionAdd", async (reaction, user) => {
  if (user.bot || !reaction.message.guild) return;

  const veri = db.get(`tepkirol_${reaction.message.id}`);
  if (!veri) return;

  const emojiKey = reaction.emoji.id
    ? `<:${reaction.emoji.name}:${reaction.emoji.id}>`
    : reaction.emoji.name;

  const rolID = veri.roller[emojiKey];
  if (!rolID) return;

  const member = await reaction.message.guild.members.fetch(user.id);
  member.roles.add(rolID).catch(console.error);
});

client.on("messageReactionRemove", async (reaction, user) => {
  if (user.bot || !reaction.message.guild) return;

  const veri = db.get(`tepkirol_${reaction.message.id}`);
  if (!veri) return;

  const emojiKey = reaction.emoji.id
    ? `<:${reaction.emoji.name}:${reaction.emoji.id}>`
    : reaction.emoji.name;

  const rolID = veri.roller[emojiKey];
  if (!rolID) return;

  const member = await reaction.message.guild.members.fetch(user.id);
  member.roles.remove(rolID).catch(console.error);
});
