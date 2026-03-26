// --------------------------------------------------------
// ediz - etkilesim olayi
// --------------------------------------------------------

const { Events } = require("discord.js");

module.exports = {
    ad: Events.InteractionCreate,
    birKez: false,
    calistir: async function (etkilesim, istemci) {
        if (!etkilesim.isChatInputCommand()) return;
        var komut = istemci.komutlar.get(etkilesim.commandName);
        if (!komut) return;

        try {
            await komut.calistir(etkilesim, istemci);
        } catch (h) {
            console.error("[ediz] komut hatasi:", h.message);
            var m = etkilesim.replied || etkilesim.deferred ? "followUp" : "reply";
            try { await etkilesim[m]({ content: "Hata olustu. -- ediz", ephemeral: true }); } catch (e) { /* */ }
        }
    }
};