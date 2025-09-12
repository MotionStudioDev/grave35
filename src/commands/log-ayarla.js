const { SlashCommandBuilder } = require("discord.js");
const db = require("croxydb");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("log-ayarla")
    .setDescription("Belirli bir log türü için kanal ayarlar.")
    .addStringOption(option =>
      option.setName("tür")
        .setDescription("Log türü")
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
    )
    .addChannelOption(option =>
      option.setName("kanal")
        .setDescription("Logların gönderileceği kanal")
        .setRequired(true)
    ),

  async execute(interaction) {
    const tür = interaction.options.getString("tür");
    const kanal = interaction.options.getChannel("kanal");

    db.set(`${tür}log_${interaction.guild.id}`, kanal.id);
    await interaction.reply({ content: `✅ ${tür}-log kanalı <#${kanal.id}> olarak ayarlandı.`, ephemeral: true });
  }
};
