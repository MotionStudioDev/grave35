const {
  SlashCommandBuilder,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  AttachmentBuilder
} = require("discord.js");
const os = require("os");
const { version: djsVersion } = require("discord.js");
const { createCanvas, loadImage } = require("canvas"); // Canvas ile dinamik görsel

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
    const startTimestamp = Math.floor((Date.now() - client.uptime) / 1000);
    const startTime = `<t:${startTimestamp}:F>`;
    const commandCount = client.commands?.size || "Bilinmiyor";
    const cwd = process.cwd();
    const ping = `${client.ws.ping}ms`;
    const botID = client.user.id;
    const userCount = client.users.cache.size;
    const guildCount = client.guilds.cache.size;

    // 🎨 Dinamik görsel oluştur
    const canvas = createCanvas(1000, 800);
    const ctx = canvas.getContext("2d");

    // Arka plan
    ctx.fillStyle = "#0f0f0f";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Başlık
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 40px Sans";
    ctx.fillText("GraveBOT Sistem Durumu", 50, 70);

    // Bilgiler
    ctx.font = "24px Sans";
    ctx.fillStyle = "#00ffff";
    ctx.fillText(`⏱️ Uptime: ${uptime}`, 50, 140);
    ctx.fillText(`🔄 Başlama Zamanı: <t:${startTimestamp}:F>`, 50, 180);
    ctx.fillText(`🏓 Ping: ${ping}`, 50, 220);
    ctx.fillText(`🖥️ RAM Kullanımı: ${memory} MB`, 50, 260);
    ctx.fillText(`💻 CPU: ${cpu}`, 50, 300);
    ctx.fillText(`📦 Node.js Versiyonu: ${nodeVersion}`, 50, 340);
    ctx.fillText(`⚙️ Discord.js Versiyonu: v${djsVersion}`, 50, 380);
    ctx.fillText(`📁 Çalışma Dizini: ${cwd}`, 50, 420);
    ctx.fillText(`📡 Sunucu Sayısı: ${guildCount}`, 50, 460);
    ctx.fillText(`👥 Kullanıcı Sayısı: ${userCount}`, 50, 500);
    ctx.fillText(`🔁 Komut Sayısı: ${commandCount}`, 50, 540);
    ctx.fillText(`🆔 Bot ID: ${botID}`, 50, 580);

    // Footer
    ctx.fillStyle = "#00ff88";
    ctx.font = "italic 20px Sans";
    ctx.fillText(`Motion Studio - Grave`, 50, 740);
    ctx.fillText(`<t:${startTimestamp}:d>`, 50, 770);

    const attachment = new AttachmentBuilder(canvas.toBuffer(), { name: "gravebot-status.png" });

    // Embed
    const embed = new EmbedBuilder()
      .setColor("Blurple")
      .setTitle("📊 GraveBOT İstatistikleri")
      .addFields(
        { name: "⏱️ Uptime", value: uptime, inline: true },
        { name: "🔄 Başlama Zamanı", value: startTime, inline: true },
        { name: "🏓 Ping", value: ping, inline: true },
        { name: "🖥️ Bellek Kullanımı", value: `${memory} MB`, inline: true },
        { name: "💻 CPU", value: cpu, inline: false },
        { name: "📦 Node.js Versiyonu", value: nodeVersion, inline: true },
        { name: "⚙️ Discord.js Versiyonu", value: `v${djsVersion}`, inline: true },
        { name: "📁 Çalışma Dizini", value: cwd, inline: false },
        { name: "📡 Sunucu Sayısı", value: `${guildCount}`, inline: true },
        { name: "👥 Kullanıcı Sayısı", value: `${userCount}`, inline: true },
        { name: "🔁 Komut Sayısı", value: `${commandCount}`, inline: true },
        { name: "🆔 Bot ID", value: botID, inline: true }
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

    await interaction.reply({
      embeds: [embed],
      components: [row],
      files: [attachment]
    });
  }
};
