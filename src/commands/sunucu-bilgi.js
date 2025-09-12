// src/commands/sunucu-bilgi.js
const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const moment = require("moment");
require("moment-duration-format");
require("moment/locale/tr");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("sunucu-bilgi")
    .setDescription("Bulunduğunuz sunucu hakkında bilgi verir."),

  async execute(interaction, client) {
    const guild = interaction.guild;

    // Sunucu sahibi
    const owner = await guild.fetchOwner();

    // Boost seviyesi
    const boostLevel = guild.premiumTier ? `Seviye ${guild.premiumTier}` : "Yok";

    // Embed
    const embed = new EmbedBuilder()
      .setColor("Blurple")
      .setTitle(`📊 ${guild.name} Sunucu Bilgisi`)
      .setThumbnail(guild.iconURL({ size: 1024 }))
      .addFields(
        { name: "👑 Sunucu Sahibi", value: `${owner.user.tag}`, inline: true },
        { name: "🆔 Sunucu ID", value: `${guild.id}`, inline: true },
        { name: "📅 Oluşturulma Tarihi", value: `<t:${Math.floor(guild.createdTimestamp / 1000)}:F>`, inline: true },
        { name: "👥 Üye Sayısı", value: `${guild.memberCount}`, inline: true },
        { name: "💬 Kanal Sayısı", value: `${guild.channels.cache.size}`, inline: true },
        { name: "✨ Boost", value: `${guild.premiumSubscriptionCount} Boost (${boostLevel})`, inline: true },
        { name: "😀 Emoji Sayısı", value: `${guild.emojis.cache.size}`, inline: true },
        { name: "🔒 Rol Sayısı", value: `${guild.roles.cache.size}`, inline: true }
      )
      .setFooter({ text: `${client.user.username} • Sunucu Bilgisi`, iconURL: client.user.displayAvatarURL() })
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });
  },
};
