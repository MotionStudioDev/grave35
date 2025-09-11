// src/events/interactionCreate.js
const { Events } = require("discord.js");

module.exports = {
  name: Events.InteractionCreate,
  async execute(interaction, client) {
    try {
      if (!interaction.isChatInputCommand()) return;

      const command = client.slashcommands.get(interaction.commandName);
      if (!command) {
        console.warn(`Komut bulunamadı: ${interaction.commandName}`);
        return;
      }

      // Try different possible signatures to be tolerant
      const tryExecute = async () => {
        if (typeof command.execute === "function") {
          try { return await command.execute(interaction, client); } catch (e1) {
            try { return await command.execute(client, interaction); } catch (e2) { throw e2; }
          }
        }
        if (typeof command.run === "function") {
          try { return await command.run(interaction, client); } catch (e1) {
            try { return await command.run(client, interaction); } catch (e2) { throw e2; }
          }
        }
        throw new Error("Komut dosyasında execute veya run fonksiyonu bulunamadı.");
      };

      await tryExecute();

    } catch (err) {
      // 1) full stack to console for debugging
      console.error(`Komut çalıştırma hatası (${interaction.commandName}):`, err);

      // 2) user-friendly message (try reply or editReply)
      try {
        if (!interaction.replied && !interaction.deferred) {
          await interaction.reply({ content: "❌ Komut çalıştırılırken bir hata oluştu. Hata konsola yazıldı.", ephemeral: true });
        } else {
          await interaction.editReply({ content: "❌ Komut çalıştırılırken bir hata oluştu. Hata konsola yazıldı." });
        }
      } catch (replyErr) {
        console.error("Hata mesajı gönderilemedi:", replyErr);
      }
    }
  }
};
