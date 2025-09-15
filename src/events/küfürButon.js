const { EmbedBuilder } = require("discord.js");
const db = require("croxydb");

module.exports = async (interaction) => {
  if (!interaction.isButton()) return;
  const id = interaction.customId;
  const user = interaction.user;
  const guild = interaction.guild;

  if (user.id !== guild.ownerId) {
    return interaction.reply({ content: "🚫 Bu işlemi sadece sunucu kurucusu yapabilir.", ephemeral: true });
  }

  if (id.startsWith("kufur_onay_")) {
    const kanalID = id.split("_")[2];
    db.set(`kufurlog_${guild.id}`, kanalID !== "none" ? kanalID : null);

    const embed = new EmbedBuilder()
      .setColor("Green")
      .setTitle("✅ Sistem Aktif")
      .setDescription("Küfür engel sistemi başarıyla kuruldu.");

    return interaction.reply({ embeds: [embed], ephemeral: true });
  }

  if (id === "kufur_red") {
    const embed = new EmbedBuilder()
      .setColor("Orange")
      .setTitle("❌ Sistem Kurulmadı")
      .setDescription("Bu sunucuda küfür sistemini kurmaktan vazgeçtin.");

    return interaction.reply({ embeds: [embed], ephemeral: true });
  }
};
