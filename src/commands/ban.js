// src/commands/ban.js
const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("ban")
    .setDescription("Belirtilen kullanıcıyı sunucudan yasaklar.")
    .addUserOption(option =>
      option
        .setName("kullanıcı")
        .setDescription("Banlanacak kullanıcıyı seçin.")
        .setRequired(true)
    )
    .addStringOption(option =>
      option
        .setName("sebep")
        .setDescription("Ban sebebini yazın.")
        .setRequired(false)
    ),

  async execute(client, interaction) {
    // Yetki kontrolü
    if (!interaction.member.permissions.has(PermissionFlagsBits.BanMembers)) {
      return interaction.reply({
        content: "❌ Bu komutu kullanmak için **Üyeleri Yasakla** yetkisine sahip olmalısınız.",
        ephemeral: true,
      });
    }

    const user = interaction.options.getUser("kullanıcı");
    const reason = interaction.options.getString("sebep") || "Sebep belirtilmedi.";

    // deferReply → Discord'a cevap beklemesini söylüyoruz
    await interaction.deferReply({ ephemeral: true });

    try {
      const member = await interaction.guild.members.fetch(user.id).catch(() => null);

      if (!member) {
        return interaction.editReply({
          content: "❌ Kullanıcı bu sunucuda bulunamadı veya zaten çıkmış.",
        });
      }

      // Banlanabilir mi?
      if (!member.bannable) {
        return interaction.editReply({
          content: "❌ Bu kullanıcıyı banlayamıyorum. (Yetkim yetersiz olabilir)",
        });
      }

      await member.ban({ reason });

      return interaction.editReply({
        embeds: [
          new EmbedBuilder()
            .setColor("Red")
            .setDescription(`✅ **${user.tag}** kullanıcısı banlandı.\n**Sebep:** ${reason}`),
        ],
      });
    } catch (error) {
      console.error(error);
      return interaction.editReply({
        content: "❌ Kullanıcıyı banlarken bir hata oluştu.",
      });
    }
  },
};