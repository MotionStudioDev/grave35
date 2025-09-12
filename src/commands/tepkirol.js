const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const db = require("croxydb");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("tepkirol")
    .setDescription("Sunucuna özel tepki rol mesajı oluşturur.")
    .addStringOption(option =>
      option.setName("emoji")
        .setDescription("Emoji (örnek: 😊 veya <:özelemoji:123456789>)")
        .setRequired(true)
    )
    .addRoleOption(option =>
      option.setName("rol")
        .setDescription("Emojiye karşılık gelen rol")
        .setRequired(true)
    ),

  async execute(interaction, client) {
    const emojiRaw = interaction.options.getString("emoji");
    const rol = interaction.options.getRole("rol");

    // Özel emoji varsa ayıkla
    const emoji = emojiRaw.match(/<a?:\w+:(\d+)>/)
      ? client.emojis.cache.get(emojiRaw.match(/<a?:\w+:(\d+)>/)[1])
      : emojiRaw;

    const embed = new EmbedBuilder()
      .setColor("Green")
      .setTitle("🎭 Rol Seçimi")
      .setDescription(`Aşağıdaki emojiye tıklayarak rol alabilirsin:\n\n${emojiRaw} = ${rol.name}`);

    const msg = await interaction.reply({ embeds: [embed], fetchReply: true });

    try {
      await msg.react(emoji);
    } catch (err) {
      return interaction.followUp({
        content: "❌ Emoji eklenemedi. Botun emojiye erişimi olduğundan emin ol.",
        ephemeral: true
      });
    }

    db.set(`tepkirol_${msg.id}`, {
      guildID: interaction.guild.id,
      roller: {
        [emojiRaw]: rol.id
      }
    });
  }
};
