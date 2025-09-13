const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("yazı-tura")
    .setDescription("Yazı mı tura mı? Şansını dene!"),

  async execute(interaction) {
    const sonuc = Math.random() < 0.5 ? "🪙 **Yazı** geldi!" : "🪙 **Tura** geldi!";
    await interaction.reply({ content: `${interaction.user} ${sonuc}` });
  }
};
