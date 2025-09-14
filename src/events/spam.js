const { EmbedBuilder } = require("discord.js");
const { spamDurumu } = require("../commands/spam-sistemi.js");

const userMessages = new Map();

module.exports = async (client, message) => {
  if (message.author.bot || !message.guild) return;

  const guildId = message.guild.id;
  if (!spamDurumu.get(guildId)) return; // Sistem kapalıysa çık

  const userId = message.author.id;
  const now = Date.now();
  const geçmiş = userMessages.get(userId) || [];

  geçmiş.push({ content: message.content, timestamp: now });
  userMessages.set(userId, geçmiş.filter(m => now - m.timestamp < 7000));

  const tekrarSayısı = geçmiş.filter(m => m.content === message.content).length;

  if (tekrarSayısı >= 3) {
    await message.channel.send({
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

    userMessages.set(userId, []);
  }
};
