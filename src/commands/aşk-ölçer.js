const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("aşk-ölçer")
    .setDescription("İki kullanıcı arasındaki aşk uyumunu ölçer.")
    .addUserOption(option =>
      option.setName("kişi")
        .setDescription("Aşkını ölçmek istediğin kişi")
        .setRequired(true)
    ),

  async execute(interaction) {
    const hedef = interaction.options.getUser("kişi");
    const yuzde = Math.floor(Math.random() * 101);

    let yorum = "💔 Hmm... bu ilişki biraz zorlayıcı.";
    if (yuzde > 70) yorum = "💘 Kalpler birleşti, bu aşk yaşanır!";
    else if (yuzde > 40) yorum = "💞 Fena değil, biraz çaba gerek.";
    else if (yuzde > 10) yorum = "💤 Belki arkadaş kalmak daha iyi olur.";

    await interaction.reply({
      content: `❤️ ${interaction.user} ile ${hedef} arasında aşk uyumu: **%${yuzde}**\n${yorum}`
    });
  }
};
