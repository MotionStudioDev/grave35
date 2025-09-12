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
//////
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
  await member.roles.remove(rolID).catch(console.error);

  // 🔔 Log embed gönder
  const logID = db.get(`tepkilog_${reaction.message.guild.id}`);
  if (!logID) return;

  const logChannel = reaction.message.guild.channels.cache.get(logID);
  if (!logChannel) return;

  const embed = new EmbedBuilder()
    .setColor("Red")
    .setTitle("🚫 Tepki Rol Alındı")
    .addFields(
      { name: "Kullanıcı", value: `${user.tag} (<@${user.id}>)`, inline: true },
      { name: "Emoji", value: emojiKey, inline: true },
      { name: "Alınan Rol", value: `<@&${rolID}>`, inline: true }
    )
    .setTimestamp();

  logChannel.send({ embeds: [embed] });
});
/////////////////////////LOG SİSTEMLERİ///////////////////////////
//TEPKİ ROL
client.on("messageReactionAdd", async (reaction, user) => {
  const veri = db.get(`tepkirol_${reaction.message.id}`);
  if (!veri || user.bot) return;

  const emojiKey = reaction.emoji.id
    ? `<:${reaction.emoji.name}:${reaction.emoji.id}>`
    : reaction.emoji.name;

  const rolID = veri.roller[emojiKey];
  if (!rolID) return;

  const member = await reaction.message.guild.members.fetch(user.id);
  await member.roles.add(rolID).catch(console.error);

  const logID = db.get(`tepkilog_${reaction.message.guild.id}`);
  if (!logID) return;

  const channel = reaction.message.guild.channels.cache.get(logID);
  if (!channel) return;

  const embed = new EmbedBuilder()
    .setColor("Green")
    .setTitle("🎯 Tepki Rol Verildi")
    .setDescription(`${user.tag} → ${emojiKey} → <@&${rolID}>`)
    .setTimestamp();

  channel.send({ embeds: [embed] });
});
////////BAN LOG
client.on("guildBanAdd", async ban => {
  const logID = db.get(`banlog_${ban.guild.id}`);
  if (!logID) return;

  const channel = ban.guild.channels.cache.get(logID);
  if (!channel) return;

  const embed = new EmbedBuilder()
    .setColor("Red")
    .setTitle("🔨 Ban Log")
    .setDescription(`${ban.user.tag} sunucudan banlandı.`)
    .setTimestamp();

  channel.send({ embeds: [embed] });
});
////KİCK LOG
client.on("guildMemberRemove", async member => {
  const logID = db.get(`kicklog_${member.guild.id}`);
  if (!logID) return;

  const channel = member.guild.channels.cache.get(logID);
  if (!channel) return;

  const embed = new EmbedBuilder()
    .setColor("Orange")
    .setTitle("👢 Kick Log")
    .setDescription(`${member.user.tag} sunucudan ayrıldı veya kicklendi.`)
    .setTimestamp();

  channel.send({ embeds: [embed] });
});
/////SES LOG 
client.on("voiceStateUpdate", async (oldState, newState) => {
  const logID = db.get(`seslog_${newState.guild.id}`);
  if (!logID) return;

  const channel = newState.guild.channels.cache.get(logID);
  if (!channel) return;

  const user = newState.member.user;
  let action = "";

  if (!oldState.channelId && newState.channelId) {
    action = `🔊 **${user.tag}** ses kanalına katıldı: <#${newState.channelId}>`;
  } else if (oldState.channelId && !newState.channelId) {
    action = `🔇 **${user.tag}** ses kanalından ayrıldı: <#${oldState.channelId}>`;
  } else if (oldState.channelId !== newState.channelId) {
    action = `🔁 **${user.tag}** ses kanalını değiştirdi: <#${oldState.channelId}> → <#${newState.channelId}>`;
  }

  if (action) {
    const embed = new EmbedBuilder()
      .setColor("Purple")
      .setTitle("🎙️ Ses Log")
      .setDescription(action)
      .setTimestamp();

    channel.send({ embeds: [embed] });
  }
});
///// ROL LOG
client.on("guildMemberUpdate", async (oldMember, newMember) => {
  const logID = db.get(`rollog_${newMember.guild.id}`);
  if (!logID) return;

  const channel = newMember.guild.channels.cache.get(logID);
  if (!channel) return;

  const addedRoles = newMember.roles.cache.filter(role => !oldMember.roles.cache.has(role.id));
  const removedRoles = oldMember.roles.cache.filter(role => !newMember.roles.cache.has(role.id));

  const embed = new EmbedBuilder()
    .setColor("Gold")
    .setTitle("🎭 Rol Log")
    .setDescription(`**${newMember.user.tag}** için rol değişikliği:`)
    .setTimestamp();

  if (addedRoles.size > 0) {
    embed.addFields({ name: "✅ Eklenen Roller", value: addedRoles.map(r => `<@&${r.id}>`).join(", ") });
  }

  if (removedRoles.size > 0) {
    embed.addFields({ name: "❌ Silinen Roller", value: removedRoles.map(r => `<@&${r.id}>`).join(", ") });
  }

  if (addedRoles.size > 0 || removedRoles.size > 0) {
    channel.send({ embeds: [embed] });
  }
});
///// MOD LOG
client.on("interactionCreate", async interaction => {
  if (!interaction.isChatInputCommand()) return;

  const logID = db.get(`modlog_${interaction.guild.id}`);
  if (!logID) return;

  const logChannel = interaction.guild.channels.cache.get(logID);
  if (!logChannel) return;

  const embed = new EmbedBuilder()
    .setColor("Blue")
    .setTitle("🛠️ Mod Komutu Kullanıldı")
    .setDescription(`**Komut:** /${interaction.commandName}\n**Kullanıcı:** ${interaction.user.tag}`)
    .setTimestamp();

  logChannel.send({ embeds: [embed] });
});
///İSİM LOG 
client.on("guildMemberUpdate", async (oldMember, newMember) => {
  const logID = db.get(`isimlog_${newMember.guild.id}`);
  if (!logID) return;

  const channel = newMember.guild.channels.cache.get(logID);
  if (!channel) return;

  if (oldMember.nickname !== newMember.nickname || oldMember.user.username !== newMember.user.username) {
    const embed = new EmbedBuilder()
      .setColor("Aqua")
      .setTitle("📝 İsim Değişikliği")
      .setDescription(`**Kullanıcı:** ${newMember.user.tag}`)
      .addFields(
        { name: "Eski İsim", value: oldMember.nickname || oldMember.user.username, inline: true },
        { name: "Yeni İsim", value: newMember.nickname || newMember.user.username, inline: true }
      )
      .setTimestamp();

    channel.send({ embeds: [embed] });
  }
});
