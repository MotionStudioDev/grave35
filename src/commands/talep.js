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
    .setDescription("Destek talebi başlatmak için buton gönderir.")
    .addStringOption(option =>
      option
        .setName("mesaj")
        .setDescription("İsteğe bağlı özel talep mesajı")
        .setRequired(false)
    ),

  async execute(interaction) {
    const özelMesaj = interaction.options.getString("mesaj");

    const embed = new EmbedBuilder()
      .setColor("Blurple")
      .setTitle("🎫 Destek Talebi")
      .setDescription(
        özelMesaj
          ? `📨 Talep mesajı:\n> ${özelMesaj}\n\nDestek ekibiyle iletişime geçmek için aşağıdaki butona tıklayabilirsin.`
          : "Destek ekibiyle iletişime geçmek istiyorsan aşağıdaki butona tıklayarak talep oluşturabilirsin."
      )
      .setFooter({ text: "GraveBOT Talep Sistemi" })
      .setTimestamp();

    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId("talep_ac")
        .setLabel("📩 Talep Oluştur")
        .setStyle(ButtonStyle.Primary)
    );

    await interaction.reply({ embeds: [embed], components: [row], ephemeral: true });
  }
};
