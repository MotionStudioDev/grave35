// src/commands/unban.js
const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("unban")
    .setDescription("Belirtilen kullanıcının yasağını kaldırır.")
    .addStringOption(option =>
      option
        .setName("kullanıcı")
        .setDescription("Kullanıcının ID'sini girin.")
        .setRequired(true)
    ),

  async execute(client, interaction) {
    const targetId = interaction.options.getString("kullanıcı").trim();

    // Kullanıcı yetkisi
    if (!interaction.member.permissions.has(PermissionFlagsBits.BanMembers)) {
      return interaction.reply({
        content: "❌ Bu komutu kullanmak için `Üyeleri Yasakla` yetkisine sahip olmalısınız.",
        ephemeral: true,
      });
    }

    // Bot yetkisi
    if (!interaction.guild.members.me.permissions.has(PermissionFlagsBits.BanMembers)) {
      return interaction.reply({
        content: "❌ Benim `Üyeleri Yasakla` yetkim yok. Lütfen yetki verip tekrar deneyin.",
        ephemeral: true,
      });
    }

    // Zaman aşımı ve çift reply hatalarını önlemek için
    await interaction.deferReply({ ephemeral: true });

    try {
      // Kullanıcı banlı mı kontrol et (banlı değilse 10026 hatası fırlatır)
      const ban = await interaction.guild.bans.fetch(targetId);
      const reason = ban?.reason ?? "Neden belirtilmemiş.";

      // Banı kaldır
      await interaction.guild.bans.remove(targetId, `Unban by ${interaction.user.tag}`);

      const embed = new EmbedBuilder()
        .setColor(0x57F287)
        .setDescription(`✅ **${ban.user.tag}** kullanıcısının yasağı kaldırıldı.\n**Sebep:** ${reason}`);

      await interaction.editReply({ embeds: [embed] });
    } catch (err) {
      // Ban yoksa (Unknown Ban)
      if (err?.code === 10026 || /Unknown Ban/i.test(String(err?.message))) {
        const embed = new EmbedBuilder()
          .setColor(0xED4245)
          .setDescription("❌ Bu ID’ye ait bir ban bulunamadı.");
        return interaction.editReply({ embeds: [embed] });
      }

      console.error(err);
      return interaction.editReply({ content: "❌ Yasağı kaldırırken bir hata oluştu." });
    }
  },
};