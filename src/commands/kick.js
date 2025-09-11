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
        .setDescription("Atılma sebebini yazın.")
        .setRequired(false)
    ),

  async execute(interaction, client) {
    if (!interaction.member.permissions.has(PermissionFlagsBits.KickMembers)) {
      return interaction.reply({
        content: "❌ Bu komutu kullanmak için **Üyeleri At** yetkisine sahip olmalısınız.",
        ephemeral: true,
      });
    }

    const user = interaction.options.getUser("kullanıcı");
    const reason = interaction.options.getString("sebep") || "Sebep belirtilmedi.";

    await interaction.deferReply({ ephemeral: true });

    try {
      const member = await interaction.guild.members.fetch(user.id).catch(() => null);

      if (!member) {
        return interaction.editReply({ content: "❌ Kullanıcı bu sunucuda bulunamadı." });
      }

      if (!member.kickable) {
        return interaction.editReply({ content: "❌ Bu kullanıcıyı atamıyorum. (Yetkim yetersiz olabilir)" });
      }

      if (member.id === interaction.user.id) {
        return interaction.editReply({ content: "❌ Kendini atamazsın." });
      }

      if (member.id === client.user.id) {
        return interaction.editReply({ content: "❌ Beni atamazsın 😅" });
      }

      await member.kick(reason);

      return interaction.editReply({
        embeds: [
          new EmbedBuilder()
            .setColor("Orange")
            .setTitle("👢 Kullanıcı Atıldı")
            .setDescription(`**${user.tag}** atıldı.\n\n**Sebep:** ${reason}`)
            .setFooter({ text: `Atan: ${interaction.user.tag}` })
            .setTimestamp(),
        ],
      });
    } catch (err) {
      console.error("[KICK KOMUTU HATASI]", err);
      return interaction.editReply({ content: "❌ Kullanıcıyı atarken bir hata oluştu." });
    }
  },
};
