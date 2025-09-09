const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const os = require("os");

function formatDuration(ms) {
  const seconds = Math.floor(ms / 1000) % 60;
  const minutes = Math.floor(ms / (1000 * 60)) % 60;
  const hours = Math.floor(ms / (1000 * 60 * 60)) % 24;
  const days = Math.floor(ms / (1000 * 60 * 60 * 24));
  return `${days}g ${hours}s ${minutes}dk ${seconds}sn`;
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName("istatistik")
    .setDescription("Botun istatistiklerini gösterir."),

  async execute(interaction, client) {
    try {
      const uptime = formatDuration(client.uptime);
      const memoryUsage = (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2);
      const cpuModel = os.cpus()[0].model;

      const embed = new EmbedBuilder()
        .setColor("Blurple")
        .setTitle("📊 Bot İstatistikleri")
        .addFields(
          { name: "⏱️ Uptime", value: uptime, inline: false },
          { name: "🏓 Ping", value: `${client.ws.ping}ms`, inline: true },
          { name: "🖥️ Bellek Kullanımı", value: `${memoryUsage} MB`, inline: true },
          { name: "💻 CPU", value: cpuModel, inline: false },
          { name: "🌍 Sunucu Sayısı", value: `${client.guilds.cache.size}`, inline: true },
          { name: "👥 Kullanıcı Sayısı", value: `${client.users.cache.size}`, inline: true }
        )
        .setFooter({ text: `${client.user.username} © ${new Date().getFullYear()}` })
        .setTimestamp();

      await interaction.reply({ embeds: [embed] });
    } catch (err) {
      console.error("İstatistik komutu hatası:", err);
      await interaction.reply({ content: "❌ Bir hata oluştu, lütfen tekrar dene.", ephemeral: true });
    }
  }
};