// src/commands/kick.js
const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("kick")
    .setDescription("Belirtilen kullanıcıyı sunucudan atar.")
    .addUserOption(option =>
      option
        .setName("kullanıcı")
        .setDescription("Atılacak kullanıcıyı seçin.")
        .setRequired(true)
    )
    .addStringOption(option =>
      option
        .setName("sebep")
        .setDescription("Atma sebebini yazın.")
        .setRequired(false)
    ),

  async execute(client, interaction) {
    // Yetki kontrolü
    if (!interaction.member.permissions.has(PermissionFlagsBits.KickMembers)) {
      return interaction.reply({
        content: "❌ Bu komutu kullanmak için **Üyeleri At** yetkisine sahip olmalısınız.",
        ephemeral: true,
      });
    }

    const user = interaction.options.getUser("kullanıcı");
    const reason = interaction.options.getString("sebep") || "Sebep belirtilmedi.";

    // deferReply → cevap gecikirse hata olmasın
    await interaction.deferReply({ ephemeral: true });

    try {
      const member = await interaction.guild.members.fetch(user.id).catch(() => null);

      if (!member) {
        return interaction.editReply({
          content: "❌ Kullanıcı bu sunucuda bulunamadı veya zaten çıkmış.",
        });
      }

      // Kicklenebilir mi?
      if (!member.kickable) {
        return interaction.editReply({
          content: "❌ Bu kullanıcıyı atamıyorum. (Yetkim yetersiz olabilir)",
        });
      }

      await member.kick(reason);

      return interaction.editReply({
        embeds: [
          new EmbedBuilder()
            .setColor("Orange")
            .setDescription(`✅ **${user.tag}** kullanıcısı sunucudan atıldı.\n**Sebep:** ${reason}`),
        ],
      });
    } catch (error) {
      console.error(error);
      return interaction.editReply({
        content: "❌ Kullanıcıyı atarken bir hata oluştu.",
      });
    }
  },
};