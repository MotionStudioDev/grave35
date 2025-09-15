const { SlashCommandBuilder, EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder, PermissionFlagsBits } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("ban")
    .setDescription("Belirtilen kullanıcıyı butonla banla.")
    .addUserOption(option =>
      option.setName("kullanıcı")
        .setDescription("Banlanacak kullanıcı")
        .setRequired(true)
    )
    .addStringOption(option =>
      option.setName("sebep")
        .setDescription("Ban sebebi")
        .setRequired(false)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers),

  async execute(interaction) {
    const hedef = interaction.options.getUser("kullanıcı");
    const sebep = interaction.options.getString("sebep") || "Belirtilmedi";

    const embed = new EmbedBuilder()
      .setColor("Red")
      .setTitle("🚨 Ban İşlemi")
      .setDescription(`${hedef} adlı kullanıcıyı banlamak istiyor musun?\n\n**Sebep:** ${sebep}`);

    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId(`ban_onay_${hedef.id}_${interaction.user.id}`)
        .setLabel("✅ Banla")
        .setStyle(ButtonStyle.Danger),
      new ButtonBuilder()
        .setCustomId(`ban_red_${interaction.user.id}`)
        .setLabel("❌ İptal Et")
        .setStyle(ButtonStyle.Secondary)
    );

    await interaction.reply({ embeds: [embed], components: [row], ephemeral: true });
  }
};
