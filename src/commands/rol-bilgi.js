// src/commands/rol-bilgi.js
const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("rol-bilgi")
    .setDescription("Belirtilen rol hakkında bilgi verir.")
    .addRoleOption(option =>
      option
        .setName("rol")
        .setDescription("Bilgi almak istediğin rolü seç.")
        .setRequired(true)
    ),

  async execute(interaction, client) {
    const rol = interaction.options.getRole("rol");

    const embed = new EmbedBuilder()
      .setColor(rol.color || "Grey")
      .setTitle(`📌 Rol Bilgisi: ${rol.name}`)
      .addFields(
        { name: "🆔 Rol ID", value: `${rol.id}`, inline: true },
        { name: "🎨 Renk", value: rol.hexColor, inline: true },
        { name: "👥 Üye Sayısı", value: `${rol.members.size}`, inline: true },
        { name: "📅 Oluşturulma Tarihi", value: `<t:${Math.floor(rol.createdTimestamp / 1000)}:F>`, inline: false },
        { name: "📊 Pozisyon", value: `${rol.position}`, inline: true },
        { name: "📢 Etiketlenebilir mi?", value: rol.mentionable ? "✅ Evet" : "❌ Hayır", inline: true }
      )
      .setFooter({ text: `Grave Bot • Rol Bilgi`, iconURL: client.user.displayAvatarURL() })
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });
  },
};
