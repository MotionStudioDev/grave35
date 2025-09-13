const { SlashCommandBuilder } = require("discord.js");

function generatePassword(length = 12) {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*";
  return Array.from({ length }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName("şifre-oluştur")
    .setDescription("Güçlü ve rastgele bir şifre üretir."),

  async execute(interaction) {
    const şifre = generatePassword();
    await interaction.reply({
      content: `🔐 İşte sana özel bir şifre: \`${şifre}\`\nNot: Paylaşma, kral gibi sakla.`
    });
  }
};
