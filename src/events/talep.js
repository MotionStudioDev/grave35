const {
  EmbedBuilder,
  ButtonBuilder,
  ButtonStyle,
  ActionRowBuilder,
  ChannelType
} = require("discord.js");

module.exports = async (interaction) => {
  if (!interaction.isButton()) return;

  const id = interaction.customId;
  const user = interaction.user;
  const guild = interaction.guild;

  // ❌ Hayır Açma
  if (id === "talep_red") {
    const embed = new EmbedBuilder()
      .setColor("Red")
      .setTitle("❌ Talep İptal Edildi")
      .setDescription("Talep açma işlemi iptal edildi.")
      .setFooter({ text: "GraveBOT Talep Sistemi" })
      .setTimestamp();

    return interaction.reply({ embeds: [embed], ephemeral: true });
  }

  // ✅ Evet Aç
  if (id === "talep_onay") {
    const kanalAdı = `talep-${user.username}`;
    const varMi = guild.channels.cache.find(c => c.name === kanalAdı);
    if (varMi) {
      const embed = new EmbedBuilder()
        .setColor("Orange")
        .setTitle("⚠️ Zaten Açık Talep Var")
        .setDescription(`Zaten açık bir talep kanalın var: <#${varMi.id}>`)
        .setFooter({ text: "GraveBOT Talep Sistemi" })
        .setTimestamp();

      return interaction.reply({ embeds: [embed], ephemeral: true });
    }

    const textChannel = await guild.channels.create({
      name: kanalAdı,
      type: ChannelType.GuildText,
      permissionOverwrites: [
        { id: guild.roles.everyone, allow: ["ViewChannel"] },
        { id: user.id, allow: ["SendMessages"] }
      ]
    });

    const talepID = Math.floor(100000 + Math.random() * 900000);
    const embed = new EmbedBuilder()
      .setColor("Green")
      .setTitle("📨 Talep Açıldı")
      .setDescription(`**Talep Sahibi:** <@${user.id}>\n**Talep ID:** \`${talepID}\`\n**Talep Süresi:** 15 dakika\n\n⏱️ 15 Dakikanız başladı. Aşağıdaki butonları kullanabilirsiniz.`)
      .setThumbnail(user.displayAvatarURL())
      .setFooter({ text: "GraveBOT Talep Sistemi" })
      .setTimestamp();

    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId(`talep_kapat_${user.id}`)
        .setLabel("❌ Talebi Kapat")
        .setStyle(ButtonStyle.Danger),
      new ButtonBuilder()
        .setCustomId(`talep_sesli_${user.id}`)
        .setLabel("🎙️ Sesli Destek Al")
        .setStyle(ButtonStyle.Primary)
    );

    await textChannel.send({ embeds: [embed], components: [row] });

    const onayEmbed = new EmbedBuilder()
      .setColor("Green")
      .setTitle("✅ Talep Kanalı Oluşturuldu")
      .setDescription(`Talep kanalın hazır: <#${textChannel.id}>`)
      .setFooter({ text: "GraveBOT Talep Sistemi" })
      .setTimestamp();

    await interaction.reply({ embeds: [onayEmbed], ephemeral: true });

    setTimeout(async () => {
      const kanallar = guild.channels.cache.filter(c =>
        c.name.includes(user.username) &&
        ["talep-", "destek-"].some(prefix => c.name.startsWith(prefix))
      );
      for (const kanal of kanallar.values()) {
        try {
          await kanal.delete();
        } catch (err) {
          console.log(`[Talep Süresi] Kanal silinemedi: ${err.message}`);
        }
      }
    }, 15 * 60 * 1000);
  }

  // 🎙️ Sesli Destek Al
  if (id.startsWith("talep_sesli_")) {
    const kanalAdı = `destek-${user.username}`;
    const varMi = guild.channels.cache.find(c => c.name === kanalAdı);
    if (varMi) {
      const embed = new EmbedBuilder()
        .setColor("Orange")
        .setTitle("⚠️ Zaten Açık Sesli Kanal Var")
        .setDescription(`Zaten açık bir sesli kanalın var: <#${varMi.id}>`)
        .setFooter({ text: "GraveBOT Talep Sistemi" })
        .setTimestamp();

      return interaction.reply({ embeds: [embed], ephemeral: true });
    }

    const voiceChannel = await guild.channels.create({
      name: kanalAdı,
      type: ChannelType.GuildVoice,
      permissionOverwrites: [
        { id: guild.roles.everyone, allow: ["ViewChannel"] },
        { id: user.id, allow: ["Connect", "Speak"] }
      ]
    });

    const embed = new EmbedBuilder()
      .setColor("Blue")
      .setTitle("🎙️ Sesli Destek Kanalı Açıldı")
      .setDescription(`Sesli kanalın oluşturuldu: <#${voiceChannel.id}>`)
      .setFooter({ text: "GraveBOT Talep Sistemi" })
      .setTimestamp();

    return interaction.reply({ embeds: [embed], ephemeral: true });
  }

  // ❌ Talebi Kapat — %100 tüm kanalları embedli uyarıyla siler
  if (id.startsWith("talep_kapat_")) {
    const embed = new EmbedBuilder()
      .setColor("Red")
      .setTitle("📪 Talep Kapatılıyor")
      .setDescription("Talep başarıyla kapatıldı. Tüm ilgili kanallar 3 saniye içinde otomatik olarak silinecek.")
      .setFooter({ text: "GraveBOT Talep Sistemi" })
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });

    setTimeout(async () => {
      const kanallar = guild.channels.cache.filter(c =>
        ["talep-", "destek-"].some(prefix => c.name.startsWith(prefix)) &&
        c.name.includes(user.username)
      );

      for (const kanal of kanallar.values()) {
        try {
          await kanal.delete();
        } catch (err) {
          console.log(`[Talep Kapat] Kanal silinemedi: ${err.message}`);
        }
      }
    }, 3000);
  }
};
