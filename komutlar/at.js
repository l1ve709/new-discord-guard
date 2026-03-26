const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");
const Kayit = require("../models/kayit.model");
const kayitci = require("../tools/kayitci");

module.exports = {
    veri: new SlashCommandBuilder()
        .setName("at")
        .setDescription("Kullaniciyi at")
        .addUserOption(function (s) { return s.setName("kisi").setDescription("Kisi").setRequired(true); })
        .addStringOption(function (s) { return s.setName("sebep").setDescription("Sebep").setRequired(false); })
        .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers),

    calistir: async function (etkilesim) {
        var hedef = etkilesim.options.getUser("kisi");
        var sebep = etkilesim.options.getString("sebep") || "Belirtilmedi";
        try {
            var uye = await etkilesim.guild.members.fetch(hedef.id);
            if (!uye.kickable) return await etkilesim.reply({ content: "Atilamaz. -- guardxnsole", ephemeral: true });
            try { await hedef.send("**" + etkilesim.guild.name + "** sunucusundan atildin. Sebep: " + sebep + " -- guardxnsole"); } catch (e) {  }
            await uye.kick("[guardxnsole] " + sebep + " | " + etkilesim.user.tag);
            await Kayit.ekle({ sunucuId: etkilesim.guild.id, kullaniciId: hedef.id, kullaniciAdi: hedef.tag, islem: "at", detay: sebep, ceza: "at" });
            await kayitci.log(etkilesim.guild, "Atildi", hedef.tag + " | " + sebep + " | " + etkilesim.user.tag, 0xe74c3c);
            await etkilesim.reply({ content: hedef.tag + " atildi. -- guardxnsole" });
        } catch (h) {
            await etkilesim.reply({ content: "Hata: " + h.message + " -- guardxnsole", ephemeral: true });
        }
    }
};