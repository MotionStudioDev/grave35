require("dotenv").config();
const { Client, Collection, Events, GatewayIntentBits, PermissionFlagsBits, Partials, EmbedBuilder } = require("discord.js");
const { readdirSync } = require("fs");
const moment = require("moment");
const { REST, Routes } = require("discord.js");
const db = require("croxydb");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildEmojisAndStickers,
    GatewayIntentBits.GuildIntegrations,
    GatewayIntentBits.GuildWebhooks,
    GatewayIntentBits.GuildInvites,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.GuildPresences,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMessageReactions,
    GatewayIntentBits.GuildMessageTyping,
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.DirectMessageReactions,
    GatewayIntentBits.DirectMessageTyping,
    GatewayIntentBits.MessageContent
  ],
  shards: "auto",
  partials: [
    Partials.Message,
    Partials.Channel,
    Partials.GuildMember,
    Partials.Reaction,
    Partials.GuildScheduledEvent,
    Partials.User,
    Partials.ThreadMember
  ]
});

client.commands = new Collection();
client.slashcommands = new Collection();
client.commandaliases = new Collection();

const rest = new REST({ version: "10" }).setToken(process.env.token);
const log = x => console.log(`[${moment().format("DD-MM-YYYY HH:mm:ss")}] ${x}`);

// ==== SLASH COMMAND HANDLER ====
const slashcommands = [];
readdirSync("./src/commands").forEach(file => {
  const command = require(`./src/commands/${file}`);
  slashcommands.push(command.data.toJSON());
  client.slashcommands.set(command.data.name, command);
});

client.on(Events.ClientReady, async () => {
  try {
    await rest.put(
      Routes.applicationCommands(client.user.id),
      { body: slashcommands }
    );
    log(`${slashcommands.length} komut yüklendi.`);
  } catch (error) {
    console.error(error);
  }
  log(`${client.user.username} Aktif Edildi!`);
});

// ==== EVENT HANDLER ====
readdirSync("./src/events").forEach(file => {
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
client.on("guildMemberAdd", member => {
  const rol = db.get(`otorol_${member.guild.id}`);
  if (!rol) return;
  member.roles.add(rol).catch(() => { });
});

// ==== REKLAM ENGEL ====
client.on("messageCreate", message => {
  let reklamlar = db.fetch(`reklamengel_${message.guild.id}`);
  if (!reklamlar) return;

  const linkler = [
    ".com.tr", ".net", ".org", ".tk", ".cf", ".gf",
    "https://", ".gq", "http://", ".com", ".gg",
    ".porn", ".edu"
  ];

  if (linkler.some(alo => message.content.toLowerCase().includes(alo))) {
    if (message.member.permissions.has(PermissionFlagsBits.ManageMessages)) return;
    message.delete();
    const embed = new EmbedBuilder()
      .setDescription(`<@${message.author.id}>, dostum. Bu sunucuda reklam engelleme sistemi aktif!`);
    message.channel.send({ embeds: [embed] });
  }
});

// ==== BOT LOGIN ====
client.login(process.env.token);
// Sunucu oluşturma ve proje aktivitesi sağlama.
const express = require('express');
const app = express();
const port = 3000;

// Web sunucu
app.get('/', (req, res) => {
  res.sendStatus(200);
});

app.listen(port, () => {
  console.log(`Sunucu ${port} numaralı bağlantı noktasında yürütülüyor.`);
});
