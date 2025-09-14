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
    .setName("talep")
    .setDescription("Yeni bir talep oluşturur.")
    .addStringOption(option =>
      option.setName("konu").setDescription("Talep konusu").setRequired(true)
    ),

  async execute(interaction) {
    const konu = interaction.options.getString("konu");
    const talepSahibi = interaction.user;
    const kanal = interaction.channel;

    const embed = new EmbedBuilder()
      .setColor("Blurple")
      .setTitle("📩 Yeni Talep")
      .setDescription(`**Talep Sahibi:** <@${talepSahibi.id}>\n**Konu:** ${konu}`)
      .setFooter({ text: "GraveBOT Talep Sistemi" })
      .setTimestamp();

    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId(`talep_kapat_${talepSahibi.id}`)
        .setLabel("❌ Talebi Kapat")
        .setStyle(ButtonStyle.Danger)
    );

    await kanal.send({ embeds: [embed], components: [row] });
    await interaction.reply({ content: "✅ Talebin oluşturuldu.", ephemeral: true });
  }
};
