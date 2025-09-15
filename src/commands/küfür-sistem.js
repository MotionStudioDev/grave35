const {
  SlashCommandBuilder,
  EmbedBuilder,
  ButtonBuilder,
  ButtonStyle,
  ActionRowBuilder
} = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("küfür-sistemi")
    .setDescription("Küfür engel sistemini kur.")
    .addChannelOption(option =>
      option.setName("kanal")
        .setDescription("Log kanalı (isteğe bağlı)")
        .setRequired(false)
    ),

  async execute(interaction) {
    const user = interaction.user;
    const guild = interaction.guild;
    const kanal = interaction.options.getChannel("kanal");

    if (user.id !== guild.ownerId) {
      const embed = new EmbedBuilder()
        .setColor("Red")
        .setTitle("🚫 Yetki Yok")
        .setDescription("Bu komutu sadece sunucu kurucusu kullanabilir.");
      return interaction.reply({ embeds: [embed], ephemeral: true });
    }

    const embed = new EmbedBuilder()
      .setColor("Blurple")
      .setTitle("🛡️ Küfür Engel Sistemi")
      .setDescription("Bu sunucuda küfür engel sistemi açılsın mı?");

    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId(`kufur_onay_${kanal?.id || "none"}`)
        .setLabel("✅ Evet Aç!")
        .setStyle(ButtonStyle.Success),
      new ButtonBuilder()
        .setCustomId("kufur_red")
        .setLabel("❌ Hayır Açma!")
        .setStyle(ButtonStyle.Danger)
    );

    await interaction.reply({ embeds: [embed], components: [row], ephemeral: true });
  }
};
