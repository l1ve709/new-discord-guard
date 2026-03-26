// --------------------------------------------------------
// ediz - yardim
// --------------------------------------------------------

const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
    veri: new SlashCommandBuilder()
        .setName("yardim")
        .setDescription("Komut listesi"),

    calistir: async function (etkilesim) {
        var g = new EmbedBuilder()
            .setTitle("ediz - Guard Bot")
            .setColor(0x2c3e50)
            .addFields(
                { name: "Koruma Modulleri", value:
                    "Kanal Koruma -- olustur/sil/guncelle izleme + geri alma\n" +
                    "Rol Koruma -- olustur/sil/tehlikeli izin tespiti + geri alma\n" +
                    "Ban Koruma -- toplu ban tespiti + geri alma\n" +
                    "Kick Koruma -- toplu kick tespiti\n" +
                    "Bot Koruma -- yetkisiz bot ekleme engeli\n" +
                    "Sunucu Koruma -- isim/ikon/ayar degisikligi geri alma\n" +
                    "Webhook Koruma -- yetkisiz webhook tespiti + silme\n" +
                    "Emoji Koruma -- toplu emoji/sticker silme + geri yukleme\n" +
                    "Spam Koruma -- hizli mesaj tespiti + susturma\n" +
                    "Reklam Koruma -- davet linki tespiti + ban\n" +
                    "Raid Koruma -- toplu katilim + dogrulama kilidi\n" +
                    "Tehlikeli Rol -- birine admin vb. rol verilirse geri alir", inline: false },
                { name: "Komutlar", value:
                    "/durum -- koruma durumunu gor\n" +
                    "/ayar -- modulleri ac/kapat\n" +
                    "/limit -- limitleri degistir\n" +
                    "/whitelist -- guvenilir kisiler\n" +
                    "/banla /at /sustur -- moderasyon\n" +
                    "/temizle -- mesaj sil\n" +
                    "/kilit -- kanal kilitle\n" +
                    "/kayitlar -- son islemleri gor", inline: false }
            )
            .setFooter({ text: "ediz" }).setTimestamp();

        await etkilesim.reply({ embeds: [g] });
    }
};