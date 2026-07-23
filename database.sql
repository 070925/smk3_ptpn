-- ============================================================
-- DATABASE SCHEMA - SMK3 PTPN I Regional 7 Kebun Way Berulu
-- Supabase PostgreSQL
-- ============================================================
-- Cara pakai:
-- 1. Buka Supabase Dashboard → SQL Editor
-- 2. Copy-paste seluruh file ini
-- 3. Klik "Run" — semua tabel, RLS, super admin, & data demo dibuat otomatis
-- ============================================================

-- ======================== 1. USERS (Profile) ========================
DROP TABLE IF EXISTS users CASCADE;
CREATE TABLE users (
  id          UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  nama        VARCHAR(255) NOT NULL,
  email       VARCHAR(255) UNIQUE NOT NULL,
  role        VARCHAR(20)  DEFAULT 'petugas_k3' CHECK (role IN ('super_admin','admin_kebun','supervisor_k3','petugas_k3','operator','viewer','admin','petugas')),
  status      VARCHAR(20)  DEFAULT 'Aktif' CHECK (status IN ('Aktif', 'Nonaktif')),
  bagian      VARCHAR(100) DEFAULT '',
  foto_url    TEXT         DEFAULT '',
  created_at  TIMESTAMPTZ  DEFAULT NOW(),
  updated_at  TIMESTAMPTZ  DEFAULT NOW()
);

ALTER TABLE users ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "users_select_all" ON users;
CREATE POLICY "users_select_all" ON users
  FOR SELECT USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "users_update_own" ON users;
CREATE POLICY "users_update_own" ON users
  FOR UPDATE USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "users_insert_admin" ON users;
CREATE POLICY "users_insert_admin" ON users
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "users_delete_admin" ON users;
CREATE POLICY "users_delete_admin" ON users
  FOR DELETE USING (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND (role = 'super_admin' OR role = 'admin'))
  );

-- Trigger: auto-create user profile on signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO users (id, nama, email, role)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data ->> 'nama', split_part(NEW.email, '@', 1)), NEW.email, 'petugas_k3');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- ======================== 2. KARYAWAN ========================
DROP TABLE IF EXISTS karyawan CASCADE;
CREATE TABLE karyawan (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nik         VARCHAR(50)  NOT NULL,
  nama        VARCHAR(255) NOT NULL,
  jabatan     VARCHAR(100) NOT NULL,
  bagian      VARCHAR(100),
  nohp        VARCHAR(20),
  email       VARCHAR(255),
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE karyawan ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "karyawan_all" ON karyawan;
CREATE POLICY "karyawan_all" ON karyawan FOR ALL USING (auth.role() = 'authenticated');

-- ======================== 3. LOKASI ========================
DROP TABLE IF EXISTS lokasi CASCADE;
CREATE TABLE lokasi (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  kode        VARCHAR(50)  NOT NULL,
  nama        VARCHAR(255) NOT NULL,
  jenis       VARCHAR(100),
  deskripsi   TEXT,
  status      VARCHAR(20)  DEFAULT 'Aktif' CHECK (status IN ('Aktif', 'Nonaktif')),
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE lokasi ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "lokasi_all" ON lokasi;
CREATE POLICY "lokasi_all" ON lokasi FOR ALL USING (auth.role() = 'authenticated');

-- ======================== 4. RISIKO ========================
DROP TABLE IF EXISTS risiko CASCADE;
CREATE TABLE risiko (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  kode          VARCHAR(50)  NOT NULL,
  nama          VARCHAR(255) NOT NULL,
  lokasi        VARCHAR(255) NOT NULL,
  kategori      VARCHAR(50)  DEFAULT 'Fisik' CHECK (kategori IN ('Fisik','Kimia','Biologi','Ergonomi','Mekanik','Listrik','Kebakaran','Lingkungan')),
  tingkat       VARCHAR(20)  NOT NULL CHECK (tingkat IN ('Tinggi', 'Sedang', 'Rendah')),
  penyebab      TEXT,
  dampak        TEXT,
  pengendalian  TEXT,
  status        VARCHAR(20)  DEFAULT 'Aktif' CHECK (status IN ('Aktif', 'Diminimalkan', 'Terkendali')),
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  updated_at    TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE risiko ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "risiko_all" ON risiko;
CREATE POLICY "risiko_all" ON risiko FOR ALL USING (auth.role() = 'authenticated');

-- ======================== 5. KEJADIAN ========================
DROP TABLE IF EXISTS kejadian CASCADE;
CREATE TABLE kejadian (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nomor         VARCHAR(50)  NOT NULL,
  tanggal       DATE         NOT NULL,
  pelapor       VARCHAR(255) NOT NULL,
  lokasi        VARCHAR(255) NOT NULL,
  jenis         VARCHAR(100) NOT NULL,
  deskripsi     TEXT         NOT NULL,
  tingkat       VARCHAR(20)  DEFAULT 'Sedang' CHECK (tingkat IN ('Ringan', 'Sedang', 'Berat', 'Fatal')),
  penyebab      TEXT,
  kerugian      TEXT,
  tindakan      TEXT,
  status        VARCHAR(20)  DEFAULT 'Open' CHECK (status IN ('Open', 'In Progress', 'Tuntas')),
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  updated_at    TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE kejadian ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "kejadian_all" ON kejadian;
CREATE POLICY "kejadian_all" ON kejadian FOR ALL USING (auth.role() = 'authenticated');

-- ======================== 6. INSPEKSI ========================
DROP TABLE IF EXISTS inspeksi CASCADE;
CREATE TABLE inspeksi (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nomor         VARCHAR(50)  NOT NULL,
  tanggal       DATE         NOT NULL,
  inspektor     VARCHAR(255) NOT NULL,
  lokasi        VARCHAR(255) NOT NULL,
  kategori      VARCHAR(100) DEFAULT 'Rutin Harian' CHECK (kategori IN ('Rutin Harian','Rutin Mingguan','Rutin Bulanan','Mendadak','Pasca-Kejadian','Audit Internal')),
  temuan        TEXT         NOT NULL,
  rekomendasi   TEXT,
  tenggat       DATE,
  status        VARCHAR(20)  DEFAULT 'Belum' CHECK (status IN ('Belum', 'Proses', 'Tuntas', 'Pending')),
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  updated_at    TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE inspeksi ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "inspeksi_all" ON inspeksi;
CREATE POLICY "inspeksi_all" ON inspeksi FOR ALL USING (auth.role() = 'authenticated');

-- ======================== 7. TINDAKAN PERBAIKAN ========================
DROP TABLE IF EXISTS tindakan CASCADE;
CREATE TABLE tindakan (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nomor             VARCHAR(50)  NOT NULL,
  tanggal           DATE         NOT NULL,
  sumber            VARCHAR(100) DEFAULT 'Laporan Kejadian' CHECK (sumber IN ('Laporan Kejadian','Inspeksi K3','Temuan Risiko','Audit Internal','Audit Eksternal','Laporan Pekerja')),
  deskripsi         TEXT,
  penanggungjawab   VARCHAR(255) NOT NULL,
  deadline          DATE         NOT NULL,
  lokasi            VARCHAR(255) NOT NULL,
  status            VARCHAR(20)  DEFAULT 'Open' CHECK (status IN ('Open', 'In Progress', 'Tuntas')),
  verifikasi        TEXT,
  created_at        TIMESTAMPTZ DEFAULT NOW(),
  updated_at        TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE tindakan ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "tindakan_all" ON tindakan;
CREATE POLICY "tindakan_all" ON tindakan FOR ALL USING (auth.role() = 'authenticated');

-- ======================== 8. ACTIVITY LOGS ========================
DROP TABLE IF EXISTS activity_logs CASCADE;
CREATE TABLE activity_logs (
  id          BIGSERIAL PRIMARY KEY,
  action      VARCHAR(20)  NOT NULL,
  module      VARCHAR(50)  NOT NULL,
  detail      TEXT,
  user_email  VARCHAR(255),
  created_at  TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE activity_logs ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "activity_logs_all" ON activity_logs;
CREATE POLICY "activity_logs_all" ON activity_logs FOR ALL USING (auth.role() = 'authenticated');

-- ======================== 9. INDEXES ========================
CREATE INDEX IF NOT EXISTS idx_karyawan_nik     ON karyawan(nik);
CREATE INDEX IF NOT EXISTS idx_karyawan_bagian   ON karyawan(bagian);
CREATE INDEX IF NOT EXISTS idx_risiko_tingkat    ON risiko(tingkat);
CREATE INDEX IF NOT EXISTS idx_risiko_status     ON risiko(status);
CREATE INDEX IF NOT EXISTS idx_kejadian_tanggal  ON kejadian(tanggal);
CREATE INDEX IF NOT EXISTS idx_kejadian_tingkat  ON kejadian(tingkat);
CREATE INDEX IF NOT EXISTS idx_kejadian_status   ON kejadian(status);
CREATE INDEX IF NOT EXISTS idx_inspeksi_tanggal  ON inspeksi(tanggal);
CREATE INDEX IF NOT EXISTS idx_inspeksi_status   ON inspeksi(status);
CREATE INDEX IF NOT EXISTS idx_tindakan_status   ON tindakan(status);
CREATE INDEX IF NOT EXISTS idx_tindakan_deadline ON tindakan(deadline);
CREATE INDEX IF NOT EXISTS idx_activity_module   ON activity_logs(module);
CREATE INDEX IF NOT EXISTS idx_activity_time     ON activity_logs(created_at DESC);

-- ======================== 10. SUPER ADMIN + DEMO USER (wajib) ========================
-- Email: admin@smk3.id  |  Password: smk3admin2024!  (role: super_admin)
-- Email: andi.ptpn@smk3.id  |  Password: andi12345  (role: admin_kebun)
--
-- CATATAN: Karena ada trigger handle_new_user yang otomatis insert ke public.users
-- saat auth.users dibuat, maka kita hanya perlu UPDATE record yang sudah dibuat trigger.
-- Script ini AMAN dijalankan berulang kali.
DO $$
DECLARE
  uid UUID;
BEGIN
  -- ===== SUPER ADMIN =====
  SELECT id INTO uid FROM auth.users WHERE email = 'admin@smk3.id' LIMIT 1;
  IF NOT FOUND THEN
    uid := gen_random_uuid();
    -- Insert ke auth.users → trigger handle_new_user otomatis insert ke public.users
    INSERT INTO auth.users (instance_id, id, aud, role, email, encrypted_password,
      email_confirmed_at, recovery_sent_at, last_sign_in_at,
      raw_app_meta_data, raw_user_meta_data,
      created_at, updated_at,
      confirmation_token, email_change, email_change_token_new, recovery_token)
    VALUES ('00000000-0000-0000-0000-000000000000', uid,
      'authenticated', 'authenticated', 'admin@smk3.id',
      crypt('smk3admin2024!', gen_salt('bf')),
      NOW(), NOW(), NOW(),
      '{"provider":"email","providers":["email"]}',
      '{"nama":"Super Admin"}',
      NOW(), NOW(), '', '', '', '');
    -- Insert identity
    INSERT INTO auth.identities (provider_id, user_id, identity_data, provider, last_sign_in_at, created_at, updated_at)
    VALUES (uid, uid, jsonb_build_object('sub', uid::text, 'email', 'admin@smk3.id'), 'email', NOW(), NOW(), NOW());
  END IF;
  -- Update role super_admin di public.users (trigger sudah insert dengan role default 'petugas_k3')
  UPDATE public.users SET role = 'super_admin', status = 'Aktif' WHERE email = 'admin@smk3.id' AND role IS DISTINCT FROM 'super_admin';

  -- ===== ADMIN KEBUN =====
  SELECT id INTO uid FROM auth.users WHERE email = 'andi.ptpn@smk3.id' LIMIT 1;
  IF NOT FOUND THEN
    uid := gen_random_uuid();
    INSERT INTO auth.users (instance_id, id, aud, role, email, encrypted_password,
      email_confirmed_at, recovery_sent_at, last_sign_in_at,
      raw_app_meta_data, raw_user_meta_data,
      created_at, updated_at,
      confirmation_token, email_change, email_change_token_new, recovery_token)
    VALUES ('00000000-0000-0000-0000-000000000000', uid,
      'authenticated', 'authenticated', 'andi.ptpn@smk3.id',
      crypt('andi12345', gen_salt('bf')),
      NOW(), NOW(), NOW(),
      '{"provider":"email","providers":["email"]}',
      '{"nama":"Andi Pratama"}',
      NOW(), NOW(), '', '', '', '');
    INSERT INTO auth.identities (provider_id, user_id, identity_data, provider, last_sign_in_at, created_at, updated_at)
    VALUES (uid, uid, jsonb_build_object('sub', uid::text, 'email', 'andi.ptpn@smk3.id'), 'email', NOW(), NOW(), NOW());
  END IF;
  -- Update role admin_kebun di public.users
  UPDATE public.users SET role = 'admin_kebun', status = 'Aktif', bagian = 'K3 / HSE' WHERE email = 'andi.ptpn@smk3.id' AND role IS DISTINCT FROM 'admin_kebun';
END $$;

-- ======================== 11. SEED DATA (Demo) ========================
INSERT INTO karyawan (nik, nama, jabatan, bagian, nohp, email)
SELECT * FROM (VALUES
  ('PTPN-MGR-001', 'Bambang Hermanto', 'Manager Kebun', 'Manajemen', '081234567890', 'bambang.h@ptpn1.co.id'),
  ('PTPN-SPV-002', 'Dewi Lestari', 'Supervisor K3', 'K3/HSE', '081234567891', 'dewi.l@ptpn1.co.id'),
  ('PTPN-OPR-003', 'Supriyanto', 'Operator Mesin', 'Produksi', '081234567892', 'supri.y@ptpn1.co.id'),
  ('PTPN-OPR-004', 'Rudi Hartono', 'Operator Boiler', 'Produksi', '081234567893', 'rudi.h@ptpn1.co.id'),
  ('PTPN-TEK-005', 'Ahmad Fauzi', 'Teknisi Listrik', 'Teknik', '081234567894', 'ahmad.f@ptpn1.co.id'),
  ('PTPN-ADM-006', 'Ratna Sari', 'Admin HRD', 'HRD', '081234567895', 'ratna.s@ptpn1.co.id'),
  ('PTPN-OPR-007', 'Hendra Gunawan', 'Operator Forklift', 'Logistik', '081234567896', 'hendra.g@ptpn1.co.id'),
  ('PTPN-TEK-008', 'Dimas Ardian', 'Mekanik', 'Teknik', '081234567897', 'dimas.a@ptpn1.co.id')
) AS v
WHERE NOT EXISTS (SELECT 1 FROM karyawan LIMIT 1);

INSERT INTO lokasi (kode, nama, jenis, deskripsi, status)
SELECT * FROM (VALUES
  ('LOK-01', 'Pabrik Pengolahan Kelapa Sawit', 'Pabrik', 'Area pengolahan TBS menjadi CPO dan kernel', 'Aktif'),
  ('LOK-02', 'Gudang Bahan Kimia & Pelumas', 'Gudang', 'Penyimpanan bahan kimia, pupuk, dan pelumas', 'Aktif'),
  ('LOK-03', 'Bengkel Mekanik & Listrik', 'Bengkel', 'Perbaikan dan perawatan mesin dan kendaraan', 'Aktif'),
  ('LOK-04', 'Kantor Kebun', 'Kantor', 'Kantor administrasi dan manajemen kebun', 'Aktif'),
  ('LOK-05', 'Area Pembibitan & Nursery', 'Kebun', 'Area pembibitan dan perawatan bibit sawit', 'Aktif'),
  ('LOK-06', 'Area Loading Ramp', 'Area Kerja', 'Area bongkar muat TBS dan pengangkutan CPO', 'Aktif')
) AS v
WHERE NOT EXISTS (SELECT 1 FROM lokasi LIMIT 1);

INSERT INTO risiko (kode, nama, lokasi, kategori, tingkat, penyebab, dampak, pengendalian, status)
SELECT * FROM (VALUES
  ('RSK-001', 'Kebocoran Gas Amonia (NH3)', 'Pabrik Pengolahan Kelapa Sawit', 'Kimia', 'Tinggi', 'Korosi pipa refrigerasi, fitting aus, tekanan berlebih', 'Keracunan massal, potensi ledakan', 'Inspeksi rutin pipa, sensor gas NH3, APD SCBA', 'Aktif'),
  ('RSK-002', 'Kebakaran Gudang Bahan Kimia', 'Gudang Bahan Kimia & Pelumas', 'Kebakaran', 'Tinggi', 'Reaksi eksoterm, korsleting listrik, suhu >40C', 'Kebakaran besar, kerugian >Rp500jt', 'Segregasi penyimpanan, sprinkler, APAR CO2', 'Aktif'),
  ('RSK-003', 'Kecelakaan Mesin Press & Screw', 'Pabrik Pengolahan', 'Mekanik', 'Sedang', 'Guard rusak, LOTO tidak dijalankan', 'Amputasi, cedera remuk', 'SOP LOTO wajib, inspeksi guard', 'Aktif'),
  ('RSK-004', 'Terpeleset & Terjatuh', 'Area Pembibitan', 'Fisik', 'Sedang', 'Lantai licin, area tidak rata', 'Cedera tulang, patah tulang', 'Grating anti-slip, safety shoes', 'Aktif'),
  ('RSK-005', 'Paparan Bahan Kimia', 'Gudang Bahan Kimia', 'Kimia', 'Sedang', 'Drum bocor, tanpa APD, ventilasi buruk', 'Iritasi kulit & mata', 'APD lengkap, MSDS, eyewash', 'Aktif'),
  ('RSK-006', 'Sengatan Listrik', 'Bengkel Mekanik', 'Listrik', 'Rendah', 'Isolasi rusak, grounding buruk', 'Luka bakar, cardiac arrest', 'Inspeksi panel bulanan, LOTO, APD elektrik', 'Diminimalkan'),
  ('RSK-007', 'Kebisingan Tinggi', 'Pabrik Pengolahan', 'Fisik', 'Rendah', 'Mesin press, turbin, boiler', 'Gangguan pendengaran', 'Ear plug/muff, rotasi shift', 'Aktif')
) AS v
WHERE NOT EXISTS (SELECT 1 FROM risiko LIMIT 1);

INSERT INTO kejadian (nomor, tanggal, pelapor, lokasi, jenis, deskripsi, tingkat, status)
SELECT * FROM (VALUES
  ('LAP-2026-001', CURRENT_DATE - INTERVAL '6 months', 'Dewi Lestari', 'Pabrik Pengolahan', 'Nearmiss (Hampir Celaka)', 'Pekerja hampir terjatuh dari tangga boiler', 'Sedang', 'Tuntas'),
  ('LAP-2026-002', CURRENT_DATE - INTERVAL '5 months', 'Supriyanto', 'Gudang Bahan Kimia', 'Insiden Ringan', 'Tumpahan oli pelumas 3m2 akibat drum bocor', 'Ringan', 'Tuntas'),
  ('LAP-2026-003', CURRENT_DATE - INTERVAL '4 months', 'Rudi Hartono', 'Pabrik Pengolahan', 'Insiden Ringan', 'Tangan terkena goresan plat saat loading', 'Ringan', 'Tuntas'),
  ('LAP-2026-004', CURRENT_DATE - INTERVAL '3 months', 'Ahmad Fauzi', 'Bengkel Mekanik', 'Insiden Ringan', 'Kabel panel kontrol terbakar kecil', 'Sedang', 'Tuntas'),
  ('LAP-2026-005', CURRENT_DATE - INTERVAL '2 months', 'Dewi Lestari', 'Area Pembibitan', 'Nearmiss (Hampir Celaka)', 'Traktor hampir menabrak pekerja', 'Berat', 'In Progress'),
  ('LAP-2026-006', CURRENT_DATE - INTERVAL '1 month', 'Bambang Hermanto', 'Pabrik Pengolahan', 'Insiden Ringan', 'Kebocoran kecil pipa steam', 'Ringan', 'Open'),
  ('LAP-2026-007', CURRENT_DATE - INTERVAL '2 weeks', 'Ratna Sari', 'Kantor Kebun', 'Insiden Ringan', 'AC ruang server terbakar akibat korsleting', 'Ringan', 'Open'),
  ('LAP-2026-008', CURRENT_DATE - INTERVAL '1 week', 'Hendra Gunawan', 'Area Loading Ramp', 'Kecelakaan Kerja', 'Tali sling crane putus saat angkat', 'Berat', 'Open')
) AS v
WHERE NOT EXISTS (SELECT 1 FROM kejadian LIMIT 1);

INSERT INTO inspeksi (nomor, tanggal, inspektor, lokasi, kategori, temuan, rekomendasi, tenggat, status)
SELECT * FROM (VALUES
  ('INS-2026-001', CURRENT_DATE - INTERVAL '3 weeks', 'Dewi Lestari', 'Pabrik Pengolahan', 'Rutin Bulanan', '3 APAR kadaluarsa, 5 rambu K3 pudar', 'Ganti APAR, cetak rambu baru', CURRENT_DATE + INTERVAL '7 days', 'Tuntas'),
  ('INS-2026-002', CURRENT_DATE - INTERVAL '2 weeks', 'Dewi Lestari', 'Gudang Bahan Kimia', 'Rutin Mingguan', 'Ventilasi kurang, suhu 38C, 2 exhaust fan rusak', 'Pasang exhaust fan baru', CURRENT_DATE + INTERVAL '14 days', 'Proses'),
  ('INS-2026-003', CURRENT_DATE - INTERVAL '1 week', 'Andi Pratama', 'Bengkel Mekanik', 'Rutin Harian', 'Kabel berantakan, sambungan terbuka', 'Rapikan dengan cable tray', CURRENT_DATE + INTERVAL '5 days', 'Pending'),
  ('INS-2026-004', CURRENT_DATE, 'Andi Pratama', 'Area Loading Ramp', 'Mendadak', 'Kondisi crane perlu maintenance, sling aus', 'Jadwalkan maintenance crane', CURRENT_DATE + INTERVAL '7 days', 'Belum')
) AS v
WHERE NOT EXISTS (SELECT 1 FROM inspeksi LIMIT 1);

INSERT INTO tindakan (nomor, tanggal, sumber, deskripsi, penanggungjawab, deadline, lokasi, status)
SELECT * FROM (VALUES
  ('CAPA-001', CURRENT_DATE - INTERVAL '2 months', 'Laporan Kejadian', 'Perbaikan rem traktor + inspeksi kendaraan operasional', 'Ahmad Fauzi', CURRENT_DATE + INTERVAL '5 days', 'Area Pembibitan', 'In Progress'),
  ('CAPA-002', CURRENT_DATE - INTERVAL '1 month', 'Laporan Kejadian', 'Perbaikan kebocoran pipa steam + pressure test', 'Supriyanto', CURRENT_DATE + INTERVAL '10 days', 'Pabrik Pengolahan', 'Open'),
  ('CAPA-003', CURRENT_DATE - INTERVAL '3 weeks', 'Inspeksi K3', 'Perbaikan AC + pengecekan instalasi listrik', 'Ahmad Fauzi', CURRENT_DATE + INTERVAL '14 days', 'Kantor Kebun', 'Open'),
  ('CAPA-004', CURRENT_DATE - INTERVAL '2 weeks', 'Laporan Kejadian', 'Penggantian sling crane + inspeksi alat angkat', 'Dimas Ardian', CURRENT_DATE + INTERVAL '21 days', 'Area Loading Ramp', 'Open'),
  ('CAPA-005', CURRENT_DATE - INTERVAL '1 week', 'Temuan Risiko', 'Pemasangan exhaust fan tambahan di gudang', 'Ahmad Fauzi', CURRENT_DATE + INTERVAL '30 days', 'Gudang Bahan Kimia', 'Open')
) AS v
WHERE NOT EXISTS (SELECT 1 FROM tindakan LIMIT 1);

-- ======================== DONE ========================
-- LOGIN AKUN:
--   1. Super Admin
--      Email    : admin@smk3.id
--      Password : smk3admin2024!
--      Role     : super_admin
--
--   2. Admin Kebun (demo)
--      Email    : andi.ptpn@smk3.id
--      Password : andi12345
--      Role     : admin_kebun
--
-- PENTING: Setelah menjalankan script ini:
--   1. Buka Supabase Dashboard → Authentication → Settings
--   2. Matikan "Confirm email" (disable email confirmation)
--   3. Pastikan "Enable email confirmations" OFF
--      agar semua user bisa langsung login tanpa verifikasi email
-- ============================================================