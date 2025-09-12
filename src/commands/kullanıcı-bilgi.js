// src/commands/kullanıcı-bilgi.js
const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("kullanıcı-bilgi")
    .setDescription("Belirtilen kullanıcı hakkında bilgi verir.")
    .addUserOption(option =>
      option
        .setName("kullanıcı")
        .setDescription("Bilgisine bakmak istediğin kullanıcı")
        .setRequired(false)
    ),

  async execute(interaction, client) {
    const user = interaction.options.getUser("kullanıcı") || interaction.user;
    const member = await interaction.guild.members.fetch(user.id).catch(() => null);

    const embed = new EmbedBuilder()
      .setColor("Blurple")
      .setTitle(`👤 ${user.username} Kullanıcı Bilgisi`)
      .setThumbnail(user.displayAvatarURL({ size: 1024 }))
      .addFields(
        { name: "🆔 Kullanıcı ID", value: user.id, inline: true },
        { name: "📛 Kullanıcı Adı", value: `${user.tag}`, inline: true },
        { name: "🤖 Bot mu?", value: user.bot ? "Evet" : "Hayır", inline: true },
        { name: "📅 Hesap Oluşturulma", value: `<t:${Math.floor(user.createdTimestamp / 1000)}:F>`, inline: true },
      );

    if (member) {
      embed.addFields(
        { name: "📅 Sunucuya Katılma", value: `<t:${Math.floor(member.joinedTimestamp / 1000)}:F>`, inline: true },
        { name: "🔒 Rolleri", value: member.roles.cache.size > 1 ? member.roles.cache.map(r => r).join(" ") : "Rol yok", inline: false }
      );
    }

    embed.setFooter({ text: `${client.user.username} • Kullanıcı Bilgisi`, iconURL: client.user.displayAvatarURL() });
    embed.setTimestamp();

    await interaction.reply({ embeds: [embed] });
  },
};
