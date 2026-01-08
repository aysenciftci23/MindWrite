require('dotenv').config();
const { DataSource } = require('typeorm');

// --- AYARLAR ---
// 1. Render'dan aldığın "External Database URL" buraya yapıştır:
const DB_URL = process.env.DATABASE_URL;

// 2. Admin yapmak istediğin kullanıcı adı:
const TARGET_USERNAME = "aysen";
// ----------------

const dataSource = new DataSource({
    type: 'postgres',
    url: DB_URL,
    ssl: { rejectUnauthorized: false }, // Render için SSL gerekli
});

async function makeAdmin() {
    if (!DB_URL) {
        console.error("HATA: DB_URL tanımlı değil! Lütfen script dosyasını açıp DB_URL değişkenine Render veritabanı linkini yapıştır.");
        return;
    }

    try {
        console.log("Veritabanına bağlanılıyor...");
        await dataSource.initialize();
        console.log("Bağlantı başarılı.");

        // Sınıf tanımlamak yerine direkt SQL komutu çalıştırıyoruz
        // $1 parametresi TARGET_USERNAME değerini güvenli bir şekilde yerleştirir
        const result = await dataSource.query(
            `UPDATE users SET role = 'admin' WHERE username = $1`,
            [TARGET_USERNAME]
        );

        // query sonucu genelde [ [], 1 ] (etkilenen satır sayısı) döner ama postgres driver'a göre değişebilir.
        // update işlemlerinde ikinci eleman (affected rows) bilgi verir.

        console.log(`BAŞARILI! 🎉 '${TARGET_USERNAME}' kullanıcısı için güncelleme komutu gönderildi.`);
        console.log("(Eğer kullanıcı adı doğruysa rolü admin olmuştur).");

        await dataSource.destroy();
    } catch (error) {
        console.error("Bir hata oluştu:", error);
    }
}

makeAdmin();
