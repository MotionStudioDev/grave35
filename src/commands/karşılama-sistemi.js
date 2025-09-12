const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const db = require("croxydb");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("karşılama-sistemi")
    .setDescription("Karşılama ve ayrılma mesajlarını ayarlar.")
    .addChannelOption(option =>
      option.setName("karşılama-kanal")
        .setDescription("Karşılama mesajının gönderileceği kanal")
        .setRequired(false)
    )
    .addStringOption(option =>
      option.setName("karşılama-mesaj")
        .setDescription("Karşılama mesajı (örnek: Hoş geldin {user})")
        .setRequired(false)
    )
    .addChannelOption(option =>
      option.setName("ayrılma-kanal")
        .setDescription("Ayrılma mesajının gönderileceği kanal")
        .setRequired(false)
    )
    .addStringOption(option =>
      option.setName("ayrılma-mesaj")
        .setDescription("Ayrılma mesajı (örnek: Güle güle {user})")
        .setRequired(false)
    ),

  async execute(interaction) {
    const karşılamaKanal = interaction.options.getChannel("karşılama-kanal");
    const karşılamaMesaj = interaction.options.getString("karşılama-mesaj");
    const ayrılmaKanal = interaction.options.getChannel("ayrılma-kanal");
    const ayrılmaMesaj = interaction.options.getString("ayrılma-mesaj");

    const embed = new EmbedBuilder()
      .setColor("Green")
      .setTitle("✅ Karşılama Sistemi Güncellendi")
      .setFooter({ text: `Sunucu: ${interaction.guild.name}` })
      .setTimestamp();

    if (karşılamaKanal && karşılamaMesaj) {
      db.set(`karsilama_${interaction.guild.id}`, {
        kanalID: karşılamaKanal.id,
        mesaj: karşılamaMesaj
      });

      embed.addFields({
        name: "Karşılama",
        value: `Kanal: <#${karşılamaKanal.id}>\nMesaj: ${karşılamaMesaj.replace("{user}", `<@${interaction.user.id}>`)}`,
        inline: false
      });
    }

    if (ayrılmaKanal && ayrılmaMesaj) {
      db.set(`ayrilma_${interaction.guild.id}`, {
        kanalID: ayrılmaKanal.id,
        mesaj: ayrılmaMesaj
      });

      embed.addFields({
        name: "Ayrılma",
        value: `Kanal: <#${ayrılmaKanal.id}>\nMesaj: ${ayrılmaMesaj.replace("{user}", `<@${interaction.user.id}>`)}`,
        inline: false
      });
    }

    if (!karşılamaKanal && !karşılamaMesaj && !ayrılmaKanal && !ayrılmaMesaj) {
      return interaction.reply({ content: "❌ Ayarlanacak hiçbir veri girmedin.", ephemeral: true });
    }

    await interaction.reply({ embeds: [embed], ephemeral: true });
  }
};
