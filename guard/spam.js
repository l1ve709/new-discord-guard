// --------------------------------------------------------
// ediz - spam koruma
// --------------------------------------------------------

const Ayar = require("../models/ayar.model");
const Beyazliste = require("../models/whitelist.model");
const yapilandirma = require("../config");
const Kayit = require("../models/kayit.model");
const kayitci = require("../tools/kayitci");

var sayac = {};

async function kontrolEt(mesaj) {
    if (!mesaj.guild) return false;
    if (mesaj.author.bot) return false;
    if (mesaj.author.id === mesaj.guild.ownerId) return false;
    if (mesaj.author.id === yapilandirma.sahipId) return false;

    var ayar = await Ayar.getir(mesaj.guild.id);
    if (!ayar.spamKoruma) return false;

    if (mesaj.member && mesaj.member.permissions.has("Administrator")) return false;

    var beyaz = await Beyazliste.kontrol(mesaj.guild.id, mesaj.author.id);
    if (beyaz) return false;

    if (ayar.muafRoller.length > 0 && mesaj.member) {
        for (var i = 0; i < ayar.muafRoller.length; i++) {
            if (mesaj.member.roles.cache.has(ayar.muafRoller[i].trim())) return false;
        }
    }

    var sId = mesaj.guild.id;
    var kId = mesaj.author.id;

    if (!sayac[sId]) sayac[sId] = {};
    if (!sayac[sId][kId]) sayac[sId][kId] = [];

    sayac[sId][kId].push(Date.now());

    var esik = Date.now() - (ayar.spamSaniye * 1000);
    sayac[sId][kId] = sayac[sId][kId].filter(function (z) { return z > esik; });

    if (sayac[sId][kId].length >= ayar.spamMesajSinir) {
        sayac[sId][kId] = [];

        try { await mesaj.delete(); } catch (e) { /* */ }

        if (mesaj.member) {
            try {
                await mesaj.member.timeout(ayar.spamSusturSure * 60 * 1000, "[ediz] spam tespit edildi");
            } catch (e) {
                console.error("[ediz] spam susturma hatasi:", e.message);
            }
        }

        await Kayit.ekle({
            sunucuId: sId, kullaniciId: kId,
            kullaniciAdi: mesaj.author.tag || mesaj.author.username,
            islem: "spam",
            detay: ayar.spamMesajSinir + " mesaj / " + ayar.spamSaniye + " sn",
            ceza: "sustur"
        });

        await kayitci.log(mesaj.guild, "Spam Tespit",
            mesaj.author.tag + " | " + ayar.spamSusturSure + " dk susturuldu", 0xe67e22);

        console.log("[ediz] spam: " + mesaj.author.tag);
        return true;
    }

    return false;
}

async function reklamKontrol(mesaj) {
    if (!mesaj.guild) return false;
    if (mesaj.author.bot) return false;
    if (mesaj.author.id === mesaj.guild.ownerId) return false;
    if (mesaj.author.id === yapilandirma.sahipId) return false;

    var ayar = await Ayar.getir(mesaj.guild.id);
    if (!ayar.reklamKoruma) return false;

    if (mesaj.member && mesaj.member.permissions.has("Administrator")) return false;

    var beyaz = await Beyazliste.kontrol(mesaj.guild.id, mesaj.author.id);
    if (beyaz) return false;

    var icerik = mesaj.content;

    for (var i = 0; i < yapilandirma.reklamDesenleri.length; i++) {
        yapilandirma.reklamDesenleri[i].lastIndex = 0;
        if (yapilandirma.reklamDesenleri[i].test(icerik)) {

            try { await mesaj.delete(); } catch (e) { /* */ }

            if (ayar.reklamCeza === "banla" && mesaj.member && mesaj.member.bannable) {
                try { await mesaj.member.ban({ reason: "[ediz] reklam", deleteMessageSeconds: 86400 }); } catch (e) { /* */ }
            } else if (ayar.reklamCeza === "at" && mesaj.member && mesaj.member.kickable) {
                try { await mesaj.member.kick("[ediz] reklam"); } catch (e) { /* */ }
            } else if (mesaj.member) {
                try { await mesaj.member.timeout(600000, "[ediz] reklam"); } catch (e) { /* */ }
            }

            await Kayit.ekle({
                sunucuId: mesaj.guild.id, kullaniciId: mesaj.author.id,
                kullaniciAdi: mesaj.author.tag || mesaj.author.username,
                islem: "reklam", detay: icerik.substring(0, 200), ceza: ayar.reklamCeza
            });

            await kayitci.log(mesaj.guild, "Reklam Tespit",
                mesaj.author.tag + " | Ceza: " + ayar.reklamCeza, 0xc0392b);

            console.log("[ediz] reklam: " + mesaj.author.tag);
            return true;
        }
    }

    return false;
}

setInterval(function () {
    var esik = Date.now() - 30000;
    Object.keys(sayac).forEach(function (sId) {
        Object.keys(sayac[sId]).forEach(function (kId) {
            sayac[sId][kId] = sayac[sId][kId].filter(function (z) { return z > esik; });
            if (sayac[sId][kId].length === 0) delete sayac[sId][kId];
        });
        if (Object.keys(sayac[sId]).length === 0) delete sayac[sId];
    });
}, 20000);

module.exports = { kontrolEt, reklamKontrol };