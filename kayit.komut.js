const { REST, Routes } = require("discord.js");
const fs = require("fs");
const yol = require("path");
require("dotenv").config();

async function kaydet() {
    var v = [];
    var d = yol.join(__dirname, "komutlar");
    fs.readdirSync(d).filter(function (f) { return f.endsWith(".js"); }).forEach(function (f) {
        var k = require(yol.join(d, f));
        if (k.veri) { v.push(k.veri.toJSON()); console.log("[guardxnsole] " + k.veri.name); }
    });
    var rest = new REST({ version: "10" }).setToken(process.env.BOT_TOKENI);
    try {
        await rest.put(Routes.applicationCommands(process.env.ISTEMCI_ID), { body: v });
        console.log("[guardxnsole] " + v.length + " komut kaydedildi");
    } catch (h) { console.error("[guardxnsole] kayit hatasi:", h.message); }
}

kaydet();