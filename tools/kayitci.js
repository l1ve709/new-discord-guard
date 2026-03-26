// --------------------------------------------------------
// ediz - log sistemi
// --------------------------------------------------------

const { EmbedBuilder } = require("discord.js");
const Ayar = require("../models/ayar.model");

var Kayitci = {};

Kayitci.log = async function (sunucu, baslik, aciklama, renk) {
    try {
        var ayar = await Ayar.getir(sunucu.id);
        if (!ayar.logKanalId) return;
        var kanal = sunucu.channels.cache.get(ayar.logKanalId);
        if (!kanal) return;

        var g = new EmbedBuilder()
            .setTitle(baslik)
            .setDescription(aciklama)
            .setColor(renk || 0x2c3e50)
            .setFooter({ text: "ediz" })
            .setTimestamp();

        await kanal.send({ embeds: [g] });
    } catch (h) {
        console.error("[ediz] log hatasi:", h.message);
    }
};

module.exports = Kayitci;