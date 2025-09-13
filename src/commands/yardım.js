const {
  SlashCommandBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder
} = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("yardım")
    .setDescription("Yardım menüsünü gösterir."),

  async execute(interaction, client) {
    const embed = new EmbedBuilder()
      .setColor("Blurple")
      .setTitle("📚 GraveBOT Yardım Menüsü")
      .setDescription("Bir kategori seçerek komutları görüntüleyebilirsin.")
      .setThumbnail(client.user.displayAvatarURL())
      .setFooter({ text: "Motion Studio - Grave", iconURL: client.user.displayAvatarURL() })
      .setTimestamp();

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
      embeds: [embed],
      components: [row],
      ephemeral: true
    });
  }
};
