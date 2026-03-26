// --------------------------------------------------------
// ediz - mysql baglanti
// --------------------------------------------------------

const mysql = require("mysql2/promise");
const yapilandirma = require("../config");

var havuz = null;

async function veritabaniBaglan() {
    try {
        havuz = mysql.createPool({
            host: yapilandirma.mysql.sunucu,
            port: yapilandirma.mysql.port,
            user: yapilandirma.mysql.kullanici,
            password: yapilandirma.mysql.sifre,
            database: yapilandirma.mysql.veritabani,
            waitForConnections: true,
            connectionLimit: 20,
            charset: "utf8mb4"
        });

        var b = await havuz.getConnection();
        b.release();
        console.log("[ediz] mysql baglantisi basarili");
    } catch (h) {
        console.error("[ediz] mysql hatasi:", h.message);
        process.exit(1);
    }
}

function havuzGetir() {
    if (!havuz) throw new Error("[ediz] havuz hazir degil");
    return havuz;
}

module.exports = { veritabaniBaglan, havuzGetir };