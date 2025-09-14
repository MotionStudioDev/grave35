const { EmbedBuilder } = require("discord.js");

module.exports = async (interaction) => {
  if (!interaction.isButton()) return;

  const customId = interaction.customId;
  if (!customId.startsWith("talep_kapat_")) return;

  const talepSahibiId = customId.split("_")[2];
  const isKurucu = interaction.user.id === interaction.guild.ownerId;
  const isTalepSahibi = interaction.user.id === talepSahibiId;

  if (!isKurucu && !isTalepSahibi) {
    return interaction.reply({
      embeds: [
        new EmbedBuilder()
          .setColor("Red")
          .setTitle("🚫 Yetki Yetersiz")
          .setDescription("Bu talebi sadece sahibi veya sunucu kurucusu kapatabilir.")
      ],
      ephemeral: true
    });
  }

  const embed = EmbedBuilder.from(interaction.message.embeds[0])
    .setColor("Red")
    .setTitle("📪 Talep Kapatıldı")
    .setFooter({ text: `Kapatan: ${interaction.user.tag}` })
    .setTimestamp();

  await interaction.update({ embeds: [embed], components: [] });
};
