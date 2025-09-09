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
client.commands = new Collection();
client.slashcommands = new Collection();
client.commandaliases = new Collection();

const log = (x) => console.log(`[${moment().format("DD-MM-YYYY HH:mm:ss")}] ${x}`);

// ==== SLASH COMMAND HANDLER ====
const slashcommands = [];
readdirSync('./src/commands').forEach(file => {
  const command = require(`./src/commands/${file}`);
  slashcommands.push(command.data.toJSON());
  client.slashcommands.set(command.data.name, command);
});

// ==== KOMUT YÜKLEME (Hem guild hem global) ====
client.once(Events.ClientReady, async () => {
  try {
    // Test sunucuna yükle (instant update)
    await rest.put(
      Routes.applicationGuildCommands(client.user.id, "1408511083232362547"), 
      { body: slashcommands }
    );
    log(`${slashcommands.length} komut test sunucuna yüklendi ✅`);

    // Global yükle (yayılması 1 saat sürebilir)
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

// ==== EVENT HANDLER ====
readdirSync('./src/events').forEach(file => {
  const event = require(`./src/events/${file}`);
  if (event.once) {
    client.once(event.name, (...args) => event.execute(...args));
  } else {
    client.on(event.name, (...args) => event.execute(...args));
  }
});

// ==== NODE.JS LISTENERS ====
process.on("unhandledRejection", e => console.log(e));
process.on("uncaughtException", e => console.log(e));
process.on("uncaughtExceptionMonitor", e => console.log(e));

// ==== OTOROL ====
client.on("guildMemberAdd", (member) => {
  const rolId = db.get(`otorol_${member.guild.id}`);
  if (!rolId) return;

  const rol = member.guild.roles.cache.get(rolId);
  if (!rol) return db.delete(`otorol_${member.guild.id}`); // rol silinmişse db'den kaldır

  member.roles.add(rol).catch(() => {});
});

// ==== REKLAM ENGEL ====
client.on("messageCreate", async (message) => {
  if (!message.guild || message.author.bot) return;

  const reklamEngel = db.get(`reklamengel_${message.guild.id}`);
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
        .setDescription(`<@${message.author.id}>, bu sunucuda reklam yapmak yasak!`)
        .setTimestamp();

      const uyari = await message.channel.send({ embeds: [embed] });
      setTimeout(() => uyari.delete().catch(() => {}), 5000); // 5 saniye sonra mesajı sil
    } catch (err) {
      console.error("Reklam engelleme hatası:", err);
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