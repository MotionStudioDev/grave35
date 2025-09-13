const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const db = require("croxydb");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("karşılama-sistem")
    .setDescription("Karşılama ve ayrılma sistemini tek komutla ayarla.")
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
    if (!interaction.guild) return interaction.reply({ content: "❌ Bu komut sadece sunucularda kullanılabilir.", ephemeral: true });
    if (!interaction.member.permissions.has("Administrator")) return interaction.reply({ content: "❌ Bu komutu sadece yöneticiler kullanabilir.", ephemeral: true });

    const karşılamaKanal = interaction.options.getChannel("karşılama_kanalı");
    const karşılamaMesaj = interaction.options.getString("karşılama_mesajı");
    const ayrılmaKanal = interaction.options.getChannel("ayrılma_kanalı");
    const ayrılmaMesaj = interaction.options.getString("ayrılma_mesajı");

    let bilgi = [];

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
      return interaction.reply({ content: "⚠️ Ayarlanacak hiçbir veri girmedin. En az bir kanal seçmelisin.", ephemeral: true });
    }

    const embed = new EmbedBuilder()
      .setColor("Blue")
      .setTitle("🔧 Karşılama Sistemi Güncellendi")
      .setDescription(bilgi.join("\n"))
      .setFooter({ text: `Sunucu: ${interaction.guild.name}` })
      .setTimestamp();

    await interaction.reply({ embeds: [embed], ephemeral: true });
  }
};
