// src/commands/emojiler.js
const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("emojiler")
    .setDescription("Sunucudaki tüm emojileri listeler."),

  async execute(interaction, client) {
    const emojis = interaction.guild.emojis.cache;

    if (emojis.size === 0) {
      return interaction.reply({
        content: "❌ Bu sunucuda hiç emoji bulunmuyor.",
        ephemeral: true,
      });
    }

    const emojiList = emojis.map(e => `${e} \`:${e.name}:\``).join(" ");

    const embed = new EmbedBuilder()
      .setColor("Blurple")
      .setTitle(`${interaction.guild.name} Sunucusundaki Emojiler`)
      .setDescription(emojiList.substring(0, 4000)) // 4000 karakter sınırı
      .setFooter({ text: `${emojis.size} emoji bulundu.` });

    await interaction.reply({ embeds: [embed] });
  },
};
