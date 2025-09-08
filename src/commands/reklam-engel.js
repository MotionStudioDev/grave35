const { Client, EmbedBuilder, PermissionFlagsBits } = require("discord.js");
const db = require("croxydb");
const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("reklam-engel")
        .setDescription("Reklam engel sistemini açar/kapatır."),

    run: async (client, interaction) => {
        if (!interaction.member.permissions.has(PermissionFlagsBits.ManageMessages)) {
            return interaction.reply({ content: "❌ Mesajları Yönet yetkin yok!", ephemeral: true });
        }

        let reklam = db.fetch(`reklamengel_${interaction.guild.id}`);

        if (reklam) {
            db.delete(`reklamengel_${interaction.guild.id}`);
            const embed = new EmbedBuilder()
                .setColor("Red")
                .setDescription("❌ Reklam engel kapatıldı. Artık reklam mesajları silinmeyecek.");
            return interaction.reply({ embeds: [embed] });
        } else {
            db.set(`reklamengel_${interaction.guild.id}`, true);
            const embed = new EmbedBuilder()
                .setColor("Green")
                .setDescription("✅ Reklam engel açıldı. Reklam mesajları otomatik silinecek.");
            return interaction.reply({ embeds: [embed] });
        }
    }
};