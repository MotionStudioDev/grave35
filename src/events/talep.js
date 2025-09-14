const {
  EmbedBuilder,
  ButtonBuilder,
  ButtonStyle,
  ActionRowBuilder,
  ChannelType
} = require("discord.js");

module.exports = async (client, interaction) => {
  if (!interaction.isButton()) return;

  const { guild, user, channel } = interaction;

  if (interaction.customId === "talep_ac") {
    const mevcutKanal = guild.channels.cache.find(c =>
      c.type === ChannelType.GuildText &&
      c.name === `talep-${user.username}`
    );
    if (mevcutKanal) {
      const embed = new EmbedBuilder()
        .setColor("Yellow")
        .setTitle("⚠️ Zaten Açık Talep Var")
        .setDescription(`Zaten açık bir talep kanalın var: <#${mevcutKanal.id}>`)
        .setTimestamp();

      return interaction.reply({ embeds: [embed], ephemeral: true });
    }

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
      .setTitle("📋 Talep Kanalı Oluşturuldu")
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

    const replyEmbed = new EmbedBuilder()
      .setColor("Blurple")
      .setTitle("✅ Talep Kanalı Açıldı")
      .setDescription(`Kanal oluşturuldu: <#${kanal.id}>`)
      .setTimestamp();

    await interaction.reply({ embeds: [replyEmbed], ephemeral: true });
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

    const embed = new EmbedBuilder()
      .setColor("Blurple")
      .setTitle("🔊 Sesli Destek Açıldı")
      .setDescription(`Sesli destek kanalı oluşturuldu: <#${sesKanal.id}>`)
      .setTimestamp();

    await interaction.reply({ embeds: [embed], ephemeral: true });
  }

  if (interaction.customId === "talep_kapat") {
    const sesKanal = guild.channels.cache.find(c =>
      c.type === ChannelType.GuildVoice &&
      c.name === `🎧 ${user.username}-destek`
    );

    const dakika = Math.floor((Date.now() - channel.createdTimestamp) / 60000);

    const embed = new EmbedBuilder()
      .setColor("Red")
      .setTitle("❌ Talep Kapatıldı")
      .setDescription(`Talebiniz kapatıldı. Bu kanal ve varsa sesli kanal 3 saniye içinde silinecek.\n\n🕒 Destek süresi: **${dakika} dakika**`)
      .setTimestamp();

    await interaction.reply({ embeds: [embed], ephemeral: true });

    setTimeout(() => {
      if (channel.deletable) channel.delete().catch(() => {});
      if (sesKanal && sesKanal.deletable) sesKanal.delete().catch(() => {});
    }, 3000);
  }
};
