const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("yardım")
    .setDescription("Yardım menüsünü gösterir."),

  async execute(interaction, client) {
    const embed = new EmbedBuilder()
      .setColor("Blurple")
      .setAuthor({ 
        name: `${client.user.username} Yardım Menüsü`, 
        iconURL: client.user.displayAvatarURL() 
      })
      .setThumbnail(
        interaction.guild?.iconURL({ extension: "png", size: 1024 }) 
        || client.user.displayAvatarURL()
      )
      .setDescription("Grave - Tüm komutlar")
      .addFields(
        {
          name: "🔨 Moderasyon",
          value: "`ban`, `kick`, `unban`, `kilit kilitle`, `kilit kaldır`, `temizle`, `slowmode`",
        },
        {
          name: "⚙️ Sistem",
          value: "`oto-rol`, `reklam-engel`, `kufur-engel`, `tepkirol`, `log-ayarla`, `log-listele`, `log-kapat`",
        },
        {
          name: "📊 Genel",
          value: "`ping`, `istatistik`, `rol-bilgi`, `emojiler`, `emoji-bilgi`, `avatar`, `sunucu-bilgi`, `kullanıcı-bilgi`",
        }
      )
      .setFooter({ 
        text: "Grave Bot • Gelişmiş Discord Deneyimi", 
        iconURL: client.user.displayAvatarURL() 
      })
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });
  },
};
