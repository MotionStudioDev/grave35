const {
  SlashCommandBuilder,
  EmbedBuilder,
  ButtonBuilder,
  ButtonStyle,
  ActionRowBuilder
} = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("talep")
    .setDescription("Talep başlatmak için onay ekranı sunar."),

  async execute(interaction) {
    const user = interaction.user;

    const embed = new EmbedBuilder()
      .setColor("Blurple")
      .setTitle("📩 Talep Başlatma")
      .setDescription(`Bir talep oluşturmak üzeresin.\n\n**Eğer talep açmak istiyorsan** ✅ Evet Aç butonuna bas.\n**İstemiyorsan** ❌ Hayır Açma butonuna bas.`)
      .setFooter({ text: "GraveBOT Talep Sistemi" })
      .setTimestamp();

    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId(`talep_onay_${user.id}`)
        .setLabel("✅ Evet Aç")
        .setStyle(ButtonStyle.Success),
      new ButtonBuilder()
        .setCustomId(`talep_red_${user.id}`)
        .setLabel("❌ Hayır Açma")
        .setStyle(ButtonStyle.Danger)
    );

    await interaction.reply({ embeds: [embed], components: [row] });
  }
};
