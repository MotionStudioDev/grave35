const { EmbedBuilder } = require("discord.js");
const { sunucuAyarları } = require("../commands/otorol.js");

module.exports = async (client, member) => {
  const ayar = sunucuAyarları.get(member.guild.id);
  if (!ayar || !ayar.aktif) return;

  const rolId = member.user.bot ? ayar.botRolId : ayar.uyeRolId;
  if (!rolId) return;

  try {
    await member.roles.add(rolId);

    if (ayar.logKanalId) {
      const embed = new EmbedBuilder()
        .setColor("Blurple")
        .setTitle("🎉 Oto-Rol Verildi")
        .setDescription(`${member.user.bot ? "🤖 Bot" : "👤 Üye"} <@${member.id}> giriş yaptı ve <@&${rolId}> rolü verildi.`)
        .setFooter({ text: "GraveBOT Oto-Rol Sistemi" })
        .setTimestamp();

      const kanal = member.guild.channels.cache.get(ayar.logKanalId);
      if (kanal && kanal.isTextBased()) kanal.send({ embeds: [embed] });
    }
  } catch (err) {
    console.log(`[OtoRol] Rol verilemedi: ${err.message}`);
  }
};
