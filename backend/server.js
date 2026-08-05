// Mengimpor library express yang sudah diinstal
const express = require("express");

// Membuat instance aplikasi Express
const app = express();
const PORT = 3000;

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
  res.json({ status: "success", data: produk });
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
  const id = Number(req.params.id);
  const item = produk.find((p) => p.id === id);

  if (!item) {
    return res.status(404).json({ status: "error", message: "Produk tidak ditemukan"});
  }
  res.json({ status: "success", data: item});
});

app.post("/api/products", (req, res) => {
  const { nama, harga} = req.body;

  //Validasi sederhana disisi backend
  if(!nama || !harga || harga <=0){
    return res.status(400).json({
      status: "error",
      message: "Nama dan harga (lebih dari 0) wajib diisi",
    });
  }
  const produkBaru = { id: idBerikutnya++, nama, harga};
  produk.push(produkBaru);

  res.status(201).json({ status: "success", data: produkBaru});
});

//PUT/api/products/:id -> memperbaiki produk berdasarkan id
app.put("/api/products/:id", (req, res) => {
  const id = Number(req.params.id);
  const { nama, harga } = req.body;

  const item = produk.find((p) => p.id === id);
  if (!item) {
    return res.status(404).json({ status: "error", message: "Produk tidak ditemukan"});
  }

  if (!nama || !harga || harga <= 0){
    return res.status(400).json({
      status: "error",
      message: "Nama dan harga (lebih dari 0) wajib diisi",
    });
  }

  item.nama = nama;
  item.harga = harga;

  res.json({ status: "success", data: item});
});

app.delete("/api/products/:id", (req, res) => {
  const id = Number(req.params.id);
  const adaProduk = produk.some((p) => p.id === id);

  if (!adaProduk){
    return res.status(404).json({status: "error", message: "Produk tidak ditemukan"});
  }

  produk = produk.filter((p) => p.id !== id);
  res.json({ status: "success", message: `Produk id ${id} berhasil dihapus`});
});