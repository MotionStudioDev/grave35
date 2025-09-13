const {
  SlashCommandBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  AttachmentBuilder
} = require("discord.js");
const os = require("os");
const { version: djsVersion } = require("discord.js");
const { createCanvas } = require("canvas");

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
    .setDescription("GraveBOT'un sistem ve performans istatistiklerini görsel olarak gösterir."),

  async execute(interaction, client) {
    const uptime = formatDuration(client.uptime);
    const memory = (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2);
    const cpu = os.cpus()[0].model;
    const nodeVersion = process.version;
    const startTimestamp = Math.floor((Date.now() - client.uptime) / 1000);
    const commandCount = client.commands?.size || "Bilinmiyor";
    const cwd = process.cwd();
    const ping = `${client.ws.ping}ms`;
    const botID = client.user.id;
    const userCount = client.users.cache.size;
    const guildCount = client.guilds.cache.size;

    // 🎨 Görsel oluştur
    const canvas = createCanvas(1000, 800);
    const ctx = canvas.getContext("2d");

    // Arka plan
    ctx.fillStyle = "#00050A";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Başlık
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 42px Sans";
    ctx.fillText("🤖 GraveBOT", 50, 70);
    ctx.font = "24px Sans";
    ctx.fillStyle = "#888";
    ctx.fillText("Aktif", 50, 105);
    ctx.fillStyle = "#ffffff";
    ctx.fillText("Sistem Durumu", 50, 140);

    // Bilgiler
    ctx.font = "22px Sans";
    ctx.fillStyle = "#00ffff";
    ctx.fillText(`Uptime: ${uptime}`, 50, 200);
    ctx.fillText(`Başlama Zamanı: <t:${startTimestamp}:F>`, 50, 240);
    ctx.fillText(`Ping: ${ping}`, 50, 280);
    ctx.fillText(`RAM Kullanımı: ${memory} MB`, 50, 320);
    ctx.fillText(`CPU: ${cpu}`, 50, 360);
    ctx.fillText(`Node.js Versiyonu: ${nodeVersion}`, 50, 400);
    ctx.fillText(`Discord.js Versiyonu: v${djsVersion}`, 50, 440);
    ctx.fillText(`Çalışma Dizini: ${cwd}`, 50, 480);
    ctx.fillText(`Sunucu Sayısı: ${guildCount}`, 50, 520);
    ctx.fillText(`Kullanıcı Sayısı: ${userCount}`, 50, 560);
    ctx.fillText(`Komut Sayısı: ${commandCount}`, 50, 600);
    ctx.fillText(`Bot ID: ${botID}`, 50, 640);

    // Footer
    ctx.fillStyle = "#00ff88";
    ctx.font = "italic 20px Sans";
    ctx.fillText(`<t:${startTimestamp}:d>`, 50, 700);
    ctx.fillText("Motion Studio - Grave", 50, 730);

    const attachment = new AttachmentBuilder(canvas.toBuffer(), { name: "gravebot-status.png" });

    // Butonlar
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
      files: [attachment],
      components: [row]
    });
  }
};
