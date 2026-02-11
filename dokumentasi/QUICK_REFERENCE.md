# 🎯 Search Species API - Quick Reference

## 📍 Pages
```
/species              - Main search page with container
/search-demo         - Simple demo with API docs
/search-advanced     - Advanced with sorting & view toggle
```

## 🧩 Components
```typescript
// Import
import SearchSpeciesContainer from '@/components/SearchSpeciesContainer';
import { 
  CustomSpeciesGrid, 
  CustomSpeciesList,
  SpeciesCard 
} from '@/components/SpeciesCard';

// Usage
<SearchSpeciesContainer 
  onResultsUpdate={(results) => console.log(results)}
>
  <CustomSpeciesGrid species={results} />
</SearchSpeciesContainer>
```

## 🔌 API Client
```typescript
import { getTree } from '@/lib/apiSpecies';

// Search
const result = await getTree.searchSpecies('Jati', 'Tropis');

// Get all
const all = await getTree.getAllSpecies();

// Get by ID
const single = await getTree.getSpeciesById('id123');

// By category
const category = await getTree.getSpeciesByCategory('Hutan');
```

## 🧪 Testing
```typescript
// Import tests
import { 
  runAllTests,
  testSearchByName,
  testSearchByCategory 
} from '@/__tests__/searchSpecies.test';

// Run all
await runAllTests();

// Run individual
await testSearchByName();

// Advanced testing
import { createTestRunner } from '@/__tests__/testUtils';
const runner = createTestRunner();
await runner.runAllTests();
```

## 🔗 API Endpoints
```
GET    /api/v1/trees/species/search?search=nama&category=kategori
GET    /api/v1/trees/species?search=nama&category=kategori
GET    /api/v1/trees/species/:id
GET    /api/v1/trees/species/category/:category
POST   /api/v1/trees/species
POST   /api/v1/trees/species/bulk
GET    /api/v1/trees
GET    /api/v1/trees/:id
```

## 🎨 Props Reference

### SearchContainerProps
```typescript
{
  onResultsUpdate?: (results: any[]) => void;
  children?: React.ReactNode;
}
```

### CustomSpeciesGridProps
```typescript
{
  species: any[];
  onSpeciesClick?: (id: string) => void;
  columns?: 'auto' | 2 | 3 | 4;
}
```

### CustomSpeciesListProps
```typescript
{
  species: any[];
  onSpeciesClick?: (id: string) => void;
}
```

## 📚 Documentation Files
- `IMPLEMENTATION_SUMMARY.md` - Full implementation details
- `SEARCH_API_DOCUMENTATION.md` - Complete docs with examples
- `TESTING_GUIDE.md` - Testing procedures & cases
- `QUICK_REFERENCE.md` - This file

## ✅ Checklist
- [ ] Backend API running on :3001
- [ ] Frontend running on :3000
- [ ] `NEXT_PUBLIC_API_URL` configured
- [ ] Database seeded dengan test data
- [ ] Try /search-demo first
- [ ] Run automated tests
- [ ] Integrate to your pages

## 🚀 Quick Integration
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

## 🐛 Common Issues
| Issue | Fix |
|-------|-----|
| 404 API error | Backend not running on :3001 |
| No results | Check database data |
| CORS error | Configure backend CORS |
| Images broken | Verify image URLs in DB |
| Slow search | Check API response time |

## 📞 Support Resources
1. Read `TESTING_GUIDE.md` for testing questions
2. Check component JSDoc comments
3. Review example pages (/search-demo, /search-advanced)
4. Check browser console for errors
5. Verify environment variables

---
**Keep this file handy for quick reference!** 💡
