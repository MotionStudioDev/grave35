const { Events, InteractionType } = require("discord.js");

module.exports = {
  name: Events.InteractionCreate,
  async execute(interaction) {
    const client = interaction.client;

    if (interaction.type !== InteractionType.ApplicationCommand) return;
    if (interaction.user.bot) return;

    const command = client.slashcommands.get(interaction.commandName);
    if (!command) return;

    try {
      await command.run(client, interaction);
    } catch (e) {
      console.error(e);

      if (interaction.deferred || interaction.replied) {
        await interaction.editReply("❌ Komut çalıştırılırken bir hata oluştu!");
      } else {
        await interaction.reply({
          content: "❌ Komut çalıştırılırken bir hata oluştu! Lütfen tekrar deneyin.",
          ephemeral: true
        });
      }
    }
  }
};
