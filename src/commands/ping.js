const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Botun pingini gösterir"),

  // senin yapına uygun → run(client, interaction)
  async run(client, interaction) {
    try {
      // önce deferReply, yoksa zaman aşımına düşer
      await interaction.deferReply();

      const botPing = Date.now() - interaction.createdTimestamp;
      const apiPing = client.ws.ping;

      await interaction.editReply(`🏓 Pong!\nBot gecikmesi: **${botPing}ms**\nAPI gecikmesi: **${apiPing}ms**`);
    } catch (err) {
      console.error(err);
      if (interaction.deferred || interaction.replied) {
        await interaction.editReply("❌ Komut çalıştırılırken hata oluştu!");
      } else {
        await interaction.reply({ content: "❌ Komut çalıştırılırken hata oluştu!", ephemeral: true });
      }
    }
  }
};
