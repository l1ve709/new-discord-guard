const Kayit = require("../models/kayit.model");
const kayitci = require("./kayitci");

var Ceza = {};

Ceza.uygula = async function (sunucu, yurutucu, islem, detay, cezaTuru) {
    var uye = null;

    try {
        uye = await sunucu.members.fetch(yurutucu.id);
    } catch (e) {
        uye = null;
    }

    if (!uye) return;

    var uyguladigimCeza = cezaTuru;

    if (cezaTuru === "banla") {
        if (uye.bannable) {
            try {
                await uye.ban({ reason: "[guardxnsole] " + islem + ": " + detay, deleteMessageSeconds: 86400 });
            } catch (e) {
                uyguladigimCeza = "rol_al";
            }
        } else {
            uyguladigimCeza = "rol_al";
        }
    }

    if (cezaTuru === "at") {
        if (uye.kickable) {
            try {
                await uye.kick("[guardxnsole] " + islem + ": " + detay);
            } catch (e) {
                uyguladigimCeza = "rol_al";
            }
        } else {
            uyguladigimCeza = "rol_al";
        }
    }

    if (uyguladigimCeza === "rol_al") {
        var rolIdleri = uye.roles.cache
            .filter(function (r) { return r.id !== sunucu.id && r.editable; })
            .map(function (r) { return r.id; });

        for (var i = 0; i < rolIdleri.length; i++) {
            try {
                await uye.roles.remove(rolIdleri[i], "[guardxnsole] " + islem);
            } catch (e) {  }
        }
    }

    if (cezaTuru === "sustur") {
        try {
            await uye.timeout(600000, "[guardxnsole] " + islem + ": " + detay);
            uyguladigimCeza = "sustur";
        } catch (e) {
            console.error("[guardxnsole] susturma hatasi:", e.message);
        }
    }

    await Kayit.ekle({
        sunucuId: sunucu.id,
        kullaniciId: yurutucu.id,
        kullaniciAdi: yurutucu.tag || yurutucu.username || "",
        islem: islem,
        detay: detay,
        ceza: uyguladigimCeza
    });

    var cezaMetin = {
        banla: "BANLANDI",
        at: "ATILDI",
        rol_al: "ROLLERI ALINDI",
        sustur: "SUSTURULDU"
    };

    await kayitci.log(sunucu, "KORUMA IHLALI: " + islem,
        "Kullanici: " + (yurutucu.tag || yurutucu.id) + "\n" +
        "ID: " + yurutucu.id + "\n" +
        "Ceza: " + (cezaMetin[uyguladigimCeza] || uyguladigimCeza) + "\n" +
        "Detay: " + detay,
        0xff0000
    );

    console.log("[guardxnsole] CEZA: " + (yurutucu.tag || yurutucu.id) + " | " + islem + " | " + uyguladigimCeza);
};

module.exports = Ceza;