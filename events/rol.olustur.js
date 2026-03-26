const { Events, AuditLogEvent } = require("discord.js");
const denetleyici = require("../guard/denetleyici");
const Rol = require("../guard/rol");
const Ceza = require("../tools/ceza");

module.exports = {
    ad: Events.GuildRoleCreate,
    birKez: false,
    calistir: async function (rol, istemci) {
        var s = await denetleyici.kontrol({
            sunucu: rol.guild,
            denetimTuru: AuditLogEvent.RoleCreate,
            eylemTuru: "rol_olustur",
            modulAdi: "rolKoruma",
            limitAlani: "rolLimit",
            istemci: istemci
        });

        if (s.ihlal) {
            await Rol.sil(rol);
            await Ceza.uygula(rol.guild, s.yurutucu, "rol_olustur",
                "Yetkisiz rol olusturma: " + rol.name, s.ayarlar.cezaTuru);
        }
    }
};