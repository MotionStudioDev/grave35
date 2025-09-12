const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const db = require("croxydb");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("tepkirol")
    .setDescription("Emojiye tepki vererek rol alma mesajı oluşturur.")
    .addStringOption(option =>
      option.setName("emoji1").setDescription("1. emoji").setRequired(true))
    .addRoleOption(option =>
      option.setName("rol1").setDescription("1. emojiye karşılık gelen rol").setRequired(true))
    .addStringOption(option =>
      option.setName("emoji2").setDescription("2. emoji").setRequired(false))
    .addRoleOption(option =>
      option.setName("rol2").setDescription("2. emojiye karşılık gelen rol").setRequired(false))
    .addStringOption(option =>
      option.setName("emoji3").setDescription("3. emoji").setRequired(false))
    .addRoleOption(option =>
      option.setName("rol3").setDescription("3. emojiye karşılık gelen rol").setRequired(false)),

  async execute(interaction, client) {
    const emojis = [];
    const roles = [];

    for (let i = 1; i <= 3; i++) {
      const emoji = interaction.options.getString(`emoji${i}`);
      const rol = interaction.options.getRole(`rol${i}`);
      if (emoji && rol) {
        emojis.push(emoji);
        roles.push(rol);
      }
    }

    if (emojis.length === 0) {
      return interaction.reply({ content: "❌ En az 1 emoji ve rol tanımlamalısın.", ephemeral: true });
    }

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
