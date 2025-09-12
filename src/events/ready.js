const { ActivityType, Events } = require("discord.js")
module.exports = {
	name: Events.ClientReady,
	once: true,
	execute(client) {
    let activities = [ `/yardım - v1.0.5`, `${client.user.username} - Yeniden sizlerle!` ], i = 0;
    setInterval(() => client.user.setActivity({ name: `${activities[i++ % activities.length]}`, type: ActivityType.Listening }), 22000);
}};
