const { EmbedBuilder } = require("discord.js");
const db = require("croxydb");

module.exports = client => {
  client.on("guildMemberAdd", async member => {
    const veri = db.get(`karsilama_${member.guild.id}`);
    if (veri) {
      const kanal = member.guild.channels.cache.get(veri.kanalID);
      if (kanal) {
        const mesaj = veri.mesaj.replace("{user}", `<@${member.id}>`);
        const embed = new EmbedBuilder()
          .setColor("Green")
          .setTitle("👋 Hoş Geldin!")
          .setDescription(`${mesaj}\n**Bu mesaj 3 saniye içinde silinecektir.**`)
          .setThumbnail(member.user.displayAvatarURL())
          .setFooter({ text: `Sunucu: ${member.guild.name}` })
          .setTimestamp();

        const msg = await kanal.send({ embeds: [embed] });
        setTimeout(() => msg.delete().catch(() => {}), 3000);
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
            { name: "ID", value: member.id, inline: true }
          )
          .setThumbnail(member.user.displayAvatarURL())
          .setTimestamp();
        logChannel.send({ embeds: [logEmbed] });
      }
    }
  });

  client.on("guildMemberRemove", async member => {
    const veri = db.get(`ayrilma_${member.guild.id}`);
    if (veri) {
      const kanal = member.guild.channels.cache.get(veri.kanalID);
      if (kanal) {
        const mesaj = veri.mesaj.replace("{user}", `<@${member.id}>`);
        const embed = new EmbedBuilder()
          .setColor("Red")
          .setTitle("👋 Güle Güle!")
          .setDescription(mesaj)
          .setThumbnail(member.user.displayAvatarURL())
          .setFooter({ text: `Sunucu: ${member.guild.name}` })
          .setTimestamp();
        kanal.send({ embeds: [embed] });
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
        logChannel.send({ embeds: [logEmbed] });
      }
    }
  });
};
