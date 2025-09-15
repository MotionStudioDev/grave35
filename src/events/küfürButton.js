const { Events, EmbedBuilder } = require("discord.js");
const db = require("croxydb");

module.exports = {
  name: Events.InteractionCreate,
  async execute(interaction, client) {
    if (!interaction.isButton()) return;

    if (interaction.customId === "kufurAc") {
      db.set(`kufur_${interaction.guild.id}`, true);

      const embed = new EmbedBuilder()
        .setColor("Green")
        .setTitle("✅ Küfür Sistemi Açıldı")
        .setDescription("Artık küfürlü mesajlar otomatik olarak engellenecek.")
        .setTimestamp();

      return interaction.update({ embeds: [embed], components: [] });
    }

    if (interaction.customId === "kufurHayir") {
      const embed = new EmbedBuilder()
        .setColor("Yellow")
        .setTitle("ℹ️ İşlem İptal Edildi")
        .setDescription("Küfür sistemi kurulmadı.")
        .setTimestamp();

      return interaction.update({ embeds: [embed], components: [] });
    }

    if (interaction.customId === "kufurKapat") {
      db.delete(`kufur_${interaction.guild.id}`);

      const embed = new EmbedBuilder()
        .setColor("Red")
        .setTitle("🚫 Küfür Sistemi Kapatıldı")
        .setDescription("Artık küfürlü mesajlar engellenmeyecek.")
        .setTimestamp();

      return interaction.update({ embeds: [embed], components: [] });
    }
  }
};
