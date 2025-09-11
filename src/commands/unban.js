const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("unban")
    .setDescription("Belirtilen kullanıcının yasağını kaldırır.")
    .addStringOption(option =>
      option
        .setName("id")
        .setDescription("Banı kaldırılacak kullanıcının ID'si.")
        .setRequired(true)
    ),

  async execute(interaction, client) {
    if (!interaction.member.permissions.has(PermissionFlagsBits.BanMembers)) {
      return interaction.reply({
        content: "❌ Bu komutu kullanmak için **Üyeleri Yasakla** yetkisine sahip olmalısınız.",
        ephemeral: true,
      });
    }

    const userId = interaction.options.getString("id");

    await interaction.deferReply({ ephemeral: true });

    try {
      await interaction.guild.members.unban(userId);

      return interaction.editReply({
        embeds: [
          new EmbedBuilder()
            .setColor("Green")
            .setTitle("✅ Kullanıcının Banı Kaldırıldı")
            .setDescription(`ID: **${userId}** olan kullanıcının yasağı kaldırıldı.`)
            .setFooter({ text: `İşlemi yapan: ${interaction.user.tag}` })
            .setTimestamp(),
        ],
      });
    } catch (err) {
      console.error("[UNBAN KOMUTU HATASI]", err);
      return interaction.editReply({
        content: "❌ Belirtilen ID'ye sahip kullanıcı banlı değil veya bulunamadı.",
      });
    }
  },
};
