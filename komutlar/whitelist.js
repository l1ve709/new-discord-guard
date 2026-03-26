const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require("discord.js");

const whitelist = require("../models/whitelist.model");

module.exports = {
    veri: new SlashCommandBuilder()
        .setName("whitelist")
        .setDescription("Guvenilir kisi yonetimi")
        .addSubcommand(function (s) {
            return s.setName("ekle").setDescription("Ekle")
                .addUserOption(function (u) { return u.setName("kisi").setDescription("Kisi").setRequired(true); });
        })
        .addSubcommand(function (s) {
            return s.setName("cikar").setDescription("Cikar")
                .addUserOption(function (u) { return u.setName("kisi").setDescription("Kisi").setRequired(true); });
        })
        .addSubcommand(function (s) {
            return s.setName("liste").setDescription("Listeyi goster");
        })
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

    calistir: async function (etkilesim) {
        if (etkilesim.user.id !== etkilesim.guild.ownerId &&
            etkilesim.user.id !== require("../config").sahipId) {
            return await etkilesim.reply({ content: "Sadece sunucu sahibi kullanabilir. -- guardxnsole", ephemeral: true });
        }

        var alt = etkilesim.options.getSubcommand();

        if (alt === "ekle") {
            var k = etkilesim.options.getUser("kisi");
            var ok = await whitelist.ekle(etkilesim.guild.id, k.id, etkilesim.user.id);
            await etkilesim.reply({ content: ok ? k.tag + " eklendi. -- guardxnsole" : "Zaten listede. -- guardxnsole" });
        }

        if (alt === "cikar") {
            var k2 = etkilesim.options.getUser("kisi");
            var ok2 = await whitelist.cikar(etkilesim.guild.id, k2.id);
            await etkilesim.reply({ content: ok2 ? k2.tag + " cikarildi. -- guardxnsole" : "Listede degil. -- guardxnsole" });
        }

        if (alt === "liste") {
            var l = await whitelist.listele(etkilesim.guild.id);
            if (l.length === 0) return await etkilesim.reply({ content: "Whitelist bos. -- guardxnsole", ephemeral: true });

            var satirlar = l.map(function (b, i) {
                return (i + 1) + ". <@" + b.kullanici_id + "> (ekleyen: <@" + b.ekleyen_id + ">)";
            });

            var g = new EmbedBuilder()
                .setTitle("Whitelist")
                .setDescription(satirlar.join("\n"))
                .setColor(0x2c3e50)
                .setFooter({ text: "guardxnsole" }).setTimestamp();

            await etkilesim.reply({ embeds: [g] });
        }
    }
};