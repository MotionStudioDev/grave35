const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const db = require("croxydb");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("log-kapat")
    .setDescription("Belirli bir log türünü devre dışı bırakır.")
    .addStringOption(option =>
      option.setName("tür")
        .setDescription("Kapatılacak log türü")
        .setRequired(true)
        .addChoices(
          { name: "Tepki Log", value: "tepki" },
          { name: "Ban Log", value: "ban" },
          { name: "Kick Log", value: "kick" },
          { name: "Ses Log", value: "ses" },
          { name: "Rol Log", value: "rol" },
          { name: "Mod Log", value: "mod" },
          { name: "İsim Log", value: "isim" }
        )
    ),

  async execute(interaction) {
    const tür = interaction.options.getString("tür");
    const key = `${tür}log_${interaction.guild.id}`;

    if (!db.has(key)) {
      const embed = new EmbedBuilder()
        .setColor("Red")
        .setTitle("❌ Log Zaten Aktif Değil")
        .setDescription(`\`${tür}-log\` bu sunucuda aktif değil.`)
        .setFooter({ text: `Sunucu: ${interaction.guild.name}` })
        .setTimestamp();

      return interaction.reply({ embeds: [embed], ephemeral: true });
    }

    db.delete(key);

    const embed = new EmbedBuilder()
      .setColor("Orange")
      .setTitle("🛑 Log Devre Dışı Bırakıldı")
      .setDescription(`\`${tür}-log\` başarıyla kapatıldı.`)
      .setFooter({ text: `Sunucu: ${interaction.guild.name}` })
      .setTimestamp();

    await interaction.reply({ embeds: [embed], ephemeral: true });
  }
};
