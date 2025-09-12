const { Events, ChannelType, PermissionFlagsBits, ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } = require("discord.js");

module.exports = {
  name: Events.InteractionCreate,
  async execute(interaction, client) {
    if (!interaction.isButton()) return;

    // ✅ DESTEK AÇ
    if (interaction.customId === "destek_ac") {
      await interaction.deferReply({ ephemeral: true });

      const kanal = await interaction.guild.channels.create({
        name: `destek-${interaction.user.username}`,
        type: ChannelType.GuildText,
        permissionOverwrites: [
          {
            id: interaction.guild.id,
            deny: [PermissionFlagsBits.ViewChannel],
          },
          {
            id: interaction.user.id,
            allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages],
          },
          {
            id: client.user.id,
            allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages],
          },
        ],
      });

      const kapatButon = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setCustomId("destek_kapat")
          .setLabel("❌ Talebi Kapat")
          .setStyle(ButtonStyle.Danger)
      );

      await kanal.send({
        embeds: [
          new EmbedBuilder()
            .setColor("Blue")
            .setTitle("🎫 Destek Talebi Açıldı")
            .setDescription(`Merhaba <@${interaction.user.id}>, buradan yetkililere ulaşabilirsin.`)
            .setTimestamp(),
        ],
        components: [kapatButon],
      });

      await interaction.editReply({
        content: `✅ Destek talebin açıldı: ${kanal}`,
      });
    }

    // ✅ DESTEK KAPAT
    if (interaction.customId === "destek_kapat") {
      await interaction.deferReply({ ephemeral: true });

      const user = interaction.channel.members.find(m => !m.user.bot); // Talebi açan kullanıcı
      if (user) {
        try {
          await user.send({
            embeds: [
              new EmbedBuilder()
                .setColor("Red")
                .setTitle("📪 Destek Talebi Kapandı")
                .setDescription(`Merhaba ${user}, açmış olduğun destek talebi **${interaction.guild.name}** sunucusunda kapatıldı.`)
                .setTimestamp(),
            ],
          });
        } catch (err) {
          console.log(`[DM] ${user.user.tag} kullanıcısına mesaj gönderilemedi.`);
        }
      }

      await interaction.channel.delete().catch(() => {});
    }
  },
};