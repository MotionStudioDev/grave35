const { PermissionFlagsBits, EmbedBuilder } = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");
const db = require("croxydb");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("oto-rol")
        .setDescription("Yeni gelenlere otomatik rol verir.")
        .addRoleOption(option =>
            option
                .setName("rol")
                .setDescription("Lütfen bir rol seçin.")
                .setRequired(true)
        ),

    run: async (client, interaction) => {
        if (!interaction.member.permissions.has(PermissionFlagsBits.ManageRoles)) {
            return interaction.reply({ content: "❌ Rolleri Yönet yetkin yok!", ephemeral: true });
        }

        const rol = interaction.options.getRole("rol");
        db.set(`otorol_${interaction.guild.id}`, rol.id);

        const embed = new EmbedBuilder()
            .setColor("Green")
            .setTitle("✅ Otorol Sistemi Ayarlandı")
            .setDescription(`
Yeni gelen üyelere <@&${rol.id}> rolü otomatik olarak verilecek.

> **Not:** Eğer botun rolü <@&${rol.id}> rolünden daha aşağıdaysa bot bu rolü veremez. Lütfen botun rolünü üste alın.
            `)
            .setTimestamp();

        interaction.reply({ embeds: [embed] });
    }
};