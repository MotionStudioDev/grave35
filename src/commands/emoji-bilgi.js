// src/commands/emoji-bilgi.js
const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("emoji-bilgi")
    .setDescription("Bir emoji hakkında bilgi verir.")
    .addStringOption(option =>
      option
        .setName("emoji")
        .setDescription("Emoji giriniz (örn: :smile: veya direkt tıkla)")
        .setRequired(true)
    ),

  async execute(interaction, client) {
    const emojiInput = interaction.options.getString("emoji");

    // Emoji ID'sini yakala
    const regex = /<(a)?:\w+:(\d+)>/;
    const match = emojiInput.match(regex);

    if (!match) {
      return interaction.reply({
        content: "❌ Lütfen sunucuya ait geçerli bir emoji giriniz.",
        ephemeral: true,
      });
    }

    const emojiId = match[2];
    const emoji = interaction.guild.emojis.cache.get(emojiId);

    if (!emoji) {
      return interaction.reply({
        content: "❌ Bu emoji bu sunucuda bulunamadı.",
        ephemeral: true,
      });
    }

    const embed = new EmbedBuilder()
      .setColor("Green")
      .setTitle(`Emoji Bilgisi: ${emoji.name}`)
      .setThumbnail(emoji.url)
      .addFields(
        { name: "Adı", value: emoji.name, inline: true },
        { name: "Animasyonlu mu?", value: emoji.animated ? "Evet ✅" : "Hayır ❌", inline: true },
        { name: "ID", value: emoji.id, inline: true },
        { name: "Bağlantı", value: `[Görüntüle](${emoji.url})`, inline: true }
      )
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });
  },
};
