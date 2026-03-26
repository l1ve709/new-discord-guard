const { Client, GatewayIntentBits, Partials, Collection } = require("discord.js");
const fs = require("fs");
const yol = require("path");
const yapilandirma = require("./config");
const { veritabaniBaglan } = require("./baglanti/db");

var istemci = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildModeration,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildWebhooks,
        GatewayIntentBits.GuildEmojisAndStickers,
        GatewayIntentBits.MessageContent
    ],
    partials: [
        Partials.Channel,
        Partials.GuildMember,
        Partials.Message
    ]
});

istemci.komutlar = new Collection();

var komutDizini = yol.join(__dirname, "komutlar");
fs.readdirSync(komutDizini).filter(function (d) { return d.endsWith(".js"); }).forEach(function (dosya) {
    var k = require(yol.join(komutDizini, dosya));
    if (k.veri && k.calistir) { istemci.komutlar.set(k.veri.name, k); console.log("[guardxnsole] komut: " + k.veri.name); }
});

var olayDizini = yol.join(__dirname, "events");
fs.readdirSync(olayDizini).filter(function (d) { return d.endsWith(".js"); }).forEach(function (dosya) {
    var o = require(yol.join(olayDizini, dosya));
    if (o.birKez) {
        istemci.once(o.ad, function () { var a = Array.from(arguments); a.push(istemci); o.calistir.apply(null, a); });
    } else {
        istemci.on(o.ad, function () { var a = Array.from(arguments); a.push(istemci); o.calistir.apply(null, a); });
    }
    console.log("[guardxnsole] olay: " + o.ad);
});

async function basla() {
    try {
        await veritabaniBaglan();
        await istemci.login(yapilandirma.botTokeni);
    } catch (h) {
        console.error("[guardxnsole] baslangic hatasi:", h.message);
        process.exit(1);
    }
}

basla();

process.on("unhandledRejection", function (h) { console.error("[guardxnsole] promise:", h); });
process.on("uncaughtException", function (h) { console.error("[guardxnsole] istisna:", h); });