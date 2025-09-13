const { EmbedBuilder, ActivityType } = require("discord.js");
const os = require("os");

module.exports = client => {
  client.once("ready", async () => {
    const izinliSunucuID = "1408511083232362547"; // senin sunucu ID
    const logKanalID = "1416144862050259168";     // embedin gideceği kanal ID

    const guild = client.guilds.cache.get(izinliSunucuID);
    if (!guild) return;

    const kanal = guild.channels.cache.get(logKanalID);
    if (!kanal) return;

    // ✅ Botun oynuyor kısmını ayarla
    client.user.setPresence({
      activities: [{ name: "GraveBOT aktif | /yardım", type: ActivityType.Playing }],
      status: "online"
    });

    // ✅ Embed oluştur
    const uptime = process.uptime();
    const saat = Math.floor(uptime / 3600);
    const dakika = Math.floor((uptime % 3600) / 60);
    const saniye = Math.floor(uptime % 60);

    const embed = new EmbedBuilder()
      .setColor("Green")
      .setTitle("✅ GraveBOT Başlatıldı")
      .addFields(
        { name: "⏱️ Uptime", value: `${saat} saat ${dakika} dk ${saniye} sn`, inline: true },
        { name: "🔄 Başlama Zamanı", value: `<t:${Math.floor((Date.now() - uptime * 1000) / 1000)}:F>`, inline: true },
        { name: "💾 RAM Kullanımı", value: `${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB`, inline: true },
        { name: "🧠 CPU", value: os.cpus()[0].model, inline: false },
        { name: "📡 Sunucu Sayısı", value: `${client.guilds.cache.size}`, inline: true },
        { name: "👥 Kullanıcı Sayısı", value: `${client.users.cache.size}`, inline: true },
        { name: "📶 Ping", value: `${client.ws.ping} ms`, inline: true }
      )
      .setFooter({ text: `GraveBOT yeniden başlatıldı.` })
      .setTimestamp();

    // ✅ Embed'i log kanalına gönder
    kanal.send({ embeds: [embed] }).catch(() => {});
    console.log(`[GraveBOT] Başlatıldı ve log kanalına embed gönderildi.`);
  });
};
