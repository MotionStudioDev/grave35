const {
  SlashCommandBuilder,
  EmbedBuilder,
  ButtonBuilder,
  ButtonStyle,
  ActionRowBuilder,
  PermissionFlagsBits
} = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("talep")
    .setDescription("Yeni bir talep oluşturur."),

  async execute(interaction) {
    const user = interaction.user;
    const guild = interaction.guild;

    // Talep metin kanalı oluştur
    const kanal = await guild.channels.create({
      name: `talep-${user.username}`,
      type: 0, // GUILD_TEXT
      permissionOverwrites: [
        {
          id: guild.roles.everyone,
          deny: ["ViewChannel"]
        },
        {
          id: user.id,
          allow: ["ViewChannel", "SendMessages"]
        },
        {
          id: guild.ownerId,
          allow: ["ViewChannel", "SendMessages"]
        }
      ]
    });

    // Embed mesaj
    const embed = new EmbedBuilder()
      .setColor("Blurple")
      .setTitle("📩 Yeni Talep")
      .setDescription(`**Talep Sahibi:** <@${user.id}>\nTalep oluşturuldu. Aşağıdaki butonları kullanabilirsin.`)
      .setFooter({ text: "GraveBOT Talep Sistemi" })
      .setTimestamp();

    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId(`talep_kapat_${user.id}`)
        .setLabel("❌ Talebi Kapat")
        .setStyle(ButtonStyle.Danger),
      new ButtonBuilder()
        .setCustomId(`talep_sesli_${user.id}`)
        .setLabel("🎙️ Sesli Destek")
        .setStyle(ButtonStyle.Primary)
    );

    await kanal.send({ embeds: [embed], components: [row] });
    await interaction.reply({ content: `✅ Talep kanalın oluşturuldu: <#${kanal.id}>`, ephemeral: true });
  }
};
