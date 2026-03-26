// --------------------------------------------------------
// ediz - limit ayarlama
// --------------------------------------------------------

const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");
const Ayar = require("../models/ayar.model");

module.exports = {
    veri: new SlashCommandBuilder()
        .setName("limit")
        .setDescription("Koruma limitlerini ayarla")
        .addStringOption(function (s) {
            return s.setName("tur").setDescription("Limit turu").setRequired(true)
                .addChoices(
                    { name: "Kanal",   value: "kanal_limit" },
                    { name: "Rol",     value: "rol_limit" },
                    { name: "Ban",     value: "ban_limit" },
                    { name: "Kick",    value: "kick_limit" },
                    { name: "Webhook", value: "webhook_limit" },
                    { name: "Emoji",   value: "emoji_limit" }
                );
        })
        .addIntegerOption(function (s) {
            return s.setName("sayi").setDescription("Limit").setRequired(true).setMinValue(1).setMaxValue(20);
        })
        .addIntegerOption(function (s) {
            return s.setName("sure").setDescription("Sure (saniye)").setRequired(false).setMinValue(3).setMaxValue(120);
        })
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

    calistir: async function (etkilesim) {
        if (etkilesim.user.id !== etkilesim.guild.ownerId &&
            etkilesim.user.id !== require("../yapilandirma").sahipId) {
            return await etkilesim.reply({ content: "Sadece sunucu sahibi kullanabilir. -- ediz", ephemeral: true });
        }

        var tur = etkilesim.options.getString("tur");
        var sayi = etkilesim.options.getInteger("sayi");
        var sure = etkilesim.options.getInteger("sure");

        await Ayar.guncelle(etkilesim.guild.id, tur, sayi);
        var mesaj = tur.replace(/_/g, " ") + ": " + sayi;

        if (sure) {
            await Ayar.guncelle(etkilesim.guild.id, "limit_suresi", sure);
            mesaj += " | sure: " + sure + " sn";
        }

        Ayar.temizle(etkilesim.guild.id);
        await etkilesim.reply({ content: mesaj + " -- ediz" });
    }
};