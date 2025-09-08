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
    const bannedUserId = interaction.options.getString("kullanıcı");

    // Yetki kontrolü
    if (!interaction.member.permissions.has(PermissionFlagsBits.BanMembers)) {
      return interaction.reply({
        content: "❌ Bu komutu kullanmak için **Üyeleri Yasakla** yetkisine sahip olmalısınız.",
        ephemeral: true,
      });
    }

    try {
      // Önce deferReply → Discord’a “cevap gelecek” diye haber veriyoruz
      await interaction.deferReply({ ephemeral: true });

      const bans = await interaction.guild.bans.fetch();
      const bannedUser = bans.get(bannedUserId);

      if (!bannedUser) {
        return interaction.editReply({
          embeds: [
            new EmbedBuilder()
              .setColor("Red")
              .setDescription("❌ Bu ID'ye sahip yasaklı kullanıcı bulunamadı."),
          ],
        });
      }

      await interaction.guild.bans.remove(bannedUser.user);

      return interaction.editReply({
        embeds: [
          new EmbedBuilder()
            .setColor("Green")
            .setDescription(`✅ **${bannedUser.user.tag}** kullanıcısının yasağı kaldırıldı.`),
        ],
      });
    } catch (error) {
      console.error(error);
      return interaction.editReply({
        content: "❌ Yasağı kaldırırken bir hata oluştu. (Not: Botun `Üyeleri Yasakla` yetkisi olmalı)",
      });
    }
  },
};