const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const db = require("croxydb");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("küfür-sistemi")
    .setDescription("Küfür engel sistemini yönet.")
    .addStringOption(option =>
      option.setName("durum")
        .setDescription("Sistem durumu")
        .setRequired(true)
        .addChoices(
          { name: "Aç", value: "aç" },
          { name: "Kapat", value: "kapat" },
          { name: "Bilgi", value: "bilgi" }
        )
    )
    .addChannelOption(option =>
      option.setName("kanal")
        .setDescription("Log kanalı (sadece aç için)")
        .setRequired(false)
    )
    .addUserOption(option =>
      option.setName("kullanıcı")
        .setDescription("Uyarı bilgisi gösterilecek kullanıcı (sadece bilgi için)")
        .setRequired(false)
    ),

  async execute(interaction) {
    const durum = interaction.options.getString("durum");
    const kanal = interaction.options.getChannel("kanal");
    const kullanıcı = interaction.options.getUser("kullanıcı") || interaction.user;
    const guildID = interaction.guild.id;

    if (durum === "kapat") {
      if (!db.has(`kufurlog_${guildID}`)) {
        const embed = new EmbedBuilder()
          .setColor("Red")
          .setTitle("❌ Sistem Zaten Kapalı")
          .setDescription("Bu sunucuda aktif küfür engel sistemi bulunmuyor.")
          .setFooter({ text: `Sunucu: ${interaction.guild.name}` })
          .setTimestamp();
        return interaction.reply({ embeds: [embed], ephemeral: true });
      }

      db.delete(`kufurlog_${guildID}`);

      const embed = new EmbedBuilder()
        .setColor("Orange")
        .setTitle("🛑 Küfür Engel Sistemi Kapatıldı")
        .setDescription("Sistem başarıyla devre dışı bırakıldı.")
        .setFooter({ text: `Sunucu: ${interaction.guild.name}` })
        .setTimestamp();
      return interaction.reply({ embeds: [embed], ephemeral: true });
    }

    if (durum === "aç") {
      if (!kanal) {
        const embed = new EmbedBuilder()
          .setColor("Red")
          .setTitle("⚠️ Eksik Bilgi")
          .setDescription("Sistemi açmak için bir log kanalı belirtmelisin.")
          .setFooter({ text: `Sunucu: ${interaction.guild.name}` })
          .setTimestamp();
        return interaction.reply({ embeds: [embed], ephemeral: true });
      }

      db.set(`kufurlog_${guildID}`, kanal.id);

      const embed = new EmbedBuilder()
        .setColor("Green")
        .setTitle("✅ Küfür Engel Sistemi Aktif")
        .addFields({ name: "Log Kanalı", value: `<#${kanal.id}>`, inline: true })
        .setFooter({ text: `Sunucu: ${interaction.guild.name}` })
        .setTimestamp();
      return interaction.reply({ embeds: [embed], ephemeral: true });
    }

    if (durum === "bilgi") {
      const uyarıKey = `uyarı_${kullanıcı.id}_${guildID}`;
      const uyarıSayısı = db.get(uyarıKey) || 0;

      const embed = new EmbedBuilder()
        .setColor("Blurple")
        .setTitle("📊 Uyarı Bilgisi")
        .addFields(
          { name: "Kullanıcı", value: `<@${kullanıcı.id}>`, inline: true },
          { name: "Uyarı Sayısı", value: `${uyarıSayısı}`, inline: true }
        )
        .setFooter({ text: `Sunucu: ${interaction.guild.name}` })
        .setTimestamp();
      return interaction.reply({ embeds: [embed], ephemeral: true });
    }
  }
};
