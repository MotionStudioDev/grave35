const {
  SlashCommandBuilder,
  EmbedBuilder,
  ButtonBuilder,
  ButtonStyle,
  ActionRowBuilder,
  PermissionFlagsBits
} = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("butonrol")
    .setDescription("Rol verme butonunu gönderir.")
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addRoleOption(option =>
      option.setName("rol").setDescription("Verilecek rol").setRequired(true)
    )
    .addStringOption(option =>
      option.setName("mesaj").setDescription("İsteğe bağlı mesaj").setRequired(false)
    ),

  async execute(interaction) {
    const rol = interaction.options.getRole("rol");
    const mesaj = interaction.options.getString("mesaj") || `Aşağıdaki butona basarak <@&${rol.id}> rolünü alabilir veya kaldırabilirsin.`;

    const embed = new EmbedBuilder()
      .setColor("Blurple")
      .setTitle("🎯 Rol Butonu")
      .setDescription(mesaj)
      .setFooter({ text: "GraveBOT Buton Rol Sistemi" })
      .setTimestamp();

    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId(`butonrol_${rol.id}`)
        .setLabel(rol.name)
        .setStyle(ButtonStyle.Primary)
    );

    await interaction.reply({ embeds: [embed], components: [row] });
  }
};
