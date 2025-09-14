const {
  SlashCommandBuilder,
  EmbedBuilder,
  ButtonBuilder,
  ButtonStyle,
  ActionRowBuilder,
  StringSelectMenuBuilder,
  PermissionFlagsBits
} = require("discord.js");

const sunucuAyarları = new Map();

module.exports = {
  data: new SlashCommandBuilder()
    .setName("otorol")
    .setDescription("Sunucuya özel oto-rol sistemini yönet.")
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

  async execute(interaction) {
    const guildId = interaction.guild.id;
    const ayar = sunucuAyarları.get(guildId);

    if (!ayar || !ayar.aktif) {
      // Sistem kapalıysa uyarı embed'i gönder
      const embed = new EmbedBuilder()
        .setColor("Red")
        .setTitle("🔒 Oto-Rol Sistemi Kapalı")
        .setDescription("Bu sunucuda oto-rol sistemi aktif değil.\nAçmak için aşağıdaki butona tıklayın.")
        .setFooter({ text: "GraveBOT Oto-Rol Sistemi" })
        .setTimestamp();

      const row = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setCustomId("otorol_ac")
          .setLabel("✅ Sistemi Aktif Et")
          .setStyle(ButtonStyle.Success)
      );

      await interaction.reply({ embeds: [embed], components: [row], ephemeral: true });
    } else {
      // Sistem aktifse roller gösterilsin ve kapatma butonu gelsin
      const embed = new EmbedBuilder()
        .setColor("Green")
        .setTitle("🛠️ Oto-Rol Sistemi Aktif")
        .setDescription(`Sistem aktif.\nÜye rolü: <@&${ayar.uyeRolId}>\nBot rolü: <@&${ayar.botRolId}>`)
        .setFooter({ text: "GraveBOT Oto-Rol Sistemi" })
        .setTimestamp();

      const row = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setCustomId("otorol_kapat")
          .setLabel("❌ Sistemi Kapat")
          .setStyle(ButtonStyle.Danger)
      );

      await interaction.reply({ embeds: [embed], components: [row], ephemeral: true });
    }

    // Buton etkileşimleri
    const collector = interaction.channel.createMessageComponentCollector({
      filter: i => i.user.id === interaction.user.id,
      time: 60_000
    });

    collector.on("collect", async i => {
      if (i.customId === "otorol_ac") {
        // Rol seçimi için menü gönder
        const embed = new EmbedBuilder()
          .setColor("Blurple")
          .setTitle("🎯 Rol Seçimi")
          .setDescription("Lütfen aşağıdan üye ve bot rolleri seçin.")
          .setFooter({ text: "GraveBOT Oto-Rol Sistemi" })
          .setTimestamp();

        const menu = new ActionRowBuilder().addComponents(
          new StringSelectMenuBuilder()
            .setCustomId("otorol_roller")
            .setPlaceholder("Rolleri Seçin")
            .addOptions(
              interaction.guild.roles.cache
                .filter(r => !r.managed && r.name !== "@everyone")
                .map(r => ({
                  label: r.name,
                  value: r.id
                }))
                .slice(0, 25)
            )
        );

        await i.update({ embeds: [embed], components: [menu] });
      }

      if (i.customId === "otorol_kapat") {
        sunucuAyarları.set(guildId, { aktif: false });
        const embed = new EmbedBuilder()
          .setColor("Red")
          .setTitle("❌ Sistem Kapatıldı")
          .setDescription("Oto-rol sistemi devre dışı bırakıldı.")
          .setTimestamp();

        await i.update({ embeds: [embed], components: [] });
      }

      if (i.customId === "otorol_roller") {
        const roller = i.values;
        if (roller.length < 2) {
          return i.reply({
            embeds: [
              new EmbedBuilder()
                .setColor("Yellow")
                .setTitle("⚠️ Eksik Seçim")
                .setDescription("Lütfen en az 2 rol seçin: biri üye, biri bot için.")
            ],
            ephemeral: true
          });
        }

        sunucuAyarları.set(guildId, {
          aktif: true,
          uyeRolId: roller[0],
          botRolId: roller[1]
        });

        const embed = new EmbedBuilder()
          .setColor("Green")
          .setTitle("✅ Oto-Rol Sistemi Aktif Edildi")
          .setDescription(`Üye rolü: <@&${roller[0]}>\nBot rolü: <@&${roller[1]}>`)
          .setTimestamp();

        await i.update({ embeds: [embed], components: [] });
      }
    });
  },

  sunucuAyarları
};
