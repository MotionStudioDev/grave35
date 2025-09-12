const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const db = require("croxydb");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("sayaç")
    .setDescription("Sayaç sistemini açar veya kapatır.")
    .addStringOption(option =>
      option.setName("durum")
        .setDescription("Sayaç sistemini aç veya kapat")
        .setRequired(true)
        .addChoices(
          { name: "Aç", value: "aç" },
          { name: "Kapat", value: "kapat" }
        )
    )
    .addIntegerOption(option =>
      option.setName("hedef")
        .setDescription("Hedef üye sayısı (sadece aç için)")
        .setRequired(false)
    )
    .addChannelOption(option =>
      option.setName("kanal")
        .setDescription("Sayaç mesajlarının gönderileceği kanal (sadece aç için)")
        .setRequired(false)
    ),

  async execute(interaction) {
    const durum = interaction.options.getString("durum");
    const hedef = interaction.options.getInteger("hedef");
    const kanal = interaction.options.getChannel("kanal");
    const key = `sayac_${interaction.guild.id}`;

    if (durum === "kapat") {
      if (!db.has(key)) {
        return interaction.reply({ content: "❌ Sayaç zaten aktif değil.", ephemeral: true });
      }

      db.delete(key);

      const embed = new EmbedBuilder()
        .setColor("Red")
        .setTitle("🛑 Sayaç Kapatıldı")
        .setDescription("Sayaç sistemi devre dışı bırakıldı.")
        .setFooter({ text: `Sunucu: ${interaction.guild.name}` })
        .setTimestamp();

      return interaction.reply({ embeds: [embed], ephemeral: true });
    }

    // Açma işlemi
    if (!hedef || !kanal) {
      return interaction.reply({ content: "❌ Sayaç açmak için hedef ve kanal girmelisin.", ephemeral: true });
    }

    db.set(key, {
      hedef: hedef,
      kanalID: kanal.id
    });

    const embed = new EmbedBuilder()
      .setColor("Green")
      .setTitle("✅ Sayaç Aktif")
      .addFields(
        { name: "Hedef Üye Sayısı", value: `${hedef}`, inline: true },
        { name: "Kanal", value: `<#${kanal.id}>`, inline: true }
      )
      .setFooter({ text: `Sunucu: ${interaction.guild.name}` })
      .setTimestamp();

    await interaction.reply({ embeds: [embed], ephemeral: true });
  }
};
