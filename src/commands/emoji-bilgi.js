const {
  SlashCommandBuilder,
  EmbedBuilder,
  ButtonBuilder,
  ButtonStyle,
  ActionRowBuilder
} = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("emoji-bilgi")
    .setDescription("Bir emoji hakkında detaylı bilgi al.")
    .addStringOption(option =>
      option.setName("emoji")
        .setDescription("Özel emoji gir (örnek: <:grave:123456789012345678>)")
        .setRequired(true)
    ),

  async execute(interaction) {
    const emojiInput = interaction.options.getString("emoji");
    const emojiRegex = /<(a?):(\w+):(\d+)>/;
    const match = emojiInput.match(emojiRegex);

    if (!match) {
      const hataEmbed = new EmbedBuilder()
        .setColor("Red")
        .setTitle("❌ Geçersiz Emoji")
        .setDescription("Lütfen özel bir sunucu emojisi gir (örnek: `<:grave:123456789012345678>`).")
        .setTimestamp();
      return interaction.reply({ embeds: [hataEmbed], ephemeral: true });
    }

    const animasyonluMu = match[1] === "a";
    const emojiAdı = match[2];
    const emojiID = match[3];
    const emojiURL = `https://cdn.discordapp.com/emojis/${emojiID}.${animasyonluMu ? "gif" : "png"}`;

    const renkler = ["Blurple", "Green", "Gold", "#ff00ff", "#00ffff"];
    const rastgeleRenk = renkler[Math.floor(Math.random() * renkler.length)];

    const embed = new EmbedBuilder()
      .setColor(rastgeleRenk)
      .setTitle("🔍 Emoji Bilgisi")
      .setThumbnail(emojiURL)
      .addFields(
        { name: "Ad", value: emojiAdı, inline: true },
        { name: "ID", value: emojiID, inline: true },
        { name: "Animasyonlu", value: animasyonluMu ? "✅ Evet" : "❌ Hayır", inline: true },
        { name: "Görsel Linki", value: `[Tıkla](${emojiURL})`, inline: false }
      )
      .setFooter({ text: "Motion Studio - GraveBOT" })
      .setTimestamp();

    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId(`copy_${emojiID}`)
        .setLabel("ID’yi Kopyala")
        .setStyle(ButtonStyle.Secondary),
      new ButtonBuilder()
        .setLabel("📥 İndir")
        .setStyle(ButtonStyle.Link)
        .setURL(emojiURL)
    );

    await interaction.reply({ embeds: [embed], components: [row], ephemeral: false });
  },

  async handleButton(interaction) {
    const customId = interaction.customId;
    if (customId.startsWith("copy_")) {
      const emojiID = customId.split("_")[1];

      const embed = new EmbedBuilder()
        .setColor("Green")
        .setTitle("📋 Emoji ID")
        .setDescription(`\`${emojiID}\` → kopyalamak için üzerine tıkla`)
        .setTimestamp();

      await interaction.reply({ embeds: [embed], ephemeral: true });
    }
  }
};
