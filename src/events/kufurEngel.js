const { Events, EmbedBuilder, PermissionFlagsBits } = require("discord.js");
const kufurler = require("../../kufurler.json");
const db = require("croxydb");

module.exports = {
  name: Events.MessageCreate,
  async execute(message, client) {
    if (!message.guild || message.author.bot) return;

    // Sistem açık mı?
    const kufurEngel = db.get(`kufurengel_${message.guild.id}`);
    if (!kufurEngel) return;

    // Mesajda küfür var mı?
    if (kufurler.some(k => message.content.toLowerCase().includes(k))) {
      // Yetkililer hariç
      if (message.member.permissions.has(PermissionFlagsBits.ManageMessages)) return;

      try {
        await message.delete();

        const embed = new EmbedBuilder()
          .setColor("Red")
          .setTitle("🚫 Küfür Engellendi!")
          .setDescription(`<@${message.author.id}> küfür etmek yasaktır!`)
          .setTimestamp();

        await message.channel.send({ embeds: [embed] });
      } catch (err) {
        console.error("[KÜFÜR ENGEL] Hata:", err);
      }
    }
  },
};
