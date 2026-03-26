const { Events, AuditLogEvent } = require("discord.js");
const Ayar = require("../models/ayar.model");
const config = require("../config");
const denetleyici = require("../guard/denetleyici");
const Webhook = require("../guard/webhook");
const Ceza = require("../tools/ceza");

module.exports = {
    ad: Events.WebhooksUpdate,
    birKez: false,
    calistir: async function (kanal, istemci) {
        if (!kanal.guild) return;

        var s = await denetleyici.kontrol({
            sunucu: kanal.guild,
            denetimTuru: AuditLogEvent.WebhookCreate,
            eylemTuru: "webhook_olustur",
            modulAdi: "webhookKoruma",
            limitAlani: "webhookLimit",
            istemci: istemci
        });

        if (s.ihlal) {
            await Webhook.temizle(kanal);
            await Ceza.uygula(kanal.guild, s.yurutucu, "webhook_olustur",
                "Yetkisiz webhook: #" + kanal.name, s.ayarlar.cezaTuru);
        }
    }
};