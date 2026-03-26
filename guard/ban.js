var Ban = {};

Ban.geriAl = async function (sunucu, kullanici) {
    try {
        await sunucu.members.unban(kullanici.id, "[guardxnsole] yetkisiz ban geri alindi");
        console.log("[guardxnsole] ban geri alindi: " + (kullanici.tag || kullanici.id));
    } catch (h) {
        console.error("[guardxnsole] ban geri alma hatasi:", h.message);
    }
};

module.exports = Ban;