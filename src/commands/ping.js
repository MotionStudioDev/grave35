const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Botun pingini gösterir"),
  
  async run(client, interaction) {
    try {
      // deferReply ile interaction acknowledge edilir
      await interaction.deferReply();

      const botPing = Date.now() - interaction.createdTimestamp;
      const apiPing = client.ws.ping;

      // reply() DEĞİL → editReply()
      await interaction.editReply(
        `🏓 Pong!\nBot gecikmesi: **${botPing}ms**\nAPI gecikmesi: **${apiPing}ms**`
      );
    } catch (err) {
      console.error(err);
      if (interaction.deferred || interaction.replied) {
        await interaction.editReply("❌ Komut çalıştırılırken bir hata oluştu!");
      }
    }
  }
};
