require('dotenv').config(); // baris pertama
const express = require('express');
const app = express();
const cors = require('cors');
const PORT = process.env.PORT || 3000;

function logger(req, res, next) {
  const waktu = new Date().toISOString();
  console.log(`[${waktu}] ${req.method} ${req.url}`);
  next(); // wajib, agar request lanjut ke handler berikutnya
}

// Didaftarkan sebelum route agar mencatat seluruh request
app.use(logger);
// function cekApiKey(req, res, next) {
//   const apiKey = req.headers['x-api-key'];

//   if (apiKey !== process.env.API_KEY) {
//     return res.status(401).json({ message: 'API key tidak valid' });
//   }

//   next();
// }

// function errorHttp(status, message) {
//   const err = new Error(message);
//   err.status = status;
//   return err;
// }

app.use(cors({
  origin: process.env.CORS_ORIGIN,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
}));
// Middleware agar req.body (JSON) dapat dibaca
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Server Express.js berjalan!');
});

app.get('/profil', (req, res) => {
    res.send('Ini Halaman Profil Saya');
});

app.get('/hubungi', (req, res) => {
    res.send('Ini Halaman Hubungi Saya');
});

// Data sementara (disimpan di memori, hilang saat server restart)
let mahasiswa = [
    { id: 1, nama: 'Andi', jurusan: 'Sistem Informasi' },
    { id: 2, nama: 'Budi', jurusan: 'Informatika' },
];
let nextId = 3; // penghitung id untuk data baru

// GET /mahasiswa -> menampilkan seluruh data
// GET /mahasiswa? jurusan=sistem informasi
app.get('/mahasiswa', (req, res) => {
    const{jurusan}= req.query;

    if(jurusan) {
        const hasil = mahasiswa.filter((m) =>
        m.jurusan === jurusan);
        return res.json(hasil);
    }

  res.json(mahasiswa);
});

// GET /mahasiswa/:id -> menampilkan satu data berdasarkan id
app.get('/mahasiswa/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const data = mahasiswa.find((m) => m.id === id);

  if (!data) return next(errorHttp(404, 'Data tidak ditemukan'));
  res.json(data);
});

// POST /mahasiswa
// Body: { "nama": "Citra", "jurusan": "Sistem Informasi" }
app.post('/mahasiswa', (req, res) => {
  const { nama, jurusan } = req.body;

  if (!nama || !jurusan) {
    return next(errorHttp(400, 'nama dan jurusan wajib diisi'));
  }

  const baru = { id: nextId++, nama, jurusan };

  mahasiswa.push(baru); // simpan ke dalam array
  res.status(201).json(baru); // response jsonn 
});

app.listen(PORT, () => {
    console.log(`Server berjalan di http://localhost:${PORT}`);
});