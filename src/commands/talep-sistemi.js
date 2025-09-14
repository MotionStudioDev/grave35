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
    .setDescription("İsteğe bağlı destek talebi başlatmak için buton gönderir."),

  async execute(interaction) {
    const renkler = ["Blurple", "Green", "Gold", "#ff00ff", "#00ffff"];
    const rastgeleRenk = renkler[Math.floor(Math.random() * renkler.length)];

    const embed = new EmbedBuilder()
      .setColor(rastgeleRenk)
      .setTitle("🎫 Destek Talebi")
      .setDescription("Destek ekibiyle iletişime geçmek istiyorsan aşağıdaki butona tıklayarak talep oluşturabilirsin.\n\n> Bu sistem isteğe bağlıdır. Talep açmak zorunda değilsin.")
      .setFooter({ text: "Motion Studio - GraveBOT" })
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
