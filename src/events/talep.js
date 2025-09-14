const { EmbedBuilder, PermissionsBitField } = require("discord.js");

module.exports = async (interaction) => {
  if (!interaction.isButton()) return;

  const id = interaction.customId;
  const guild = interaction.guild;
  const user = interaction.user;

  // Talep sahibinin ID'sini ayıkla
  const hedefId = id.split("_")[2];
  const isKurucu = user.id === guild.ownerId;
  const isTalepSahibi = user.id === hedefId;

  if (!isKurucu && !isTalepSahibi) {
    return interaction.reply({
      embeds: [
        new EmbedBuilder()
          .setColor("Red")
          .setTitle("🚫 Yetki Yetersiz")
          .setDescription("Bu butonu sadece talep sahibi veya sunucu kurucusu kullanabilir.")
      ],
      ephemeral: true
    });
  }

  // Sesli Destek Butonu
  if (id.startsWith("talep_sesli_")) {
    const kanal = await guild.channels.create({
      name: `destek-${user.username}`,
      type: 2, // GUILD_VOICE
      permissionOverwrites: [
        {
          id: guild.roles.everyone,
          deny: ["ViewChannel"]
        },
        {
          id: hedefId,
          allow: ["ViewChannel", "Connect", "Speak"]
        },
        {
          id: guild.ownerId,
          allow: ["ViewChannel", "Connect", "Speak"]
        }
      ]
    });

    return interaction.reply({
      embeds: [
        new EmbedBuilder()
          .setColor("Green")
          .setTitle("🎙️ Sesli Destek Açıldı")
          .setDescription(`Sesli kanal oluşturuldu: <#${kanal.id}>`)
      ],
      ephemeral: true
    });
  }

  // Talebi Kapat Butonu
  if (id.startsWith("talep_kapat_")) {
    const kanallar = guild.channels.cache.filter(c =>
      c.name.includes(user.username) && ["talep-", "destek-"].some(prefix => c.name.startsWith(prefix))
    );

    for (const kanal of kanallar.values()) {
      try {
        await kanal.delete();
      } catch (err) {
        console.log(`[Talep] Kanal silinemedi: ${err.message}`);
      }
    }

    return interaction.reply({
      embeds: [
        new EmbedBuilder()
          .setColor("Red")
          .setTitle("📪 Talep Kapatıldı")
          .setDescription("Tüm talep kanalların kapatıldı.")
      ],
      ephemeral: true
    });
  }
};
