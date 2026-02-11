# 🚀 Live Search Species - Fitur Baru

## ✨ Overview

**Live Search Species** adalah komponen yang menampilkan semua species awalnya dan melakukan filter real-time saat user mengetik atau memilih kategori.

---

## 🎯 Fitur Utama

### 1. **Tampilkan Semua Species Awalnya**
- Saat halaman dimuat, semua species ditampilkan secara otomatis
- User langsung bisa melihat daftar lengkap
- Tidak perlu mengetik apapun untuk melihat data

### 2. **Filter Real-time**
- Ketika user mengetik di search box, hasil filter instant
- Tidak perlu klik tombol "Cari"
- Hasil diupdate setiap kali ada perubahan

### 3. **Multiple Filter**
- Kombinasikan search nama dengan kategori
- Filter dilakukan secara bersamaan
- Hasil akurat dan cepat

### 4. **Category Filter**
- Dropdown dengan kategori tersedia:
  - Tropis
  - Subtropis
  - Hutan
  - Buah
  - Medis

### 5. **Clear Button**
- Tombol "Bersihkan" untuk menghapus semua filter
- Kembali ke tampilan semua species

---

## 📁 File Struktur

```
src/
├── components/
│   └── LiveSearchSpecies.tsx          ← Komponen baru
└── app/
    └── search-demo/page.tsx           ← Updated untuk menggunakan LiveSearchSpecies
```

---

## 🔧 Implementasi

### Component: LiveSearchSpecies
**File:** `src/components/LiveSearchSpecies.tsx`

**Props:**
```typescript
interface LiveSearchProps {
  onResultsUpdate?: (results: Species[]) => void;  // Callback hasil filter
  children?: React.ReactNode;                       // Custom display component
}
```

**Usage:**
```tsx
import LiveSearchSpecies from '@/components/LiveSearchSpecies';

export default function Page() {
  const [results, setResults] = useState([]);

  return (
    <LiveSearchSpecies onResultsUpdate={setResults} />
  );
}
```

---

## 🔄 Workflow

```
1. Halaman Dimuat
   ↓
2. API Call: GET /api/v1/trees/species
   ↓
3. Tampilkan Semua Species
   ↓
4. User Mengetik / Memilih Kategori
   ↓
5. Filter Client-side (Real-time)
   ↓
6. Update Tampilan Hasil
```

---

## 💻 Code Example

### Basic Usage
```tsx
'use client';
import LiveSearchSpecies from '@/components/LiveSearchSpecies';

export default function Page() {
  return <LiveSearchSpecies />;
}
```

### With Results Handler
```tsx
'use client';
import { useState } from 'react';
import LiveSearchSpecies from '@/components/LiveSearchSpecies';

export default function Page() {
  const [results, setResults] = useState([]);

  return (
    <div>
      <LiveSearchSpecies onResultsUpdate={setResults} />
      <p>Total results: {results.length}</p>
    </div>
  );
}
```

---

## ⚡ Performance

### Keuntungan Live Search
✅ **Cepat** - Update instant tanpa API delay
✅ **Offline Ready** - Filter dilakukan client-side
✅ **Akurat** - Hasil presisi dengan kata kunci
✅ **Responsive** - UI tetap responsif
✅ **Minimal API** - Hanya 1 API call di awal

### How It Works
```
1. API Call 1x: Load semua species
   ↓
2. Client-side Filter: Setiap ketikan user
   ↓
3. Update State: Real-time
   ↓
4. Re-render: Instant display
```

---

## 🎨 UI Components

### Search Bar
- Input field dengan placeholder
- Real-time update saat user mengetik
- Keyboard focus management

### Category Dropdown
- Default: "Semua Kategori"
- Options: Tropis, Subtropis, Hutan, Buah, Medis
- Single selection

### Filter Badges
- Display filter aktif
- Show search term + category
- Visual feedback dengan warna

### Clear Button
- Muncul hanya saat ada filter aktif
- Reset semua filter sekaligus
- Kembali ke semua species

### Result Counter
- Tampilkan jumlah hasil
- Format: "Ditemukan X species dari Y total"

### Result Display
- Grid layout responsive
- Card design dengan image
- Hover effects

---

## 🧪 Testing

### Test Case 1: Load Awal
```
1. Buka halaman
2. Tunggu loading selesai
3. Verify: Semua species ditampilkan
```

### Test Case 2: Search by Name
```
1. Ketik "Jati" di search box
2. Verify: Hanya species dengan "Jati" ditampilkan
3. Verify: Result count update
```

### Test Case 3: Filter by Category
```
1. Pilih "Tropis" dari dropdown
2. Verify: Hanya species Tropis ditampilkan
3. Verify: Result count update
```

### Test Case 4: Combined Filter
```
1. Ketik "Pohon" + Pilih "Hutan"
2. Verify: Filter keduanya bekerja
3. Verify: Result akurat
```

### Test Case 5: Clear Filter
```
1. Lakukan filtering apapun
2. Klik "Bersihkan"
3. Verify: Semua species kembali ditampilkan
```

---

## 📊 State Management

### States
```typescript
const [allSpecies, setAllSpecies] = useState<Species[]>([]);
const [filteredSpecies, setFilteredSpecies] = useState<Species[]>([]);
const [searchQuery, setSearchQuery] = useState('');
const [selectedCategory, setSelectedCategory] = useState('');
const [loading, setLoading] = useState(true);
const [error, setError] = useState<string | null>(null);
```

### State Flow
```
Component Mount
  ↓
loadAllSpecies() → setAllSpecies, setFilteredSpecies
  ↓
searchQuery Change → trigger filter effect
  ↓
selectedCategory Change → trigger filter effect
  ↓
Filter Logic → setFilteredSpecies
  ↓
Re-render dengan filtered results
```

---

## 🔌 API Integration

### Initial Load
```typescript
const response = await getTree.getAllSpecies();
// No filters initially
```

### Data Flow
```
API Response
  ↓
setAllSpecies(response.data)
  ↓
setFilteredSpecies(response.data)  // Initially all
  ↓
User Input → Filter
```

---

## 🎯 Use Cases

### Use Case 1: Browse All Species
- User buka halaman
- Lihat semua species available
- Scroll dan explore

### Use Case 2: Quick Search
- User tahu nama species
- Ketik nama
- Langsung lihat hasil

### Use Case 3: Category Browse
- User ingin lihat kategori tertentu
- Pilih kategori
- Filter instant

### Use Case 4: Combined Search
- User mencari "Pohon Buah"
- Search "pohon" + pilih "Buah"
- Hasil presisi

---

## 🚀 Deploy Checklist

- [x] Component created
- [x] Page updated
- [x] TypeScript types defined
- [x] Error handling
- [x] Loading states
- [x] Empty states
- [x] Mobile responsive
- [x] Accessibility
- [x] Performance optimized

---

## 📱 Mobile Responsive

### Mobile (< 640px)
- Full width search input
- Dropdown di bawah input
- Stacked layout

### Tablet (640px - 1024px)
- Side-by-side layout
- Better spacing

### Desktop (> 1024px)
- Full layout dengan grid
- 3 columns per row

---

## ♿ Accessibility

- Semantic HTML
- ARIA labels (ready)
- Keyboard navigation support
- Screen reader friendly
- Focus management

---

## 🔐 Security

- Input sanitization (handled by React)
- XSS prevention
- SQL injection prevention (Prisma)
- CORS configured

---

## 📚 Related Files

- **API Client:** `src/lib/apiSpecies.ts`
- **Species Interface:** `src/types/index.ts`
- **Demo Page:** `src/app/search-demo/page.tsx`
- **Traditional Search:** `src/components/SearchSpeciesContainer.tsx`

---

## 💡 Perbedaan dengan SearchSpeciesContainer

| Feature | LiveSearch | SearchContainer |
|---------|-----------|-----------------|
| Initial Display | Semua species | Kosong |
| Search Trigger | Real-time | Manual (klik/Enter) |
| API Calls | 1x | Per search |
| Filter Speed | Instant | Tergantung API |
| Offline Mode | Works | Tidak |
| Best For | Browse | Precise search |

---

## 🎁 Future Enhancements

- [ ] Debouncing untuk large datasets
- [ ] Sorting options (name, price, stock)
- [ ] Favorites/bookmark
- [ ] Export functionality
- [ ] Advanced filters
- [ ] Search history
- [ ] Suggestions/autocomplete
- [ ] Pagination

---

## 📞 Support

Untuk questions atau issues, lihat:
- [FAQ_TROUBLESHOOTING.md](../FAQ_TROUBLESHOOTING.md)
- [BEST_PRACTICES.md](../BEST_PRACTICES.md)
- Component JSDoc comments

---

**Status:** ✅ Ready for Production

Last Updated: February 12, 2026
