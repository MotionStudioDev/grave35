// src/commands/destek-panel.js
const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, PermissionFlagsBits } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("destek-panel")
    .setDescription("Destek panelini kurar.")
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

  async execute(interaction, client) {
    const embed = new EmbedBuilder()
      .setColor("Blurple")
      .setTitle("🎫 Destek Talebi")
      .setDescription("Destek talebi açmak için aşağıdaki butona basın.")
      .setFooter({ text: "Grave Bot Destek Sistemi" })
      .setTimestamp();

    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId("destek_olustur")
        .setLabel("📩 Talep Aç")
        .setStyle(ButtonStyle.Primary)
    );

    await interaction.reply({ content: "✅ Panel kuruldu!", ephemeral: true });
    await interaction.channel.send({ embeds: [embed], components: [row] });
  },
};