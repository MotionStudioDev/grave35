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

  const hedefId = id.split("_")[2];
  const isKurucu = user.id === guild.ownerId;
  const isTalepSahibi = user.id === hedefId;

  if (!isKurucu && !isTalepSahibi) {
    return interaction.reply({
      content: "🚫 Bu butonu sadece talep sahibi veya kurucu kullanabilir.",
      ephemeral: true
    });
  }

  // ❌ Hayır Açma
  if (id.startsWith("talep_red_")) {
    return interaction.update({
      embeds: [
        new EmbedBuilder()
          .setColor("Red")
          .setTitle("❌ Talep İptal Edildi")
          .setDescription("Onaylandı, talep açılmıyor.")
      ],
      components: []
    });
  }

  // ✅ Evet Aç
  if (id.startsWith("talep_onay_")) {
    const kanalAdı = `talep-${user.username}`;
    const varMi = guild.channels.cache.find(c => c.name === kanalAdı);
    if (varMi) {
      return interaction.update({
        embeds: [
          new EmbedBuilder()
            .setColor("Orange")
            .setTitle("⚠️ Zaten Açık Talebin Var")
            .setDescription(`Zaten açık bir talep kanalın var: <#${varMi.id}>`)
        ],
        components: []
      });
    }

    const textChannel = await guild.channels.create({
      name: kanalAdı,
      type: ChannelType.GuildText,
      permissionOverwrites: [
        { id: guild.roles.everyone, allow: ["ViewChannel"] },
        { id: user.id, allow: ["SendMessages"] },
        { id: guild.ownerId, allow: ["SendMessages"] }
      ]
    });

    const talepID = Math.floor(100000 + Math.random() * 900000);
    const embed = new EmbedBuilder()
      .setColor("Green")
      .setTitle("📨 Talep Açıldı")
      .setDescription(`**Talep Sahibi:** <@${user.id}>\n**Talep ID:** \`${talepID}\`\n**Talep Süresi:** 15 dakika\n\n⏱️ 15 Dakikanız başlamıştır. Aşağıdaki butonları kullanabilirsiniz.`)
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

    await interaction.update({
      embeds: [
        new EmbedBuilder()
          .setColor("Green")
          .setTitle("✅ Talep Açıldı")
          .setDescription(`Talep kanalın oluşturuldu: <#${textChannel.id}>`)
      ],
      components: []
    });

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
      return interaction.reply({
        content: `⚠️ Zaten açık bir sesli kanalın var: <#${varMi.id}>`,
        ephemeral: true
      });
    }

    const voiceChannel = await guild.channels.create({
      name: kanalAdı,
      type: ChannelType.GuildVoice,
      permissionOverwrites: [
        { id: guild.roles.everyone, allow: ["ViewChannel"] },
        { id: user.id, allow: ["Connect", "Speak"] },
        { id: guild.ownerId, allow: ["Connect", "Speak"] }
      ]
    });

    return interaction.reply({
      content: `🎙️ Sesli destek kanalın oluşturuldu: <#${voiceChannel.id}>`,
      ephemeral: true
    });
  }

  // ❌ Talebi Kapat — senin istediğin gibi: uyarı embed + 3 saniye sonra silme
  if (id.startsWith("talep_kapat_")) {
    const kanal = interaction.channel;

    const embed = new EmbedBuilder()
      .setColor("Red")
      .setTitle("📪 Talep Kapatılıyor")
      .setDescription("Talep başarıyla kapatıldı. Bu kanal 3 saniye içinde otomatik olarak silinecek.")
      .setFooter({ text: "GraveBOT Talep Sistemi" })
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });

    setTimeout(async () => {
      try {
        await kanal.delete();
      } catch (err) {
        console.log(`[Talep Kapat] Kanal silinemedi: ${err.message}`);
      }
    }, 3000);
  }
};
