const {
  EmbedBuilder,
  ButtonBuilder,
  ButtonStyle,
  ActionRowBuilder,
  ChannelType
} = require("discord.js");

module.exports = async (client, interaction) => {
  if (!interaction.isButton()) return;

  const { guild, user } = interaction;

  if (interaction.customId === "talep_ac") {
    const kanal = await guild.channels.create({
      name: `talep-${user.username}`,
      type: ChannelType.GuildText,
      permissionOverwrites: [
        { id: guild.id, deny: ["ViewChannel"] },
        { id: user.id, allow: ["ViewChannel", "SendMessages"] }
      ]
    });

    const embed = new EmbedBuilder()
      .setColor("Green")
      .setTitle("📋 Talep Bilgisi")
      .setDescription(`Talep sahibi: <@${user.id}>\nOluşturulma: <t:${Math.floor(Date.now() / 1000)}:F>\n\n> Sesli destek istersen aşağıdaki butona tıklayabilirsin.`)
      .setFooter({ text: "GraveBOT Talep Sistemi" })
      .setTimestamp();

    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId("talep_kapat")
        .setLabel("❌ Talebi Kapat")
        .setStyle(ButtonStyle.Danger),
      new ButtonBuilder()
        .setCustomId("talep_ses")
        .setLabel("🔊 Sesli Destek")
        .setStyle(ButtonStyle.Secondary)
    );

    await kanal.send({ content: `<@${user.id}>`, embeds: [embed], components: [row] });
    await interaction.reply({ content: `✅ Talep kanalı oluşturuldu: ${kanal}`, ephemeral: true });

    setTimeout(() => {
      if (kanal && kanal.deletable) {
        kanal.send({
          embeds: [
            new EmbedBuilder()
              .setColor("Red")
              .setTitle("⏳ Talep Süresi Doldu")
              .setDescription("Bu kanal otomatik olarak kapatılıyor.")
              .setTimestamp()
          ]
        }).then(() => kanal.delete().catch(() => {}));
      }
    }, 15 * 60 * 1000);
  }

  if (interaction.customId === "talep_kapat") {
    await interaction.reply({
      embeds: [
        new EmbedBuilder()
          .setColor("Red")
          .setTitle("❌ Talep Kapatıldı")
          .setDescription("Bu kanal birazdan silinecek.")
          .setTimestamp()
      ],
      ephemeral: true
    });
    setTimeout(() => interaction.channel.delete().catch(() => {}), 3000);
  }

  if (interaction.customId === "talep_ses") {
    const sesKanal = await guild.channels.create({
      name: `🎧 ${user.username}-destek`,
      type: ChannelType.GuildVoice,
      permissionOverwrites: [
        { id: guild.id, deny: ["ViewChannel"] },
        { id: user.id, allow: ["ViewChannel", "Connect", "Speak"] }
      ]
    });

    await interaction.reply({
      embeds: [
        new EmbedBuilder()
          .setColor("Blurple")
          .setTitle("🔊 Sesli Destek Açıldı")
          .setDescription(`Sesli destek kanalı oluşturuldu: <#${sesKanal.id}>`)
          .setTimestamp()
      ],
      ephemeral: true
    });
  }
};
