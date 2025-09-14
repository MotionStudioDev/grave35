const {
  SlashCommandBuilder,
  EmbedBuilder,
  ButtonBuilder,
  ButtonStyle,
  ActionRowBuilder
} = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("butonrol")
    .setDescription("Rol butonu oluşturur veya günceller (sadece kurucu)")
    .addRoleOption(option =>
      option.setName("rol")
        .setDescription("Verilecek rol")
        .setRequired(true)
    ),

  async execute(interaction) {
    const user = interaction.user;
    const guild = interaction.guild;
    const channel = interaction.channel;
    const rol = interaction.options.getRole("rol");

    if (user.id !== guild.ownerId) {
      return interaction.reply({
        content: "🚫 Bu komutu sadece sunucu kurucusu kullanabilir.",
        ephemeral: true
      });
    }

    const embed = new EmbedBuilder()
      .setColor("Blurple")
      .setTitle("🎯 Rol Butonu")
      .setDescription(`Aşağıdaki butona basarak <@&${rol.id}> rolünü alabilir veya kaldırabilirsiniz.`)
      .setFooter({ text: "Kurucu tarafından güncellendi" })
      .setTimestamp();

    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId(`rol_toggle_${rol.id}`)
        .setLabel("🎭 Rol Al / Bırak")
        .setStyle(ButtonStyle.Primary)
    );

    // Eski mesajı bul ve güncelle
    const messages = await channel.messages.fetch({ limit: 50 });
    const eskiMesaj = messages.find(msg =>
      msg.components?.[0]?.components?.[0]?.customId?.startsWith("rol_toggle_")
    );

    if (eskiMesaj) {
      await eskiMesaj.edit({ embeds: [embed], components: [row] });
      return interaction.reply({
        content: "✅ Rol butonu başarıyla güncellendi.",
        ephemeral: true
      });
    } else {
      await channel.send({ embeds: [embed], components: [row] });
      return interaction.reply({
        content: "✅ Rol butonu başarıyla oluşturuldu.",
        ephemeral: true
      });
    }
  }
};
