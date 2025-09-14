const {
  SlashCommandBuilder,
  EmbedBuilder,
  ButtonBuilder,
  ButtonStyle,
  ActionRowBuilder,
  PermissionFlagsBits
} = require("discord.js");

// Sunucu bazlı ayarları tutan obje
const sunucuAyarları = new Map();

module.exports = {
  data: new SlashCommandBuilder()
    .setName("otorol")
    .setDescription("Sunucuya özel oto-rol sistemini aç/kapat.")
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addRoleOption(option =>
      option.setName("üye-rol").setDescription("Üyelere verilecek rol").setRequired(true)
    )
    .addRoleOption(option =>
      option.setName("bot-rol").setDescription("Botlara verilecek rol").setRequired(true)
    ),

  async execute(interaction) {
    const guildId = interaction.guild.id;
    const uyeRol = interaction.options.getRole("üye-rol");
    const botRol = interaction.options.getRole("bot-rol");

    sunucuAyarları.set(guildId, {
      aktif: false,
      uyeRolId: uyeRol.id,
      botRolId: botRol.id
    });

    const embed = new EmbedBuilder()
      .setColor("Blurple")
      .setTitle("🔧 Oto-Rol Ayarları Kaydedildi")
      .setDescription(`Üye rolü: <@&${uyeRol.id}>\nBot rolü: <@&${botRol.id}>\n\nAşağıdaki butonla sistemi aktif edebilir veya kapatabilirsin.`)
      .setFooter({ text: "GraveBOT Oto-Rol Sistemi" })
      .setTimestamp();

    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId("otorol_ac")
        .setLabel("✅ Aktif Et")
        .setStyle(ButtonStyle.Success),
      new ButtonBuilder()
        .setCustomId("otorol_kapat")
        .setLabel("❌ Kapat")
        .setStyle(ButtonStyle.Danger)
    );

    await interaction.reply({ embeds: [embed], components: [row], ephemeral: true });

    const collector = interaction.channel.createMessageComponentCollector({
      filter: i => i.user.id === interaction.user.id,
      time: 60_000
    });

    collector.on("collect", async i => {
      const ayar = sunucuAyarları.get(guildId);
      if (!ayar) return;

      if (i.customId === "otorol_ac") {
        ayar.aktif = true;
        await i.update({
          embeds: [
            new EmbedBuilder()
              .setColor("Green")
              .setTitle("✅ Oto-Rol Aktif Edildi")
              .setDescription("Yeni gelenlere otomatik rol verilecek.")
              .setTimestamp()
          ],
          components: []
        });
      }

      if (i.customId === "otorol_kapat") {
        ayar.aktif = false;
        await i.update({
          embeds: [
            new EmbedBuilder()
              .setColor("Red")
              .setTitle("❌ Oto-Rol Kapatıldı")
              .setDescription("Yeni gelenlere artık otomatik rol verilmeyecek.")
              .setTimestamp()
          ],
          components: []
        });
      }
    });
  },

  sunucuAyarları
};
