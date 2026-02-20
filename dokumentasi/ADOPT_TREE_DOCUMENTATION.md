# Fitur Adopsi Pohon (Adopt Tree) - Dokumentasi

## Overview
Fitur adopsi pohon memungkinkan pengguna untuk memilih pohon dari katalog, mengisi nama untuk tag pohon, dan melakukan pembayaran melalui Midtrans.

## Flow Aplikasi

### 1. Halaman Utama Adopsi (`/adopt`)
- **File**: `src/app/adopt/page.tsx`
- **Fungsi Utama**:
  - Menampilkan katalog pohon dengan filter
  - Filter berdasarkan kategori dan pencarian
  - Server-side filtering dengan debounce 300ms
  
**Kategori Filter**:
- Tanaman Perspektif Keistimewaan
- Tanaman Toponimi Gunungkidul
- Tanaman Native Karst
- Tanaman Sumbu Filosofi

### 2. Komponen Species Card (`AdoptSpeciesCard.tsx`)
- **Lokasi**: `src/components/adopt/AdoptSpeciesCard.tsx`
- **Fitur**:
  - Menampilkan gambar pohon
  - Nama dan nama latin
  - Deskripsi singkat
  - Informasi serapan CO₂
  - Badge kategori
  - Tombol "Adopsi Sekarang"
  - Formatisasi harga rupiah

### 3. Order Modal (`OrderModal.tsx`)
- **Lokasi**: `src/components/adopt/OrderModal.tsx`
- **Fitur**:
  - Form input "Nama di Tag"
  - Preview informasi pohon yang dipilih
  - Validasi input
  - Mengirim data ke API `/api/v1/orders` dengan payload:
    ```json
    {
      "speciesId": "string",
      "nameOnTag": "string"
    }
    ```

### 4. Payment Modal dengan Midtrans (`PaymentModal.tsx`)
- **Lokasi**: `src/components/adopt/PaymentModal.tsx`
- **Fitur**:
  - Load Midtrans Snap script dari CDN
  - Fetch payment token dari API `/api/v1/orders/{orderId}/payment`
  - Trigger Midtrans Snap popup dengan:
    - `onSuccess`: Redirect ke `/dashboard`
    - `onPending`: Log pending status
    - `onError`: Show error message
    - `onClose`: Handle user close popup

## API Endpoints

### 1. Create Order
```
POST /api/v1/orders
Authorization: Bearer {token}
Content-Type: application/json

Body:
{
  "speciesId": "string",
  "nameOnTag": "string"
}

Response:
{
  "success": true,
  "data": {
    "orderId": "string"
  }
}
```

### 2. Create Payment
```
POST /api/v1/orders/{orderId}/payment
Authorization: Bearer {token}

Response:
{
  "success": true,
  "data": {
    "snapToken": "string",
    "transactionId": "string"
  }
}
```

### 3. Search Species (dari page.tsx)
```
GET /api/v1/species?search={query}&category={category}

Response:
{
  "success": true,
  "data": [
    {
      "id": "string",
      "name": "string",
      "latinName": "string",
      "category": "string",
      "basePrice": number,
      "mainImageUrl": "string",
      "description": "string",
      "carbonAbsorptionRate": number
    }
  ]
}
```

## Data Flow

```
[Adopt Page]
    ↓
[Filter & Search]
    ↓
[Species Grid dengan Cards]
    ↓
[Click Tombol Adopsi] → [Order Modal]
    ↓
[Input Nama di Tag]
    ↓
[Submit Form] → [API Create Order]
    ↓
[Dapat orderId] → [Payment Modal]
    ↓
[Fetch Payment Token] → [API Create Payment]
    ↓
[Trigger Midtrans Snap]
    ↓
[User Input Pembayaran]
    ↓
[Success/Pending/Error/Close]
```

## Environment Variables Required

```env
NEXT_PUBLIC_API_URL=http://localhost:3000  # atau URL backend production
```

## Styling

### CSS Classes
- `.adopt-container`: Container utama halaman adopsi
- `.filter-section`: Bagian filter search
- `.species-grid`: Grid layout untuk species cards
- `.modal-backdrop`: Backdrop untuk modal
- `.modal-content`: Konten modal
- `.btn-primary`: Tombol action utama
- `.btn-secondary`: Tombol secondary

### Responsive Design
- Mobile-first approach
- Grid berubah dari 1 kolom (mobile) → 2 kolom (tablet) → 3 kolom (desktop)
- Modal tetap centered dan scrollable

## Security Notes

1. **Token Management**:
   - Token diambil dari `localStorage.getItem('access_token')`
   - Dikirim dalam header `Authorization: Bearer {token}`
   - Pastikan token valid sebelum membuat order

2. **Data Validation**:
   - Nama di tag tidak boleh kosong
   - Validasi di frontend dan backend
   - Max length: 100 karakter

3. **Payment Security**:
   - Menggunakan Midtrans Snap (hosted solution)
   - Token digenerate di backend
   - Frontend hanya menampilkan popup

## Browser Support

- Chrome/Firefox/Safari (versi terbaru)
- Mobile browsers (iOS Safari, Chrome Mobile)
- Memerlukan JavaScript enabled
- Midtrans Snap memerlukan JavaScript

## Testing Guide

### Manual Testing:
1. Navigasi ke `/adopt`
2. Coba filter dengan kategori berbeda
3. Cari pohon dengan nama
4. Klik tombol "Adopsi Sekarang"
5. Isi nama di tag
6. Klik "Lanjut ke Pembayaran"
7. Gunakan test credentials Midtrans untuk testing

### Test Midtrans Credentials (Sandbox):
- Card: 4811 1111 1111 1114
- Exp: 12/25
- CVV: 123

## Troubleshooting

### Order Modal tidak muncul
- Cek console untuk error
- Pastikan selected species tidak null
- Pastikan onClick handler bekerja

### Midtrans Snap tidak muncul
- Cek apakah internet connection stabil
- Verify Midtrans script ter-load
- Check browser console untuk script errors
- Pastikan window.snap tersedia

### Payment gagal
- Verify orderId tidak null
- Check API response dari createPayment
- Pastikan token pembayaran valid
- Cek Midtrans account status (sandbox vs production)

## Future Enhancements

1. Add species review/rating system
2. Add adoption history tracking
3. Add certificate generation
4. Add email receipt
5. Add WhatsApp notification
6. Add multiple payment methods
7. Add installment options
