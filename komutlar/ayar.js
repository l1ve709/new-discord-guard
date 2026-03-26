// --------------------------------------------------------
// ediz - ayar degistirme
// --------------------------------------------------------

const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");
const Ayar = require("../models/ayar.model");

module.exports = {
    veri: new SlashCommandBuilder()
        .setName("ayar")
        .setDescription("Koruma modullerini ac/kapat")
        .addStringOption(function (s) {
            return s.setName("modul").setDescription("Modul").setRequired(true)
                .addChoices(
                    { name: "Kanal Koruma",   value: "kanal_koruma" },
                    { name: "Rol Koruma",     value: "rol_koruma" },
                    { name: "Ban Koruma",     value: "ban_koruma" },
                    { name: "Kick Koruma",    value: "kick_koruma" },
                    { name: "Bot Koruma",     value: "bot_koruma" },
                    { name: "Sunucu Koruma",  value: "sunucu_koruma" },
                    { name: "Webhook Koruma", value: "webhook_koruma" },
                    { name: "Emoji Koruma",   value: "emoji_koruma" },
                    { name: "Spam Koruma",    value: "spam_koruma" },
                    { name: "Reklam Koruma",  value: "reklam_koruma" },
                    { name: "Raid Koruma",    value: "raid_koruma" }
                );
        })
        .addStringOption(function (s) {
            return s.setName("durum").setDescription("Ac / Kapat").setRequired(true)
                .addChoices({ name: "Ac", value: "1" }, { name: "Kapat", value: "0" });
        })
        .addChannelOption(function (s) {
            return s.setName("log-kanal").setDescription("Log kanali").setRequired(false);
        })
        .addStringOption(function (s) {
            return s.setName("ceza").setDescription("Ceza turu").setRequired(false)
                .addChoices(
                    { name: "Banla",     value: "banla" },
                    { name: "At",        value: "at" },
                    { name: "Rolleri Al", value: "rol_al" }
                );
        })
        .addRoleOption(function (s) {
            return s.setName("muaf-rol").setDescription("Korumadan muaf rol").setRequired(false);
        })
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

    calistir: async function (etkilesim) {
        if (etkilesim.user.id !== etkilesim.guild.ownerId &&
            etkilesim.user.id !== require("../yapilandirma").sahipId) {
            return await etkilesim.reply({ content: "Sadece sunucu sahibi kullanabilir. -- ediz", ephemeral: true });
        }

        var modul = etkilesim.options.getString("modul");
        var durum = etkilesim.options.getString("durum");
        var logK = etkilesim.options.getChannel("log-kanal");
        var ceza = etkilesim.options.getString("ceza");
        var muaf = etkilesim.options.getRole("muaf-rol");

        await Ayar.guncelle(etkilesim.guild.id, modul, parseInt(durum));
        var mesaj = modul.replace(/_/g, " ") + ": " + (durum === "1" ? "ACILDI" : "KAPATILDI");

        if (logK) {
            await Ayar.guncelle(etkilesim.guild.id, "log_kanal_id", logK.id);
            mesaj += "\nLog kanal: #" + logK.name;
        }

        if (ceza) {
            await Ayar.guncelle(etkilesim.guild.id, "ceza_turu", ceza);
            mesaj += "\nCeza: " + ceza;
        }

        if (muaf) {
            var ayar = await Ayar.getir(etkilesim.guild.id);
            var liste = ayar.muafRoller || [];
            if (!liste.includes(muaf.id)) liste.push(muaf.id);
            await Ayar.guncelle(etkilesim.guild.id, "muaf_roller", liste.join(","));
            mesaj += "\nMuaf rol: @" + muaf.name;
        }

        Ayar.temizle(etkilesim.guild.id);
        await etkilesim.reply({ content: mesaj + "\n-- ediz" });
    }
};