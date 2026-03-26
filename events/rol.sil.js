// --------------------------------------------------------
// ediz - rol silme
// --------------------------------------------------------

const { Events, AuditLogEvent } = require("discord.js");
const denetleyici = require("../guard/denetleyici");
const Rol = require("../guard/rol");
const Ceza = require("../tools/ceza");

module.exports = {
    ad: Events.GuildRoleDelete,
    birKez: false,
    calistir: async function (rol, istemci) {
        var s = await denetleyici.kontrol({
            sunucu: rol.guild,
            denetimTuru: AuditLogEvent.RoleDelete,
            eylemTuru: "rol_sil",
            modulAdi: "rolKoruma",
            limitAlani: "rolLimit",
            istemci: istemci
        });

        if (s.ihlal) {
            await Rol.geriYukle(rol);
            await Ceza.uygula(rol.guild, s.yurutucu, "rol_sil",
                "Yetkisiz rol silme: " + rol.name, s.ayarlar.cezaTuru);
        }
    }
};