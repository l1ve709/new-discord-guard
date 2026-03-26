



CREATE DATABASE IF NOT EXISTS guardxnsole_guard
    CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE guardxnsole_guard;





CREATE TABLE IF NOT EXISTS ayarlar (
    id                  INT AUTO_INCREMENT PRIMARY KEY,
    sunucu_id           VARCHAR(25) NOT NULL,

    kanal_koruma        BOOLEAN DEFAULT TRUE,
    rol_koruma          BOOLEAN DEFAULT TRUE,
    ban_koruma          BOOLEAN DEFAULT TRUE,
    kick_koruma         BOOLEAN DEFAULT TRUE,
    bot_koruma          BOOLEAN DEFAULT TRUE,
    sunucu_koruma       BOOLEAN DEFAULT TRUE,
    webhook_koruma      BOOLEAN DEFAULT TRUE,
    emoji_koruma        BOOLEAN DEFAULT TRUE,
    spam_koruma         BOOLEAN DEFAULT TRUE,
    raid_koruma         BOOLEAN DEFAULT TRUE,
    reklam_koruma       BOOLEAN DEFAULT TRUE,

    kanal_limit         INT DEFAULT 3,
    rol_limit           INT DEFAULT 3,
    ban_limit           INT DEFAULT 3,
    kick_limit          INT DEFAULT 3,
    webhook_limit       INT DEFAULT 2,
    emoji_limit         INT DEFAULT 3,
    limit_suresi        INT DEFAULT 15,

    spam_mesaj_sinir    INT DEFAULT 5,
    spam_saniye         INT DEFAULT 4,
    spam_sustur_sure    INT DEFAULT 10,

    raid_katilim_sinir  INT DEFAULT 10,
    raid_saniye         INT DEFAULT 8,

    ceza_turu           VARCHAR(10) DEFAULT 'banla',
    reklam_ceza         VARCHAR(10) DEFAULT 'banla',

    log_kanal_id        VARCHAR(25) DEFAULT NULL,
    muaf_roller         TEXT DEFAULT NULL,

    olusturan           VARCHAR(20) DEFAULT 'guardxnsole',
    guncelleme_tarihi   TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    UNIQUE INDEX idx_sunucu (sunucu_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;





CREATE TABLE IF NOT EXISTS whitelist (
    id              INT AUTO_INCREMENT PRIMARY KEY,
    sunucu_id       VARCHAR(25) NOT NULL,
    kullanici_id    VARCHAR(25) NOT NULL,
    ekleyen_id      VARCHAR(25) NOT NULL,
    tarih           TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    olusturan       VARCHAR(20) DEFAULT 'guardxnsole',

    UNIQUE INDEX idx_sk (sunucu_id, kullanici_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;





CREATE TABLE IF NOT EXISTS kayitlar (
    id              INT AUTO_INCREMENT PRIMARY KEY,
    sunucu_id       VARCHAR(25) NOT NULL,
    kullanici_id    VARCHAR(25) NOT NULL,
    kullanici_adi   VARCHAR(50) DEFAULT '',
    islem           VARCHAR(30) NOT NULL,
    detay           TEXT DEFAULT NULL,
    ceza            VARCHAR(20) DEFAULT NULL,
    tarih           TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    olusturan       VARCHAR(20) DEFAULT 'guardxnsole',

    INDEX idx_sunucu (sunucu_id),
    INDEX idx_tarih (tarih)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

