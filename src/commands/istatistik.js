const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const os = require("os");
const { version: djsVersion } = require("discord.js");

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
    .setDescription("GraveBOT'un sistem ve performans istatistiklerini gösterir."),

  async execute(interaction, client) {
    const uptime = formatDuration(client.uptime);
    const memory = (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2);
    const cpu = os.cpus()[0].model;
    const nodeVersion = process.version;
    const startTime = `<t:${Math.floor((Date.now() - client.uptime) / 1000)}:F>`;
    const commandCount = client.commands?.size || "Bilinmiyor";
    const cwd = process.cwd();

    const embed = new EmbedBuilder()
      .setColor("Blurple")
      .setTitle("📊 GraveBOT İstatistikleri")
      .addFields(
        { name: "⏱️ Uptime", value: uptime, inline: true },
        { name: "🔄 Başlama Zamanı", value: startTime, inline: true },
        { name: "🏓 Ping", value: `${client.ws.ping}ms`, inline: true },
        { name: "🖥️ Bellek Kullanımı", value: `${memory} MB`, inline: true },
        { name: "💻 CPU", value: cpu, inline: false },
        { name: "📦 Node.js Versiyonu", value: nodeVersion, inline: true },
        { name: "⚙️ Discord.js Versiyonu", value: `v${djsVersion}`, inline: true },
        { name: "📁 Çalışma Dizini", value: cwd, inline: false },
        { name: "📡 Sunucu Sayısı", value: `${client.guilds.cache.size}`, inline: true },
        { name: "👥 Kullanıcı Sayısı", value: `${client.users.cache.size}`, inline: true },
        { name: "🔁 Komut Sayısı", value: `${commandCount}`, inline: true },
        { name: "🆔 Bot ID", value: client.user.id, inline: true }
      )
      .setFooter({ text: `${client.user.username} • Motion Studio - Grave` })
      .setTimestamp();

    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setLabel("Destek Sunucusu")
        .setStyle(ButtonStyle.Link)
        .setURL("https://discord.gg/CVZ4zEkJws"),
      new ButtonBuilder()
        .setLabel("Botu Davet Et")
        .setStyle(ButtonStyle.Link)
        .setURL("https://discord.com/oauth2/authorize?client_id=1066016782827130960&scope=bot+applications.commands&permissions=8"),
      new ButtonBuilder()
        .setLabel("GitHub")
        .setStyle(ButtonStyle.Link)
        .setURL("https://github.com/MotionStudioDev")
    );

    await interaction.reply({ embeds: [embed], components: [row] });
  }
};
