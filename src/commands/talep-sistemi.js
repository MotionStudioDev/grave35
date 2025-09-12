const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const db = require("croxydb");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("talep-sistemi")
    .setDescription("Talep sistemini yönet veya talep gönder.")
    .addStringOption(option =>
      option.setName("durum")
        .setDescription("Sistem durumu")
        .setRequired(true)
        .addChoices(
          { name: "Aç", value: "aç" },
          { name: "Kapat", value: "kapat" },
          { name: "Gönder", value: "gönder" }
        )
    )
    .addChannelOption(option =>
      option.setName("kanal")
        .setDescription("Talep log kanalı (sadece aç için)")
        .setRequired(false)
    )
    .addStringOption(option =>
      option.setName("mesaj")
        .setDescription("Talep içeriği (sadece gönder için)")
        .setRequired(false)
    ),

  async execute(interaction) {
    const durum = interaction.options.getString("durum");
    const kanal = interaction.options.getChannel("kanal");
    const mesaj = interaction.options.getString("mesaj");
    const key = `talep_log_${interaction.guild.id}`;

    // ❌ Kapat
    if (durum === "kapat") {
      if (!db.has(key)) {
        const embed = new EmbedBuilder()
          .setColor("Red")
          .setTitle("❌ Talep Sistemi Zaten Kapalı")
          .setDescription("Bu sunucuda aktif talep sistemi bulunmuyor.")
          .setFooter({ text: `Sunucu: ${interaction.guild.name}` })
          .setTimestamp();
        return interaction.reply({ embeds: [embed], ephemeral: true });
      }

      db.delete(key);

      const embed = new EmbedBuilder()
        .setColor("Orange")
        .setTitle("🛑 Talep Sistemi Kapatıldı")
        .setDescription("Talep sistemi başarıyla devre dışı bırakıldı.")
        .setFooter({ text: `Sunucu: ${interaction.guild.name}` })
        .setTimestamp();
      return interaction.reply({ embeds: [embed], ephemeral: true });
    }

    // ✅ Aç
    if (durum === "aç") {
      if (!kanal) {
        const embed = new EmbedBuilder()
          .setColor("Red")
          .setTitle("⚠️ Eksik Bilgi")
          .setDescription("Talep sistemini açmak için kanal belirtmelisin.")
          .setFooter({ text: `Sunucu: ${interaction.guild.name}` })
          .setTimestamp();
        return interaction.reply({ embeds: [embed], ephemeral: true });
      }

      db.set(key, kanal.id);

      const embed = new EmbedBuilder()
        .setColor("Green")
        .setTitle("✅ Talep Sistemi Aktif")
        .addFields({ name: "Log Kanalı", value: `<#${kanal.id}>`, inline: true })
        .setFooter({ text: `Sunucu: ${interaction.guild.name}` })
        .setTimestamp();
      return interaction.reply({ embeds: [embed], ephemeral: true });
    }

    // 📨 Gönder
    if (durum === "gönder") {
      if (!mesaj) {
        const embed = new EmbedBuilder()
          .setColor("Red")
          .setTitle("⚠️ Talep Mesajı Eksik")
          .setDescription("Talep göndermek için bir mesaj yazmalısın.")
          .setFooter({ text: `Sunucu: ${interaction.guild.name}` })
          .setTimestamp();
        return interaction.reply({ embeds: [embed], ephemeral: true });
      }

      const logID = db.get(key);
      if (!logID) {
        const embed = new EmbedBuilder()
          .setColor("Red")
          .setTitle("❌ Talep Sistemi Aktif Değil")
          .setDescription("Talep sistemi bu sunucuda aktif değil.")
          .setFooter({ text: `Sunucu: ${interaction.guild.name}` })
          .setTimestamp();
        return interaction.reply({ embeds: [embed], ephemeral: true });
      }

      const logChannel = interaction.guild.channels.cache.get(logID);
      if (!logChannel) {
        return interaction.reply({ content: "❌ Log kanalı bulunamadı.", ephemeral: true });
      }

      const embed = new EmbedBuilder()
        .setColor("Blue")
        .setTitle("📨 Yeni Talep")
        .addFields(
          { name: "Gönderen", value: `<@${interaction.user.id}>`, inline: true },
          { name: "Talep", value: mesaj, inline: false }
        )
        .setFooter({ text: `Sunucu: ${interaction.guild.name}` })
        .setTimestamp();

      logChannel.send({ embeds: [embed] });

      return interaction.reply({
        content: "✅ Talebin başarıyla iletildi.",
        ephemeral: true
      });
    }
  }
};
