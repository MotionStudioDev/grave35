require("dotenv").config();
const { REST, Routes } = require("discord.js");
const fs = require("fs");
const path = require("path");
const { clientId } = require("./src/config.js"); // buradan alıyoruz

// Komutları oku
const commands = [];
const komutlarPath = path.join(__dirname, "src", "commands");
const komutDosyalari = fs.readdirSync(komutlarPath).filter(file => file.endsWith(".js"));

for (const file of komutDosyalari) {
  const filePath = path.join(komutlarPath, file);
  const command = require(filePath);
  if ("data" in command && "execute" in command) {
    commands.push(command.data.toJSON());
  } else {
    console.log(`[UYARI] ${filePath} dosyasında "data" veya "execute" eksik.`);
  }
}

// Discord API'ye gönder
const rest = new REST({ version: "10" }).setToken(process.env.token);

(async () => {
  try {
    console.log(`${commands.length} komut yükleniyor...`);
    const data = await rest.put(
      Routes.applicationCommands(clientId), // Global yükleme
      { body: commands }
    );
    console.log(`${data.length} komut başarıyla yüklendi ✅`);
  } catch (error) {
    console.error(error);
  }
})();
