const { EmbedBuilder, PermissionsBitField } = require("discord.js");
const { sunucuAyarları } = require("../commands/otorol.js");

module.exports = async (client, member) => {
  const ayar = sunucuAyarları.get(member.guild.id);
  if (!ayar || !ayar.aktif) return;

  const rolId = member.user.bot ? ayar.botRolId : ayar.uyeRolId;
  if (!rolId) return;

  try {
    const rol = member.guild.roles.cache.get(rolId);
    const bot = member.guild.members.me;

    const yetkisiVarMi = bot.permissions.has(PermissionsBitField.Flags.ManageRoles);
    const pozisyonUygunMu = rol && bot.roles.highest.position > rol.position;

    if (yetkisiVarMi && pozisyonUygunMu) {
      await member.roles.add(rolId);
    } else {
      console.log(`[OtoRol] Rol verilemedi: Yetki veya rol pozisyonu yetersiz.`);
    }

    if (ayar.logKanalId) {
      const kanal = member.guild.channels.cache.get(ayar.logKanalId);
      if (kanal && kanal.isTextBased()) {
        const embed = new EmbedBuilder()
          .setColor("Blurple")
          .setTitle("🎉 Oto-Rol Verildi")
          .setDescription(`${member.user.bot ? "🤖 Bot" : "👤 Üye"} <@${member.id}> giriş yaptı ve <@&${rolId}> rolü verildi.`)
          .setFooter({ text: "GraveBOT Oto-Rol Sistemi" })
          .setTimestamp();

        kanal.send({ embeds: [embed] }).catch(() => {});
      }
    }
  } catch (err) {
    console.log(`[OtoRol] Rol verme hatası: ${err.message}`);
  }
};
