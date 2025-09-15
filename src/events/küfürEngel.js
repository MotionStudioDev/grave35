const { Events, PermissionFlagsBits, EmbedBuilder } = require("discord.js");
const db = require("croxydb");
const kufurler = require("../../küfürler.json");

module.exports = {
  name: Events.MessageCreate,
  async execute(message, client) {
    if (!message.guild || message.author.bot) return;

    const sistemDurum = db.get(`kufur_${message.guild.id}`);
    if (!sistemDurum) return;

    if (kufurler.some(word => message.content.toLowerCase().includes(word))) {
      if (message.member.permissions.has(PermissionFlagsBits.Administrator)) return;

      try {
        await message.delete();
        const embed = new EmbedBuilder()
          .setColor("Red")
          .setTitle("🚫 Küfür Engellendi")
          .setDescription(`<@${message.author.id}>, bu sunucuda küfür yasaktır.`)
          .setTimestamp();

        await message.channel.send({ embeds: [embed] });
      } catch (err) {
        console.error("[KÜFÜR ENGEL] Mesaj silinemedi:", err);
      }
    }
  }
};
