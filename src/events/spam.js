const { EmbedBuilder } = require("discord.js");
const { spamDurumu } = require("../commands/spam-sistemi.js");

const userMessages = new Map();

module.exports = async (client, message) => {
  if (message.author.bot || !message.guild) return;

  const guildId = message.guild.id;
  if (!spamDurumu.get(guildId)) return;

  const userId = message.author.id;
  const now = Date.now();
  const geçmiş = userMessages.get(userId) || [];

  geçmiş.push({ content: message.content, timestamp: now, id: message.id });
  userMessages.set(userId, geçmiş.filter(m => now - m.timestamp < 7000));

  const tekrarlar = geçmiş.filter(m => m.content === message.content);

  if (tekrarlar.length >= 3) {
    const uyarı = await message.channel.send({
      content: `<@${userId}>`,
      embeds: [
        new EmbedBuilder()
          .setColor("Red")
          .setTitle("🚫 Spam Tespit Edildi")
          .setDescription("Lütfen mesajları tekrar tekrar göndermeyin. Bu davranış spam olarak algılandı.")
          .setFooter({ text: "GraveBOT Spam Koruma Sistemi" })
          .setTimestamp()
      ]
    });

    // Uyarıyı 5 saniye sonra sil
    setTimeout(() => {
      if (uyarı.deletable) uyarı.delete().catch(() => {});
    }, 5000);

    // Spam mesajlarını sil
    for (const m of tekrarlar) {
      try {
        const msg = await message.channel.messages.fetch(m.id);
        if (msg.deletable) await msg.delete();
      } catch (err) {}
    }

    userMessages.set(userId, []);
  }
};
