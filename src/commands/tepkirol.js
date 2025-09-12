const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const db = require("croxydb");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("tepkirol")
    .setDescription("Birden fazla emojiyle rol alma mesajı oluşturur.")
    .addStringOption(option =>
      option.setName("emoji1").setDescription("1. emoji").setRequired(true))
    .addRoleOption(option =>
      option.setName("rol1").setDescription("1. emojiye karşılık gelen rol").setRequired(true))
    .addStringOption(option =>
      option.setName("emoji2").setDescription("2. emoji").setRequired(true))
    .addRoleOption(option =>
      option.setName("rol2").setDescription("2. emojiye karşılık gelen rol").setRequired(true))
    .addStringOption(option =>
      option.setName("emoji3").setDescription("3. emoji").setRequired(true))
    .addRoleOption(option =>
      option.setName("rol3").setDescription("3. emojiye karşılık gelen rol").setRequired(true)),

  async execute(interaction, client) {
    const emojis = [
      interaction.options.getString("emoji1"),
      interaction.options.getString("emoji2"),
      interaction.options.getString("emoji3")
    ];
    const roles = [
      interaction.options.getRole("rol1"),
      interaction.options.getRole("rol2"),
      interaction.options.getRole("rol3")
    ];

    const embed = new EmbedBuilder()
      .setColor("Blurple")
      .setTitle("🎭 Rol Seçimi")
      .setDescription(emojis.map((e, i) => `${e} = ${roles[i].name}`).join("\n"));

    const msg = await interaction.reply({ embeds: [embed], fetchReply: true });

    const emojiMap = {};

    for (let i = 0; i < emojis.length; i++) {
      const raw = emojis[i];
      const emoji = raw.match(/<a?:\w+:(\d+)>/)
        ? client.emojis.cache.get(raw.match(/<a?:\w+:(\d+)>/)[1])
        : raw;

      try {
        await msg.react(emoji);
        emojiMap[raw] = roles[i].id;
      } catch (err) {
        console.error(`Emoji eklenemedi: ${raw}`, err);
      }
    }

    db.set(`tepkirol_${msg.id}`, {
      guildID: interaction.guild.id,
      roller: emojiMap
    });
  }
};
