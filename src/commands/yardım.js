const { SlashCommandBuilder } = require("@discordjs/builders");
const { EmbedBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("yardım")
        .setDescription("Yardım menüsünü gösterir."),
    run: async (client, interaction) => {
        const Yardım = new EmbedBuilder()
            .setColor("Blurple")
            .setImage("")
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
