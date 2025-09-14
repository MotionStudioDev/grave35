const {
  SlashCommandBuilder,
  EmbedBuilder,
  ButtonBuilder,
  ButtonStyle,
  ActionRowBuilder,
  StringSelectMenuBuilder,
  ChannelSelectMenuBuilder,
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
      const embed = new EmbedBuilder()
        .setColor("Green")
        .setTitle("🛠️ Oto-Rol Sistemi Aktif")
        .setDescription(`Üye rolü: <@&${ayar.uyeRolId}>\nBot rolü: <@&${ayar.botRolId}>\n${ayar.logKanalId ? `Log kanalı: <#${ayar.logKanalId}>` : "Log kanalı ayarlanmadı."}`)
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

    const collector = interaction.channel.createMessageComponentCollector({
      filter: i => i.user.id === interaction.user.id,
      time: 90_000
    });

    collector.on("collect", async i => {
      const guildId = i.guild.id;

      if (i.customId === "otorol_ac") {
        const embed = new EmbedBuilder()
          .setColor("Blurple")
          .setTitle("🎯 Rol Seçimi")
          .setDescription("Lütfen aşağıdan **üye rolü** ve **bot rolü** olmak üzere 2 rol seçin.")
          .setFooter({ text: "GraveBOT Oto-Rol Sistemi" })
          .setTimestamp();

        const menu = new ActionRowBuilder().addComponents(
          new StringSelectMenuBuilder()
            .setCustomId("otorol_roller")
            .setPlaceholder("Üye ve Bot rollerini seçin")
            .setMinValues(2)
            .setMaxValues(2)
            .addOptions(
              i.guild.roles.cache
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
        sunucuAyarları.set(guildId, {
          aktif: true,
          uyeRolId: roller[0],
          botRolId: roller[1],
          logKanalId: null
        });

        const embed = new EmbedBuilder()
          .setColor("Green")
          .setTitle("✅ Roller Ayarlandı")
          .setDescription(`Üye rolü: <@&${roller[0]}>\nBot rolü: <@&${roller[1]}>\n\nLog kanalını ayarlamak ister misin?`)
          .setFooter({ text: "GraveBOT Oto-Rol Sistemi" })
          .setTimestamp();

        const row = new ActionRowBuilder().addComponents(
          new ButtonBuilder()
            .setCustomId("log_ev")
            .setLabel("✅ Evet, Ayarla")
            .setStyle(ButtonStyle.Success),
          new ButtonBuilder()
            .setCustomId("log_hayir")
            .setLabel("❌ Hayır, Gerek Yok")
            .setStyle(ButtonStyle.Secondary)
        );

        await i.update({ embeds: [embed], components: [row] });
      }

      if (i.customId === "log_ev") {
        const embed = new EmbedBuilder()
          .setColor("Blurple")
          .setTitle("📡 Log Kanalı Seçimi")
          .setDescription("Lütfen log embed'lerinin gönderileceği metin kanalını seçin.")
          .setTimestamp();

        const kanalMenu = new ActionRowBuilder().addComponents(
          new ChannelSelectMenuBuilder()
            .setCustomId("otorol_log")
            .setPlaceholder("Log kanalı seç")
            .setChannelTypes([0])
        );

        await i.update({ embeds: [embed], components: [kanalMenu] });
      }

      if (i.customId === "log_hayir") {
        const embed = new EmbedBuilder()
          .setColor("Green")
          .setTitle("✅ Sistem Güncellendi")
          .setDescription("Oto-rol sistemi aktif edildi. Log kanalı ayarlanmadı.")
          .setTimestamp();

        await i.update({ embeds: [embed], components: [] });
      }

      if (i.customId === "otorol_log") {
        const kanalId = i.values[0];
        const ayar = sunucuAyarları.get(guildId);
        if (ayar) ayar.logKanalId = kanalId;

        const embed = new EmbedBuilder()
          .setColor("Green")
          .setTitle("✅ Log Kanalı Ayarlandı")
          .setDescription(`Log embed'leri artık <#${kanalId}> kanalına gönderilecek.`)
          .setTimestamp();

        await i.update({ embeds: [embed], components: [] });
      }
    });
  },

  sunucuAyarları
};
