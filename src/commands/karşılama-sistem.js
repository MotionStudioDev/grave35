const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const db = require("croxydb");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("karşılama-sistem")
    .setDescription("Karşılama ve ayrılma sistemini tek komutla ayarla veya kapat.")
    .addChannelOption(option =>
      option.setName("karşılama_kanalı")
        .setDescription("Karşılama mesajının gönderileceği kanal")
        .setRequired(false)
    )
    .addStringOption(option =>
      option.setName("karşılama_mesajı")
        .setDescription("Karşılama mesajı (örnek: Hoş geldin {user})")
        .setRequired(false)
    )
    .addChannelOption(option =>
      option.setName("ayrılma_kanalı")
        .setDescription("Ayrılma mesajının gönderileceği kanal")
        .setRequired(false)
    )
    .addStringOption(option =>
      option.setName("ayrılma_mesajı")
        .setDescription("Ayrılma mesajı (örnek: Güle güle {user})")
        .setRequired(false)
    ),

  async execute(interaction) {
    if (!interaction.guild) {
      const embed = new EmbedBuilder()
        .setColor("Red")
        .setTitle("❌ Komut Hatası")
        .setDescription("Bu komut sadece sunucularda kullanılabilir.")
        .setTimestamp();
      return interaction.reply({ embeds: [embed], ephemeral: true });
    }

    if (!interaction.member.permissions.has("Administrator")) {
      const embed = new EmbedBuilder()
        .setColor("Red")
        .setTitle("⛔ Yetki Yetersiz")
        .setDescription("Bu komutu sadece yöneticiler kullanabilir.")
        .setTimestamp();
      return interaction.reply({ embeds: [embed], ephemeral: true });
    }

    const renkler = ["Blurple", "Green", "Red", "Gold", "#00ffff", "#ff00ff"];
    const rastgeleRenk = renkler[Math.floor(Math.random() * renkler.length)];

    const karşılamaKanal = interaction.options.getChannel("karşılama_kanalı");
    const karşılamaMesaj = interaction.options.getString("karşılama_mesajı");
    const ayrılmaKanal = interaction.options.getChannel("ayrılma_kanalı");
    const ayrılmaMesaj = interaction.options.getString("ayrılma_mesajı");

    let bilgi = [];

    // Sistem kapatma durumu
    if (!karşılamaKanal && !ayrılmaKanal) {
      db.delete(`karsilama_${interaction.guild.id}`);
      db.delete(`ayrilma_${interaction.guild.id}`);

      const embed = new EmbedBuilder()
        .setColor(rastgeleRenk)
        .setTitle("🛑 Sistem Kapatıldı")
        .setDescription("Karşılama ve ayrılma mesajları devre dışı bırakıldı.")
        .setFooter({ text: `Sunucu: ${interaction.guild.name}` })
        .setTimestamp();

      return interaction.reply({ embeds: [embed], ephemeral: true });
    }

    // Sistem güncelleme
    if (karşılamaKanal) {
      db.set(`karsilama_${interaction.guild.id}`, {
        kanalID: karşılamaKanal.id,
        mesaj: karşılamaMesaj || "Hoş geldin {user}!"
      });
      bilgi.push(`✅ Karşılama kanalı: <#${karşılamaKanal.id}>`);
      if (karşılamaMesaj) bilgi.push(`📝 Karşılama mesajı: \`${karşılamaMesaj}\``);
    }

    if (ayrılmaKanal) {
      db.set(`ayrilma_${interaction.guild.id}`, {
        kanalID: ayrılmaKanal.id,
        mesaj: ayrılmaMesaj || "{user} aramızdan ayrıldı."
      });
      bilgi.push(`✅ Ayrılma kanalı: <#${ayrılmaKanal.id}>`);
      if (ayrılmaMesaj) bilgi.push(`📝 Ayrılma mesajı: \`${ayrılmaMesaj}\``);
    }

    if (bilgi.length === 0) {
      const embed = new EmbedBuilder()
        .setColor(rastgeleRenk)
        .setTitle("⚠️ Eksik Veri")
        .setDescription("Ayarlanacak hiçbir veri girmedin. En az bir kanal seçmelisin.")
        .setTimestamp();
      return interaction.reply({ embeds: [embed], ephemeral: true });
    }

    const embed = new EmbedBuilder()
      .setColor(rastgeleRenk)
      .setTitle("🔧 Karşılama Sistemi Güncellendi")
      .setDescription(bilgi.join("\n"))
      .setFooter({ text: `Sunucu: ${interaction.guild.name}` })
      .setTimestamp();

    await interaction.reply({ embeds: [embed], ephemeral: true });
  }
};
