// --------------------------------------------------------
// ediz - mesaj temizleme
// --------------------------------------------------------

const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");

module.exports = {
    veri: new SlashCommandBuilder()
        .setName("temizle")
        .setDescription("Mesaj temizle")
        .addIntegerOption(function (s) { return s.setName("sayi").setDescription("Adet").setRequired(true).setMinValue(1).setMaxValue(100); })
        .addUserOption(function (s) { return s.setName("kisi").setDescription("Sadece bu kisi").setRequired(false); })
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),

    calistir: async function (etkilesim) {
        var sayi = etkilesim.options.getInteger("sayi");
        var kisi = etkilesim.options.getUser("kisi");
        try {
            var m = await etkilesim.channel.messages.fetch({ limit: sayi });
            if (kisi) m = m.filter(function (x) { return x.author.id === kisi.id; });
            var s = await etkilesim.channel.bulkDelete(m, true);
            await etkilesim.reply({ content: s.size + " mesaj silindi. -- ediz", ephemeral: true });
        } catch (h) {
            await etkilesim.reply({ content: "Hata: " + h.message + " -- ediz", ephemeral: true });
        }
    }
};