const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, PermissionFlagsBits } = require("discord.js");
const db = require("croxydb");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("küfür-sistemi")
    .setDescription("Sunucuda küfür engel sistemini aç/kapat."),
  
  async execute(interaction, client) {
    // ❗ Sadece sunucu kurucusu açabilsin
    if (interaction.user.id !== interaction.guild.ownerId) {
      return interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setColor("Red")
            .setTitle("🚫 Yetkin Yok")
            .setDescription("Bu komutu sadece **sunucu kurucusu** kullanabilir.")
        ],
        ephemeral: true
      });
    }

    const sistemDurum = db.get(`kufur_${interaction.guild.id}`);

    const embed = new EmbedBuilder()
      .setColor("Blurple")
      .setTitle("🛡️ Küfür Engel Sistemi")
      .setDescription(sistemDurum 
        ? "Bu sunucuda **küfür engel sistemi zaten açık**.\n\nİstersen kapatabilirsin. 👇"
        : "Bu sunucuda küfür engel sistemi **kapalı**.\n\nAçmak ister misiniz? 👇")
      .setTimestamp();

    const row = new ActionRowBuilder();

    if (sistemDurum) {
      row.addComponents(
        new ButtonBuilder()
          .setCustomId("kufurKapat")
          .setLabel("🚫 Sistemi Kapat!")
          .setStyle(ButtonStyle.Danger)
      );
    } else {
      row.addComponents(
        new ButtonBuilder()
          .setCustomId("kufurAc")
          .setLabel("✅ Evet Aç!")
          .setStyle(ButtonStyle.Success),
        new ButtonBuilder()
          .setCustomId("kufurHayir")
          .setLabel("❌ Hayır Açma!")
          .setStyle(ButtonStyle.Secondary)
      );
    }

    await interaction.reply({ embeds: [embed], components: [row], ephemeral: true });
  },
};
