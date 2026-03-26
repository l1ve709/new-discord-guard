const { Events, ActivityType } = require("discord.js");
const Ayar = require("../models/ayar.model");

module.exports = {
    ad: Events.ClientReady,
    birKez: true,
    calistir: async function (istemci) {
        console.log("[guardxnsole] bot aktif: " + istemci.user.tag);
        console.log("[guardxnsole] " + istemci.guilds.cache.size + " sunucu korunuyor");

        istemci.user.setActivity("online | /yardim", { type: ActivityType.Watching });

        for (var [id] of istemci.guilds.cache) {
            try { await Ayar.getir(id); } catch (e) { }
        }

        console.log("[guardxnsole] ayarlar yuklendi");
    }
};