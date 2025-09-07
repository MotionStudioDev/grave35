const { SlashCommandBuilder } = require("@discordjs/builders");
const { EmbedBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("yardım")
        .setDescription("Yardım menüsünü gösterir."),
    run: async (client, interaction) => {
        const Yardım = new EmbedBuilder()
            .setColor("Blurple")
            .setImage("https://cdn.discordapp.com/attachments/1414192526927335496/1414308119088988320/standard.gif?ex=68bf1894&is=68bdc714&hm=de909ffeefd2d7fb2cb96db43e9c332dc3a3339514008ceef881efaa982ac280&")
            .setTitle("Grave - Tüm Komutlar")
            .setDescription(`                
                **/ban** • Belirtilen kişiyi sunucudan banlar.
                **/kick** • Belirtilen kişiyi sunucudan atar.
                **/unban** • Belirtilen idli kişinin banını açar.
                **/kilit kilitle** • Kanalı kilitler.
                **/kilit kaldır** • Eğerki kanal kilitliyse o kiliti kaldırır.
                **/oto-rol** • Sunucuya gelen üyelere otomatik rol verir.
                **/reklam-engel** • Reklam engel sistemini açar.
                **/slowmode** • Kanala yavaş mod ekler.
                **/temizle** • Belirtilen miktarda mesaj siler.

            `);

        interaction.reply({ embeds: [Yardım] });
    },
};
