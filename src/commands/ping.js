const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Botun ping değerini gösterir."),

  async execute(interaction, client) {
    const apiPing = client.ws.ping;
    const sent = await interaction.deferReply({ fetchReply: true, ephemeral: true });

    const botPing = sent.createdTimestamp - interaction.createdTimestamp;

    const embed = new EmbedBuilder()
      .setColor("Green")
      .setTitle("Grave - Ping!")
      .setDescription(`
**Bot Gecikmesi:** \`${botPing}ms\`
**Discord API Gecikmesi:** \`${apiPing}ms\`
      `)
      .setTimestamp()
      .setFooter({ text: `İsteyen: ${interaction.user.tag}` });

    await interaction.editReply({ embeds: [embed] });
  },
};
