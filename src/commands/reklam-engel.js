const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require("discord.js");
const db = require("croxydb");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("reklam-engel")
        .setDescription("Reklam engel sistemini açar veya kapatır."),

    run: async (client, interaction) => {
        // Yetki kontrolü
        if (!interaction.member.permissions.has(PermissionFlagsBits.ManageMessages)) {
            return interaction.reply({ 
                content: "❌ Bu komutu kullanmak için **Mesajları Yönet** yetkisine sahip olmalısın.", 
                ephemeral: true 
            });
        }

        // Veritabanı kontrol
        const dataKey = `reklamengel_${interaction.guild.id}`;
        const systemStatus = db.fetch(dataKey);

        if (systemStatus) {
            // Varsa → kapat
            db.delete(dataKey);

            const embed = new EmbedBuilder()
                .setColor("Red")
                .setTitle("🚫 Reklam Engel Sistemi Kapatıldı")
                .setDescription("Artık reklam mesajları engellenmeyecek.");

            return interaction.reply({ embeds: [embed], ephemeral: true });
        } else {
            // Yoksa → aç
            db.set(dataKey, true);

            const embed = new EmbedBuilder()
                .setColor("Green")
                .setTitle("✅ Reklam Engel Sistemi Açıldı")
                .setDescription("Reklam mesajları otomatik olarak silinecek ve kullanıcı uyarılacak.");

            return interaction.reply({ embeds: [embed], ephemeral: true });
        }
    }
};