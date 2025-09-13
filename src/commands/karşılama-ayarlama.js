const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const db = require("croxydb");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("karşılama-ayarla")
    .setDescription("Sunucuya özel karşılama ve ayrılma mesajı ayarlar.")
    .addChannelOption(option =>
      option.setName("karşılama_kanalı")
        .setDescription("Karşılama mesajının gönderileceği kanal")
        .setRequired(true)
    )
    .addStringOption(option =>
      option.setName("karşılama_mesajı")
        .setDescription("Karşılama mesajı (örnek: Hoş geldin {user})")
        .setRequired(true)
    )
    .addChannelOption(option =>
      option.setName("ayrılma_kanalı")
        .setDescription("Ayrılma mesajının gönderileceği kanal")
        .setRequired(true)
    )
    .addStringOption(option =>
      option.setName("ayrılma_mesajı")
        .setDescription("Ayrılma mesajı (örnek: Güle güle {user})")
        .setRequired(true)
    ),

  async execute(interaction) {
    if (!interaction.guild) return interaction.reply({ content: "❌ Bu komut sadece sunucularda kullanılabilir.", ephemeral: true });
    if (!interaction.member.permissions.has("Administrator")) return interaction.reply({ content: "❌ Bu komutu sadece yöneticiler kullanabilir.", ephemeral: true });

    const karşılamaKanal = interaction.options.getChannel("karşılama_kanalı");
    const karşılamaMesaj = interaction.options.getString("karşılama_mesajı");
    const ayrılmaKanal = interaction.options.getChannel("ayrılma_kanalı");
    const ayrılmaMesaj = interaction.options.getString("ayrılma_mesajı");

    db.set(`karsilama_${interaction.guild.id}`, {
      kanalID: karşılamaKanal.id,
      mesaj: karşılamaMesaj
    });

    db.set(`ayrilma_${interaction.guild.id}`, {
      kanalID: ayrılmaKanal.id,
      mesaj: ayrılmaMesaj
    });

    const embed = new EmbedBuilder()
      .setColor("Green")
      .setTitle("✅ Karşılama & Ayrılma Mesajları Ayarlandı")
      .setDescription(`**Karşılama Kanalı:** <#${karşılamaKanal.id}>\n**Ayrılma Kanalı:** <#${ayrılmaKanal.id}>`)
      .addFields(
        { name: "Karşılama Mesajı", value: karşılamaMesaj },
        { name: "Ayrılma Mesajı", value: ayrılmaMesaj }
      )
      .setTimestamp();

    await interaction.reply({ embeds: [embed], ephemeral: true });
  }
};
