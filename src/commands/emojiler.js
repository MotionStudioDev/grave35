const {
  SlashCommandBuilder,
  EmbedBuilder,
  ButtonBuilder,
  ButtonStyle,
  ActionRowBuilder
} = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("emojiler")
    .setDescription("Sunucudaki özel emojileri sayfa sayfa gösterir."),

  async execute(interaction) {
    const emojis = interaction.guild.emojis.cache.map(e => ({
      name: e.name,
      id: e.id,
      animated: e.animated,
      url: `https://cdn.discordapp.com/emojis/${e.id}.${e.animated ? "gif" : "png"}`
    }));

    if (emojis.length === 0) {
      const embed = new EmbedBuilder()
        .setColor("Red")
        .setTitle("😢 Emoji Yok")
        .setDescription("Bu sunucuda özel emoji bulunmuyor.")
        .setTimestamp();
      return interaction.reply({ embeds: [embed], ephemeral: true });
    }

    let index = 0;
    const renkler = ["Blurple", "Green", "Gold", "#ff00ff", "#00ffff", "Red"];

    const createEmbed = (i) => {
      const emoji = emojis[i];
      const renk = renkler[Math.floor(Math.random() * renkler.length)];

      return new EmbedBuilder()
        .setColor(renk)
        .setTitle(`🔍 Emoji ${i + 1}/${emojis.length}`)
        .setThumbnail(emoji.url)
        .addFields(
          { name: "Ad", value: emoji.name, inline: true },
          { name: "ID", value: emoji.id, inline: true },
          { name: "Animasyonlu", value: emoji.animated ? "✅ Evet" : "❌ Hayır", inline: true },
          { name: "Görsel Linki", value: `[Tıkla](${emoji.url})`, inline: false }
        )
        .setFooter({ text: `Motion Studio - GraveBOT` })
        .setTimestamp();
    };

    const row = (i) => new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId("prev")
        .setLabel("⏪ Önceki")
        .setStyle(ButtonStyle.Secondary)
        .setDisabled(i === 0),
      new ButtonBuilder()
        .setCustomId("next")
        .setLabel("⏩ Sonraki")
        .setStyle(ButtonStyle.Secondary)
        .setDisabled(i === emojis.length - 1),
      new ButtonBuilder()
        .setLabel("📥 İndir")
        .setStyle(ButtonStyle.Link)
        .setURL(emojis[i].url)
    );

    await interaction.reply({
      embeds: [createEmbed(index)],
      components: [row(index)],
      ephemeral: false
    });

    const collector = interaction.channel.createMessageComponentCollector({
      filter: i => i.user.id === interaction.user.id,
      time: 60_000
    });

    collector.on("collect", async i => {
      if (i.customId === "prev") index--;
      if (i.customId === "next") index++;

      await i.update({
        embeds: [createEmbed(index)],
        components: [row(index)]
      });
    });
  }
};
