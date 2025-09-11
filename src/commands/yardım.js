const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("yardım")
    .setDescription("Yardım menüsünü gösterir."),
  
  async execute(interaction, client) {
    const Yardım = new EmbedBuilder()
      .setColor("Blurple")
      .setTitle("📖 Grave - Tüm Komutlar")
      .setImage("https://cdn.discordapp.com/attachments/1414192526927335496/1414308119088988320/standard.gif?ex=68bf1894&is=68bdc714&hm=de909ffeefd2d7fb2cb96db43e9c332dc3a3339514008ceef881efaa982ac280&")
      .setDescription(`
**/ban** • Belirtilen kişiyi sunucudan banlar.  
**/kick** • Belirtilen kişiyi sunucudan atar.  
**/unban** • Belirtilen ID'li kişinin banını açar.  
**/kilit kilitle** • Kanalı kilitler.  
**/kilit kaldır** • Kanal kilidini kaldırır.  
**/oto-rol** • Sunucuya gelen üyelere otomatik rol verir.  
**/reklam-engel** • Reklam engel sistemini açar/kapatır.  
**/slowmode** • Kanala yavaş mod ekler.  
**/temizle** • Belirtilen miktarda mesaj siler.  
**/ping** • Grave botun pingini gösterir.
      `);

    await interaction.reply({ embeds: [Yardım] });
  },
};
