const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");
const kayitci = require("../tools/kayitci");

module.exports = {
    veri: new SlashCommandBuilder()
        .setName("lock")
        .setDescription("Kanali kilitle / ac")
        .addStringOption(function (s) {
            return s.setName("islem").setDescription("Kilitle / Ac").setRequired(true)
                .addChoices({ name: "Kilitle", value: "kilitle" }, { name: "Ac", value: "ac" });
        })
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels),

    calistir: async function (etkilesim) {
        var islem = etkilesim.options.getString("islem");
        var herkes = etkilesim.guild.roles.everyone;
        try {
            if (islem === "kilitle") {
                await etkilesim.channel.permissionOverwrites.edit(herkes, { SendMessages: false }, { reason: "[guardxnsole] kilit" });
                await etkilesim.reply({ content: "Kanal kilitlendi. -- guardxnsole" });
                await kayitci.log(etkilesim.guild, "Kanal Kilidi", "#" + etkilesim.channel.name + " kilitlendi | " + etkilesim.user.tag, 0xe74c3c);
            } else {
                await etkilesim.channel.permissionOverwrites.edit(herkes, { SendMessages: null }, { reason: "[guardxnsole] kilit acildi" });
                await etkilesim.reply({ content: "Kilit acildi. -- guardxnsole" });
                await kayitci.log(etkilesim.guild, "Kilit Acildi", "#" + etkilesim.channel.name + " | " + etkilesim.user.tag, 0x27ae60);
            }
        } catch (h) {
            await etkilesim.reply({ content: "Hata: " + h.message + " -- guardxnsole", ephemeral: true });
        }
    }
};