require("dotenv").config();

var yapilandirma = {
    botTokeni: process.env.BOT_TOKENI,
    istemciId: process.env.ISTEMCI_ID,
    sahipId: process.env.SAHIP_ID,

    mysql: {
        sunucu: process.env.MYSQL_SUNUCU || "localhost",
        port: parseInt(process.env.MYSQL_PORT) || 3306,
        kullanici: process.env.MYSQL_KULLANICI || "root",
        sifre: process.env.MYSQL_SIFRE || "ed1z2010.()",
        veritabani: process.env.MYSQL_VERITABANI || "guardxnsole_guard"
    },

    varsayilan: {
        kanalKoruma: true,
        rolKoruma: true,
        banKoruma: true,
        kickKoruma: true,
        botKoruma: true,
        sunucuKoruma: true,
        webhookKoruma: true,
        emojiKoruma: true,
        spamKoruma: true,
        raidKoruma: true,

        kanalLimit: 3,
        rolLimit: 3,
        banLimit: 3,
        kickLimit: 3,
        webhookLimit: 2,
        emojiLimit: 3,

        limitSuresi: 15,

        spamMesajSinir: 5,
        spamSaniye: 4,
        spamSusturSure: 10,

        raidKatilimSinir: 10,
        raidSaniye: 8,

        cezaTuru: "banla",

        reklamKoruma: true,
        reklamCeza: "banla"
    },

    reklamDesenleri: [
        /discord\.gg\/[a-zA-Z0-9]+/gi,
        /discord\.com\/invite\/[a-zA-Z0-9]+/gi,
        /discordapp\.com\/invite\/[a-zA-Z0-9]+/gi,
        /dsc\.gg\/[a-zA-Z0-9]+/gi,
        /invite\.gg\/[a-zA-Z0-9]+/gi,
        /discord\.me\/[a-zA-Z0-9]+/gi
    ]
};

module.exports = yapilandirma;