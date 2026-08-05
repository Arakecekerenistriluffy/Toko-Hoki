// let digunakan untuk nilai ynag bisa berubah
let jumlahKeranjang = 0;

// const digunakan untuk nilai yang tetap (tidak berubah)
const namaToko = "TokoHoki";

// Template literal: cara moedrn menggabungkan teks dan variabel 
console.log(`Selamat datang di ${namaToko}!`);
console.log(`Jumlah item di keranjang: ${jumlahKeranjang}`);


// Menyeleksi satu elemen berdasarkan id atau class
const tombolKeranjang = document.querySelector("#tombol-keranjang");
const tombolHamburger = document.querySelector("#tombol-hamburger");
const menuMobile = document.querySelector("#menu-mobile");

// Menyeleksi banyak elemen sekaligus (hasilnya berupa list)
const semuaTombol = document.querySelectorAll(".btn-tambah-keranjang");

console.log(tombolKeranjang); //pastikan elemen ditemukan, bukan null

tombolKeranjang.addEventListener("click", function () {
    console.log("Tombol Keranjang diklik!");
});

//Bentuk modern menggunakan arrowfunction
tombolKeranjang.addEventListener("click", () =>{
    console.log("Tombol Keranjang diklik (arrow function)!");
});

tombolHamburger.addEventListener("click",()=>{
    //dan menghapusnya jika
    // toggle akan menambah class jika belum ada sudah ada
    menuMobile.classList.toggle("hidden");
});

const formProduk = document.querySelector("#form-produk");
// beri id "grid-katalog" pada <div grid> di Catalog UI
const gridKatalog = document.querySelector("#grid-katalog");
const pesanError = document.querySelector("#pesan-error");

// Tentukan base URL API secara dinamis:
// - Jika dijalankan di Codespaces / GitHub.dev, gunakan origin saat ini
// - Jika dijalankan lokal, pakai localhost:3000
const API_BASE = (() => {
  const hostIsCodespace = location.hostname.includes("app.github.dev") || location.hostname.includes("github.dev");
  const base = hostIsCodespace ? `${location.protocol}//${location.hostname}` : "http://localhost:3000";
  return base.replace(/\/+$/, "");
})();

console.log("API_BASE:", API_BASE);

formProduk.addEventListener("submit", (event) => {
  event.preventDefault();

  const nama = document.querySelector("#input-nama").value.trim();
  const harga = document.querySelector("#input-harga").value;

  // validasi sederhana
  if (nama === "" || harga === "" || Number(harga) <= 0) {
    pesanError.textContent = "Nama produk dan harga (lebih dari 0) wajib diisi.";
    pesanError.classList.remove("hidden");
    return;
  }

  pesanError.classList.add("hidden");

  // Kirim data ke API (pilih base otomatis untuk Codespaces / lokal)
  fetch(`${API_BASE}/api/products`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ nama, harga: Number(harga) }),
  })
    .then((res) => res.json())
    .then((data) => {
      if (data && data.status === "success") {
        const produk = data.data;
        const kartuBaru = document.createElement("div");
        kartuBaru.className = "bg-white rounded-xl shadow hover:shadow-lg transition p-4";

        kartuBaru.innerHTML = `
          <div class="w-full h-40 bg-gray-100 rounded-lg mb-3 flex items-center justify-center text-gray-400 text-sm">Belum ada gambar</div>
          <h4 class="font-semibold text-gray-800">${produk.nama}</h4>
          <p class="text-blue-700 font-bold mt-1">Rp ${Number(produk.harga).toLocaleString("id-ID")}</p>
          <button class="w-full mt-3 bg-blue-700 text-white py-2 rounded-lg text-sm btn-tambah-keranjang">Tambah ke Keranjang</button>
        `;

        gridKatalog.appendChild(kartuBaru);
        formProduk.reset();
      } else {
        pesanError.textContent = data && data.message ? data.message : "Terjadi kesalahan saat menyimpan produk.";
        pesanError.classList.remove("hidden");
      }
    })
    .catch((err) => {
      console.error(err);
      pesanError.textContent = "Gagal menghubungi server. Pastikan backend berjalan di http://localhost:3000";
      pesanError.classList.remove("hidden");
    });
});

let totalKeranjang = 0;
const labelKeranjang = document.querySelector("#tombol-keranjang");

gridKatalog.addEventListener("click", (event) => {
    // cek apakah yang diklik adalah tombol tambah ke Keranjang
    if (event.target.classList.contains("btn-tambah-keranjang")) {
        totalKeranjang++;
        labelKeranjang.textContent = `Keranjang (${totalKeranjang})`;
    }
});