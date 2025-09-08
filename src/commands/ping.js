const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Botun pingini gösterir"),
  
  async execute(interaction) {
    // deferReply kullanmamız lazım çünkü ping ölçümü bazen 3 saniyeyi geçebilir
    await interaction.deferReply();

    const botPing = Date.now() - interaction.createdTimestamp;
    const apiPing = interaction.client.ws.ping;

    await interaction.editReply(`🏓 Pong!\nBot gecikmesi: **${botPing}ms**\nAPI gecikmesi: **${apiPing}ms**`);
  }
};
