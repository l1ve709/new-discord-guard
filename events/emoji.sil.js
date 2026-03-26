// --------------------------------------------------------
// ediz - emoji silme tespiti
// --------------------------------------------------------

const { Events, AuditLogEvent } = require("discord.js");
const denetleyici = require("../guard/denetleyici");
const Emoji = require("../guard/emoji");
const Ceza = require("../tools/ceza");

module.exports = {
    ad: Events.GuildEmojiDelete,
    birKez: false,
    calistir: async function (emoji, istemci) {
        var s = await denetleyici.kontrol({
            sunucu: emoji.guild,
            denetimTuru: AuditLogEvent.EmojiDelete,
            eylemTuru: "emoji_sil",
            modulAdi: "emojiKoruma",
            limitAlani: "emojiLimit",
            istemci: istemci
        });

        if (s.ihlal) {
            await Emoji.geriYukle(emoji.guild, emoji);
            await Ceza.uygula(emoji.guild, s.yurutucu, "emoji_sil",
                "Toplu emoji silme: " + emoji.name, s.ayarlar.cezaTuru);
        }
    }
};