const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require("discord.js");
const db = require("croxydb");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("reklam-engel")
    .setDescription("Reklam engelleme sistemini aç/kapat."),

  async execute(interaction, client) {
    if (!interaction.member.permissions.has(PermissionFlagsBits.ManageMessages)) {
      return interaction.reply({ content: "❌ Mesajları Yönet yetkin yok!", ephemeral: true });
    }

    let sistem = db.get(`reklamengel_${interaction.guild.id}`);

    if (sistem) {
      db.delete(`reklamengel_${interaction.guild.id}`);
      const embed = new EmbedBuilder()
        .setColor("Red")
        .setDescription("🚫 Reklam engel sistemi kapatıldı.");
      return interaction.reply({ embeds: [embed] });
    } else {
      db.set(`reklamengel_${interaction.guild.id}`, true);
      const embed = new EmbedBuilder()
        .setColor("Green")
        .setDescription("✅ Reklam engel sistemi açıldı.\nReklam yapanların mesajı silinecek.");
      return interaction.reply({ embeds: [embed] });
    }
  }
};