const fs = require("fs");
const path = require("path");
const db = require("croxydb");
const { EmbedBuilder } = require("discord.js");

module.exports = async (message) => {
  if (message.author.bot || !message.guild) return;

  const küfürListesi = JSON.parse(fs.readFileSync(path.join(__dirname, "../küfürler.json"), "utf8"));
  const içerik = message.content.toLowerCase();
  const küfürVar = küfürListesi.some(k => içerik.includes(k));
  const logKanalID = db.get(`kufurlog_${message.guild.id}`);

  if (!db.has(`kufurlog_${message.guild.id}`)) return;
  if (!küfürVar) return;

  await message.delete();

  const embed = new EmbedBuilder()
    .setColor("Red")
    .setTitle("⚠️ Küfür Tespit Edildi")
    .setDescription(`${message.author} bu sunucuda küfür kullandı.`);

  const key = `uyarı_${message.author.id}_${message.guild.id}`;
  db.add(key, 1);

  const uyarıMesajı = await message.channel.send({ embeds: [embed] });
  setTimeout(() => uyarıMesajı.delete().catch(() => {}), 2000);

  if (logKanalID) {
    const logChannel = message.guild.channels.cache.get(logKanalID);
    if (logChannel) logChannel.send({ embeds: [embed] });
  }
};
