const { EmbedBuilder } = require("discord.js");
const { sunucuAyarları } = require("../commands/otorol.js");

module.exports = async (client, member) => {
  const guildId = member.guild.id;
  const ayar = sunucuAyarları.get(guildId);
  if (!ayar || !ayar.aktif) return;

  const rolId = member.user.bot ? ayar.botRolId : ayar.uyeRolId;

  try {
    await member.roles.add(rolId);

    const embed = new EmbedBuilder()
      .setColor("Blurple")
      .setTitle("🎉 Oto-Rol Verildi")
      .setDescription(`${member.user.bot ? "🤖 Bot" : "👤 Üye"} <@${member.id}> giriş yaptı ve <@&${rolId}> rolü verildi.`)
      .setTimestamp();

    const logKanal = member.guild.channels.cache.find(c => c.name === "otorol-log");
    if (logKanal) logKanal.send({ embeds: [embed] });
  } catch (err) {
    console.log("Rol verilemedi:", err.message);
  }
};
