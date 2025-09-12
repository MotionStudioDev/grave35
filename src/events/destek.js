// src/events/destek.js
const { Events, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");

module.exports = {
  name: Events.InteractionCreate,
  async execute(interaction, client) {
    if (!interaction.isButton()) return;

    // === DESTEK OLUŞTUR ===
    if (interaction.customId === "destek_olustur") {
      const existingChannel = interaction.guild.channels.cache.find(
        ch => ch.name === `destek-${interaction.user.username.toLowerCase()}`
      );
      if (existingChannel) {
        return interaction.reply({
          content: "❌ Zaten açık bir destek talebin var!",
          ephemeral: true,
        });
      }

      const channel = await interaction.guild.channels.create({
        name: `destek-${interaction.user.username}`,
        type: 0, // GUILD_TEXT
        permissionOverwrites: [
          { id: interaction.guild.id, deny: ["ViewChannel"] },
          { id: interaction.user.id, allow: ["ViewChannel", "SendMessages", "ReadMessageHistory"] },
        ],
      });

      const embed = new EmbedBuilder()
        .setColor("Green")
        .setTitle("📌 Destek Talebi Açıldı")
        .setDescription(
          `Merhaba <@${interaction.user.id}> 👋\n\n` +
          `Buradan yetkililere şikayetini, isteğini veya önerini yazabilirsin.\n\n` +
          `Talebi kapatmak için aşağıdaki butona bas.`
        )
        .setTimestamp();

      const row = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setCustomId("destek_kapat")
          .setLabel("❌ Talebi Kapat")
          .setStyle(ButtonStyle.Danger)
      );

      await channel.send({
        content: `<@${interaction.user.id}> burası senin özel destek talebin.`,
        embeds: [embed],
        components: [row],
      });

      await interaction.reply({ content: `✅ Talebin açıldı: ${channel}`, ephemeral: true });
    }

    // === DESTEK KAPAT ===
    if (interaction.customId === "destek_kapat") {
      await interaction.channel.delete().catch(() => null);
    }
  },
};