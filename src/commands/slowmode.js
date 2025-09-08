const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('slowmode')
    .setDescription('Kanala yavaş mod ekler veya kaldırır.')
    .addIntegerOption(option =>
      option.setName('süre')
        .setDescription('Yavaş mod süresi (saniye cinsinden, 0 = kapat)')
        .setRequired(true)
    ),

  async execute(client, interaction) {
    if (!interaction.member.permissions.has(PermissionFlagsBits.ManageChannels)) {
      return interaction.reply({
        content: '❌ Bu komutu kullanmak için **Kanalları Yönet** yetkisine sahip olmalısın.',
        ephemeral: true
      });
    }

    const channel = interaction.channel;
    const seconds = interaction.options.getInteger('süre');

    if (seconds < 0 || seconds > 21600) { // Discord max 6 saat (21600 saniye) izin veriyor
      return interaction.reply({
        content: '❌ Süre 0 ile 21600 saniye arasında olmalı.',
        ephemeral: true
      });
    }

    try {
      await channel.setRateLimitPerUser(seconds);

      const embed = new EmbedBuilder()
        .setColor(seconds === 0 ? 'Green' : 'Blurple')
        .setTitle(`#${channel.name} kanalı için yavaş mod`)
        .setDescription(
          seconds === 0
            ? '⏱️ Yavaş mod başarıyla **kapatıldı**.'
            : `⏱️ Yavaş mod başarıyla **${seconds} saniye** olarak ayarlandı.`
        );

      return interaction.reply({ embeds: [embed] });
    } catch (error) {
      console.error(error);
      return interaction.reply({
        content: '❌ Bir hata oluştu ve yavaş mod ayarlanamadı.',
        ephemeral: true
      });
    }
  }
};