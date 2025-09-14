const { EmbedBuilder } = require("discord.js");

module.exports = async (interaction) => {
  if (!interaction.isButton()) return;

  const id = interaction.customId;
  const user = interaction.user;
  const member = interaction.member;
  const guild = interaction.guild;

  if (!id.startsWith("rol_toggle_")) return;

  const rolId = id.split("_")[2];
  const rol = guild.roles.cache.get(rolId);

  if (!rol) {
    const embed = new EmbedBuilder()
      .setColor("Red")
      .setTitle("❌ Rol Bulunamadı")
      .setDescription("Bu butona bağlı rol sunucuda mevcut değil.")
      .setFooter({ text: "GraveBOT Rol Sistemi" })
      .setTimestamp();

    return interaction.reply({ embeds: [embed], ephemeral: true });
  }

  const hasRole = member.roles.cache.has(rolId);

  if (hasRole) {
    await member.roles.remove(rolId);

    const embed = new EmbedBuilder()
      .setColor("Orange")
      .setTitle("🎭 Rol Kaldırıldı")
      .setDescription(`<@${user.id}> kullanıcısından <@&${rolId}> rolü kaldırıldı.`)
      .setFooter({ text: "GraveBOT Rol Sistemi" })
      .setTimestamp();

    return interaction.reply({ embeds: [embed], ephemeral: true });
  } else {
    await member.roles.add(rolId);

    const embed = new EmbedBuilder()
      .setColor("Green")
      .setTitle("🎭 Rol Verildi")
      .setDescription(`<@${user.id}> kullanıcısına <@&${rolId}> rolü verildi.`)
      .setFooter({ text: "GraveBOT Rol Sistemi" })
      .setTimestamp();

    return interaction.reply({ embeds: [embed], ephemeral: true });
  }
};
