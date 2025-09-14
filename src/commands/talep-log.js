const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const db = require("croxydb");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("talep-log")
    .setDescription("Talep loglarının gönderileceği kanalı ayarlar.")
    .addChannelOption(option =>
      option.setName("kanal")
        .setDescription("Logların gönderileceği kanal")
        .setRequired(true)
    ),

  async execute(interaction) {
    if (!interaction.member.permissions.has("Administrator")) {
      const embed = new EmbedBuilder()
        .setColor("Red")
        .setTitle("⛔ Yetki Yetersiz")
        .setDescription("Bu komutu sadece yöneticiler kullanabilir.")
        .setTimestamp();
      return interaction.reply({ embeds: [embed], ephemeral: true });
    }

    const kanal = interaction.options.getChannel("kanal");
    db.set(`talep_log_${interaction.guild.id}`, kanal.id);

    const embed = new EmbedBuilder()
      .setColor("Green")
      .setTitle("📋 Talep Log Kanalı Ayarlandı")
      .setDescription(`Loglar artık <#${kanal.id}> kanalına gönderilecek.`)
      .setTimestamp();

    await interaction.reply({ embeds: [embed], ephemeral: true });
  }
};
