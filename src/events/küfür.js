const { EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require("discord.js");
const db = require("croxydb");
const fs = require("fs");
const path = require("path");

module.exports = async (data) => {
  // Slash komut: /küfür-sistemi
  if (data.isChatInputCommand?.() && data.commandName === "küfür-sistemi") {
    const interaction = data;
    const user = interaction.user;
    const guild = interaction.guild;
    const kanal = interaction.options.getChannel("kanal");

    if (user.id !== guild.ownerId) {
      const embed = new EmbedBuilder()
        .setColor("Red")
        .setTitle("🚫 Yetki Yok")
        .setDescription("Bu komutu sadece sunucu kurucusu kullanabilir.")
        .setFooter({ text: `Sunucu: ${guild.name}` })
        .setTimestamp();
      return interaction.reply({ embeds: [embed], ephemeral: true });
    }

    const embed = new EmbedBuilder()
      .setColor("Blurple")
      .setTitle("🛡️ Küfür Engel Sistemi")
      .setDescription("Bu sunucuda küfür engel sistemi açılsın mı?")
      .setFooter({ text: `Sunucu: ${guild.name}` })
      .setTimestamp();

    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId(`kufur_onay_${kanal?.id || "none"}`)
        .setLabel("✅ Evet Aç!")
        .setStyle(ButtonStyle.Success),
      new ButtonBuilder()
        .setCustomId("kufur_red")
        .setLabel("❌ Hayır Açma!")
        .setStyle(ButtonStyle.Danger)
    );

    return interaction.reply({ embeds: [embed], components: [row], ephemeral: true });
  }

  // Butonlar
  if (data.isButton?.()) {
    const interaction = data;
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

    if (interaction.replied || interaction.deferred) return;

    if (id.startsWith("kufur_onay_")) {
      const kanalID = id.split("_")[2];
      db.set(`kufurlog_${guildID}`, kanalID !== "none" ? kanalID : null);

      const embed = new EmbedBuilder()
        .setColor("Green")
        .setTitle("✅ Sistem Aktif")
        .setDescription("Küfür engel sistemi başarıyla kuruldu.")
        .addFields({
          name: "Log Kanalı",
          value: kanalID !== "none" ? `<#${kanalID}>` : "Belirtilmedi",
          inline: true
        })
        .setFooter({ text: `Sunucu: ${guild.name}` })
        .setTimestamp();

      return interaction.reply({ embeds: [embed], ephemeral: true });
    }

    if (id === "kufur_red") {
      const embed = new EmbedBuilder()
        .setColor("Orange")
        .setTitle("❌ Sistem Kurulmadı")
        .setDescription("Bu sunucuda küfür sistemini kurmaktan vazgeçtin.")
        .setFooter({ text: `Sunucu: ${guild.name}` })
        .setTimestamp();

      return interaction.reply({ embeds: [embed], ephemeral: true });
    }
  }

  // Mesaj kontrolü
  if (data.content) {
    const message = data;
    if (message.author.bot || !message.guild) return;

    const küfürListesi = JSON.parse(fs.readFileSync(path.join(__dirname, "../küfürler.json"), "utf8"));
    const içerik = message.content.toLowerCase();
    const küfürVar = küfürListesi.some(kelime => içerik.includes(kelime));
    const logKanalID = db.get(`kufurlog_${message.guild.id}`);

    if (!db.has(`kufurlog_${message.guild.id}`)) return;
    if (!küfürVar) return;

    await message.delete();

    const embed = new EmbedBuilder()
      .setColor("Red")
      .setTitle("⚠️ Küfür Tespit Edildi")
      .setDescription(`${message.author} bu sunucuda küfür kullandı.`)
      .setFooter({ text: `Sunucu: ${message.guild.name}` })
      .setTimestamp();

    const uyarıKey = `uyarı_${message.author.id}_${message.guild.id}`;
    db.add(uyarıKey, 1);

    const uyarıMesajı = await message.channel.send({ embeds: [embed] });
    setTimeout(() => uyarıMesajı.delete().catch(() => {}), 2000);

    if (logKanalID) {
      const logChannel = message.guild.channels.cache.get(logKanalID);
      if (logChannel) {
        logChannel.send({ embeds: [embed] });
      }
    }
  }
};
