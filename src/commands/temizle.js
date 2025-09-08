// src/commands/temizle.js
const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("temizle")
    .setDescription("Belirtilen miktarda mesajı siler.")
    .addIntegerOption(option =>
      option
        .setName("miktar")
        .setDescription("Kaç mesaj silineceğini belirleyin (1-100 arası).")
        .setRequired(true)
    )
    .addChannelOption(option =>
      option
        .setName("kanal")
        .setDescription("Mesajların silineceği kanalı belirleyin.")
        .setRequired(false)
    ),

  async execute(client, interaction) {
    // Yetki kontrolü
    if (!interaction.member.permissions.has(PermissionFlagsBits.ManageMessages)) {
      return interaction.reply({
        content: "❌ Bu komutu kullanmak için **Mesajları Yönet** yetkisine sahip olmalısınız.",
        ephemeral: true,
      });
    }

    const miktar = interaction.options.getInteger("miktar");
    const kanal = interaction.options.getChannel("kanal") || interaction.channel;

    if (miktar < 1 || miktar > 100) {
      return interaction.reply({
        content: "❌ Silinecek mesaj miktarı **1 ile 100** arasında olmalıdır.",
        ephemeral: true,
      });
    }

    try {
      // Mesajları çek
      const fetched = await kanal.messages.fetch({ limit: miktar });
      const messagesToDelete = fetched.filter(msg => !msg.pinned);

      // Sil
      const deleted = await kanal.bulkDelete(messagesToDelete, true);

      const embed = new EmbedBuilder()
        .setColor(0x57F287)
        .setDescription(`✅ Başarıyla **${deleted.size}** mesaj silindi.`);

      await interaction.reply({ embeds: [embed], ephemeral: true });
    } catch (error) {
      console.error(error);
      await interaction.reply({
        content: "❌ Mesajları silerken bir hata oluştu. Not: 14 günden eski mesajlar silinemez.",
        ephemeral: true,
      });
    }
  },
};