(function() {
  var y = new Date().getFullYear();

  function ensure(key, data) {
    if (!localStorage.getItem(key)) {
      localStorage.setItem(key, JSON.stringify(data));
      console.log('[Seed] ' + key + ': ' + data.length + ' items');
    } else {
      var existing = JSON.parse(localStorage.getItem(key));
      console.log('[Seed] ' + key + ': already exists (' + existing.length + ' items)');
    }
  }

  // ========== USERS ==========
  ensure("smk3_users", [
    {id:"ADMIN001",nama:"Super Admin",email:"admin@smk3.id",password:"smk3admin2024!",role:"super_admin",status:"Aktif",bagian:"Manajemen",foto_url:"",created_at:"2026-07-01T08:00:00+07:00",updated_at:"2026-07-01T08:00:00+07:00"},
    {id:"USR002",nama:"Andi Pratama",email:"andi.ptpn@smk3.id",password:"andi12345",role:"admin_kebun",status:"Aktif",bagian:"K3 / HSE",foto_url:"",created_at:"2026-07-02T08:00:00+07:00",updated_at:"2026-07-02T08:00:00+07:00"},
    {id:"USR003",nama:"Siti Rahayu",email:"siti.ptpn@smk3.id",password:"siti12345",role:"supervisor_k3",status:"Aktif",bagian:"K3 / HSE",foto_url:"",created_at:"2026-07-03T08:00:00+07:00",updated_at:"2026-07-03T08:00:00+07:00"}
  ]);

  // ========== KARYAWAN ==========
  ensure("smk3_karyawan", [
    {id:"K001",nik:"PTPN-MGR-001",nama:"Bambang Hermanto",jabatan:"Manager Kebun",bagian:"Manajemen",nohp:"081234567890",email:"bambang.h@ptpn1.co.id",created_at:"2026-06-01T08:00:00+07:00"},
    {id:"K002",nik:"PTPN-SPV-002",nama:"Dewi Lestari",jabatan:"Supervisor K3",bagian:"K3/HSE",nohp:"081234567891",email:"dewi.l@ptpn1.co.id",created_at:"2026-06-02T08:00:00+07:00"},
    {id:"K003",nik:"PTPN-OPR-003",nama:"Supriyanto",jabatan:"Operator Mesin",bagian:"Produksi",nohp:"081234567892",email:"supri.y@ptpn1.co.id",created_at:"2026-06-03T08:00:00+07:00"},
    {id:"K004",nik:"PTPN-OPR-004",nama:"Rudi Hartono",jabatan:"Operator Boiler",bagian:"Produksi",nohp:"081234567893",email:"rudi.h@ptpn1.co.id",created_at:"2026-06-04T08:00:00+07:00"},
    {id:"K005",nik:"PTPN-TEK-005",nama:"Ahmad Fauzi",jabatan:"Teknisi Listrik",bagian:"Teknik",nohp:"081234567894",email:"ahmad.f@ptpn1.co.id",created_at:"2026-06-05T08:00:00+07:00"},
    {id:"K006",nik:"PTPN-ADM-006",nama:"Ratna Sari",jabatan:"Admin HRD",bagian:"HRD",nohp:"081234567895",email:"ratna.s@ptpn1.co.id",created_at:"2026-06-06T08:00:00+07:00"},
    {id:"K007",nik:"PTPN-OPR-007",nama:"Hendra Gunawan",jabatan:"Operator Forklift",bagian:"Logistik",nohp:"081234567896",email:"hendra.g@ptpn1.co.id",created_at:"2026-06-07T08:00:00+07:00"},
    {id:"K008",nik:"PTPN-TEK-008",nama:"Dimas Ardian",jabatan:"Mekanik",bagian:"Teknik",nohp:"081234567897",email:"dimas.a@ptpn1.co.id",created_at:"2026-06-08T08:00:00+07:00"}
  ]);

  // ========== LOKASI ==========
  ensure("smk3_lokasi", [
    {id:"L001",kode:"LOK-01",nama:"Pabrik Pengolahan Kelapa Sawit",jenis:"Pabrik",deskripsi:"Area pengolahan TBS menjadi CPO dan kernel, mencakup sterilizer, press, dan klarifikasi",status:"Aktif",created_at:"2026-05-01T08:00:00+07:00"},
    {id:"L002",kode:"LOK-02",nama:"Gudang Bahan Kimia & Pelumas",jenis:"Gudang",deskripsi:"Penyimpanan bahan kimia, pupuk, dan pelumas dengan sistem rak dan pallet",status:"Aktif",created_at:"2026-05-02T08:00:00+07:00"},
    {id:"L003",kode:"LOK-03",nama:"Bengkel Mekanik & Listrik",jenis:"Bengkel",deskripsi:"Perbaikan dan perawatan mesin, kendaraan, dan instalasi listrik",status:"Aktif",created_at:"2026-05-03T08:00:00+07:00"},
    {id:"L004",kode:"LOK-04",nama:"Kantor Kebun",jenis:"Kantor",deskripsi:"Kantor administrasi dan manajemen kebun, termasuk ruang server",status:"Aktif",created_at:"2026-05-04T08:00:00+07:00"},
    {id:"L005",kode:"LOK-05",nama:"Area Pembibitan & Nursery",jenis:"Kebun",deskripsi:"Area pembibitan dan perawatan bibit kelapa sawit, luas 5 hektar",status:"Aktif",created_at:"2026-05-05T08:00:00+07:00"},
    {id:"L006",kode:"LOK-06",nama:"Area Loading Ramp",jenis:"Area Kerja",deskripsi:"Area bongkar muat TBS dan pengangkutan CPO menggunakan crane",status:"Aktif",created_at:"2026-05-06T08:00:00+07:00"}
  ]);

  // ========== RISIKO ==========
  ensure("smk3_risiko", [
    {id:"R001",kode:"RSK-001",nama:"Kebocoran Gas Amonia (NH3)",lokasi:"Pabrik Pengolahan Kelapa Sawit",kategori:"Kimia",tingkat:"Tinggi",penyebab:"Korosi pipa refrigerasi, fitting aus, tekanan berlebih",dampak:"Keracunan massal, potensi ledakan",pengendalian:"Inspeksi rutin pipa & fitting, sensor gas NH3, APD SCBA, SOP kebocoran, ventilasi paksa",status:"Aktif",created_at:"2026-04-01T08:00:00+07:00"},
    {id:"R002",kode:"RSK-002",nama:"Kebakaran Gudang Bahan Kimia",lokasi:"Gudang Bahan Kimia & Pelumas",kategori:"Kebakaran",tingkat:"Tinggi",penyebab:"Reaksi eksoterm, korsleting listrik, suhu >40C",dampak:"Kebakaran besar, kerugian >Rp500jt, korban jiwa",pengendalian:"Segregasi penyimpanan, sprinkler, APAR CO2, sensor panas & smoke detector, grounding",status:"Aktif",created_at:"2026-04-02T08:00:00+07:00"},
    {id:"R003",kode:"RSK-003",nama:"Kecelakaan Mesin Press & Screw",lokasi:"Pabrik Pengolahan",kategori:"Mekanik",tingkat:"Sedang",penyebab:"Guard rusak, LOTO tidak dijalankan, human error",dampak:"Amputasi, cedera remuk, downtime >3 hari",pengendalian:"SOP LOTO wajib, inspeksi guard setiap shift, sensor proximity, rotasi operator",status:"Aktif",created_at:"2026-04-03T08:00:00+07:00"},
    {id:"R004",kode:"RSK-004",nama:"Terpeleset & Terjatuh",lokasi:"Area Pembibitan",kategori:"Fisik",tingkat:"Sedang",penyebab:"Lantai licin, area tidak rata, tangga tanpa railing",dampak:"Cedera tulang, patah tulang",pengendalian:"Grating anti-slip, railing tangga, safety shoes, housekeeping",status:"Aktif",created_at:"2026-04-04T08:00:00+07:00"},
    {id:"R005",kode:"RSK-005",nama:"Paparan Bahan Kimia",lokasi:"Gudang Bahan Kimia",kategori:"Kimia",tingkat:"Sedang",penyebab:"Drum bocor, tanpa APD, ventilasi buruk",dampak:"Iritasi kulit & mata, gangguan pernapasan",pengendalian:"APD lengkap, MSDS, eyewash, exhaust fan, pelatihan",status:"Aktif",created_at:"2026-04-05T08:00:00+07:00"},
    {id:"R006",kode:"RSK-006",nama:"Sengatan Listrik",lokasi:"Bengkel Mekanik",kategori:"Listrik",tingkat:"Rendah",penyebab:"Isolasi rusak, grounding buruk",dampak:"Luka bakar, cardiac arrest",pengendalian:"Inspeksi panel bulanan, LOTO, APD elektrik, rubber mat",status:"Diminimalkan",created_at:"2026-04-06T08:00:00+07:00"},
    {id:"R007",kode:"RSK-007",nama:"Kebisingan Tinggi",lokasi:"Pabrik Pengolahan",kategori:"Fisik",tingkat:"Rendah",penyebab:"Mesin press, turbin, boiler",dampak:"Gangguan pendengaran (NIHL)",pengendalian:"Ear plug/muff, rotasi shift, sound barrier",status:"Aktif",created_at:"2026-04-07T08:00:00+07:00"}
  ]);

  // ========== KEJADIAN ==========
  ensure("smk3_kejadian", [
    {id:"J001",nomor:"LAP-2026-001",tanggal:y+"-01-15",pelapor:"Dewi Lestari",lokasi:"Pabrik Pengolahan",jenis:"Hampir Celaka",deskripsi:"Pekerja hampir terjatuh dari tangga boiler, safety harness tidak terpasang",tingkat:"Sedang",status:"Closed",created_at:y+"-01-15T10:30:00+07:00"},
    {id:"J002",nomor:"LAP-2026-002",tanggal:y+"-02-08",pelapor:"Supriyanto",lokasi:"Gudang Bahan Kimia",jenis:"Insiden",deskripsi:"Tumpahan oli pelumas 3m2 akibat drum bocor",tingkat:"Rendah",status:"Closed",created_at:y+"-02-08T14:00:00+07:00"},
    {id:"J003",nomor:"LAP-2026-003",tanggal:y+"-03-22",pelapor:"Rudi Hartono",lokasi:"Pabrik Pengolahan",jenis:"Kecelakaan Ringan",deskripsi:"Tangan terkena goresan plat saat loading, sudah P3K",tingkat:"Rendah",status:"Closed",created_at:y+"-03-22T09:15:00+07:00"},
    {id:"J004",nomor:"LAP-2026-004",tanggal:y+"-04-10",pelapor:"Ahmad Fauzi",lokasi:"Bengkel Mekanik",jenis:"Insiden",deskripsi:"Kabel panel kontrol terbakar kecil akibat korsleting",tingkat:"Sedang",status:"Closed",created_at:y+"-04-10T16:45:00+07:00"},
    {id:"J005",nomor:"LAP-2026-005",tanggal:y+"-05-19",pelapor:"Dewi Lestari",lokasi:"Area Pembibitan",jenis:"Hampir Celaka",deskripsi:"Traktor hampir menabrak pekerja di jalur kendaraan",tingkat:"Tinggi",status:"In Progress",created_at:y+"-05-19T08:30:00+07:00"},
    {id:"J006",nomor:"LAP-2026-006",tanggal:y+"-06-05",pelapor:"Bambang Hermanto",lokasi:"Pabrik Pengolahan",jenis:"Insiden",deskripsi:"Kebocoran kecil pipa steam di area sterilizer",tingkat:"Rendah",status:"Open",created_at:y+"-06-05T11:00:00+07:00"},
    {id:"J007",nomor:"LAP-2026-007",tanggal:y+"-06-28",pelapor:"Ratna Sari",lokasi:"Kantor Kebun",jenis:"Insiden",deskripsi:"AC ruang server terbakar akibat korsleting",tingkat:"Rendah",status:"Open",created_at:y+"-06-28T13:20:00+07:00"},
    {id:"J008",nomor:"LAP-2026-008",tanggal:y+"-07-05",pelapor:"Hendra Gunawan",lokasi:"Area Loading Ramp",jenis:"Insiden",deskripsi:"Tali sling crane putus saat angkat, muatan jatuh",tingkat:"Tinggi",status:"Open",created_at:y+"-07-05T07:45:00+07:00"}
  ]);

  // ========== INSPEKSI ==========
  ensure("smk3_inspeksi", [
    {id:"I001",nomor:"INS-2026-001",tanggal:y+"-07-02",inspektor:"Dewi Lestari",lokasi:"Pabrik Pengolahan",temuan:"3 APAR kadaluarsa, 5 rambu K3 pudar",rekomendasi:"Ganti APAR, cetak rambu baru",status:"Selesai",created_at:y+"-07-02T09:00:00+07:00"},
    {id:"I002",nomor:"INS-2026-002",tanggal:y+"-07-10",inspektor:"Dewi Lestari",lokasi:"Gudang Bahan Kimia",temuan:"Ventilasi kurang, suhu 38C, 2 exhaust fan rusak",rekomendasi:"Pasang exhaust fan baru, perbaiki yang rusak",status:"Proses",created_at:y+"-07-10T10:00:00+07:00"},
    {id:"I003",nomor:"INS-2026-003",tanggal:y+"-07-18",inspektor:"Andi Pratama",lokasi:"Bengkel Mekanik",temuan:"Kabel berantakan, sambungan terbuka",rekomendasi:"Rapikan dengan cable tray, isolasi sambungan",status:"Pending",created_at:y+"-07-18T14:00:00+07:00"},
    {id:"I004",nomor:"INS-2026-004",tanggal:y+"-07-22",inspektor:"Andi Pratama",lokasi:"Area Loading Ramp",temuan:"Kondisi crane perlu maintenance, sling aus",rekomendasi:"Jadwalkan maintenance crane, ganti sling",status:"Proses",created_at:y+"-07-22T08:00:00+07:00"}
  ]);

  // ========== TINDAKAN ==========
  ensure("smk3_tindakan", [
    {id:"T001",nomor:"CAPA-001",tanggal:y+"-05-20",deskripsi:"Perbaikan rem traktor + inspeksi seluruh kendaraan operasional",penanggungjawab:"Ahmad Fauzi",deadline:y+"-06-15",lokasi:"Area Pembibitan",status:"In Progress",created_at:y+"-05-20T08:00:00+07:00"},
    {id:"T002",nomor:"CAPA-002",tanggal:y+"-06-06",deskripsi:"Perbaikan kebocoran pipa steam + pressure test",penanggungjawab:"Supriyanto",deadline:y+"-07-10",lokasi:"Pabrik Pengolahan",status:"Open",created_at:y+"-06-06T11:30:00+07:00"},
    {id:"T003",nomor:"CAPA-003",tanggal:y+"-06-29",deskripsi:"Perbaikan AC + pengecekan instalasi listrik Kantor Kebun",penanggungjawab:"Ahmad Fauzi",deadline:y+"-07-20",lokasi:"Kantor Kebun",status:"Open",created_at:y+"-06-29T14:00:00+07:00"},
    {id:"T004",nomor:"CAPA-004",tanggal:y+"-07-06",deskripsi:"Penggantian sling crane + inspeksi alat angkat",penanggungjawab:"Dimas Ardian",deadline:y+"-07-25",lokasi:"Area Loading Ramp",status:"Open",created_at:y+"-07-06T08:00:00+07:00"},
    {id:"T005",nomor:"CAPA-005",tanggal:y+"-07-15",deskripsi:"Pemasangan exhaust fan tambahan di gudang",penanggungjawab:"Ahmad Fauzi",deadline:y+"-08-05",lokasi:"Gudang Bahan Kimia",status:"Open",created_at:y+"-07-15T10:00:00+07:00"}
  ]);

  console.log('[Seed] All demo data ready (' + (3+8+6+7+8+4+5) + ' total items across 7 collections)');
})();