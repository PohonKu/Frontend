# ⚡ Quick Start - Integrasi Adopsi Pohon

## 📋 Checklist Integrasi Cepat

Ikuti langkah-langkah ini untuk setup fitur adopsi pohon dalam 15 menit!

---

## 1️⃣ Backend Prerequisites (Pastikan Ada)

### Endpoints yang Diperlukan

#### ✅ GET /api/v1/species
```
Query Params: ?search=xxx&category=yyy (optional)
Response: { success: true, data: Species[] }
```

#### ✅ POST /api/v1/orders
```
Headers: Authorization: Bearer {token}
Body: { speciesId: string, nameOnTag: string }
Response: { success: true, data: { orderId: string } }
```

#### ✅ POST /api/v1/orders/{orderId}/payment
```
Headers: Authorization: Bearer {token}
Response: { success: true, data: { snapToken: string, transactionId: string } }
```

**Jika belum ada, buat di backend terlebih dahulu!**

---

## 2️⃣ Frontend Setup (5 menit)

### Step 1: Pastikan File-file Sudah Ada
```
✅ src/app/adopt/page.tsx
✅ src/app/adopt/layout.tsx
✅ src/app/adopt/adopt.css
✅ src/components/adopt/AdoptSpeciesCard.tsx
✅ src/components/adopt/OrderModal.tsx
✅ src/components/adopt/PaymentModal.tsx
✅ src/lib/useMidtrans.ts
✅ src/lib/apiPayment.ts (update)
```

### Step 2: Update Environment Variables
File: `.env.local`
```env
NEXT_PUBLIC_API_URL=http://localhost:2000
NEXT_PUBLIC_MIDTRANS_CLIENT_KEY=your-sandbox-key
```

### Step 3: Install Dependencies (jika perlu)
```bash
npm install
```

### Step 4: Restart Development Server
```bash
npm run dev
```

---

## 3️⃣ Verification (3 menit)

### ✅ Check Frontend Files
```bash
# Pastikan file ada
ls -la src/app/adopt/
ls -la src/components/adopt/
```

### ✅ Check Browser
1. Buka: http://localhost:3000/adopt
2. Lihat apakah halaman load

**Expected:**
- Halaman dengan title "🌱 Adopsi Pohon Gunungkidul"
- Filter section (search & category)
- Grid kosong atau berisi species (tergantung backend)

### ✅ Check Console (F12)
```javascript
// Tidak boleh ada error merah
// Boleh ada warning biru
```

---

## 4️⃣ Backend Integration Check (5 menit)

### Test API Endpoints

#### Test 1: GET Species
```bash
curl -X GET "http://localhost:2000/api/v1/species" \
  -H "Authorization: Bearer {your_token}"
```

**Expected Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "...",
      "name": "...",
      "category": "...",
      ...
    }
  ]
}
```

#### Test 2: POST Order (Mock)
```bash
curl -X POST "http://localhost:2000/api/v1/orders" \
  -H "Authorization: Bearer {your_token}" \
  -H "Content-Type: application/json" \
  -d '{
    "speciesId": "test-id",
    "nameOnTag": "Test User"
  }'
```

**Expected Response:**
```json
{
  "success": true,
  "data": {
    "orderId": "order-123456"
  }
}
```

#### Test 3: POST Payment (Mock)
```bash
curl -X POST "http://localhost:2000/api/v1/orders/order-123456/payment" \
  -H "Authorization: Bearer {your_token}"
```

**Expected Response:**
```json
{
  "success": true,
  "data": {
    "snapToken": "snap-xxxxx",
    "transactionId": "trans-xxxxx"
  }
}
```

---

## 5️⃣ Midtrans Setup (3 menit)

### 1. Buat Akun Midtrans
- [ ] Daftar di: https://www.midtrans.com
- [ ] Pilih Sandbox mode

### 2. Dapatkan Credentials
- [ ] Login ke Midtrans Dashboard
- [ ] Go to: Settings → Access Keys
- [ ] Copy **Client Key** (untuk frontend)
- [ ] Copy **Server Key** (untuk backend)

### 3. Update Environment
```env
# Frontend
NEXT_PUBLIC_MIDTRANS_CLIENT_KEY=your_client_key

# Backend (pastikan ada)
MIDTRANS_SERVER_KEY=your_server_key
```

### 4. Verify Midtrans Script
```javascript
// Buka console di DevTools
console.log(window.snap); // Should work setelah page load
```

---

## 6️⃣ End-to-End Test (2 menit)

### Flow Test:
1. **Login** (pastikan punya token)
2. **Go to** `/adopt`
3. **See** grid dengan species (atau loading)
4. **Filter** dengan kategori
5. **Click** "Adopsi Sekarang"
6. **Fill** nama di tag
7. **Click** "Lanjut ke Pembayaran"
8. **See** Midtrans popup ✅

---

## ⚠️ Troubleshooting Cepat

### Problem: Halaman 404
**Solution:**
```bash
# Restart dev server
npm run dev
```

### Problem: Species tidak tampil
**Check:**
```javascript
// Console
// Network tab → GET /api/v1/species
// Status harus 200, bukan 404 atau 500
```

### Problem: Adopsi button tidak jalan
**Check:**
```javascript
// React DevTools
// Check OrderModal state
// Check console untuk error
```

### Problem: Midtrans popup tidak muncul
**Check:**
```javascript
// window.snap should be defined
console.log(window.snap);
// Jika undefined = script belum load
```

### Problem: API 401 Error
**Solution:**
- [ ] Login terlebih dahulu
- [ ] Token ada di localStorage
- [ ] Token tidak expired

---

## 📊 Success Indicators

Jika semua ini bekerja, setup Anda **SUKSES**:

- ✅ Halaman `/adopt` load tanpa error
- ✅ Species grid menampilkan data
- ✅ Filter kategori bekerja
- ✅ Search real-time bekerja
- ✅ Adopt button membuka modal
- ✅ Form input bisa di-fill
- ✅ Submit form trigger POST request
- ✅ Midtrans popup muncul
- ✅ Test payment bisa dilakukan

---

## 🚀 Next Steps

Setelah setup selesai:

1. **Setup Database Seeding**
   - Isi database dengan species data
   - Pastikan kategori sesuai

2. **Testing**
   - Lihat: `ADOPT_TREE_TESTING_GUIDE.md`
   - Lakukan semua test cases

3. **Customization**
   - Update warna/styling sesuai brand
   - Add lebih banyak species
   - Customize Midtrans payment options

4. **Deployment**
   - Update Midtrans sandbox → production
   - Update environment variables
   - Deploy ke production

---

## 📞 Help Resources

- **Dokumentasi**: `ADOPT_TREE_DOCUMENTATION.md`
- **User Guide**: `ADOPT_TREE_USER_GUIDE.md`
- **Testing**: `ADOPT_TREE_TESTING_GUIDE.md`
- **Implementation**: `ADOPT_TREE_IMPLEMENTATION.md`

---

## ✅ Integration Checklist

```
Setup Phase:
- [ ] Backend endpoints ready
- [ ] Frontend files created
- [ ] Environment variables set
- [ ] Dev server running

Verification Phase:
- [ ] Halaman `/adopt` accessible
- [ ] Species data loading
- [ ] Filter bekerja
- [ ] API integration successful

Midtrans Phase:
- [ ] Account created
- [ ] Credentials obtained
- [ ] Script loading
- [ ] Snap object available

Testing Phase:
- [ ] E2E flow works
- [ ] Form validation works
- [ ] Midtrans popup shows
- [ ] Payment test successful

Done! 🎉
```

---

**Siap untuk deployment? Follow checklist di atas dan go live! 🚀**
