const { PermissionFlagsBits, EmbedBuilder } = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");
const db = require("croxydb");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("oto-rol")
        .setDescription("Yeni gelenlere otomatik rol verir veya kapatır.")
        .addSubcommand(sub =>
            sub.setName("ayarla")
               .setDescription("Otorol için bir rol ayarlayın.")
               .addRoleOption(option =>
                   option.setName("rol")
                         .setDescription("Otomatik verilecek rol")
                         .setRequired(true)
               )
        )
        .addSubcommand(sub =>
            sub.setName("kapat")
               .setDescription("Otorol sistemini kapatır.")
        ),

    run: async (client, interaction) => {
        if (!interaction.member.permissions.has(PermissionFlagsBits.ManageRoles)) {
            return interaction.reply({ content: "❌ Rolleri Yönet yetkin yok!", ephemeral: true });
        }

        const sub = interaction.options.getSubcommand();

        if (sub === "ayarla") {
            const rol = interaction.options.getRole("rol");
            db.set(`otorol_${interaction.guild.id}`, rol.id);

            const embed = new EmbedBuilder()
                .setColor("Green")
                .setTitle("✅ Otorol Ayarlandı")
                .setDescription(`Yeni gelen üyelere <@&${rol.id}> rolü verilecek.`);
            return interaction.reply({ embeds: [embed] });
        }

        if (sub === "kapat") {
            db.delete(`otorol_${interaction.guild.id}`);
            const embed = new EmbedBuilder()
                .setColor("Red")
                .setTitle("❌ Otorol Kapatıldı")
                .setDescription("Artık yeni gelenlere otomatik rol verilmeyecek.");
            return interaction.reply({ embeds: [embed] });
        }
    }
};