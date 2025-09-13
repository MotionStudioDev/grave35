const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("tokatla")
    .setDescription("Bir kullanıcıya tokat atarsın.")
    .addUserOption(option =>
      option.setName("kişi")
        .setDescription("Tokatlamak istediğin kişi")
        .setRequired(true)
    ),

  async execute(interaction) {
    const hedef = interaction.options.getUser("kişi");
    await interaction.reply({
      content: `👋 ${interaction.user}, ${hedef} kişisini tokatladı! Ses sunucudan duyuldu 💥`
    });
  }
};
