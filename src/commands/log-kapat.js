const { SlashCommandBuilder } = require("discord.js");
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
      return interaction.reply({ content: `❌ ${tür}-log zaten aktif değil.`, ephemeral: true });
    }

    db.delete(key);
    await interaction.reply({ content: `✅ ${tür}-log başarıyla devre dışı bırakıldı.`, ephemeral: true });
  }
};
