# Panduan Pemasangan — Takwim JPN Interaktif

Tiga fail, tiga komponen: **Google Sheet** (pangkalan data) → **Apps Script** (API) → **GitHub Pages** (paparan). Ikut urutan ni.

---

## Bahagian A — Google Sheet + Apps Script (backend)

1. Buka Google Sheet baharu → namakan **Takwim JPN Kedah**.
2. Menu **Extensions → Apps Script**.
3. Padam kod sedia ada, **tampal sepenuhnya** isi `Code.gs`. Simpan (ikon disket).
4. Dalam Apps Script, pilih fungsi **`setupSheet`** pada dropdown atas → klik **Run**.
   - Kali pertama akan minta kebenaran → **Review permissions → pilih akaun → Allow**.
   - Selesai, Sheet anda kini ada 5 tab: `Sektor`, `Pengguna`, `Senarai_VIP`, `Senarai_Venue`, `Program`.
5. **Deploy → New deployment** → ikon gear pilih **Web app**:
   - *Description*: Takwim API
   - *Execute as*: **Me**
   - *Who has access*: **Anyone**
   - Klik **Deploy** → salin **URL Web app** (berakhir dengan `/exec`).

> ⚠️ Setiap kali anda **ubah `Code.gs`**, kena **Deploy → Manage deployments → Edit → Version: New version**. Kalau tak, perubahan tak naik.

---

## Bahagian B — Sambung frontend

1. Buka `index.html` dengan editor teks.
2. Cari baris ini (berhampiran atas blok `<script>`):
   ```js
   const GAS_URL = "TAMPAL_URL_GAS_DI_SINI";
   ```
3. Gantikan dengan URL `/exec` tadi. Simpan.

---

## Bahagian C — Naik ke GitHub Pages

1. Buat repo baharu (cth `takwim-jpn`) → muat naik **semua fail ini ke root repo**:
   - `index.html`
   - `manifest.webmanifest`
   - `sw.js`
   - `logo.png`
   - `icon-192.png`, `icon-512.png`, `icon-maskable-512.png`, `apple-touch-icon-180.png`
2. **Settings → Pages → Source: Deploy from a branch → main → /(root)** → Save.
3. Tunggu seminit, URL akan keluar: `https://username.github.io/takwim-jpn/`.

> 📌 Semua fail mesti berada **dalam folder yang sama** (root). Jangan asingkan ikon ke subfolder, kerana laluan dalam `manifest.webmanifest` dan `sw.js` bersifat relatif.

---

## Pasang sebagai aplikasi (PWA)

Selepas dibuka di pelayar:
- **Android (Chrome)**: butang **"Pasang aplikasi ke peranti"** muncul di skrin login → tekan. Atau menu ⋮ → *Add to Home screen*.
- **iPhone (Safari)**: butang *Kongsi* → *Add to Home Screen*.
- **Desktop (Chrome/Edge)**: ikon pasang muncul di bar alamat.

Selepas dipasang, app buka dengan ikon TAKWIM sendiri, skrin penuh tanpa bar pelayar, dan boleh dibuka walaupun talian lemah (paparan dimuatkan dari cache; data tetap perlu talian untuk segarkan).

> 🔄 **Penting:** setiap kali anda kemas kini `index.html`, buka `sw.js` dan naikkan versi cache (`takwim-jpn-v1` → `v2`, dan seterusnya). Tanpa ini, pengguna yang dah pasang akan kekal nampak versi lama.

---

## Akaun ujian (boleh tukar dalam tab `Pengguna`)

| Username | Kata Laluan | Peranan        | Sektor                                   |
|----------|-------------|----------------|------------------------------------------|
| `admin`  | `admin123`  | Admin Utama    | (semua)                                  |
| `s4pd`   | `s4pd123`   | Admin Sektor   | Sektor Perancangan & Pengurusan PPD      |
| `jpn`    | `jpn123`    | Pengguna JPN   | (lihat sahaja)                           |

**Tukar kata laluan** terus dalam tab `Pengguna` lajur `KataLaluan`. Untuk tambah Admin Sektor baharu, tambah baris baharu — pastikan lajur `Sektor` betul-betul **sepadan** dengan nama dalam tab `Sektor`.

---

## Cara urus tanpa sentuh kod

- **Tambah/buang VIP** → tab `Senarai_VIP`, lajur `NamaVIP`.
- **Tambah/buang venue** → tab `Senarai_Venue`, lajur `NamaVenue`.
- **Tukar warna sektor** → tab `Sektor`, lajur `Warna` (kod hex, cth `#1d4e89`).
- **Padam/betulkan program** → boleh terus dalam tab `Program`, atau melalui aplikasi.

---

## Peranan & kebenaran (ringkas)

| Tindakan                     | Admin Utama | Admin Sektor        | Pengguna JPN |
|------------------------------|:-----------:|:-------------------:|:------------:|
| Lihat semua takwim           | ✓           | ✓                   | ✓            |
| Tapis ikut sektor            | ✓           | ✓                   | ✓            |
| Tambah/edit program          | semua sektor| **sektor sendiri**  | ✗            |
| Padam program                | semua       | **sektor sendiri**  | ✗            |

Kebenaran disahkan **di server (GAS)**, bukan hanya di paparan — jadi Admin Sektor betul-betul tak boleh ubah sektor lain walaupun cuba.

---

## Pengesanan pertindihan (clash detection)

Bila program disimpan, server semak automatik:
- **VIP** sama yang ditempah pada julat tarikh bertindih.
- **Tempat** sama pada julat tarikh bertindih.

Jika ada, amaran kuning dipaparkan dalam borang — **program tetap disimpan** (selaras "papar dulu, bengkel kemudian"). Sesuai jadi bahan rujukan masa bengkel penyelarasan Admin Utama.

---

## Export PDF (dokumentasi cetak)

Butang **⤓ Export PDF** ada di bar utama untuk **semua pengguna** (keluaran baca-sahaja).

1. Tetapkan **julat tarikh** (lalai: tahun semasa penuh).
2. PDF mengikut **tapisan sektor semasa** di skrin — matikan sektor di sisi kiri kalau nak kecualikan.
3. Klik **Jana PDF** → fail dimuat turun automatik.

Susunan PDF: kepala surat berlogo → petunjuk warna sektor → setiap bulan (grid ringkas berwarna + jadual kronologi penuh: Bil, Tarikh, Program, Sektor, Unit, Pegawai, Tempat, VIP) → kaki surat dengan tarikh jana + nombor muka surat. Teks PDF boleh pilih/cari, sesuai untuk failkan atau cetak.

> Pustaka PDF (jsPDF) dimuat dari CDN dan dicache oleh service worker selepas kali pertama dibuka dalam talian.
