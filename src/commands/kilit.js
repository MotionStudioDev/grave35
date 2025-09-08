const { PermissionFlagsBits, SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('kilit')
    .setDescription('Kanala üyelerin mesaj yazmasını kilitler veya kilidini açar.')
    .addSubcommand(subcommand =>
      subcommand
        .setName('kilitle')
        .setDescription('Kanalı kilitleyerek üyelerin mesaj yazmasını kısıtlar.')
    )
    .addSubcommand(subcommand =>
      subcommand
        .setName('kaldır')
        .setDescription('Kilidi kaldırarak kanala mesaj yazılmasına izin verir.')
    ),

  async execute(client, interaction) {
    if (!interaction.member.permissions.has(PermissionFlagsBits.ManageChannels)) {
      return interaction.reply({
        content: "❌ Bu komutu kullanmak için **Kanalları Yönet** yetkisine sahip olmalısın.",
        ephemeral: true,
      });
    }

    const channel = interaction.channel;
    const guild = interaction.guild;
    const sub = interaction.options.getSubcommand();

    if (sub === "kilitle") {
      // Kanal zaten kilitli mi?
      if (!channel.permissionsFor(guild.id).has(PermissionFlagsBits.SendMessages)) {
        return interaction.reply({
          embeds: [
            new EmbedBuilder()
              .setColor("Red")
              .setTitle(`#${channel.name} zaten kilitli!`)
              .setDescription("Kilidi kaldırmak için `/kilit kaldır` komutunu kullanabilirsin."),
          ],
        });
      }

      try {
        await channel.permissionOverwrites.edit(guild.id, { SendMessages: false });
        return interaction.reply({
          embeds: [
            new EmbedBuilder()
              .setColor("Green")
              .setTitle(`#${channel.name} başarıyla kilitlendi!`)
              .setDescription("Kilidi kaldırmak için `/kilit kaldır` komutunu kullanabilirsin."),
          ],
        });
      } catch (err) {
        console.error(err);
        return interaction.reply({
          content: "❌ Kanal kilitlenirken bir hata oluştu.",
          ephemeral: true,
        });
      }
    }

    if (sub === "kaldır") {
      // Kanal zaten kilitli değilse
      if (channel.permissionsFor(guild.id).has(PermissionFlagsBits.SendMessages)) {
        return interaction.reply({
          embeds: [
            new EmbedBuilder()
              .setColor("Red")
              .setTitle(`#${channel.name} zaten kilitli değil!`)
              .setDescription("Kilitlemek için `/kilit kilitle` komutunu kullanabilirsin."),
          ],
        });
      }

      try {
        await channel.permissionOverwrites.edit(guild.id, { SendMessages: null }); // eski haline döndür
        return interaction.reply({
          embeds: [
            new EmbedBuilder()
              .setColor("Green")
              .setTitle(`#${channel.name} kanalının kilidi kaldırıldı!`)
              .setDescription("Artık üyeler bu kanala mesaj gönderebilir."),
          ],
        });
      } catch (err) {
        console.error(err);
        return interaction.reply({
          content: "❌ Kanal kilidini kaldırırken bir hata oluştu.",
          ephemeral: true,
        });
      }
    }
  },
};