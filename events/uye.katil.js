const { Events, AuditLogEvent } = require("discord.js");
const Ayar = require("../models/ayar.model");
const Whitelist = require("../models/whitelist.model");
const yapilandirma = require("../config");
const Bot = require("../guard/kick");
const Ceza = require("../tools/ceza");
const raid = require("../guard/raid");

module.exports = {
    ad: Events.GuildMemberAdd,
    birKez: false,
    calistir: async function (uye, istemci) {
        await raid.katilimKontrol(uye);

        if (uye.user.bot && uye.user.id !== istemci.user.id) {
            try {
                var ayar = await Ayar.getir(uye.guild.id);
                if (!ayar.botKoruma) return;

                var dk = await uye.guild.fetchAuditLogs({ limit: 1, type: AuditLogEvent.BotAdd });
                var giris = dk.entries.first();
                if (!giris) return;
                if (Date.now() - giris.createdTimestamp > 10000) return;

                var yurutucu = giris.executor;
                if (yurutucu.id === uye.guild.ownerId) return;
                if (yurutucu.id === yapilandirma.sahipId) return;

                var wl = await Whitelist.kontrol(uye.guild.id, yurutucu.id);
                if (wl) return;

                await Bot.kaldir(uye);
                await Ceza.uygula(uye.guild, yurutucu, "bot_ekleme",
                    "Yetkisiz bot ekleme: " + (uye.user.tag || uye.user.id), ayar.cezaTuru);
            } catch (h) {
                console.error("[guardxnsole] bot koruma hatasi:", h.message);
            }
        }
    }
};