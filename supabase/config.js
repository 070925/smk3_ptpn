// supabase/config.js
// Konfigurasi Supabase untuk SMK3 PTPN I Regional 7
//
// Untuk mengaktifkan mode Supabase (online, data terpusat):
//   1. Buat project di https://supabase.com
//   2. Buka Settings -> API, salin "Project URL" dan "anon public key"
//   3. Isi nilai url dan anonKey di bawah ini
//   4. Jalankan database.sql di SQL Editor
//   5. Deploy Edge Function manage-user
//
// Jika url dikosongkan (string kosong), sistem otomatis pakai LocalStorage.

var supabaseConfig = {
  url: "https://shnbkfcdxgceorymokyf.supabase.co",
  anonKey: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNobmJrZmNkeGdjZW9yeW1va3lmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQ3ODI5MTQsImV4cCI6MjEwMDM1ODkxNH0.WQv4rgweahnSb8h5DW7hony-3ymOtqC6SY8aLpfjbpI"
};

window.SMK3_SUPABASE_CONFIG = supabaseConfig;
