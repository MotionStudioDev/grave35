const { SlashCommandBuilder } = require("@discordjs/builders");
const { PermissionFlagsBits, EmbedBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("unban")
        .setDescription("Belirtilen kullanıcının yasağını kaldırır.")
        .addStringOption(option =>
            option.setName("kullanıcı")
                .setDescription("Kullanıcının ID'sini girin.")
                .setRequired(true)
        ),
        
    async run(client, interaction) {
        const bannedUserId = interaction.options.getString("kullanıcı");

        // Yetki kontrolü
        if (!interaction.member.permissions.has(PermissionFlagsBits.BanMembers)) {
            return interaction.reply({
                content: "❌ Bu komutu kullanmak için `Üyeleri Yasakla` yetkisine sahip olmalısınız.",
                ephemeral: true
            });
        }

        try {
            const guild = interaction.guild;
            const bans = await guild.bans.fetch();
            const bannedUser = bans.find(ban => ban.user.id === bannedUserId);

            if (!bannedUser) {
                const embed = new EmbedBuilder()
                    .setColor("Red")
                    .setDescription("❌ Belirtilen ID ile eşleşen yasaklı kullanıcı bulunamadı.");

                return interaction.reply({ embeds: [embed], ephemeral: true });
            }

            const reason = bannedUser.reason || "Neden belirtilmemiş.";

            await guild.bans.remove(bannedUser.user);

            const embed = new EmbedBuilder()
                .setColor("Green")
                .setDescription(`✅ Kullanıcının yasağı kaldırıldı: **${bannedUser.user.tag}**\n**Sebep:** ${reason}`);

            return interaction.reply({ embeds: [embed] });

        } catch (error) {
            console.error(error);
            return interaction.reply({
                content: "❌ Yasağı kaldırırken bir hata oluştu.",
                ephemeral: true
            });
        }
    },
};