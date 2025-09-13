const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("öp")
    .setDescription("Bir kullanıcıyı öpersin.")
    .addUserOption(option =>
      option.setName("kişi")
        .setDescription("Öpmek istediğin kişi")
        .setRequired(true)
    ),

  async execute(interaction) {
    const hedef = interaction.options.getUser("kişi");
    await interaction.reply({
      content: `😘 ${interaction.user}, ${hedef} kişisini öptü! Romantik mi bu? 💞`
    });
  }
};
