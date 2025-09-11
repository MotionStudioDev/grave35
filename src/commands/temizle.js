const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("temizle")
    .setDescription("Belirtilen miktarda mesaj siler.")
    .addIntegerOption(option =>
      option
        .setName("miktar")
        .setDescription("Silinecek mesaj sayısı (1-100 arası).")
        .setRequired(true)
    ),

  async execute(interaction, client) {
    if (!interaction.member.permissions.has(PermissionFlagsBits.ManageMessages)) {
      return interaction.reply({
        content: "❌ Bu komutu kullanmak için **Mesajları Yönet** yetkisine sahip olmalısınız.",
        ephemeral: true,
      });
    }

    const amount = interaction.options.getInteger("miktar");

    if (amount < 1 || amount > 100) {
      return interaction.reply({
        content: "❌ Lütfen **1 ile 100** arasında bir sayı girin.",
        ephemeral: true,
      });
    }

    await interaction.deferReply({ ephemeral: true });

    try {
      const deleted = await interaction.channel.bulkDelete(amount, true);

      return interaction.editReply({
        embeds: [
          new EmbedBuilder()
            .setColor("Blue")
            .setTitle("🧹 Mesajlar Temizlendi")
            .setDescription(`✅ **${deleted.size}** mesaj başarıyla silindi.`)
            .setFooter({ text: `Komutu kullanan: ${interaction.user.tag}` })
            .setTimestamp(),
        ],
      });
    } catch (err) {
      console.error("[TEMİZLE KOMUTU HATASI]", err);
      return interaction.editReply({
        content: "❌ Mesajları silerken bir hata oluştu. (14 günden eski mesajlar silinemez!)",
      });
    }
  },
};
