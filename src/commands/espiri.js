const { SlashCommandBuilder } = require("discord.js");

const espiriler = [
  "Benimle dalga geçme, ben zaten düz değilim.",
  "Çay koydum gel... ama gelmeyeceğini bildiğim için kendime koydum.",
  "Hayat kısa, gülmek serbest. Ama kahkaha vergilendirilebilir.",
  "Ders çalışırken beynim '404 Not Found' hatası veriyor.",
  "Telefonumda yer yok ama kalbimde sana bolca var... şarjın bitmesin yeter."
];

module.exports = {
  data: new SlashCommandBuilder()
    .setName("espiri")
    .setDescription("Rastgele bir espiri gönderir."),

  async execute(interaction) {
    const sec = espiriler[Math.floor(Math.random() * espiriler.length)];
    await interaction.reply({ content: `🤣 ${sec}` });
  }
};
