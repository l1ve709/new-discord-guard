const { Events } = require("discord.js");
const spam = require("../guard/spam");

module.exports = {
    ad: Events.MessageCreate,
    birKez: false,
    calistir: async function (mesaj, istemci) {
        if (!mesaj.guild) return;
        if (mesaj.author.bot) return;

        var reklam = await spam.reklamKontrol(mesaj);
        if (reklam) return;

        await spam.kontrolEt(mesaj);
    }
};
