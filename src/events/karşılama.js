const { EmbedBuilder } = require("discord.js");
const db = require("croxydb");

module.exports = client => {
  client.on("guildMemberAdd", async member => {
    const veri = db.get(`karsilama_${member.guild.id}`);
    if (veri) {
      const kanal = member.guild.channels.cache.get(veri.kanalID);
      if (kanal) {
        const mesaj = veri.mesaj?.replace("{user}", `<@${member.id}>`) || `<@${member.id}> sunucuya katıldı!`;
        const embed = new EmbedBuilder()
          .setColor("Green")
          .setTitle("👋 Hoş Geldin!")
          .setDescription(mesaj)
          .addFields(
            { name: "Kullanıcı Adı", value: member.user.username, inline: true },
            { name: "Etiket", value: member.user.tag, inline: true },
            { name: "Hesap Oluşturma", value: `<t:${Math.floor(member.user.createdTimestamp / 1000)}:F>`, inline: true },
            { name: "Sunucu Üye Sayısı", value: `${member.guild.memberCount}`, inline: true }
          )
          .setThumbnail(member.user.displayAvatarURL())
          .setFooter({ text: `Sunucu: ${member.guild.name}` })
          .setTimestamp();

        kanal.send({ embeds: [embed] }).catch(() => {});
      }
    }

    const logID = db.get(`modlog_${member.guild.id}`);
    if (logID) {
      const logChannel = member.guild.channels.cache.get(logID);
      if (logChannel) {
        const logEmbed = new EmbedBuilder()
          .setColor("Green")
          .setTitle("📥 Üye Katıldı")
          .addFields(
            { name: "Kullanıcı", value: `${member.user.tag} (<@${member.id}>)`, inline: true },
            { name: "ID", value: member.id, inline: true },
            { name: "Hesap Oluşturma", value: `<t:${Math.floor(member.user.createdTimestamp / 1000)}:R>`, inline: true }
          )
          .setThumbnail(member.user.displayAvatarURL())
          .setTimestamp();

        logChannel.send({ embeds: [logEmbed] }).catch(() => {});
      }
    }
  });

  client.on("guildMemberRemove", async member => {
    const veri = db.get(`ayrilma_${member.guild.id}`);
    if (veri) {
      const kanal = member.guild.channels.cache.get(veri.kanalID);
      if (kanal) {
        const mesaj = veri.mesaj?.replace("{user}", `<@${member.id}>`) || `<@${member.id}> sunucudan ayrıldı.`;
        const embed = new EmbedBuilder()
          .setColor("Red")
          .setTitle("👋 Güle Güle!")
          .setDescription(mesaj)
          .addFields(
            { name: "Kullanıcı Adı", value: member.user.username || "Bilinmiyor", inline: true },
            { name: "Etiket", value: member.user.tag || "Yok", inline: true }
          )
          .setThumbnail(member.user.displayAvatarURL())
          .setFooter({ text: `Sunucu: ${member.guild.name}` })
          .setTimestamp();

        kanal.send({ embeds: [embed] }).catch(() => {});
      }
    }

    const logID = db.get(`modlog_${member.guild.id}`);
    if (logID) {
      const logChannel = member.guild.channels.cache.get(logID);
      if (logChannel) {
        const logEmbed = new EmbedBuilder()
          .setColor("Red")
          .setTitle("📤 Üye Ayrıldı")
          .addFields(
            { name: "Kullanıcı", value: `${member.user.tag} (<@${member.id}>)`, inline: true },
            { name: "ID", value: member.id, inline: true }
          )
          .setThumbnail(member.user.displayAvatarURL())
          .setTimestamp();

        logChannel.send({ embeds: [logEmbed] }).catch(() => {});
      }
    }
  });
};
