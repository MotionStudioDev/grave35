// src/events/interactionCreate.js
const { Events } = require("discord.js");

module.exports = {
  name: Events.InteractionCreate,
  async execute(interaction, client) {
    if (!interaction.isChatInputCommand()) return;

    const command = client.slashcommands.get(interaction.commandName);
    if (!command) {
      console.warn(`[WARN] ${interaction.commandName} komutu bulunamadı.`);
      return;
    }

    try {
      // Normal execute çalıştırma
      if (typeof command.execute === "function") {
        await command.execute(interaction, client);
      } else if (typeof command.run === "function") {
        await command.run(interaction, client);
      } else {
        throw new Error(`Komut ${interaction.commandName} içinde execute/run fonksiyonu yok.`);
      }
    } catch (error) {
      console.error(`[ERROR] ${interaction.commandName} çalıştırılırken hata:`, error);

      if (!interaction.replied && !interaction.deferred) {
        await interaction.reply({
          content: "❌ Komut çalıştırılırken bir hata oluştu. Konsola yazıldı.",
          ephemeral: true
        });
      } else {
        await interaction.editReply({
          content: "❌ Komut çalıştırılırken bir hata oluştu. Konsola yazıldı."
        });
      }
    }
  }
};
