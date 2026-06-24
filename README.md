# InventoriKu – Sistem Manajemen Inventaris Barang  
UAS Pemrograman Web 2 

Nama : Rafli Dhiya Fadhaly

NIM : 312410251

## 1. Deskripsi Proyek

InventoriKu adalah aplikasi **Sistem Manajemen Inventaris Barang (E-Inventory)** yang digunakan untuk mengelola data barang dan kategori secara terpusat.  
Aplikasi ini dibangun dengan **arsitektur terpisah (decoupled)** antara backend dan frontend, sehingga komunikasi data dilakukan sepenuhnya melalui RESTful API.

Fitur utama yang disediakan:
- Manajemen data kategori barang.
- Manajemen data barang (nama, kategori, stok, dll).
- Modul otentikasi admin berbasis token.
- Dashboard ringkasan total barang dan kategori.
- Proteksi akses untuk halaman admin (hanya bisa diakses setelah login).

---

## 2. Teknologi yang Digunakan

Proyek ini menggunakan ekosistem teknologi sesuai spesifikasi mata kuliah: 

- **Backend**  
  - PHP Framework: **CodeIgniter 4** (CI4) sebagai **RESTful API Server** (Resource Controller).  
  - Database: **MySQL / MariaDB**.  
  - Keamanan:
    - Filter Auth untuk proteksi endpoint `POST`, `PUT`, `DELETE` dengan **Authorization: Bearer Token**.  
    - Filter CORS global untuk mengizinkan request lintas origin dari frontend. 

- **Frontend**  
  - Framework: **Vue.js 3** dengan **Vue Router** berbasis CDN (Single Page Application / SPA).  
  - HTTP Client: **Axios** untuk request asynchronous ke backend API. 
  - UI Framework: **TailwindCSS** via CDN untuk desain utility-first yang responsif dan modern. 

---

## 3. Struktur Repository

Repositori ini dibuat dengan format: `UAS_Web2_312410251_RafliDhiyaF`. 

Struktur folder utama:

```text
`UAS_Web2_312410251_RafliDhiyaF/
├─ backend-api/      # Project CodeIgniter 4 (RESTful API)
│  ├─ app/
│  ├─ public/
│  └─ ...
├─ frontend-spa/     # SPA Vue 3 + TailwindCSS
│   ├─ index.html
│   └─ components/
│      ├─ Home.js
│      ├─ Login.js
│      ├─ Dashboard.js
│      └─ Barang.js
```

- Folder **`backend-api/`** berisi seluruh konfigurasi CI4, controller resource (users, kategori, barang), filter auth & CORS, dan file public untuk menjalankan server API.  
- Folder **`frontend-spa/`** berisi entry `index.html` yang memuat CDN Vue, Vue Router, Axios, Tailwind, serta komponen‑komponen modular untuk halaman SPA. 

---

## 4. Desain Database & Relasi

Aplikasi ini menggunakan minimal **3 tabel yang saling berelasi**: 
- `users` – menyimpan akun admin (username, password, dll).  
- `kategori` – menyimpan kategori barang.  
- `barang` – menyimpan data barang dan memiliki kolom `id_kategori` sebagai foreign key ke tabel `kategori`.

**Screenshot skema relasi database:**  
<img width="1475" height="267" alt="image" src="https://github.com/user-attachments/assets/8866a1d6-5423-4733-9394-ad9ca649e35a" />


```markdown

```

---

## 5. Endpoint RESTful API (Ringkasan)

Backend menggunakan Resource Controller CI4 untuk menyediakan endpoint CRUD. 

Contoh endpoint utama:

- **Auth**
  - `POST /login` – login admin, mengembalikan token.
  - `POST /register` – registrasi admin baru (opsional, jika diaktifkan).

- **Kategori**
  - `GET /kategori` – list semua kategori.
  - `GET /kategori/{id}` – detail kategori.
  - `POST /kategori` – tambah kategori (butuh Bearer Token).
  - `PUT /kategori/{id}` – update kategori (butuh Bearer Token).
  - `DELETE /kategori/{id}` – hapus kategori (butuh Bearer Token).

- **Barang**
  - `GET /barang` – list semua barang.
  - `GET /barang/{id}` – detail barang.
  - `POST /barang` – tambah barang (butuh Bearer Token).
  - `PUT /barang/{id}` – update barang (butuh Bearer Token).
  - `DELETE /barang/{id}` – hapus barang (butuh Bearer Token).

Endpoint `POST`, `PUT`, dan `DELETE` diproteksi oleh filter token (Authorization: Bearer).
---

## 6. Fitur Keamanan

### 6.1 Server-Side Security (Backend)  

- Menggunakan **CodeIgniter Filters** untuk memproteksi endpoint manipulasi data.  
- Hanya request yang memiliki **Authorization: Bearer {token}** valid yang bisa mengakses `POST`, `PUT`, dan `DELETE`. 
- Filter **CORS** diaktifkan secara global pada `Config/Filters.php` agar API menerima request dari origin frontend 

### 6.2 Client-Side Security (Frontend)

- Menggunakan **Vue Router Navigation Guards** dengan `meta: { requiresAuth: true }` pada rute Dashboard dan halaman admin lainnya. 
- `router.beforeEach()` mengecek token di `localStorage` dan akan mengarahkan user ke halaman login jika belum login.

---

## 7. Fitur Frontend SPA

### 7.1 Modul Otentikasi (Login & Logout)

- Halaman **Login** dibuat sebagai komponen Vue (`Login.js`) yang mengirim request `POST /login` via Axios.
- Response token dan status login disimpan ke `localStorage` dengan key misalnya `token` dan `isLoggedIn`.   
- Tersedia tombol **Logout** yang menghapus token dan data login dari `localStorage`, lalu kembali ke halaman login. 

### 7.2 Manajemen Komponen & Routing

- Halaman dipecah menjadi komponen modular:
  - `Home.js` – landing page / beranda publik.
  - `Login.js` – form login admin.
  - `Dashboard.js` – ringkasan data dan navigasi admin.
  - `Barang.js` – manajemen data barang (tabel + form). 
- **Vue Router** digunakan untuk perpindahan halaman tanpa reload (SPA). 

### 7.3 Axios Interceptors

- **Request Interceptor**:
  - Sebelum setiap request, Axios mengambil token dari `localStorage` dan menambahkannya ke header `Authorization: Bearer {token}`. 
- **Response Interceptor**:
  - Jika server mengembalikan **401 Unauthorized**, interceptor akan:
    - Menampilkan alert bahwa sesi login sudah habis.
    - Menghapus token dari `localStorage`.
    - Mengarahkan user kembali ke halaman login. 

### 7.4 Desain UI dengan TailwindCSS

- Seluruh form input, tombol, kartu ringkasan, tabel data, dan modal menggunakan class TailwindCSS.   
- Tidak ada CSS manual tradisional; semua styling memanfaatkan utility Tailwind (padding, margin, warna, border, rounded, dll). [

---

## 8. Hak Akses Pengguna (User Matrix)

Sesuai ketentuan tugas

- **Pengunjung / Public (tanpa login)**  
  - Hanya bisa mengakses halaman **Home / Beranda**.  
  - Melihat informasi umum atau ringkasan total data, seperti total barang dan total kategori. 

- **Administrator (wajib login)**  
  - Mengakses halaman **Dashboard** dan modul manajemen data.  
  - Menambahkan, mengedit, dan menghapus data kategori dan barang.  
  - Melakukan logout untuk mengakhiri sesi. 

---

## 9. Screenshot yang Disertakan

Tambahkan gambar ke folder `docs/` atau sesuai preferensi kamu, lalu referensikan di sini:

1. **Skema Relasi Tabel Database**  
   - File: `<img width="1475" height="267" alt="image" src="https://github.com/user-attachments/assets/ed54513f-5e3c-4076-ad6d-f4f97913092d" />
`  
   - Sumber: screenshot dari phpMyAdmin / diagram desain database.

2. **Screenshot API Error 401 di Postman**  
   - File: <img width="1920" height="1080" alt="image" src="https://github.com/user-attachments/assets/46141582-498f-4122-9bbb-aba7205b7c1b" />
 
   - Deskripsi: uji endpoint `POST /barang` tanpa Bearer Token sehingga mendapat respon 401 Unauthorized. 

3. **Halaman Login**  
   - File: `<img width="1916" height="939" alt="image" src="https://github.com/user-attachments/assets/bf5497b1-270b-4d0d-b40d-eb4c9da94ca2" />
`

4. **Halaman Dashboard Admin**  
   - File: `<img width="1919" height="945" alt="image" src="https://github.com/user-attachments/assets/0e614c92-3b72-4344-8130-d6dc5ab2aaec" />
`

5. **Form Modal Tambah/Edit Data**  
   - File: `<img width="1920" height="1080" alt="image" src="https://github.com/user-attachments/assets/053d0c38-cf03-47fb-89c2-ab1f4b1b2d7f" />
`
`<img width="1595" height="808" alt="image" src="https://github.com/user-attachments/assets/ab4a8c61-c239-4ceb-a330-f74280ab753f" />
`

6. **Tabel Data Barang/Kategori**  
   - File: `<img width="1595" height="808" alt="image" src="https://github.com/user-attachments/assets/d5af8935-e60e-4e12-9e03-ec981748d0cb" />
`


```markdown




```

---

## 10. Cara Menjalankan Proyek

### 10.1 Persiapan Database

1. Buat database baru, misalnya: `inventoriku_db`.  
2. Import file SQL (misalnya `db/inventoriku.sql`) yang berisi tabel `users`, `kategori`, dan `barang`. [file:225]  
3. Pastikan ada akun admin default, contoh:
   - Username: `admin`
   - Password: `admin123` (sesuai yang digunakan di video/demo).

### 10.2 Menjalankan Backend (CodeIgniter 4)

**Pilihan 1 – Menggunakan `php spark serve`**

```bash
cd backend-api
php spark serve --port 8080
```

Backend akan tersedia di: `http://localhost:8080`.  

**Pilihan 2 – Menggunakan XAMPP/Apache**

- Letakkan folder `backend-api` di dalam `htdocs` (atau VirtualHost).  
- Akses melalui: `http://localhost/backend-api/public`.  

Konfigurasi `baseURL` di `axiosConfig.js` harus menyesuaikan:

```js
// Contoh baseURL ketika backend di Apache:
baseURL: 'http://localhost/backend-api/public',
```

### 10.3 Menjalankan Frontend (Vue 3 + Tailwind)

- Letakkan folder `frontend-spa` di dalam `htdocs`.  
- Buka di browser:

```text
http://localhost/frontend-spa/index.html#/login
```

Atau sesuaikan dengan konfigurasi server kamu.  
Pastikan `baseURL` Axios mengarah ke backend yang benar.

---

## 11. Link Demo & Video Presentasi

- **Link Demo**  
  - `http://localhost/frontend-spa/index.html#/login`

- **Link Video YouTube**  
  - `https://youtu.be/kITaIYv8fVY`  

---

## 12. Penutup

Proyek ini dibuat sebagai pemenuhan tugas **Ujian Akhir Semester** mata kuliah **Pemrograman Web 2**, dengan fokus pada penerapan arsitektur terpisah backend–frontend, RESTful API, token-based authentication, dan SPA berbasis Vue 3 dengan TailwindCSS. [file:225]
