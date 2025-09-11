const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const os = require("os");

function formatDuration(ms) {
  const sec = Math.floor((ms / 1000) % 60);
  const min = Math.floor((ms / (1000 * 60)) % 60);
  const hrs = Math.floor((ms / (1000 * 60 * 60)) % 24);
  const days = Math.floor(ms / (1000 * 60 * 60 * 24));
  return `${days}g ${hrs}s ${min}dk ${sec}sn`;
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName("istatistik")
    .setDescription("Botun istatistiklerini gösterir."),
    
  async execute(interaction, client) {
    const uptime = formatDuration(client.uptime);
    const memory = (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2);
    const cpu = os.cpus()[0].model;

    const embed = new EmbedBuilder()
      .setColor("Blurple")
      .setTitle("📊 Bot İstatistikleri")
      .addFields(
        { name: "⏱️ Uptime", value: uptime, inline: false },
        { name: "🏓 Ping", value: `${client.ws.ping}ms`, inline: true },
        { name: "🖥️ Bellek Kullanımı", value: `${memory} MB`, inline: true },
        { name: "💻 CPU", value: cpu, inline: false },
        { name: "🌍 Sunucu Sayısı", value: `${client.guilds.cache.size}`, inline: true },
        { name: "👥 Kullanıcı Sayısı", value: `${client.users.cache.size}`, inline: true }
      )
      .setFooter({ text: `${client.user.username}` })
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });
  }
};
