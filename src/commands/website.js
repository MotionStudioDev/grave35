const {
  SlashCommandBuilder,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle
} = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("website")
    .setDescription("GraveBOT'un resmi web sitesine yönlendirir."),

  async execute(interaction, client) {
    const renkler = ["Blurple", "Green", "Red", "Gold", "#00ffff", "#ff00ff"];
    const rastgeleRenk = renkler[Math.floor(Math.random() * renkler.length)];

    const embed = new EmbedBuilder()
      .setColor(rastgeleRenk)
      .setTitle("🌐 GraveBOT Web Sitesi")
      .setDescription("GraveBOT'un Web Sitesine Göz Atmak İstermisin?")
      .setThumbnail(client.user.displayAvatarURL())
      .setFooter({ text: "Motion Studio - Grave", iconURL: client.user.displayAvatarURL() })
      .setTimestamp();

    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setLabel("Web Sitesine Git")
        .setStyle(ButtonStyle.Link)
        .setURL("https://gravebot.vercel.app") // kendi domaininle değiştir
    );

    await interaction.reply({
      embeds: [embed],
      components: [row],
      ephemeral: false
    });
  }
};
