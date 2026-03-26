var Webhook = {};

Webhook.temizle = async function (kanal) {
    try {
        var wh = await kanal.fetchWebhooks();
        for (var [, w] of wh) {
            try {
                await w.delete("[guardxnsole] yetkisiz webhook temizlendi");
                console.log("[guardxnsole] webhook silindi: " + w.name);
            } catch (e) {  }
        }
    } catch (h) {
        console.error("[guardxnsole] webhook temizleme hatasi:", h.message);
    }
};

module.exports = Webhook;