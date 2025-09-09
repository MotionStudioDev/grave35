const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require("discord.js");
const db = require("croxydb");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("oto-rol")
    .setDescription("Sunucuya girenlere otomatik rol verir.")
    .addRoleOption(option =>
      option.setName("rol")
        .setDescription("Yeni gelenlere verilecek rolü seç.")
        .setRequired(true)
    ),

  async execute(interaction, client) {
    if (!interaction.member.permissions.has(PermissionFlagsBits.ManageRoles)) {
      return interaction.reply({ content: "❌ Rolleri Yönet yetkin yok!", ephemeral: true });
    }

    const rol = interaction.options.getRole("rol");

    db.set(`otorol_${interaction.guild.id}`, rol.id);

    const embed = new EmbedBuilder()
      .setColor("Green")
      .setDescription(`✅ Yeni gelenlere otomatik olarak <@&${rol.id}> rolü verilecek.\n\n**Not:** Eğer botun rolü <@&${rol.id}> rolünden düşükse veremez. Rolünü üste taşı!`);

    await interaction.reply({ embeds: [embed] });
  }
};