const path = require("path");
const Database = require("better-sqlite3");
 
//Membuat/membuka file database bernama tokohoki.db
const dbPath = path.join(__dirname, "tokohoki.db");
const db = new Database(dbPath);

//Membuat tabel 'produk' jika belum ada (dijalankan sekali saat server start)
db.exec(`
    CREATE TABLE IF NOT EXISTS produk (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nama TEXT NOT NULL,
    harga INTEGER NOT NULL
    )
`);

module.exports = db;

//Mengecek apakah table produk masih kosong.
const jumlahProduk = db.prepare("SELECT COUNT(*) AS total FROM produk").get();

if (jumlahProduk.total === 0) {
    const tambahProduk = db.prepare(
        "INSERT INTO produk (nama, harga) VALUES (?, ?)"
    );

    // Data awal, mirip dengan yang dipakai di Hari 3
    tambahProduk.run("Skin1004 Bundling", 193700);
    tambahProduk.run("Wardah Paket Bundling", 170000);
    tambahProduk.run("Glad2Glow Paket Bundling", 150000);
    tambahProduk.run("Facetology Sunscreen", 90000);
    tambahProduk.run("Finally Found You Toner", 130000);
    tambahProduk.run(" Toner Avoskin", 110000);
    tambahProduk.run(" Sunscreen Anessa", 145000);
    tambahProduk.run("  Moisturizer Scora", 50000);

    console.log("Data awal produk berhasil ditambahkan ke database.");
}

// Uji coba sementara (bvoleh dihapus setelah dicoba)
const semuaProduk = db.prepare("SELECT * FROM produk").all();
console.log(semuaProduk);


