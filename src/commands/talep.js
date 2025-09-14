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
    .setDescription("Talep sistemi başlatılır (sadece kurucu)")
    .addRoleOption(option =>
      option.setName("destekrol")
        .setDescription("Talebe bakacak destek rolü (isteğe bağlı)")
        .setRequired(false)
    ),

  async execute(interaction) {
    const user = interaction.user;
    const guild = interaction.guild;
    const destekRol = interaction.options.getRole("destekrol");

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
      .setFooter({ text: destekRol ? `Destek Rolü: ${destekRol.name}` : "Destek rolü belirtilmedi" })
      .setTimestamp();

    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId(`talep_onay_${destekRol?.id || "none"}`)
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
