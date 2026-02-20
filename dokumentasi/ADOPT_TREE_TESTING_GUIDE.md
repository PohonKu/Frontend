# 🧪 Testing Guide - Fitur Adopsi Pohon

## Prerequisites

- ✅ Node.js & npm ter-install
- ✅ Backend API running (default: localhost:2000)
- ✅ Database dengan data species
- ✅ Midtrans account (sandbox)

---

## 1️⃣ Setup untuk Testing

### Start Frontend Development Server
```bash
npm run dev
```

Buka browser: `http://localhost:3000`

### Pastikan Backend Running
```bash
# Di terminal lain, jalankan backend
cd ../Backend
npm run dev
# atau sesuai dengan perintah backend Anda
```

---

## 2️⃣ Testing Environment Setup

### Environment Variables
Pastikan `.env.local` di Frontend folder memiliki:
```env
NEXT_PUBLIC_API_URL=http://localhost:2000
NEXT_PUBLIC_MIDTRANS_CLIENT_KEY=your-sandbox-client-key
```

### Database Seeding (Optional)
Pastikan ada data species di database:
```sql
-- Example species data
INSERT INTO species (id, name, latinName, category, basePrice, mainImageUrl, description, carbonAbsorptionRate) 
VALUES (
  'species-001',
  'Pinus Merkusii',
  'Pinus merkusii',
  'Tanaman Native Karst',
  150000,
  'https://example.com/pinus.jpg',
  'Pohon pinus dengan serapan CO2 tinggi',
  20.5
);
```

---

## 3️⃣ Manual Testing Flow

### Test Case 1: View & Filter Species

**Steps:**
1. Navigate ke `http://localhost:3000/adopt`
2. Tunggu loading selesai
3. Verifikasi spesies ter-load di grid

**Expected Result:**
- ✅ Grid menampilkan 3 kolom (desktop)
- ✅ Setiap kartu menampilkan: gambar, nama, kategori, harga
- ✅ Jumlah hasil ditampilkan di bawah filter
- ✅ Tidak ada error di console

---

### Test Case 2: Filter by Category

**Steps:**
1. Di halaman adopsi, buka dropdown kategori
2. Pilih "Tanaman Native Karst"
3. Tunggu hasil ter-filter

**Expected Result:**
- ✅ Grid ter-update hanya menampilkan pohon kategori dipilih
- ✅ Jumlah hasil berubah sesuai filter
- ✅ Tombol "Clear Filter" muncul
- ✅ Tidak ada loading flicker berlebihan

---

### Test Case 3: Search Functionality

**Steps:**
1. Di kolom search, ketik "Pinus"
2. Tunggu 300ms (debounce delay)
3. Lihat hasil

**Expected Result:**
- ✅ Hasil filter sesuai pencarian
- ✅ Menampilkan pohon dengan nama atau nama latin mengandung "Pinus"
- ✅ Deskripsi juga di-search

---

### Test Case 4: Combine Search & Filter

**Steps:**
1. Cari "Mahoni"
2. Filter kategori "Tanaman Perspektif Keistimewaan"
3. Lihat hasil kombinasi

**Expected Result:**
- ✅ Hasil adalah irisan dari search + filter
- ✅ Jumlah hasil akurat
- ✅ Clear filter menghapus keduanya

---

### Test Case 5: Adopt Button Click

**Steps:**
1. Klik tombol "🌱 Adopsi Sekarang" pada salah satu pohon
2. Modal order muncul

**Expected Result:**
- ✅ OrderModal muncul di atas halaman
- ✅ Preview detail pohon ditampilkan
- ✅ Gambar, nama, kategori, harga visible
- ✅ Form input "Nama di Tag Pohon" kosong
- ✅ Tombol "Lanjut ke Pembayaran" disabled (karena input kosong)

---

### Test Case 6: Form Validation

**Steps:**
1. Modal order terbuka
2. Coba klik "Lanjut ke Pembayaran" tanpa isi nama

**Expected Result:**
- ✅ Tombol tetap disabled
- ✅ Tidak ada POST request ke backend
- ✅ Error message muncul: "Nama di tag tidak boleh kosong"

---

### Test Case 7: Valid Order Creation

**Steps:**
1. Modal order terbuka
2. Isi nama: "John Doe"
3. Klik "Lanjut ke Pembayaran"
4. Tunggu proses

**Expected Result:**
- ✅ Loading state muncul (spinner visible)
- ✅ Network tab: POST request ke `/api/v1/orders`
- ✅ Request payload:
  ```json
  {
    "speciesId": "correct-id",
    "nameOnTag": "John Doe"
  }
  ```
- ✅ Dapat response dengan `orderId`
- ✅ PaymentModal muncul
- ✅ OrderModal hilang

---

### Test Case 8: Payment Modal Loading

**Steps:**
1. PaymentModal telah muncul
2. Tunggu script loading

**Expected Result:**
- ✅ Loading indicator muncul
- ✅ Network tab: GET request ke Midtrans Snap script
- ✅ POST request ke `/api/v1/orders/{orderId}/payment`
- ✅ Response berisi `snapToken`
- ✅ Tidak ada error di console

---

### Test Case 9: Midtrans Snap Popup

**Steps:**
1. PaymentModal selesai loading
2. Tunggu 1-2 detik

**Expected Result:**
- ✅ Midtrans Snap popup **otomatis** muncul
- ✅ Popup menampilkan form pembayaran
- ✅ Dropdown metode pembayaran tersedia:
  - Kartu Kredit
  - Transfer Bank
  - E-wallet, dll

---

### Test Case 10: Test Payment Success

**Steps:**
1. Midtrans Snap popup terbuka
2. Pilih "Kartu Kredit"
3. Isi dengan test card:
   ```
   Nomor: 4811 1111 1111 1114
   Exp: 12/25
   CVV: 123
   ```
4. Klik "Bayar"
5. Masukkan OTP (biasanya "123456" di sandbox)

**Expected Result:**
- ✅ Popup menampilkan "Proses pembayaran..."
- ✅ Setelah selesai, halaman redirect ke `/dashboard`
- ✅ Browser console: "✅ Pembayaran berhasil!"
- ✅ Tidak ada error page

---

### Test Case 11: Test Payment Failure

**Steps:**
1. Di Midtrans Snap, gunakan kartu error:
   ```
   Nomor: 4000 0000 0000 0002
   Exp: 12/25
   CVV: 123
   ```
2. Klik "Bayar"

**Expected Result:**
- ✅ Popup menampilkan error message
- ✅ Console log: "❌ Pembayaran gagal"
- ✅ Popup tetap terbuka
- ✅ User bisa close dan retry

---

### Test Case 12: Close Popup

**Steps:**
1. Di Midtrans Snap popup, klik tombol close (X)
2. Atau tekan ESC

**Expected Result:**
- ✅ Console log: "⚠️ Popup ditutup tanpa menyelesaikan pembayaran"
- ✅ Modal tetap terbuka (PaymentModal)
- ✅ User bisa retry pembayaran

---

### Test Case 13: Modal Close Buttons

**Steps:**
1. Di OrderModal, klik "Batal"
2. Atau klik backdrop di luar modal

**Expected Result:**
- ✅ Modal tertutup
- ✅ Kembali ke halaman adopsi
- ✅ State modal di-reset

---

### Test Case 14: Responsive Design

**Mobile (< 640px):**
- [ ] 1 kolom grid
- [ ] Font sizes smaller
- [ ] Modal still accessible

**Tablet (640px - 1024px):**
- [ ] 2 kolom grid
- [ ] Proper padding
- [ ] Modal width adjusted

**Desktop (> 1024px):**
- [ ] 3 kolom grid
- [ ] Full spacing
- [ ] Hover effects work

**Steps:**
1. Buka DevTools (F12)
2. Toggle device toolbar (Ctrl+Shift+M)
3. Test di berbagai ukuran

---

## 4️⃣ API Testing

### Mock API Response (untuk reference)

**GET /api/v1/species**
```json
{
  "success": true,
  "data": [
    {
      "id": "sp-001",
      "name": "Pinus Merkusii",
      "latinName": "Pinus merkusii",
      "category": "Tanaman Native Karst",
      "basePrice": 150000,
      "mainImageUrl": "https://...",
      "description": "...",
      "carbonAbsorptionRate": 20.5
    }
  ]
}
```

**POST /api/v1/orders**
```json
{
  "success": true,
  "data": {
    "orderId": "order-123456"
  }
}
```

**POST /api/v1/orders/{orderId}/payment**
```json
{
  "success": true,
  "data": {
    "snapToken": "snap-token-xxxxx",
    "transactionId": "trans-xxxxx"
  }
}
```

---

## 5️⃣ Browser DevTools Testing

### Network Tab
- ✅ Check semua request status 200
- ✅ Payload request sesuai spec
- ✅ Response body valid JSON
- ✅ Tidak ada CORS error

### Console Tab
- ✅ Tidak ada error merah
- ✅ Warning aman diabaikan
- ✅ Log messages terlihat:
  - "✅ Pembayaran berhasil!"
  - "⏳ Menunggu pembayaran"
  - dll

### Performance Tab
- ✅ Halaman load < 3 detik
- ✅ Filter response < 1 detik
- ✅ Tidak ada memory leak

---

## 6️⃣ Common Issues & Fixes

### Issue: Midtrans script tidak load
**Debug:**
```javascript
console.log(window.snap); // undefined = script belum load
```
**Fix:**
- Check internet connection
- Verify CDN URL correct
- Check browser console untuk error

### Issue: API 401 Unauthorized
**Debug:**
```javascript
console.log(localStorage.getItem('access_token')); // should not be null
```
**Fix:**
- Login terlebih dahulu
- Token tidak expired
- Backend verify token correctly

### Issue: Species tidak ter-load
**Debug:**
```javascript
// Network tab → GET /api/v1/species
// Check response status dan body
```
**Fix:**
- Backend endpoint aktif
- Database ada data species
- Database connection ok

### Issue: Order modal tidak muncul
**Debug:**
```javascript
// React DevTools → Check OrderModal state
// onAdoptClick handler executed?
```
**Fix:**
- Check onClick handler
- Verify state management
- Check console errors

---

## 7️⃣ Performance Testing

### Load Testing
```javascript
// Buka console, paste:
console.time('Page Load');
// Lihat waktu di console setelah page load
```

### Grid Rendering
```javascript
// DevTools → Performance tab
// Record saat scroll species grid
// Check untuk dropped frames
```

---

## 8️⃣ Accessibility Testing

### Keyboard Navigation
- ✅ Tab ke semua input/button
- ✅ Enter trigger button click
- ✅ Escape close modal
- ✅ Focus visible

### Screen Reader
- ✅ Buka dengan NVDA/JAWS
- ✅ Alt text pada gambar
- ✅ Labels pada input
- ✅ Semantic HTML

---

## ✅ Test Checklist

- [ ] Filter kategori bekerja
- [ ] Search real-time bekerja
- [ ] Adopt button membuka modal
- [ ] Form validation bekerja
- [ ] Order API call berhasil
- [ ] Payment API call berhasil
- [ ] Midtrans popup muncul
- [ ] Test payment berhasil
- [ ] Test payment gagal
- [ ] Close popup handling bekerja
- [ ] Redirect ke dashboard berhasil
- [ ] Mobile responsive bekerja
- [ ] Tablet responsive bekerja
- [ ] Desktop responsive bekerja
- [ ] Tidak ada console error
- [ ] Network requests semua 200
- [ ] Loading states visible
- [ ] Error messages clear
- [ ] Accessibility OK
- [ ] Performance acceptable

---

## 📊 Testing Report Template

```markdown
# Testing Report - [Date]

## Environment
- Browser: [Chrome 120 / Firefox / Safari]
- Device: [Desktop / Tablet / Mobile]
- Backend Status: ✅ Running

## Tests Passed
- ✅ Test case 1
- ✅ Test case 2
- ...

## Tests Failed
- ❌ Test case X: [Description]
- ❌ Test case Y: [Description]

## Issues Found
1. [Issue description]
   - Steps to reproduce
   - Expected behavior
   - Actual behavior

## Recommendations
- [Improvement suggestions]

## Sign Off
- Tested by: [Name]
- Date: [Date]
- Status: [PASS / FAIL / CONDITIONAL]
```

---

**Happy Testing! 🚀**
