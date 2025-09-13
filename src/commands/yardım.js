const {
  SlashCommandBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle
} = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("yardım")
    .setDescription("Yardım menüsünü gösterir."),

  async execute(interaction) {
    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId("yardim_moderasyon")
        .setLabel("🔨 Moderasyon")
        .setStyle(ButtonStyle.Primary),
      new ButtonBuilder()
        .setCustomId("yardim_sistem")
        .setLabel("⚙️ Sistem")
        .setStyle(ButtonStyle.Secondary),
      new ButtonBuilder()
        .setCustomId("yardim_genel")
        .setLabel("📊 Genel")
        .setStyle(ButtonStyle.Success),
      new ButtonBuilder()
        .setCustomId("yardim_eglence")
        .setLabel("🎉 Eğlence")
        .setStyle(ButtonStyle.Danger)
    );

    await interaction.reply({
      content: "📚 Yardım menüsünden bir kategori seçin:",
      components: [row],
      ephemeral: true
    });
  }
};
