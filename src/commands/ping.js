const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Botun gecikmesini ölçer."),
  
  async execute(client, interaction) {
    const sent = await interaction.reply({ 
      content: "🏓 Ping hesaplanıyor...", 
      fetchReply: true, 
      ephemeral: true 
    });

    const ping = sent.createdTimestamp - interaction.createdTimestamp;

    await interaction.editReply({
      content: `🏓 Pong! Bot gecikmesi: **${ping}ms** | WebSocket: **${client.ws.ping}ms**`
    });
  }
};
