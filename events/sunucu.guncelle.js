const { Events, AuditLogEvent } = require("discord.js");
const denetleyici = require("../guard/denetleyici");
const Sunucu = require("../guard/sunucu");
const Ceza = require("../tools/ceza");

module.exports = {
    ad: Events.GuildUpdate,
    birKez: false,
    calistir: async function (eski, yeni, istemci) {
        var s = await denetleyici.kontrol({
            sunucu: yeni,
            denetimTuru: AuditLogEvent.GuildUpdate,
            eylemTuru: "sunucu_guncelle",
            modulAdi: "sunucuKoruma",
            limitAlani: "kanalLimit",
            istemci: istemci
        });

        if (s.ihlal) {
            await Sunucu.geriAl(eski, yeni);
            await Ceza.uygula(yeni, s.yurutucu, "sunucu_guncelle",
                "Yetkisiz sunucu degisikligi", s.ayarlar.cezaTuru);
        }
    }
};