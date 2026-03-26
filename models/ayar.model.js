// --------------------------------------------------------
// ediz - ayar modeli
// --------------------------------------------------------

const { havuzGetir } = require("../baglanti/veritabani");
const yapilandirma = require("../yapilandirma");

var onbellek = {};
var Ayar = {};

Ayar.getir = async function (sunucuId) {
    if (onbellek[sunucuId]) return onbellek[sunucuId];

    var havuz = havuzGetir();
    var [s] = await havuz.execute("SELECT * FROM ayarlar WHERE sunucu_id = ?", [sunucuId]);

    if (s.length === 0) {
        await Ayar.olustur(sunucuId);
        var [y] = await havuz.execute("SELECT * FROM ayarlar WHERE sunucu_id = ?", [sunucuId]);
        onbellek[sunucuId] = donustur(y[0]);
        return onbellek[sunucuId];
    }

    onbellek[sunucuId] = donustur(s[0]);
    return onbellek[sunucuId];
};

Ayar.olustur = async function (sunucuId) {
    var havuz = havuzGetir();
    var v = yapilandirma.varsayilan;
    var sql = `INSERT IGNORE INTO ayarlar (
        sunucu_id, kanal_koruma, rol_koruma, ban_koruma, kick_koruma,
        bot_koruma, sunucu_koruma, webhook_koruma, emoji_koruma,
        spam_koruma, raid_koruma, reklam_koruma,
        kanal_limit, rol_limit, ban_limit, kick_limit, webhook_limit, emoji_limit,
        limit_suresi, spam_mesaj_sinir, spam_saniye, spam_sustur_sure,
        raid_katilim_sinir, raid_saniye, ceza_turu, reklam_ceza
    ) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`;

    await havuz.execute(sql, [
        sunucuId,
        v.kanalKoruma, v.rolKoruma, v.banKoruma, v.kickKoruma,
        v.botKoruma, v.sunucuKoruma, v.webhookKoruma, v.emojiKoruma,
        v.spamKoruma, v.raidKoruma, v.reklamKoruma,
        v.kanalLimit, v.rolLimit, v.banLimit, v.kickLimit, v.webhookLimit, v.emojiLimit,
        v.limitSuresi, v.spamMesajSinir, v.spamSaniye, v.spamSusturSure,
        v.raidKatilimSinir, v.raidSaniye, v.cezaTuru, v.reklamCeza
    ]);
};

Ayar.guncelle = async function (sunucuId, alan, deger) {
    var havuz = havuzGetir();
    var izinli = [
        "kanal_koruma","rol_koruma","ban_koruma","kick_koruma","bot_koruma",
        "sunucu_koruma","webhook_koruma","emoji_koruma","spam_koruma",
        "raid_koruma","reklam_koruma",
        "kanal_limit","rol_limit","ban_limit","kick_limit","webhook_limit","emoji_limit",
        "limit_suresi","spam_mesaj_sinir","spam_saniye","spam_sustur_sure",
        "raid_katilim_sinir","raid_saniye","ceza_turu","reklam_ceza",
        "log_kanal_id","muaf_roller"
    ];
    if (!izinli.includes(alan)) return false;
    await havuz.execute("UPDATE ayarlar SET " + alan + " = ? WHERE sunucu_id = ?", [deger, sunucuId]);
    delete onbellek[sunucuId];
    return true;
};

Ayar.temizle = function (sunucuId) { delete onbellek[sunucuId]; };

function donustur(s) {
    return {
        sunucuId:           s.sunucu_id,
        kanalKoruma:        !!s.kanal_koruma,
        rolKoruma:          !!s.rol_koruma,
        banKoruma:          !!s.ban_koruma,
        kickKoruma:         !!s.kick_koruma,
        botKoruma:          !!s.bot_koruma,
        sunucuKoruma:       !!s.sunucu_koruma,
        webhookKoruma:      !!s.webhook_koruma,
        emojiKoruma:        !!s.emoji_koruma,
        spamKoruma:         !!s.spam_koruma,
        raidKoruma:         !!s.raid_koruma,
        reklamKoruma:       !!s.reklam_koruma,
        kanalLimit:         s.kanal_limit,
        rolLimit:           s.rol_limit,
        banLimit:           s.ban_limit,
        kickLimit:          s.kick_limit,
        webhookLimit:       s.webhook_limit,
        emojiLimit:         s.emoji_limit,
        limitSuresi:        s.limit_suresi,
        spamMesajSinir:     s.spam_mesaj_sinir,
        spamSaniye:         s.spam_saniye,
        spamSusturSure:     s.spam_sustur_sure,
        raidKatilimSinir:   s.raid_katilim_sinir,
        raidSaniye:         s.raid_saniye,
        cezaTuru:           s.ceza_turu,
        reklamCeza:         s.reklam_ceza,
        logKanalId:         s.log_kanal_id,
        muafRoller:         s.muaf_roller ? s.muaf_roller.split(",") : []
    };
}

module.exports = Ayar;