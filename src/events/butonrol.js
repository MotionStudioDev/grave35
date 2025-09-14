const { EmbedBuilder, PermissionsBitField } = require("discord.js");

module.exports = async (interaction) => {
  if (!interaction.isButton()) return;

  const customId = interaction.customId;
  if (!customId.startsWith("butonrol_")) return;

  const rolId = customId.split("_")[1];
  const member = interaction.member;
  const guild = interaction.guild;
  const bot = guild.members.me;

  const rol = guild.roles.cache.get(rolId);
  if (!rol) {
    return interaction.reply({
      embeds: [
        new EmbedBuilder()
          .setColor("Red")
          .setTitle("❌ Rol Bulunamadı")
          .setDescription("Bu rol artık sunucuda mevcut değil.")
      ],
      ephemeral: true
    });
  }

  const yetkisiVarMi = bot.permissions.has(PermissionsBitField.Flags.ManageRoles);
  const pozisyonUygunMu = bot.roles.highest.position > rol.position;

  if (!yetkisiVarMi || !pozisyonUygunMu) {
    return interaction.reply({
      embeds: [
        new EmbedBuilder()
          .setColor("Red")
          .setTitle("🚫 Yetki Yetersiz")
          .setDescription("Botun rolü vermek için yeterli yetkisi veya rol pozisyonu yok.")
      ],
      ephemeral: true
    });
  }

  const hasRole = member.roles.cache.has(rolId);

  try {
    if (hasRole) {
      await member.roles.remove(rolId);
      await interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setColor("Orange")
            .setTitle("🔻 Rol Kaldırıldı")
            .setDescription(`<@&${rolId}> rolü başarıyla kaldırıldı.`)
        ],
        ephemeral: true
      });
    } else {
      await member.roles.add(rolId);
      await interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setColor("Green")
            .setTitle("✅ Rol Verildi")
            .setDescription(`<@&${rolId}> rolü başarıyla verildi.`)
        ],
        ephemeral: true
      });
    }
  } catch (err) {
    console.log(`[ButonRol] Rol işlem hatası: ${err.message}`);
    if (!interaction.replied) {
      await interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setColor("Red")
            .setTitle("⚠️ Hata Oluştu")
            .setDescription("Rol verilirken bir hata oluştu. Yetkileri ve rol pozisyonunu kontrol et.")
        ],
        ephemeral: true
      });
    }
  }
};
