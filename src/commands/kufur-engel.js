const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require("discord.js");
const db = require("croxydb");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("küfür-engel")
    .setDescription("Küfür engel sistemini açar veya kapatır.")
    .addStringOption(option =>
      option
        .setName("durum")
        .setDescription("Sistemi aç veya kapat")
        .setRequired(true)
        .addChoices(
          { name: "Aç", value: "ac" },
          { name: "Kapat", value: "kapat" }
        )
    ),

  async execute(interaction, client) { // ✅ doğru sıra
    if (!interaction.member.permissions.has(PermissionFlagsBits.Administrator)) {
      return interaction.reply({
        content: "❌ Bu komutu kullanmak için **Yönetici** yetkisine sahip olmalısın!",
        ephemeral: true,
      });
    }

    const durum = interaction.options.getString("durum");

    if (durum === "ac") {
      db.set(`kufurengel_${interaction.guild.id}`, true);
      return interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setColor("Green")
            .setDescription("✅ Küfür engel sistemi **aktif edildi**."),
        ],
      });
    } else {
      db.delete(`kufurengel_${interaction.guild.id}`);
      return interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setColor("Red")
            .setDescription("❌ Küfür engel sistemi **devre dışı bırakıldı**."),
        ],
      });
    }
  },
};
