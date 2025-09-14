const { EmbedBuilder } = require("discord.js");

module.exports = async (interaction) => {
  if (!interaction.isButton()) return;

  const id = interaction.customId;
  const user = interaction.user;
  const guild = interaction.guild;

  const hedefId = id.split("_")[2];
  if (user.id !== hedefId) return;

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
      type: 0,
      permissionOverwrites: [
        { id: guild.roles.everyone, deny: ["ViewChannel"] },
        { id: user.id, allow: ["ViewChannel", "SendMessages"] },
        { id: guild.ownerId, allow: ["ViewChannel", "SendMessages"] }
      ]
    });

    const embed = new EmbedBuilder()
      .setColor("Green")
      .setTitle("📨 Talep Açıldı")
      .setDescription(`**Talep Sahibi:** <@${user.id}>\n**Talep Süresi:** 15 dakika\n\n15 Dakikanız başlamıştır. Aşağıdaki butonları kullanabilirsiniz.`)
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

    // 15 dakika sonra otomatik kapatma
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
      type: 2,
      permissionOverwrites: [
        { id: guild.roles.everyone, deny: ["ViewChannel"] },
        { id: user.id, allow: ["ViewChannel", "Connect", "Speak"] },
        { id: guild.ownerId, allow: ["ViewChannel", "Connect", "Speak"] }
      ]
    });

    return interaction.reply({
      content: `🎙️ Sesli destek kanalın oluşturuldu: <#${voiceChannel.id}>`,
      ephemeral: true
    });
  }

  // ❌ Talebi Kapat
  if (id.startsWith("talep_kapat_")) {
    const kanallar = guild.channels.cache.filter(c =>
      c.name.includes(user.username) &&
      ["talep-", "destek-"].some(prefix => c.name.startsWith(prefix))
    );
    for (const kanal of kanallar.values()) {
      try {
        await kanal.delete();
      } catch (err) {
        console.log(`[Talep Kapat] Kanal silinemedi: ${err.message}`);
      }
    }

    return interaction.reply({
      content: "📪 Talebin kapatıldı. Kanallar silindi.",
      ephemeral: true
    });
  }
};
