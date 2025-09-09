const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const os = require("os");
const moment = require("moment");
require("moment-duration-format");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("istatistik")
        .setDescription("Botun istatistiklerini gösterir."),

    async execute(interaction, client) {
        const uptime = moment
            .duration(client.uptime)
            .format("D [gün], H [saat], m [dakika], s [saniye]");

        const embed = new EmbedBuilder()
            .setColor("Blurple")
            .setTitle("📊 Grave - İstatistikler")
            .addFields(
                { name: "📌 Gecikme (Ping)", value: `\`${client.ws.ping} ms\``, inline: true },
                { name: "🕒 Çalışma Süresi", value: `\`${uptime}\``, inline: true },
                { name: "💾 Bellek Kullanımı", value: `\`${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB\``, inline: true },
                { name: "⚙️ CPU", value: `\`${os.cpus()[0].model}\``, inline: false },
                { name: "🌍 Sunucu Sayısı", value: `\`${client.guilds.cache.size}\``, inline: true },
                { name: "👥 Kullanıcı Sayısı", value: `\`${client.users.cache.size}\``, inline: true }
            )
            .setFooter({ text: `Grave • İstendi ${interaction.user.tag}` })
            .setTimestamp();

        await interaction.reply({ embeds: [embed] });
    }
};