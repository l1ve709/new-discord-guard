// --------------------------------------------------------
// ediz - webhook koruma
// --------------------------------------------------------

var Webhook = {};

Webhook.temizle = async function (kanal) {
    try {
        var wh = await kanal.fetchWebhooks();
        for (var [, w] of wh) {
            try {
                await w.delete("[ediz] yetkisiz webhook temizlendi");
                console.log("[ediz] webhook silindi: " + w.name);
            } catch (e) { /* silinemedi */ }
        }
    } catch (h) {
        console.error("[ediz] webhook temizleme hatasi:", h.message);
    }
};

module.exports = Webhook;