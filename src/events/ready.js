const { Events, ActivityType, Routes } = require("discord.js");

module.exports = {
  name: Events.ClientReady,
  once: true,
  async execute(client, rest, slashcommands, log) {
    try {
      // Test sunucusuna komut yükle
      await rest.put(
        Routes.applicationGuildCommands(client.user.id, "1408511083232362547"),
        { body: slashcommands }
      );
      log(`${slashcommands.length} komut test sunucuna yüklendi ✅`);

      // Global komut yükle
      await rest.put(
        Routes.applicationCommands(client.user.id),
        { body: slashcommands }
      );
      log(`${slashcommands.length} komut global yüklendi 🌍`);
    } catch (error) {
      console.error(error);
    }

    // === Bot Durumu ===
    let activities = [
      { name: "Bakım Modu Aktif - Grave", type: ActivityType.Playing },
      { name: `${client.user.username}`, type: ActivityType.Playing }
    ];
    let i = 0;

    // Başlangıçta direkt ayarla
    client.user.setPresence({
      activities: [activities[0]],
      status: "dnd"
    });

    // 10 saniyede bir değiştir
    setInterval(() => {
      client.user.setPresence({
        activities: [activities[i++ % activities.length]],
        status: "dnd"
      });
    }, 10000);

    log(`${client.user.username} aktif edildi!`);
  },
};
