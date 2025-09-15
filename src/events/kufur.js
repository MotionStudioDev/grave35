const { EmbedBuilder } = require("discord.js");
const db = require("croxydb");

module.exports = async (interaction) => {
  if (!interaction.isButton()) return;

  const id = interaction.customId;
  const user = interaction.user;
  const guild = interaction.guild;
  const guildID = guild.id;

  if (user.id !== guild.ownerId) {
    return interaction.reply({
      content: "🚫 Bu işlemi sadece sunucu kurucusu yapabilir.",
      ephemeral: true
    });
  }

  if (id.startsWith("kufur_ac_")) {
    const kanalID = id.split("_")[2];
    if (kanalID !== "none") {
      db.set(`kufurlog_${guildID}`, kanalID);
    }

    const embed = new EmbedBuilder()
      .setColor("Green")
      .setTitle("✅ Küfür Engel Sistemi Aktif")
      .setDescription("Sistem başarıyla aktif edildi.")
      .addFields({
        name: "Log Kanalı",
        value: kanalID !== "none" ? `<#${kanalID}>` : "Belirtilmedi",
        inline: true
      })
      .setFooter({ text: `Sunucu: ${guild.name}` })
      .setTimestamp();

    return interaction.reply({ embeds: [embed], ephemeral: true });
  }

  if (id === "kufur_kapat") {
    if (!db.has(`kufurlog_${guildID}`)) {
      const embed = new EmbedBuilder()
        .setColor("Red")
        .setTitle("❌ Sistem Zaten Kapalı")
        .setDescription("Bu sunucuda aktif küfür engel sistemi bulunmuyor.")
        .setFooter({ text: `Sunucu: ${guild.name}` })
        .setTimestamp();
      return interaction.reply({ embeds: [embed], ephemeral: true });
    }

    db.delete(`kufurlog_${guildID}`);

    const embed = new EmbedBuilder()
      .setColor("Orange")
      .setTitle("🛑 Küfür Engel Sistemi Kapatıldı")
      .setDescription("Sistem başarıyla devre dışı bırakıldı.")
      .setFooter({ text: `Sunucu: ${guild.name}` })
      .setTimestamp();
    return interaction.reply({ embeds: [embed], ephemeral: true });
  }

  if (id.startsWith("kufur_bilgi_")) {
    const kullanıcıID = id.split("_")[2];
    const uyarıKey = `uyarı_${kullanıcıID}_${guildID}`;
    const uyarıSayısı = db.get(uyarıKey) || 0;

    const embed = new EmbedBuilder()
      .setColor("Blurple")
      .setTitle("📊 Uyarı Bilgisi")
      .addFields(
        { name: "Kullanıcı", value: `<@${kullanıcıID}>`, inline: true },
        { name: "Uyarı Sayısı", value: `${uyarıSayısı}`, inline: true }
      )
      .setFooter({ text: `Sunucu: ${guild.name}` })
      .setTimestamp();

    return interaction.reply({ embeds: [embed], ephemeral: true });
  }
};
