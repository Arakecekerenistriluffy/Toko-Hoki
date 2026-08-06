// Mengimpor library express yang sudah diinstal
const express = require("express");
const cors = require("cors");
const db = require("./db"); // Mengimpor koneksi database dari db.js

const app = express();
const PORT = 3000;
app.use(express.json());

// Middleware bawaan agar Express bisa membaca JSON dari request
app.use(express.json());

// Middleware CORS sederhana untuk development lokal
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
  if (req.method === "OPTIONS") return res.sendStatus(200);
  next();
});

// Route paling dasar, hanya untuk mengecek server hidup
app.get("/", (req, res) => {
    res.send("Selamat datang di API TokoHoki!");
});

// Menjalankan server dan mendengarkan di PORT yang ditentukan
app.listen(PORT, () => {
  console.log(`Server berjalan di http://localhost:${PORT}`);
});

app.get("/api/ping", (req, res) => {
  res.json({
    status: "success",
    messages: "pong",
    waktuServer: new Date().toISOString(),
  });
});

//Data sementara di memori (akan diganti database sungguhan di hari 4)
let produk = [
  { id: 1, nama:"Skin1004 Bundling", harga: 193700 },
  { id: 2, nama:"Wardah Paket Bundling", harga: 170000 },
  { id: 3, nama:"Glad2Glow Paket Bundling", harga: 150000 },
  { id: 4, nama:"Facetology Sunscreen", harga: 90000 },
  { id: 5, nama:"Finally Found You Toner", harga: 130000} ,
  { id: 6, nama:"Toner Avoskin", harga: 110000 },
  { id: 7, nama:"Sunscreen Anessa", harga: 145000 },
  { id: 8, nama:"Moisturizer Scora", harga: 50000 },
];
let idBerikutnya = produk.length + 1;

//GET /api/products -> mengambil semua produk
app.get("/api/products", (req, res) => {
  const data = db.prepare("SELECT * FROM produk").all();
  res.json({ status: "success", data });
});

//GET /api/products/search?nama=... -> cari produk berdasarkan kata kunci nama
app.get("/api/products/search", (req, res) => {
  const keyword = (req.query.nama || "").toLowerCase();
  const hasil = produk.filter((item) =>
    item.nama.toLowerCase().includes(keyword)
  );
  res.json({ status: "success", data: hasil });
});

//GET /api/products/:id -> mengambil produk berdasarkan id
app.get("/api/products/:id", (req,res) => {
  const data = db.prepare("SELECT * FROM produk").all();
  res.json({ status: "success", data });
});

//GET /api/products/:id -> mengambil produk berdasarkan id
app.get("/api/products/:id", (req, res) => {
  const id = Number(req.params.id);
  const item = db.prepare("SELECT * FROM produk WHERE id = ?").get(id);

  if (!item) {
    return res.status(404).json({ status: "error", message: "Produk tidak ditemukan" });
  }
  res.json({ status: "success", data: item });
});

//POST /api/products -> menambahkan produk baru
app.post("/api/products", (req, res) => {
  const { nama, harga} = req.body;
  if(!nama || !harga || harga <=0){
    return res.status(400).json({
      status: "error",
      message: "Nama dan harga wajib diisi",
    });
  }
  const hasil = db 
    .prepare("INSERT INTO produk (nama, harga) VALUES (?, ?)")
    .run(nama, harga);

  const produkBaru = { id: hasil.lastInsertRowid, nama, harga };
  res.status(201).json({ status: "success", data: produkBaru });
});

//PUT/api/products/:id -> memperbaiki produk berdasarkan id
app.put("/api/products/:id", (req, res) => {
  const id = Number(req.params.id);
  const { nama, harga } = req.body;

  const hasil = db
  .prepare("UPDATE produk SET nama = ?, harga = ? WHERE id = ?")
  .run(nama, harga, id);

  if (hasil.changes === 0) {
    return res.status(404).json({ status: "error", message: "Produk tidak ditemukan"});
    }
    res.json({ status: "success", data: { id, nama, harga } });
  });

//DELETE /api/products/:id -> menghapus produk berdasarkan id
app.delete("/api/products/:id", (req, res) => {
  const id = Number(req.params.id);
  const hasil = db.prepare("DELETE FROM produk WHERE id = ?").run(id);

  if (hasil.changes === 0) {
    return res.status(404).json({ status: "error", message: "Produk tidak ditemukan" });
  }
  res.json({ status: "success", message: `Produk id ${id} berhasil dihapus`});
});