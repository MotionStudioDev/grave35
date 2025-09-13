const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("sarıl")
    .setDescription("Bir kullanıcıya sarılırsın.")
    .addUserOption(option =>
      option.setName("kişi")
        .setDescription("Sarılmak istediğin kişi")
        .setRequired(true)
    ),

  async execute(interaction) {
    const hedef = interaction.options.getUser("kişi");
    await interaction.reply({
      content: `🤗 ${interaction.user} ${hedef} kişisine sımsıkı sarıldı!`
    });
  }
};
