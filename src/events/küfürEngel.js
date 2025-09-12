const { EmbedBuilder } = require("discord.js");
const fs = require("fs");
const db = require("croxydb");

module.exports = client => {
  client.on("messageCreate", async message => {
    if (message.author.bot || !message.guild) return;

    const küfürler = JSON.parse(fs.readFileSync("./küfürler.json", "utf8"));
    const içerik = message.content.toLowerCase();

    if (küfürler.some(k => içerik.includes(k))) {
      await message.delete(); // ✅ Küfürlü mesajı anında sil

      const uyarıKey = `uyarı_${message.author.id}_${message.guild.id}`;
      let uyarıSayısı = db.get(uyarıKey) || 0;
      uyarıSayısı++;
      db.set(uyarıKey, uyarıSayısı);

      const embed = new EmbedBuilder()
        .setColor("Red")
        .setTitle("🚫 Küfür Tespit Edildi")
        .setDescription(`<@${message.author.id}> küfürlü mesaj gönderdi.\n**Bu uyarı 3 saniye içinde silinecektir.**`)
        .addFields(
          { name: "Uyarı Sayısı", value: `${uyarıSayısı}` }
        )
        .setFooter({ text: `Kanal: #${message.channel.name}` })
        .setTimestamp();

      const uyarıMesajı = await message.channel.send({ embeds: [embed] }).catch(() => {});

      // ⏱️ 3 saniye sonra uyarı embed’ini sil
      setTimeout(() => {
        if (uyarıMesajı) uyarıMesajı.delete().catch(() => {});
      }, 3000);

      const logID = db.get(`kufurlog_${message.guild.id}`);
      if (logID) {
        const logChannel = message.guild.channels.cache.get(logID);
        if (logChannel) {
          logChannel.send({ embeds: [embed] }).catch(() => {});
        }
      }
    }
  });
};
