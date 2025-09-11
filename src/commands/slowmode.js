const { PermissionFlagsBits, SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("slowmode")
    .setDescription("Kanala yavaş mod ekler veya kaldırır.")
    .addIntegerOption(option =>
      option.setName("süre")
        .setDescription("Yavaş mod süresi (saniye)")
        .setRequired(true)
    ),

  async execute(interaction, client) {
    if (!interaction.member.permissions.has(PermissionFlagsBits.ManageChannels)) {
      return interaction.reply({ content: "❌ Kanalları Yönet yetkin yok!", ephemeral: true });
    }

    const seconds = interaction.options.getInteger("süre");
    const channel = interaction.channel;

    try {
      await channel.setRateLimitPerUser(seconds);
      await interaction.reply(`✅ Kanal yavaş modu **${seconds} saniye** olarak ayarlandı.`);
    } catch (err) {
      console.error(err);
      await interaction.reply({ content: "❌ Bir hata oluştu.", ephemeral: true });
    }
  }
};
