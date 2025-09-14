const {
  SlashCommandBuilder,
  EmbedBuilder,
  ButtonBuilder,
  ButtonStyle,
  ActionRowBuilder,
  PermissionFlagsBits
} = require("discord.js");

// Kanal bazlı mesaj ID'lerini tutan Map
const kanalMesajlar = new Map();

module.exports = {
  data: new SlashCommandBuilder()
    .setName("butonrol")
    .setDescription("Rol verme butonunu gönderir veya mevcut mesaja ekler.")
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addRoleOption(option =>
      option.setName("rol").setDescription("Verilecek rol").setRequired(true)
    )
    .addStringOption(option =>
      option.setName("mesaj").setDescription("İsteğe bağlı özel mesaj").setRequired(false)
    ),

  async execute(interaction) {
    const rol = interaction.options.getRole("rol");
    const mesaj = interaction.options.getString("mesaj") || `Aşağıdaki butona basarak <@&${rol.id}> rolünü alabilir veya kaldırabilirsin.`;
    const kanalId = interaction.channel.id;

    const yeniButon = new ButtonBuilder()
      .setCustomId(`butonrol_${rol.id}`)
      .setLabel(rol.name)
      .setStyle(ButtonStyle.Primary);

    const row = new ActionRowBuilder().addComponents(yeniButon);

    if (kanalMesajlar.has(kanalId)) {
      try {
        const eskiMesajId = kanalMesajlar.get(kanalId);
        const mesajObjesi = await interaction.channel.messages.fetch(eskiMesajId);
        const eskiRow = mesajObjesi.components[0];

        // Aynı rol zaten varsa ekleme
        if (eskiRow.components.some(b => b.customId === `butonrol_${rol.id}`)) {
          return interaction.reply({ content: "⚠️ Bu rol zaten mevcut butonlarda var.", ephemeral: true });
        }

        const yeniRow = ActionRowBuilder.from(eskiRow).addComponents(yeniButon);
        await mesajObjesi.edit({ components: [yeniRow] });
        return interaction.reply({ content: "✅ Buton mevcut mesaja eklendi.", ephemeral: true });
      } catch (err) {
        console.log(`[ButonRol] Mesaj düzenleme hatası: ${err.message}`);
        kanalMesajlar.delete(kanalId); // Bozuksa sil
      }
    }

    // Yeni mesaj oluştur
    const embed = new EmbedBuilder()
      .setColor("Blurple")
      .setTitle("🎯 Rol Butonları")
      .setDescription(mesaj)
      .setFooter({ text: "GraveBOT Buton Rol Sistemi" })
      .setTimestamp();

    const yeniMesaj = await interaction.channel.send({ embeds: [embed], components: [row] });
    kanalMesajlar.set(kanalId, yeniMesaj.id);

    await interaction.reply({ content: "✅ Yeni rol mesajı oluşturuldu.", ephemeral: true });
  },

  kanalMesajlar
};
