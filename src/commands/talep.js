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
    .setDescription("Talep başlatmak için kurucu yetkisi gereklidir."),

  async execute(interaction) {
    const user = interaction.user;
    const guild = interaction.guild;

    if (user.id !== guild.ownerId) {
      return interaction.reply({
        content: "🚫 Bu komutu sadece sunucu kurucusu kullanabilir.",
        ephemeral: true
      });
    }

    const embed = new EmbedBuilder()
      .setColor("Blurple")
      .setTitle("📩 Talep Sistemi Başlatıldı")
      .setDescription(`Talep açmak isteyenler aşağıdaki butonları kullanabilir.\n\n✅ Evet Aç → Talep kanalı oluşturur\n❌ Hayır Açma → Talep iptal edilir`)
      .setFooter({ text: "Kurucu tarafından başlatıldı" })
      .setTimestamp();

    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId(`talep_onay`)
        .setLabel("✅ Evet Aç")
        .setStyle(ButtonStyle.Success),
      new ButtonBuilder()
        .setCustomId(`talep_red`)
        .setLabel("❌ Hayır Açma")
        .setStyle(ButtonStyle.Danger)
    );

    await interaction.reply({ embeds: [embed], components: [row] });
  }
};
