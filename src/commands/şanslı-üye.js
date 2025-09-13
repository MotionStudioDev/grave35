const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("şanslı-üye")
    .setDescription("Sunucudan rastgele bir üyeyi seçer."),

  async execute(interaction) {
    const üyeler = interaction.guild.members.cache.filter(m => !m.user.bot).map(m => m);
    const rastgele = üyeler[Math.floor(Math.random() * üyeler.length)];
    await interaction.reply({ content: `🎯 Bugünün şanslı üyesi: ${rastgele}` });
  }
};
