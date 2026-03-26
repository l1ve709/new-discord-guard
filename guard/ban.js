// --------------------------------------------------------
// ediz - ban koruma (geri alma)
// --------------------------------------------------------

var Ban = {};

Ban.geriAl = async function (sunucu, kullanici) {
    try {
        await sunucu.members.unban(kullanici.id, "[ediz] yetkisiz ban geri alindi");
        console.log("[ediz] ban geri alindi: " + (kullanici.tag || kullanici.id));
    } catch (h) {
        console.error("[ediz] ban geri alma hatasi:", h.message);
    }
};

module.exports = Ban;