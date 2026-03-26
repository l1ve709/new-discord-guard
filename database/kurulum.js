// --------------------------------------------------------
// ediz - veritabani kurulum betigi
// --------------------------------------------------------

const mysql = require("mysql2/promise");
const fs = require("fs");
const yol = require("path");
require("dotenv").config();

async function kur() {
    var b = null;
    try {
        b = await mysql.createConnection({
            host: process.env.MYSQL_SUNUCU || "localhost",
            port: parseInt(process.env.MYSQL_PORT) || 3306,
            user: process.env.MYSQL_KULLANICI || "root",
            password: process.env.MYSQL_SIFRE || "",
            multipleStatements: true
        });
        var sql = fs.readFileSync(yol.join(__dirname, "kurulum.sql"), "utf8");
        await b.query(sql);
        console.log("[ediz] kurulum tamamlandi");
    } catch (h) {
        console.error("[ediz] kurulum hatasi:", h.message);
    } finally {
        if (b) await b.end();
        process.exit(0);
    }
}

kur();