const { Events, AuditLogEvent } = require("discord.js");
const denetleyici = require("../guard/denetleyici");
const Kanal = require("../guard/kanal");
const Ceza = require("../tools/ceza");

module.exports = {
    ad: Events.ChannelDelete, birKez: false,
    calistir: async function (kanal, istemci) {
        if (!kanal.guild) return;
        var s = await denetleyici.kontrol({ sunucu: kanal.guild, denetimTuru: AuditLogEvent.ChannelDelete, eylemTuru: "kanal_sil", modulAdi: "kanalKoruma", limitAlani: "kanalLimit", istemci: istemci });
        if (s.ihlal) { await Kanal.geriYukle(kanal); await Ceza.uygula(kanal.guild, s.yurutucu, "kanal_sil", "Yetkisiz kanal silme: " + kanal.name, s.ayarlar.cezaTuru); }
    }
};