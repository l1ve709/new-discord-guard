const Ayar = require("../models/ayar.model");
const Whitelist = require("../models/whitelist.model");
const yapilandirma = require("../config");

var sayaclar = {};

function temizle(sunucuId, eylemTuru, kullaniciId) {
    var anahtar = sunucuId + ":" + eylemTuru + ":" + kullaniciId;
    if (!sayaclar[anahtar]) return;
    delete sayaclar[anahtar];
}

function sayacArttir(sunucuId, eylemTuru, kullaniciId, limitSuresi) {
    var anahtar = sunucuId + ":" + eylemTuru + ":" + kullaniciId;
    if (!sayaclar[anahtar]) sayaclar[anahtar] = [];
    sayaclar[anahtar].push(Date.now());

    var esik = Date.now() - (limitSuresi * 1000);
    sayaclar[anahtar] = sayaclar[anahtar].filter(function (z) { return z > esik; });

    return sayaclar[anahtar].length;
}

var Denetleyici = {};

Denetleyici.kontrol = async function (secenekler) {
    var sonuc = { ihlal: false, yurutucu: null, ayarlar: null };

    try {
        var sunucu = secenekler.sunucu;
        var denetimTuru = secenekler.denetimTuru;
        var eylemTuru = secenekler.eylemTuru;
        var modulAdi = secenekler.modulAdi;
        var limitAlani = secenekler.limitAlani;
        var istemci = secenekler.istemci;

        var ayar = await Ayar.getir(sunucu.id);
        sonuc.ayarlar = ayar;

        if (!ayar[modulAdi]) return sonuc;

        var dk;
        try {
            dk = await sunucu.fetchAuditLogs({ limit: 1, type: denetimTuru });
        } catch (e) {
            console.error("[guardxnsole] audit log hatasi:", e.message);
            return sonuc;
        }

        var giris = dk.entries.first();
        if (!giris) return sonuc;
        if (Date.now() - giris.createdTimestamp > 5000) return sonuc;

        var yurutucu = giris.executor;
        if (!yurutucu) return sonuc;

        if (yurutucu.id === istemci.user.id) return sonuc;
        if (yurutucu.id === sunucu.ownerId) return sonuc;
        if (yurutucu.id === yapilandirma.sahipId) return sonuc;

        var wl = await Whitelist.kontrol(sunucu.id, yurutucu.id);
        if (wl) return sonuc;

        if (ayar.muafRoller && ayar.muafRoller.length > 0) {
            try {
                var uye = await sunucu.members.fetch(yurutucu.id);
                if (uye) {
                    for (var i = 0; i < ayar.muafRoller.length; i++) {
                        if (uye.roles.cache.has(ayar.muafRoller[i].trim())) return sonuc;
                    }
                }
            } catch (e) {  }
        }

        sonuc.yurutucu = yurutucu;

        var limit = ayar[limitAlani] || 3;
        var miktar = sayacArttir(sunucu.id, eylemTuru, yurutucu.id, ayar.limitSuresi || 15);

        if (miktar >= limit) {
            sonuc.ihlal = true;
            temizle(sunucu.id, eylemTuru, yurutucu.id);
            console.log("[guardxnsole] IHLAL: " + yurutucu.tag + " | " + eylemTuru + " | " + miktar + "/" + limit);
        }

    } catch (h) {
        console.error("[guardxnsole] denetleyici hatasi:", h.message);
    }

    return sonuc;
};

setInterval(function () {
    var esik = Date.now() - 60000;
    Object.keys(sayaclar).forEach(function (anahtar) {
        sayaclar[anahtar] = sayaclar[anahtar].filter(function (z) { return z > esik; });
        if (sayaclar[anahtar].length === 0) delete sayaclar[anahtar];
    });
}, 30000);

module.exports = Denetleyici;