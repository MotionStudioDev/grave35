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
    .setDescription("Küfür engel sistemini yönet.")
    .addChannelOption(option =>
      option.setName("kanal")
        .setDescription("Log kanalı (isteğe bağlı)")
        .setRequired(false)
    )
    .addUserOption(option =>
      option.setName("kullanıcı")
        .setDescription("Uyarı bilgisi gösterilecek kullanıcı (isteğe bağlı)")
        .setRequired(false)
    ),

  async execute(interaction) {
    const user = interaction.user;
    const guild = interaction.guild;
    const kanal = interaction.options.getChannel("kanal");
    const kullanıcı = interaction.options.getUser("kullanıcı") || user;

    if (user.id !== guild.ownerId) {
      const embed = new EmbedBuilder()
        .setColor("Red")
        .setTitle("🚫 Yetki Yok")
        .setDescription("Bu komutu sadece sunucu kurucusu kullanabilir.")
        .setFooter({ text: `Sunucu: ${guild.name}` })
        .setTimestamp();
      return interaction.reply({ embeds: [embed], ephemeral: true });
    }

    const embed = new EmbedBuilder()
      .setColor("Blurple")
      .setTitle("⚙️ Küfür Engel Sistemi Yönetimi")
      .setDescription("Aşağıdaki butonları kullanarak sistemi açabilir, kapatabilir veya uyarı bilgisi alabilirsiniz.")
      .setFooter({ text: `Sunucu: ${guild.name}` })
      .setTimestamp();

    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId(`kufur_ac_${kanal?.id || "none"}`)
        .setLabel("✅ Sistemi Aç")
        .setStyle(ButtonStyle.Success),
      new ButtonBuilder()
        .setCustomId("kufur_kapat")
        .setLabel("🛑 Sistemi Kapat")
        .setStyle(ButtonStyle.Danger),
      new ButtonBuilder()
        .setCustomId(`kufur_bilgi_${kullanıcı.id}`)
        .setLabel("📊 Uyarı Bilgisi")
        .setStyle(ButtonStyle.Secondary)
    );

    await interaction.reply({ embeds: [embed], components: [row], ephemeral: true });
  }
};
