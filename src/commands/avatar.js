// src/commands/avatar.js
const {
  SlashCommandBuilder,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("avatar")
    .setDescription("Bir kullanıcının avatarını gösterir.")
    .addUserOption(option =>
      option
        .setName("kullanıcı")
        .setDescription("Avatarını görmek istediğiniz kullanıcıyı seçin.")
        .setRequired(false)
    ),

  async execute(interaction, client) {
    const user = interaction.options.getUser("kullanıcı") || interaction.user;

    // Embed
    const embed = new EmbedBuilder()
      .setColor("Blurple")
      .setAuthor({ name: `${user.username} kullanıcısının avatarı`, iconURL: user.displayAvatarURL() })
      .setImage(user.displayAvatarURL({ extension: "png", size: 1024, dynamic: true }))
      .setFooter({ text: `Komutu kullanan: ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL() })
      .setTimestamp();

    // Boyut butonları
    const boyutRow = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setLabel("256px")
        .setStyle(ButtonStyle.Link)
        .setURL(user.displayAvatarURL({ extension: "png", size: 256, dynamic: true })),
      new ButtonBuilder()
        .setLabel("512px")
        .setStyle(ButtonStyle.Link)
        .setURL(user.displayAvatarURL({ extension: "png", size: 512, dynamic: true })),
      new ButtonBuilder()
        .setLabel("1024px")
        .setStyle(ButtonStyle.Link)
        .setURL(user.displayAvatarURL({ extension: "png", size: 1024, dynamic: true })),
      new ButtonBuilder()
        .setLabel("2048px")
        .setStyle(ButtonStyle.Link)
        .setURL(user.displayAvatarURL({ extension: "png", size: 2048, dynamic: true }))
    );

    // Format butonları
    const formatRow = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setLabel("PNG")
        .setStyle(ButtonStyle.Link)
        .setURL(user.displayAvatarURL({ extension: "png", size: 2048, dynamic: true })),
      new ButtonBuilder()
        .setLabel("JPG")
        .setStyle(ButtonStyle.Link)
        .setURL(user.displayAvatarURL({ extension: "jpg", size: 2048, dynamic: true })),
      new ButtonBuilder()
        .setLabel("WEBP")
        .setStyle(ButtonStyle.Link)
        .setURL(user.displayAvatarURL({ extension: "webp", size: 2048, dynamic: true })),
      new ButtonBuilder()
        .setLabel("GIF")
        .setStyle(ButtonStyle.Link)
        .setURL(user.displayAvatarURL({ extension: "gif", size: 2048, dynamic: true }))
    );

    await interaction.reply({ embeds: [embed], components: [boyutRow, formatRow] });
  },
};
