const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const db = require("croxydb");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("sayaç-bilgi")
    .setDescription("Sunucudaki sayaç sisteminin mevcut durumunu gösterir."),

  async execute(interaction) {
    const veri = db.get(`sayac_${interaction.guild.id}`);
    if (!veri) {
      const embed = new EmbedBuilder()
        .setColor("Red")
        .setTitle("❌ Sayaç Aktif Değil")
        .setDescription("Bu sunucuda aktif bir sayaç sistemi bulunmuyor.")
        .setFooter({ text: `Sunucu: ${interaction.guild.name}` })
        .setTimestamp();

      return interaction.reply({ embeds: [embed], ephemeral: true });
    }

    const toplam = interaction.guild.memberCount;
    const kalan = veri.hedef - toplam;

    const embed = new EmbedBuilder()
      .setColor("Blurple")
      .setTitle("📊 Sayaç Durumu")
      .addFields(
        { name: "Hedef Üye Sayısı", value: `${veri.hedef}`, inline: true },
        { name: "Mevcut Üye Sayısı", value: `${toplam}`, inline: true },
        { name: "Kalan", value: kalan > 0 ? `${kalan}` : "✅ Hedefe ulaşıldı!", inline: true },
        { name: "Mesaj Kanalı", value: `<#${veri.kanalID}>`, inline: false }
      )
      .setFooter({ text: `Sunucu: ${interaction.guild.name}` })
      .setTimestamp();

    await interaction.reply({ embeds: [embed], ephemeral: true });
  }
};
