const { EmbedBuilder } = require("discord.js");
const fs = require("fs");
const db = require("croxydb");

module.exports = client => {
  client.on("messageCreate", async message => {
    if (message.author.bot || !message.guild) return;

    const küfürler = JSON.parse(fs.readFileSync("./küfürler.json", "utf8"));
    const içerik = message.content.toLowerCase();

    if (küfürler.some(k => içerik.includes(k))) {
      await message.delete();

      const uyarıKey = `uyarı_${message.author.id}_${message.guild.id}`;
      let uyarıSayısı = db.get(uyarıKey) || 0;
      uyarıSayısı++;
      db.set(uyarıKey, uyarıSayısı);

      const embed = new EmbedBuilder()
        .setColor("Red")
        .setTitle("🚫 Küfür Tespit Edildi")
        .setDescription(`<@${message.author.id}> küfürlü mesaj gönderdi ve silindi.`)
        .addFields(
          { name: "Mesaj", value: `\`${message.content}\``, inline: false },
          { name: "Uyarı Sayısı", value: `${uyarıSayısı}`, inline: true }
        )
        .setFooter({ text: `Kanal: #${message.channel.name}` })
        .setTimestamp();

      try {
        await message.channel.send({ embeds: [embed] });
      } catch (err) {
        console.log("Uyarı mesajı gönderilemedi:", err);
      }

      const logID = db.get(`kufurlog_${message.guild.id}`);
      if (logID) {
        const logChannel = message.guild.channels.cache.get(logID);
        if (logChannel) {
          logChannel.send({ embeds: [embed] });
        }
      }
    }
  });
};
