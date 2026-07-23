# SMK3 PTPN I Regional 7 — Kebun Way Berulu

**Sistem Informasi Manajemen Keselamatan dan Kesehatan Kerja (SMK3)**  
Aplikasi web untuk manajemen K3 di PTPN I Regional 7 Kebun Way Berulu.

## 🔐 Login Super Admin Default

| Mode | Email | Password |
|------|-------|----------|
| **Semua mode** | `admin@smk3.id` | `smk3admin2024!` |

Super admin ini:
- Otomatis dibuat saat `database.sql` dijalankan di Supabase
- Otomatis dibuat di LocalStorage saat pertama kali membuka login (mode offline)
- Bisa langsung dipakai tanpa konfigurasi tambahan

## 🚀 Cara Deploy

### Opsi A: GitHub Pages (Paling Simpel, Mode LocalStorage)

1. Upload seluruh isi folder `smk3/` ke repository GitHub
2. Aktifkan GitHub Pages di Settings → Pages → Source: `main` branch, folder `/ (root)`
3. Akses lewat `https://<username>.github.io/<repo>/`
4. Sistem langsung bisa digunakan dalam mode LocalStorage
5. **Super admin langsung tersedia**: `admin@smk3.id` / `smk3admin2024!`

### Opsi B: Dengan Supabase (Mode Online, Rekomendasi)

#### Step 1 — Buat Project Supabase
1. Buka [supabase.com](https://supabase.com) → Create New Project
2. Set password database, pilih region terdekat (Asia Tenggara/Singapore)
3. Tunggu project selesai dibuat (±1 menit)

#### Step 2 — Jalankan Schema Database
1. Di Supabase Dashboard → **SQL Editor** → New Query
2. Copy-paste **seluruh isi `database.sql`**
3. Klik **Run**
4. Semua tabel, RLS, super admin, dan data demo langsung terbuat

#### Step 3 — Nonaktifkan Email Confirmation
1. Supabase Dashboard → **Authentication** → **Settings**
2. Scroll ke **Email Confirmations** → **Disable "Confirm email"**
3. Klik **Save**

#### Step 4 — Deploy Edge Function (manage-user)
1. Install Supabase CLI: `npm install -g supabase`
2. Login: `supabase login`
3. Dari folder `smk3/`, deploy:
   ```bash
   supabase functions deploy manage-user --project-ref <project-ref-anda>
   ```
   Project ref bisa dilihat di Supabase Dashboard URL: `https://supabase.com/dashboard/project/<project-ref>`
4. Atau lewat Dashboard → **Edge Functions** → **Deploy new function** → upload `supabase/functions/manage-user/index.ts`

#### Step 5 — Update Config
1. Di Supabase Dashboard → **Settings** → **API**
2. Salin **Project URL** dan **anon public key**
3. Edit `supabase/config.js`:
   ```js
   url: "https://<project-ref>.supabase.co",
   anonKey: "<anon-key-anda>"
   ```

#### Step 6 — Deploy ke Hosting
Upload semua file ke hosting favorit Anda:
- **GitHub Pages**: Bisa langsung, tapi Edge Function tetap perlu Supabase
- **Vercel / Netlify**: Upload folder `smk3/`, tambahkan file `vercel.json` atau `netlify.toml` jika perlu
- **Hosting statis lain**: Folder `smk3/` siap deploy apa adanya

## 📱 Akses dari HP

Aplikasi sudah sepenuhnya **responsive**:
- **Mobile-first design** — tampilan menyesuaikan otomatis ukuran layar
- **Touch-friendly** — tombol cukup besar, input mudah di-tap
- **Viewport di-set** — `maximum-scale=1.0, user-scalable=no, viewport-fit=cover`
- Sidebar auto-collapse di layar kecil, bisa dibuka via tombol hamburger
- Semua data yang ditambahkan admin dari desktop langsung bisa diakses dari HP (karena pakai Supabase/LocalStorage yang sama)

> **Penting**: Untuk mode LocalStorage, data tersimpan di browser masing-masing device. Jadi data yang ditambahkan dari desktop TIDAK akan muncul di HP — kecuali Anda menggunakan mode Supabase. Untuk sharing data antar device, **wajib pakai Supabase**.

## 🗄️ Struktur Database

| Tabel | Fungsi |
|-------|--------|
| `users` | Profil pengguna (sync dengan auth.users) |
| `karyawan` | Data karyawan |
| `lokasi` | Data lokasi kerja |
| `risiko` | Identifikasi risiko K3 |
| `kejadian` | Laporan kejadian/insiden |
| `inspeksi` | Hasil inspeksi K3 |
| `tindakan` | Tindakan perbaikan |
| `activity_logs` | Log aktivitas pengguna |

## 👤 Role Pengguna

| Role | Hak Akses |
|------|-----------|
| **admin** | Full access: CRUD semua data, manajemen pengguna, pengaturan |
| **petugas** | View data, input laporan/inspeksi, edit data sendiri |

## 🔧 Troubleshooting

### Login gagal "Email atau password salah"
- Pastikan email & password benar (case-sensitive)
- Coba super admin default: `admin@smk3.id` / `smk3admin2024!`
- Kalau pakai Supabase, cek apakah `database.sql` sudah di-run
- Kalau error "Email not confirmed", disable email confirmation di Auth Settings

### Data tidak muncul di HP
- Mode LocalStorage: Data tersimpan per device. Beralihlah ke Supabase untuk sharing data.
- Mode Supabase: Pastikan koneksi internet HP aktif. Cek config.js sudah diupdate dengan benar.

### Edge Function error
- Pastikan `SUPABASE_SERVICE_ROLE_KEY` environment variable ter-set di Edge Function
- Cek log di Supabase Dashboard → Edge Functions → manage-user → Logs

### Halaman tidak terbuka setelah deploy
- Pastikan semua file ter-upload lengkap
- Cek console browser (F12) untuk error JavaScript
- Untuk GitHub Pages: pastikan tidak ada path issue (semua file ada di folder root)

## 📂 Struktur File

```
smk3/
├── index.html              # Redirect ke login
├── login.html              # Halaman login
├── dashboard.html          # Dashboard utama
├── database.sql            # Schema + seed data Supabase
├── README.md               # File ini
├── assets/
│   ├── css/style.css       # Style global
│   ├── img/
│   │   ├── favicon.png     # Favicon
│   │   └── logo.png        # Logo PTPN I
│   └── js/
│       ├── app.js           # Utility global
│       ├── auth.js          # Auth checker
│       ├── supabase.js      # Database service (Supabase + LocalStorage)
│       └── seed-data.js     # Seed data LocalStorage
├── pages/
│   ├── karyawan.html       # Data karyawan
│   ├── lokasi.html         # Data lokasi
│   ├── risiko.html         # Data risiko
│   ├── kejadian.html       # Laporan kejadian
│   ├── inspeksi.html       # Inspeksi K3
│   ├── tindakan.html       # Tindakan perbaikan
│   ├── statistik.html      # Statistik & grafik
│   ├── pengguna.html       # Manajemen pengguna (admin only)
│   └── pengaturan.html     # Pengaturan sistem
└── supabase/
    ├── config.js            # Konfigurasi Supabase
    └── functions/
        └── manage-user/
            └── index.ts     # Edge Function manajemen user
```

## ⚙️ Tech Stack

- **Frontend**: HTML5, CSS3, Vanilla JavaScript (Bootstrap 5 + SweetAlert2)
- **Database**: Supabase (PostgreSQL) + LocalStorage fallback
- **Auth**: Supabase Auth
- **Icons**: Font Awesome 6
- **Charts**: Chart.js (di halaman statistik)

---

**Versi**: 2.0 — Juli 2026  
**Dikembangkan untuk**: PTPN I Regional 7, Kebun Way Berulu
