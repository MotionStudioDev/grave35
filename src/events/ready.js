const { ActivityType, Events } = require("discord.js");

module.exports = {
  name: Events.ClientReady,
  once: true,
  execute(client) {
    let activities = [
      `Güçlü sistemler, yeni altyapı, düşük ping`,
	  `/yardım - v1.0.9 Beta`,
      `${client.user.username} - Yeniden Sizlerle`,
    ], i = 0;

    // Durum modunu Rahatsız Etmeyin (dnd) yap
    client.user.setStatus("dnd");

    // Her 10 saniyede bir aktiviteyi değiştir
    setInterval(() => {
      client.user.setActivity({
        name: activities[i++ % activities.length],
        type: ActivityType.Playing // "Oynuyor" olarak gözükür
      });
    }, 10000);
  }
};
