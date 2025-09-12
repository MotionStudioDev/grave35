const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const db = require("croxydb");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("log-listele")
    .setDescription("Sunucuda aktif olan log türlerini listeler."),

  async execute(interaction) {
    const logTürleri = ["tepki", "ban", "kick", "ses", "rol", "mod", "isim"];
    const aktifLoglar = [];

    for (const tür of logTürleri) {
      const kanalID = db.get(`${tür}log_${interaction.guild.id}`);
      if (kanalID) {
        aktifLoglar.push(`• \`${tür}-log\` → <#${kanalID}>`);
      }
    }

    const embed = new EmbedBuilder()
      .setColor("Blurple")
      .setTitle("📋 Aktif Loglar")
      .setDescription(
        aktifLoglar.length > 0
          ? aktifLoglar.join("\n")
          : "❌ Bu sunucuda aktif log bulunmuyor."
      )
      .setFooter({ text: `Sunucu: ${interaction.guild.name}` })
      .setTimestamp();

    await interaction.reply({ embeds: [embed], ephemeral: true });
  }
};
