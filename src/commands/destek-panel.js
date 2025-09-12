const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, PermissionFlagsBits } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("destek-panel")
    .setDescription("Destek talep panelini kurar.")
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator), // Her sunucuda adminler kullanabilir

  async execute(interaction, client) {
    const embed = new EmbedBuilder()
      .setColor("Blurple")
      .setTitle("🎫 Destek Talebi")
      .setDescription("Aşağıdaki butona basarak bir destek talebi oluşturabilirsin.\n\n📌 **Şikayet, öneri veya isteklerini yazabilirsin.**")
      .setFooter({ text: `${interaction.guild.name} Destek Sistemi`, iconURL: interaction.guild.iconURL() });

    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId("destek_olustur")
        .setLabel("📩 Destek Talebi Oluştur")
        .setStyle(ButtonStyle.Primary)
    );

    await interaction.reply({ embeds: [embed], components: [row] });
  },
};