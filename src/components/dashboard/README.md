# Dashboard Adopsi - Dokumentasi

## Overview
Dashboard lengkap untuk menampilkan daftar adopsi pohon user dengan fitur stats, list view, dan detail modal.

## Struktur File

### Main Page
- **`/src/app/dashboard/page.tsx`** - Halaman utama dashboard
  - Mengelola state adoptions, stats, dan selected adoption
  - Fetch data dari API menggunakan `dashboardApi`
  - Handle click events untuk membuka detail modal

### Komponen Utama

#### 1. AdoptionStats Component
- **File**: `/src/components/dashboard/AdoptionStats.tsx`
- **CSS**: `/src/components/dashboard/AdoptionStats.css`
- **Fungsi**: Menampilkan 4 kartu statistik
  - Total Adopsi
  - Pohon Ditanam
  - Karbon Terserap
  - Adopsi Bulan Ini

#### 2. AdoptionList Component
- **File**: `/src/components/dashboard/AdoptionList.tsx`
- **CSS**: `/src/components/dashboard/AdoptionList.css`
- **Fungsi**: 
  - Menampilkan grid list semua adopsi
  - Setiap kartu menampilkan:
    - Gambar spesies
    - Nama pohon (Latin & Indonesia)
    - Nama di tag
    - Nomor seri pohon
    - Kategori
    - Tingkat karbon
    - Tanggal adopsi
    - Harga
    - Status pembayaran
  - Clickable untuk membuka detail

#### 3. AdoptionDetailModal Component
- **File**: `/src/components/dashboard/AdoptionDetailModal.tsx`
- **CSS**: `/src/components/dashboard/AdoptionDetailModal.css`
- **Fungsi**: Modal dengan informasi lengkap adoption
  - Gambr spesies di header
  - Informasi adopsi (nama tag, nomor, tanggal, status)
  - Informasi pohon (seri, status, kategori, lokasi)
  - Tentang spesies (deskripsi, cerita, stok)
  - Informasi pesanan (detail transaksi)
  - Informasi pemilik
  - Link download sertifikat (jika ada)

### Dashboard Layout
- **File**: `/src/app/dashboard/dashboard.css`
- **Komponen**:
  - Header dengan judul dan deskripsi
  - Error banner untuk menampilkan pesan error
  - Stats section (grid responsive)
  - Adoption section dengan empty state handling
  - Loading skeleton untuk UX yang lebih baik

## API Integration

### Endpoints yang Digunakan
Semua API call via `dashboardApi` dari `/lib/apiDashboard.ts`:

1. **GET /api/v1/adoptions**
   - Fetch list semua adopsi user
   - Response: Array of adoptions dengan basic info

2. **GET /api/v1/adoptions/${adoptionId}**
   - Fetch detail adoption spesifik
   - Response: Detail lengkap adoption dengan semua relasi

3. **GET /api/v1/adoptions/stats**
   - Fetch statistik adoption
   - Response: Stats object (totalAdoptions, totalTreesPlanted, etc)

## Fitur-Fitur

### 1. Loading State
- Skeleton loading saat fetch data
- Smooth animation

### 2. Error Handling
- Error banner yang dapat di-close
- Retry mechanism dengan refetch data

### 3. Empty State
- Icon emoji 🌱
- Pesan untuk user yang belum punya adoption

### 4. Responsive Design
- Mobile-friendly layout
- Breakpoints: 1200px, 768px, 480px
- Grid layout yang adaptive

### 5. Data Formatting
- Currency formatting (IDR)
- Date formatting (Indonesian locale)
- Status badges dengan warna berbeda

### 6. Interactivity
- Hover effects pada cards
- Click handlers untuk detail modal
- Smooth animations dan transitions

## Styling Features

### Color Scheme
- Primary Green: #4CAF50 (adoption actions)
- Secondary Blue: #2196F3 (info)
- Orange: #FF9800 (highlights)
- Purple: #9C27B0 (owner)
- Dark Text: #1a1a1a
- Light Text: #999

### Shadows & Effects
- Box shadows untuk depth
- Transform effects untuk interactivity
- Gradient backgrounds
- Smooth transitions

## Dependencies
- React hooks (useState, useEffect)
- TypeScript for type safety
- CSS3 animations & transitions

## Usage

```tsx
// Automatic di /dashboard route
// Data di-fetch saat component mount
// Click adoption card untuk lihat detail
// Close modal dengan X button atau click overlay
```

## Error Scenarios
- API timeout: Show error banner
- Invalid data: Graceful handling
- No adoptions: Show empty state
- Missing images: Fallback placeholder

## Future Enhancements
- Export adoption data ke PDF
- Filter & search adoptions
- Sort by date/price/status
- Email certificate
- Share adoption to social media
- Update tree location & photos
