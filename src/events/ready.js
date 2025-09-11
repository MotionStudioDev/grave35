const { ActivityType, Events } = require("discord.js");

module.exports = {
  name: Events.ClientReady,
  once: true,
  execute(client) {
    let activities = [ 
      `/yardım - Grave yeniden sizlerle!`, 
      `${client.user.username} - v1.0.7` 
    ], 
    i = 0;

    setInterval(
      () => client.user.setActivity({ 
        name: activities[i++ % activities.length], 
        type: ActivityType.Listening 
      }), 
      10000 // 10 saniye
    );

    client.user.setStatus("dnd"); // 🔴 Rahatsız Etmeyin
  }
};
