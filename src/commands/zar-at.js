const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("zar-at")
    .setDescription("1 ile 6 arasında rastgele bir zar atar."),

  async execute(interaction) {
    const zar = Math.floor(Math.random() * 6) + 1;

    const emojiMap = {
      1: "🎲 **1** – Tek geldi!",
      2: "🎲 **2** – Çift ama düşük!",
      3: "🎲 **3** – Orta karar!",
      4: "🎲 **4** – Güzel sayı!",
      5: "🎲 **5** – Şanslısın!",
      6: "🎲 **6** – KRAL GELDİ 👑"
    };

    await interaction.reply({
      content: emojiMap[zar],
      ephemeral: false
    });
  }
};
