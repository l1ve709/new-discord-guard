// --------------------------------------------------------
// ediz - sustur komutu
// --------------------------------------------------------

const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");
const Kayit = require("../models/kayit.model");
const kayitci = require("../tools/kayitci");

module.exports = {
    veri: new SlashCommandBuilder()
        .setName("sustur")
        .setDescription("Kullaniciyi sustur")
        .addUserOption(function (s) { return s.setName("kisi").setDescription("Kisi").setRequired(true); })
        .addIntegerOption(function (s) { return s.setName("sure").setDescription("Dakika").setRequired(true).setMinValue(1).setMaxValue(40320); })
        .addStringOption(function (s) { return s.setName("sebep").setDescription("Sebep").setRequired(false); })
        .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),

    calistir: async function (etkilesim) {
        var hedef = etkilesim.options.getUser("kisi");
        var sure = etkilesim.options.getInteger("sure");
        var sebep = etkilesim.options.getString("sebep") || "Belirtilmedi";
        try {
            var uye = await etkilesim.guild.members.fetch(hedef.id);
            await uye.timeout(sure * 60000, "[ediz] " + sebep);
            await Kayit.ekle({ sunucuId: etkilesim.guild.id, kullaniciId: hedef.id, kullaniciAdi: hedef.tag, islem: "sustur", detay: sebep + " (" + sure + " dk)", ceza: "sustur" });
            await kayitci.log(etkilesim.guild, "Susturma", hedef.tag + " | " + sure + " dk | " + sebep + " | " + etkilesim.user.tag, 0xe67e22);
            await etkilesim.reply({ content: hedef.tag + " " + sure + " dk susturuldu. -- ediz" });
        } catch (h) {
            await etkilesim.reply({ content: "Hata: " + h.message + " -- ediz", ephemeral: true });
        }
    }
};