const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("kaçcm")
    .setDescription("Mizahi bir şekilde kaç cm olduğunu ölçer."),

  async execute(interaction) {
    const cm = Math.floor(Math.random() * 31); // 0–30 cm arası
    let yorum = "😅 Bu biraz kısa gibi...";
    if (cm > 20) yorum = "🔥 Bu ölçüyle gurur duyabilirsin!";
    else if (cm > 10) yorum = "👌 Ortalama ama etkili.";
    else if (cm === 0) yorum = "🫣 Yok artık...";

    await interaction.reply({
      content: `📏 ${interaction.user} tam olarak **${cm}cm** ölçüldü.\n${yorum}`
    });
  }
};
