const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("kilit")
    .setDescription("Kanal kilitleme sistemini yönetir.")
    .addStringOption(option =>
      option
        .setName("işlem")
        .setDescription("Kanalı kilitle veya aç.")
        .setRequired(true)
        .addChoices(
          { name: "Kilitle", value: "kilitle" },
          { name: "Kaldır", value: "kaldir" }
        )
    ),

  async execute(interaction, client) {
    if (!interaction.member.permissions.has(PermissionFlagsBits.ManageChannels)) {
      return interaction.reply({
        content: "❌ Bu komutu kullanmak için **Kanalları Yönet** yetkisine sahip olmalısın.",
        ephemeral: true,
      });
    }

    const işlem = interaction.options.getString("işlem");
    const channel = interaction.channel;

    try {
      if (işlem === "kilitle") {
        await channel.permissionOverwrites.edit(interaction.guild.roles.everyone, {
          SendMessages: false,
        });

        const embed = new EmbedBuilder()
          .setColor("Red")
          .setTitle("🔒 Kanal Kilitlendi!")
          .setDescription(`${channel} artık mesaj gönderimine kapatıldı.`)
          .setTimestamp();

        return interaction.reply({ embeds: [embed] });
      }

      if (işlem === "kaldir") {
        await channel.permissionOverwrites.edit(interaction.guild.roles.everyone, {
          SendMessages: null,
        });

        const embed = new EmbedBuilder()
          .setColor("Green")
          .setTitle("🔓 Kanal Kilidi Kaldırıldı!")
          .setDescription(`${channel} artık mesaj gönderimine açık.`)
          .setTimestamp();

        return interaction.reply({ embeds: [embed] });
      }
    } catch (err) {
      console.error("[KİLİT KOMUTU] Hata:", err);
      return interaction.reply({
        content: "❌ Kanal kilitleme/kaldırma sırasında bir hata oluştu.",
        ephemeral: true,
      });
    }
  },
};
