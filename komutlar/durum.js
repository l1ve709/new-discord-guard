// --------------------------------------------------------
// ediz - durum
// --------------------------------------------------------

const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const Ayar = require("../models/ayar.model");

module.exports = {
    veri: new SlashCommandBuilder()
        .setName("durum")
        .setDescription("Koruma durumunu gosterir"),

    calistir: async function (etkilesim) {
        var a = await Ayar.getir(etkilesim.guild.id);
        function d(v) { return v ? "ACIK" : "KAPALI"; }

        var g = new EmbedBuilder()
            .setTitle("Koruma Durumu")
            .setColor(0x27ae60)
            .addFields(
                { name: "Kanal",    value: d(a.kanalKoruma) + " | limit: " + a.kanalLimit, inline: true },
                { name: "Rol",      value: d(a.rolKoruma) + " | limit: " + a.rolLimit, inline: true },
                { name: "Ban",      value: d(a.banKoruma) + " | limit: " + a.banLimit, inline: true },
                { name: "Kick",     value: d(a.kickKoruma) + " | limit: " + a.kickLimit, inline: true },
                { name: "Bot",      value: d(a.botKoruma), inline: true },
                { name: "Sunucu",   value: d(a.sunucuKoruma), inline: true },
                { name: "Webhook",  value: d(a.webhookKoruma) + " | limit: " + a.webhookLimit, inline: true },
                { name: "Emoji",    value: d(a.emojiKoruma) + " | limit: " + a.emojiLimit, inline: true },
                { name: "Spam",     value: d(a.spamKoruma) + " | " + a.spamMesajSinir + "/" + a.spamSaniye + "sn", inline: true },
                { name: "Reklam",   value: d(a.reklamKoruma) + " | ceza: " + a.reklamCeza, inline: true },
                { name: "Raid",     value: d(a.raidKoruma) + " | " + a.raidKatilimSinir + "/" + a.raidSaniye + "sn", inline: true },
                { name: "Genel",    value:
                    "Ceza: " + a.cezaTuru +
                    "\nSure: " + a.limitSuresi + " sn" +
                    "\nLog: " + (a.logKanalId ? "<#" + a.logKanalId + ">" : "yok"), inline: true }
            )
            .setFooter({ text: "ediz" }).setTimestamp();

        await etkilesim.reply({ embeds: [g] });
    }
};