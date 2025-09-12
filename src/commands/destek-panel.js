const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("destek-panel")
    .setDescription("Sunucuda destek talebi paneli kurar.")
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

  async execute(interaction, client) {
    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId("destek_ac")
        .setLabel("🎫 Destek Talebi Aç")
        .setStyle(ButtonStyle.Primary)
    );

    const embed = new EmbedBuilder()
      .setColor("Blue")
      .setTitle("📩 Destek Sistemi")
      .setDescription("Bir sorunun mu var? Aşağıdaki butona tıklayarak destek talebi açabilirsin.");

    await interaction.reply({ embeds: [embed], components: [row] });
  },
};