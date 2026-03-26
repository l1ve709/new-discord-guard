// --------------------------------------------------------
// ediz - son kayitlari gosterme
// --------------------------------------------------------

const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require("discord.js");
const Kayit = require("../models/kayit.model");

module.exports = {
    veri: new SlashCommandBuilder()
        .setName("logs")
        .setDescription("Son koruma loglarini gosterir")
        .addIntegerOption(function (s) {
            return s.setName("adet").setDescription("Kac log").setRequired(false).setMinValue(1).setMaxValue(25);
        })
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

    calistir: async function (etkilesim) {
        var adet = etkilesim.options.getInteger("adet") || 10;
        var liste = await Kayit.listele(etkilesim.guild.id, adet);

        if (liste.length === 0) {
            return await etkilesim.reply({ content: "log yok. -- ediz", ephemeral: true });
        }

        var satirlar = liste.map(function (k, i) {
            var tarih = new Date(k.tarih).toLocaleString("tr-TR");
            return "**" + (i + 1) + ".** " + k.islem + " | " + (k.kullanici_adi || k.kullanici_id) +
                   " | " + (k.ceza || "-") + " | " + tarih;
        });

        // 4096 karakter siniri var kiral
        var metin = satirlar.join("\n");
        if (metin.length > 4000) metin = metin.substring(0, 4000) + "\n...";

        var g = new EmbedBuilder()
            .setTitle("Son Koruma Kayitlari")
            .setDescription(metin)
            .setColor(0x2c3e50)
            .setFooter({ text: "ediz" }).setTimestamp();

        await etkilesim.reply({ embeds: [g], ephemeral: true });
    }
};