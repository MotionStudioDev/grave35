const {
  SlashCommandBuilder,
  EmbedBuilder,
  ButtonBuilder,
  ButtonStyle,
  ActionRowBuilder
} = require("discord.js");

// Sunucu bazlı spam durumu
const spamDurumu = new Map();

module.exports = {
  data: new SlashCommandBuilder()
    .setName("spam-sistemi")
    .setDescription("Spam korumasını aç/kapatmak için panel gönderir."),

  async execute(interaction) {
    const guildId = interaction.guild.id;
    const aktifMi = spamDurumu.get(guildId) || false;

    const embed = new EmbedBuilder()
      .setColor(aktifMi ? "Green" : "Red")
      .setTitle("🛡️ Spam Koruma Sistemi")
      .setDescription(
        aktifMi
          ? "Spam koruması şu anda **aktif**.\nİstersen aşağıdaki butonla kapatabilirsin."
          : "Spam koruması şu anda **kapalı**.\nİstersen aşağıdaki butonla aktif edebilirsin."
      )
      .setFooter({ text: "GraveBOT Spam Sistemi" })
      .setTimestamp();

    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId("spam_ac")
        .setLabel("✅ Aktif Et")
        .setStyle(ButtonStyle.Success),
      new ButtonBuilder()
        .setCustomId("spam_kapat")
        .setLabel("❌ Kapat")
        .setStyle(ButtonStyle.Danger)
    );

    await interaction.reply({ embeds: [embed], components: [row], ephemeral: true });

    // Buton etkileşimleri
    const collector = interaction.channel.createMessageComponentCollector({
      filter: i => i.user.id === interaction.user.id,
      time: 60_000
    });

    collector.on("collect", async i => {
      if (i.customId === "spam_ac") {
        spamDurumu.set(guildId, true);
        await i.update({
          embeds: [
            new EmbedBuilder()
              .setColor("Green")
              .setTitle("🛡️ Spam Koruması Aktif Edildi")
              .setDescription("Sunucuda spam mesajlar artık otomatik olarak engellenecek.")
              .setTimestamp()
          ],
          components: []
        });
      }

      if (i.customId === "spam_kapat") {
        spamDurumu.set(guildId, false);
        await i.update({
          embeds: [
            new EmbedBuilder()
              .setColor("Red")
              .setTitle("🛡️ Spam Koruması Kapatıldı")
              .setDescription("Spam koruması devre dışı bırakıldı. Mesajlar artık kontrol edilmeyecek.")
              .setTimestamp()
          ],
          components: []
        });
      }
    });
  },

  // Dışarıdan erişim için spam durumu kontrol fonksiyonu
  spamDurumu
};
