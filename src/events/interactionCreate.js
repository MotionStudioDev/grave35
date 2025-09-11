const { Events } = require("discord.js");

module.exports = {
  name: Events.InteractionCreate,
  async execute(interaction, client) {
    if (!interaction.isChatInputCommand()) return;

    const command = client.slashcommands.get(interaction.commandName);
    if (!command) {
      console.warn(`Komut bulunamadı: ${interaction.commandName}`);
      return;
    }

    try {
      await command.execute(interaction, client);
    } catch (error) {
      console.error(`Komut çalıştırma hatası: ${interaction.commandName}`, error);

      if (!interaction.replied && !interaction.deferred) {
        await interaction.reply({
          content: "❌ Komut çalıştırılırken bir hata oluştu.",
          ephemeral: true
        });
      } else {
        await interaction.editReply({
          content: "❌ Komut çalıştırılırken bir hata oluştu."
        });
      }
    }
  }
};
