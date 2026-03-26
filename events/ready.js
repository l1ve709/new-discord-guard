// --------------------------------------------------------
// ediz - bot hazir
// --------------------------------------------------------

const { Events, ActivityType } = require("discord.js");
const Ayar = require("../models/ayar.model");

module.exports = {
    ad: Events.ClientReady,
    birKez: true,
    calistir: async function (istemci) {
        console.log("[ediz] bot aktif: " + istemci.user.tag);
        console.log("[ediz] " + istemci.guilds.cache.size + " sunucu korunuyor");

        istemci.user.setActivity("sunuculari koruyor | /yardim", { type: ActivityType.Watching });

        for (var [id] of istemci.guilds.cache) {
            try { await Ayar.getir(id); } catch (e) { /* */ }
        }

        console.log("[ediz] ayarlar yuklendi");
    }
};