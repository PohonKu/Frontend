# Search Species API - Dokumentasi Lengkap

## 📖 Daftar Isi
1. [Overview](#overview)
2. [File Structure](#file-structure)
3. [Component Documentation](#component-documentation)
4. [API Integration](#api-integration)
5. [Testing Guide](#testing-guide)
6. [Usage Examples](#usage-examples)

---

## 🎯 Overview

Sistem pencarian species pohon yang komprehensif dengan:
- ✅ Real-time search functionality
- ✅ Multiple filter options
- ✅ Responsive UI
- ✅ Client-side & Server-side integration
- ✅ Comprehensive testing tools
- ✅ Multiple view modes (Grid/List)

---

## 📁 File Structure

```
Frontend/
├── src/
│   ├── app/
│   │   ├── species/
│   │   │   └── page.tsx                    # Main species page with search
│   │   ├── search-demo/
│   │   │   └── page.tsx                    # Simple demo page
│   │   └── search-advanced/
│   │       └── page.tsx                    # Advanced search page
│   │
│   ├── components/
│   │   ├── SearchSpeciesContainer.tsx      # Main search container component
│   │   ├── SpeciesCard.tsx                 # Reusable species card components
│   │   ├── fetching/
│   │   │   └── SpeciestList.tsx           # List display component
│   │   └── layout/
│   │       └── Navbar.tsx
│   │
│   ├── lib/
│   │   └── apiSpecies.ts                  # API client
│   │
│   └── __tests__/
│       └── searchSpecies.test.ts          # Testing file
│
├── backend/
│   ├── routes/
│   │   └── tree.routes.ts                 # Route definitions
│   ├── controllers/
│   │   └── tree.controller.ts             # Controller logic
│   └── repositories/
│       └── tree.repository.ts             # Data access layer
│
└── TESTING_GUIDE.md                        # Detailed testing guide
```

---

## 🧩 Component Documentation

### 1. SearchSpeciesContainer
**File:** `src/components/SearchSpeciesContainer.tsx`

**Props:**
```typescript
interface SearchContainerProps {
  onResultsUpdate?: (results: any[]) => void;  // Callback for results
  children?: React.ReactNode;                   // Custom result component
}
```

**Features:**
- Search input dengan keyboard support
- Category dropdown filter
- Real-time filtering
- Error handling
- Loading states
- Clear button

**Usage:**
```tsx
import SearchSpeciesContainer from '@/components/SearchSpeciesContainer';

export default function MyPage() {
  return (
    <SearchSpeciesContainer
      onResultsUpdate={(results) => console.log(results)}
    >
      <MyCustomResultComponent />
    </SearchSpeciesContainer>
  );
}
```

---

### 2. SpeciesCard Components
**File:** `src/components/SpeciesCard.tsx`

**Components:**
1. **SpeciesCard** - Individual card component
2. **CustomSpeciesGrid** - Grid layout wrapper
3. **CustomSpeciesList** - List layout wrapper

**Usage:**
```tsx
import { CustomSpeciesGrid, CustomSpeciesList } from '@/components/SpeciesCard';

// Grid view
<CustomSpeciesGrid 
  species={data} 
  onSpeciesClick={(id) => console.log(id)}
  columns={3}
/>

// List view
<CustomSpeciesList 
  species={data}
  onSpeciesClick={(id) => console.log(id)}
/>
```

---

## 🔌 API Integration

### Frontend API Client
**File:** `src/lib/apiSpecies.ts`

**Methods:**
```typescript
// Search species dengan filter
getTree.searchSpecies(searchName?: string, category?: string)

// Get all species dengan filter
getTree.getAllSpecies(searchName?: string, category?: string)

// Get species by ID
getTree.getSpeciesById(id: string)

// Get species by category
getTree.getSpeciesByCategory(category: string)
```

### Backend Endpoints
**Base URL:** `http://localhost:3001/api/v1/trees`

```
GET  /species/search?search=nama&category=kategori
GET  /species?search=nama&category=kategori
GET  /species/:id
GET  /species/category/:category
POST /species
POST /species/bulk
GET  /
GET  /:id
```

---

## 🧪 Testing Guide

### Quick Start
1. **Manual Testing:** Kunjungi `http://localhost:3000/search-demo`
2. **Automated Testing:** Lihat [TESTING_GUIDE.md](./TESTING_GUIDE.md)

### Test Files
```typescript
// src/__tests__/searchSpecies.test.ts
import { runAllTests } from '@/tests/searchSpecies.test';

// Jalankan semua test
await runAllTests();
```

### Available Tests
- `testSearchByName()` - Search by name
- `testSearchByCategory()` - Filter by category
- `testSearchCombined()` - Combined search
- `testEmptySearch()` - No filter search
- `testSearchNoResults()` - Empty result handling
- `testCompareApis()` - API comparison
- `testPerformance()` - Performance metrics

---

## 💡 Usage Examples

### Example 1: Basic Search Page
```tsx
'use client';
import SearchSpeciesContainer from '@/components/SearchSpeciesContainer';
import SpeciesList from '@/components/fetching/SpeciestList';

export default function Page() {
  const [results, setResults] = useState([]);

  return (
    <SearchSpeciesContainer onResultsUpdate={setResults}>
      <SpeciesList species={results} />
    </SearchSpeciesContainer>
  );
}
```

### Example 2: Advanced Search with View Toggle
```tsx
'use client';
import { useState } from 'react';
import SearchSpeciesContainer from '@/components/SearchSpeciesContainer';
import { CustomSpeciesGrid, CustomSpeciesList } from '@/components/SpeciesCard';

export default function AdvancedPage() {
  const [results, setResults] = useState([]);
  const [viewMode, setViewMode] = useState('grid');

  return (
    <div>
      <SearchSpeciesContainer onResultsUpdate={setResults} />
      
      {viewMode === 'grid' ? (
        <CustomSpeciesGrid species={results} />
      ) : (
        <CustomSpeciesList species={results} />
      )}
    </div>
  );
}
```

### Example 3: Search with Sorting
```tsx
const [results, setResults] = useState([]);
const [sortBy, setSortBy] = useState('name');

const sorted = results.sort((a, b) => {
  switch(sortBy) {
    case 'price': return a.basePrice - b.basePrice;
    case 'name': return a.name.localeCompare(b.name);
    default: return 0;
  }
});

return <CustomSpeciesGrid species={sorted} />;
```

---

## 🚀 Pages Available

### 1. Main Species Page
- **URL:** `http://localhost:3000/species`
- **Features:** Search + Display results
- **Component:** SearchSpeciesContainer + SpeciesList

### 2. Demo Search Page
- **URL:** `http://localhost:3000/search-demo`
- **Features:** Dokumentasi API inline
- **Use Case:** Testing & learning

### 3. Advanced Search Page
- **URL:** `http://localhost:3000/search-advanced`
- **Features:** Multiple view modes, sorting, filtering
- **Use Case:** Production-like interface

---

## ⚙️ Configuration

### Environment Variables
```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

### Categories Available
- Tropis
- Subtropis
- Hutan
- Buah
- Medis

---

## 🐛 Troubleshooting

| Issue | Solution |
|-------|----------|
| API 404 error | Pastikan backend running di port 3001 |
| No results muncul | Check database data & search query |
| Slow performance | Verify API response time, add pagination |
| CORS error | Configure CORS di backend |
| Image tidak load | Verify image URL di database |

---

## 📋 Checklist for Production

- [ ] Test all search scenarios
- [ ] Verify API response times
- [ ] Test on mobile devices
- [ ] Check error handling
- [ ] Verify accessibility
- [ ] Optimize images
- [ ] Add pagination
- [ ] Implement caching
- [ ] Set up logging
- [ ] Create user documentation

---

## 📞 Support

Untuk pertanyaan atau issues:
1. Check TESTING_GUIDE.md untuk testing questions
2. Review component JSDoc comments
3. Check console untuk error messages
4. Verify environment variables

---

**Last Updated:** Feb 11, 2026
**Version:** 1.0.0
