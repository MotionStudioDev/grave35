const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("zar-at")
    .setDescription("1 ile 6 arasında rastgele bir zar atar."),

  async execute(interaction) {
    const zar = Math.floor(Math.random() * 6) + 1;

    const yorumlar = {
      1: "🎲 **1** – Tek geldi, şanssızsın 😅",
      2: "🎲 **2** – Düşük ama çift 👀",
      3: "🎲 **3** – Orta karar, ne iyi ne kötü 😐",
      4: "🎲 **4** – Güzel sayı, devam! 🔥",
      5: "🎲 **5** – Şanslısın, neredeyse kral! 👌",
      6: "🎲 **6** – KRAL GELDİ 👑 Seninle zar atılmaz!"
    };

    await interaction.reply({
      content: `${interaction.user} ${yorumlar[zar]}`,
      ephemeral: false
    });
  }
};
