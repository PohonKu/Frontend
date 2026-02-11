# Testing Guide - Search Species API

## 📋 Overview

Panduan lengkap untuk testing Search Species API di Pohonku Frontend. Ada dua cara untuk testing:
1. **Manual Testing** - Melalui UI Demo Page
2. **Automated Testing** - Menggunakan test file

---

## 🌐 1. Manual Testing via Demo Page

### Akses Demo Page
```
http://localhost:3000/search-demo
```

### Fitur Testing:
- ✅ Search berdasarkan nama
- ✅ Filter berdasarkan kategori
- ✅ Kombinasi search + kategori
- ✅ Real-time validation
- ✅ Error handling display

### Test Cases:

#### Test 1: Search Single Name
1. Masukkan "Jati" di search field
2. Klik "Cari" atau tekan Enter
3. **Expected**: Menampilkan species dengan nama mengandung "Jati"

#### Test 2: Filter by Category
1. Pilih kategori "Tropis"
2. Klik "Cari"
3. **Expected**: Menampilkan semua species kategori Tropis

#### Test 3: Combined Search
1. Masukkan nama: "Pohon"
2. Pilih kategori: "Hutan"
3. Klik "Cari"
4. **Expected**: Species dengan nama mengandung "Pohon" dan kategori "Hutan"

#### Test 4: No Results
1. Masukkan nama: "XXXXX" (tidak ada)
2. Klik "Cari"
3. **Expected**: Pesan "Tidak ada hasil yang ditemukan"

#### Test 5: Clear Search
1. Melakukan search apapun
2. Klik tombol "Bersihkan"
3. **Expected**: Form kosong, results hilang, state tereset

---

## 🧪 2. Automated Testing

### File Test Location
```
src/__tests__/searchSpecies.test.ts
```

### Running Tests

#### Option 1: Using Node (Direct Execution)
```bash
# Run all tests
npx ts-node src/__tests__/searchSpecies.test.ts

# Atau buat script di package.json
npm run test:search
```

#### Option 2: Using Jest (Jika sudah setup)
```bash
npm test -- searchSpecies.test.ts
```

### Available Test Functions

#### 1. `testSearchByName()`
```typescript
// Test search berdasarkan nama
await testSearchByName();
```
**Expected Output:**
```
✅ Success: {
  success: true,
  count: X,
  message: "Ditemukan X species",
  results: X
}
```

#### 2. `testSearchByCategory()`
```typescript
await testSearchByCategory();
```
**Expected Output:**
- Menampilkan species kategori "Tropis"

#### 3. `testSearchCombined()`
```typescript
await testSearchCombined();
```
**Expected Output:**
- Kombinasi search nama + kategori

#### 4. `testEmptySearch()`
```typescript
await testEmptySearch();
```
**Expected Output:**
- Ambil semua species (no filter)

#### 5. `testSearchNoResults()`
```typescript
await testSearchNoResults();
```
**Expected Output:**
- count: 0 (tidak ada hasil)

#### 6. `testCompareApis()`
```typescript
await testCompareApis();
```
**Expected Output:**
- Bandingkan `getAllSpecies()` vs `searchSpecies()`
- `isSame: true` (harus sama ketika no filter)

#### 7. `testPerformance()`
```typescript
await testPerformance();
```
**Expected Output:**
```
✅ Performance: {
  duration: "XXms",
  resultsCount: X
}
```

#### 8. `runAllTests()`
```typescript
// Jalankan semua tests sekaligus
await runAllTests();
```

---

## 📱 3. Using Browser Console

Buka DevTools (F12) dan jalankan tests:

```javascript
// Import di browser console
import { getTree } from './lib/apiSpecies';

// Test 1: Search by name
const result1 = await getTree.searchSpecies('Jati');
console.log(result1);

// Test 2: Filter by category
const result2 = await getTree.searchSpecies(undefined, 'Tropis');
console.log(result2);

// Test 3: Combined
const result3 = await getTree.searchSpecies('Pohon', 'Hutan');
console.log(result3);
```

---

## 🔍 4. API Endpoint Testing (Backend)

### Using cURL

#### Test Search Endpoint
```bash
# Search by name
curl "http://localhost:3001/api/v1/trees/species/search?search=Jati"

# Filter by category
curl "http://localhost:3001/api/v1/trees/species/search?category=Tropis"

# Combined
curl "http://localhost:3001/api/v1/trees/species/search?search=Pohon&category=Hutan"
```

#### Test getAllSpecies Endpoint
```bash
# Get all with no filter
curl "http://localhost:3001/api/v1/trees/species"

# With filter
curl "http://localhost:3001/api/v1/trees/species?search=Jati&category=Tropis"
```

### Using Postman

1. **Create Request**
   - Method: GET
   - URL: `http://localhost:3001/api/v1/trees/species/search`

2. **Add Query Parameters**
   - Key: `search` | Value: `Jati`
   - Key: `category` | Value: `Tropis`

3. **Send Request**
   - Check response status: `200 OK`
   - Validate JSON response

---

## ✅ Expected Responses

### Success Response
```json
{
  "success": true,
  "data": [
    {
      "id": "...",
      "name": "Jati",
      "latinName": "Tectona grandis",
      "category": "Hutan",
      "basePrice": 500000,
      "description": "...",
      "mainImageUrl": "...",
      ...
    }
  ],
  "count": 5,
  "message": "Ditemukan 5 species"
}
```

### Empty Results
```json
{
  "success": true,
  "data": [],
  "count": 0,
  "message": "Ditemukan 0 species"
}
```

### Error Response
```json
{
  "success": false,
  "message": "Minimal satu parameter (search atau category) harus diisi"
}
```

---

## 🐛 Troubleshooting

### Issue 1: API tidak respond
- ✅ Pastikan backend server running di port 3001
- ✅ Check environment variable `NEXT_PUBLIC_API_URL`
- ✅ Verify CORS configuration di backend

### Issue 2: Search return 0 results
- ✅ Pastikan data sudah ada di database
- ✅ Check spelling dari search term
- ✅ Verify kategori name di database

### Issue 3: Performance issue
- ✅ Add pagination (limit, offset)
- ✅ Optimize database query dengan index
- ✅ Implement debouncing di search input

---

## 📊 Test Checklist

- [ ] Search by name works
- [ ] Filter by category works
- [ ] Combined search works
- [ ] Empty search returns all results
- [ ] No results handling displays correctly
- [ ] API response time < 500ms
- [ ] Error messages display correctly
- [ ] Clear button resets form
- [ ] Keyboard Enter key triggers search
- [ ] Results display in grid/list correctly

---

## 🚀 Integration with Components

### SearchSpeciesContainer Props
```typescript
interface SearchContainerProps {
  onResultsUpdate?: (results: any[]) => void;  // Callback when results change
  children?: React.ReactNode;                   // Custom component to display results
}
```

### Usage Example
```tsx
import SearchSpeciesContainer from '@/components/SearchSpeciesContainer';
import SpeciesList from '@/components/fetching/SpeciestList';

export default function MyPage() {
  const [results, setResults] = useState([]);

  return (
    <SearchSpeciesContainer
      onResultsUpdate={setResults}
    >
      <SpeciesList species={results} />
    </SearchSpeciesContainer>
  );
}
```

---

## 📝 Notes

- SearchSpeciesContainer adalah `'use client'` component (client-side)
- API calls dibuat menggunakan fetch API
- Case-insensitive search (database level)
- Hasil diurutkan alphabetically (A-Z)
- Support multiple filters simultaneously

---

Generated: Feb 11, 2026
