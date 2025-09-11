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

  async execute(interaction, client) {
    // Yetki kontrolü
    if (!interaction.member.permissions.has(PermissionFlagsBits.BanMembers)) {
      return interaction.reply({
        content: "❌ Bu komutu kullanmak için **Üyeleri Yasakla** yetkisine sahip olmalısınız.",
        ephemeral: true,
      });
    }

    const user = interaction.options.getUser("kullanıcı");
    const reason = interaction.options.getString("sebep") || "Sebep belirtilmedi.";

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

      // Kendini banlamasın
      if (member.id === interaction.user.id) {
        return interaction.editReply({
          content: "❌ Kendini banlayamazsın.",
        });
      }

      // Botu banlamasın
      if (member.id === client.user.id) {
        return interaction.editReply({
          content: "❌ Beni banlayamazsın 😅",
        });
      }

      await member.ban({ reason });

      return interaction.editReply({
        embeds: [
          new EmbedBuilder()
            .setColor("Red")
            .setTitle("🚫 Kullanıcı Banlandı")
            .setDescription(`**${user.tag}** banlandı.\n\n**Sebep:** ${reason}`)
            .setFooter({ text: `Banlayan: ${interaction.user.tag}` })
            .setTimestamp(),
        ],
      });
    } catch (error) {
      console.error("[BAN KOMUTU HATASI]", error);
      return interaction.editReply({
        content: "❌ Kullanıcıyı banlarken bir hata oluştu.",
      });
    }
  },
};
