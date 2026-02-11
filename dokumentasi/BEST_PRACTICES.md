# 🏆 Best Practices - Search Species Implementation

## 1️⃣ Component Usage

### ✅ DO
```tsx
// Wrap in Suspense for server components
<Suspense fallback={<LoadingSpinner />}>
  <SearchSpeciesContainer onResultsUpdate={setResults}>
    <CustomSpeciesGrid species={results} />
  </SearchSpeciesContainer>
</Suspense>

// Use callback for parent updates
<SearchSpeciesContainer 
  onResultsUpdate={(results) => {
    setResults(results);
    saveToLocalStorage(results);
  }}
/>

// Pass custom component for flexibility
<SearchSpeciesContainer>
  <MyCustomResultComponent />
</SearchSpeciesContainer>
```

### ❌ DON'T
```tsx
// Don't fetch again in parent if using container
const [results, setResults] = useState([]);
useEffect(() => {
  // DON'T DO THIS - container already fetching
  getTree.searchSpecies().then(setResults);
}, []);

// Don't call API multiple times
<SearchSpeciesContainer />
<SearchSpeciesContainer />  // ❌ Duplicate calls

// Don't render without error handling UI
<SearchSpeciesContainer />  {/* ❌ No error display */}
```

---

## 2️⃣ API Integration

### ✅ DO
```typescript
// Use optional chaining for safety
const name = result.data?.[0]?.name;

// Validate response
if (response.success && response.data.length > 0) {
  handleResults(response.data);
}

// Handle errors gracefully
try {
  const result = await getTree.searchSpecies(query);
} catch (error) {
  showErrorMessage('Search failed. Please try again.');
}

// Use constants for categories
const CATEGORIES = ['Tropis', 'Subtropis', 'Hutan'];
categories.map(cat => <option value={cat}>{cat}</option>)
```

### ❌ DON'T
```typescript
// Don't assume API always returns data
const name = result.data[0].name;  // ❌ Can crash

// Don't ignore errors
await getTree.searchSpecies(query);  // ❌ Silent fail

// Don't hardcode values
<option value="Tropis">Tropis</option>
<option value="Subtropis">Subtropis</option>
// Better: use constants/config

// Don't make unnecessary requests
<input onChange={(e) => searchSpecies(e.target.value)} />
// Better: use debounce
```

---

## 3️⃣ Performance

### ✅ DO
```typescript
// Debounce search input
import { debounce } from 'lodash';

const debouncedSearch = debounce((query) => {
  getTree.searchSpecies(query);
}, 300);

// Memoize expensive components
const MemoizedGrid = React.memo(CustomSpeciesGrid);

// Use virtual scrolling for large lists
import { FixedSizeList } from 'react-window';

// Cache results appropriately
const cache = new Map();
if (cache.has(query)) {
  return cache.get(query);
}
```

### ❌ DON'T
```typescript
// Don't search on every keystroke
<input onChange={(e) => getTree.searchSpecies(e.target.value)} />

// Don't re-render parent on every result
const [count, setCount] = useState(0);  // ❌ Unnecessary

// Don't load all data at once
findMany({ take: 10000 })  // ❌ Performance issue

// Don't ignore loading times
// Show spinner or skeleton while loading
```

---

## 4️⃣ Testing

### ✅ DO
```typescript
// Test happy path
await testSearchByName();

// Test edge cases
await testSearchNoResults();
await testEmptySearch();

// Test performance
await PerformanceTester.measureMultiple(
  'Search',
  () => getTree.searchSpecies('test'),
  5
);

// Validate responses
ResponseValidator.validateSearchResponse(result);
```

### ❌ DON'T
```typescript
// Don't test without validation
const result = await getTree.searchSpecies('test');
console.log(result);  // ❌ Doesn't validate

// Don't ignore error scenarios
// Only test success paths

// Don't run tests without logging
// Use TestLogger for output
```

---

## 5️⃣ Error Handling

### ✅ DO
```tsx
{error && (
  <div className="alert alert-error">
    <p className="font-bold">Error:</p>
    <p>{error}</p>
    <button onClick={handleRetry}>Retry</button>
  </div>
)}

{!loading && results.length === 0 && (
  <div className="alert alert-info">
    No results found. Try different keywords.
  </div>
)}

{loading && <LoadingSpinner />}
```

### ❌ DON'T
```tsx
// Don't silently fail
{error && console.log(error)}  // ❌ Hidden error

// Don't show generic messages
<p>Error occurred</p>  // ❌ Not helpful

// Don't forget loading state
// Users should know search is in progress
```

---

## 6️⃣ Type Safety

### ✅ DO
```typescript
// Define interfaces
interface SearchResult {
  success: boolean;
  data: TreeSpecies[];
  count: number;
  message: string;
}

interface TreeSpecies {
  id: string;
  name: string;
  latinName: string;
  category: string;
  basePrice: number;
  description: string;
  mainImageUrl?: string;
  carbonAbsorptionRate?: number;
  availabelStok?: number;
}

// Use types in functions
async function handleSearch(
  query: string,
  category?: string
): Promise<TreeSpecies[]> {
  const result: SearchResult = await getTree.searchSpecies(query, category);
  return result.data;
}
```

### ❌ DON'T
```typescript
// Don't use 'any' type
const result: any = await getTree.searchSpecies(query);

// Don't skip typing props
function MyComponent(props) {  // ❌ No types
  return <div>{props.data}</div>;
}

// Don't ignore TypeScript warnings
// @ts-ignore  // ❌ Suppress warnings
```

---

## 7️⃣ Accessibility

### ✅ DO
```tsx
// Use semantic HTML
<input 
  aria-label="Search species by name"
  placeholder="Search species..."
/>

// Keyboard navigation
<button onClick={search} onKeyDown={(e) => {
  if (e.key === 'Enter') search();
}}/>

// ARIA labels for screen readers
<div role="status" aria-live="polite">
  {results.length} results found
</div>

// Color contrasts
<span className="text-gray-900 bg-white">
  High contrast text
</span>
```

### ❌ DON'T
```tsx
// Don't rely on color alone
<span style={{ color: 'red' }}>Error</span>  // ❌ Icon needed

// Don't forget alt text
<img src="..." />  // ❌ Missing alt

// Don't use generic button text
<button>Click</button>  // ❌ Not descriptive

// Don't ignore keyboard users
onClick handlers without onKeyDown
```

---

## 8️⃣ Code Organization

### ✅ DO
```typescript
// Structure: features > [scope] > [type]
src/
├── features/
│   ├── species-search/
│   │   ├── components/
│   │   │   ├── SearchContainer.tsx
│   │   │   └── SpeciesCard.tsx
│   │   ├── hooks/
│   │   │   └── useSpeciesSearch.ts
│   │   ├── services/
│   │   │   └── speciesApi.ts
│   │   └── types/
│   │       └── index.ts

// Separate concerns
// - Components: UI only
// - Hooks: State & logic
// - Services: API calls
// - Types: Type definitions
```

### ❌ DON'T
```typescript
// Don't mix concerns
export default function SearchContainer() {
  // UI logic + state + API call + styling all here ❌
}

// Don't create deep nesting
src/components/search/demo/advanced/page.tsx  // ❌ Too deep

// Don't name files generically
component.tsx  // ❌ What component?
better: SearchContainer.tsx  // ✅ Clear name
```

---

## 9️⃣ Documentation

### ✅ DO
```typescript
/**
 * Search for tree species with optional filters
 * 
 * @param searchName - Optional: search by species name (case-insensitive)
 * @param category - Optional: filter by category
 * @returns Promise resolving to SearchResult with data array
 * 
 * @example
 * const result = await getTree.searchSpecies('Jati', 'Hutan');
 * console.log(result.count); // Number of results
 */
async searchSpecies(
  searchName?: string, 
  category?: string
): Promise<SearchResult>
```

### ❌ DON'T
```typescript
// Vague documentation
// search function
async searchSpecies(q?: string, c?: string) {}

// No examples
// No usage guide
// No parameter descriptions
```

---

## 🔟 Environment & Configuration

### ✅ DO
```env
# .env.local
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_APP_ENV=development

# .env.production
NEXT_PUBLIC_API_URL=https://api.pohonku.com
NEXT_PUBLIC_APP_ENV=production
```

### ❌ DON'T
```typescript
// Don't hardcode URLs
const API_URL = 'http://localhost:3001';  // ❌ Hardcoded

// Don't expose secrets
NEXT_PUBLIC_API_KEY='secret123'  // ❌ Exposed

// Don't forget environment checks
if (process.env.NODE_ENV === 'development') {
  // Dev-only logic
}
```

---

## 📋 Checklist Before Production

- [ ] All components have JSDoc comments
- [ ] Error handling is comprehensive
- [ ] Loading states are visible
- [ ] Keyboard navigation works
- [ ] ARIA labels are present
- [ ] Performance tested (< 500ms)
- [ ] Type safety enforced
- [ ] Environment variables configured
- [ ] API responses validated
- [ ] Results can be empty (zero state)
- [ ] Mobile responsive design tested
- [ ] Accessibility tested with screen reader
- [ ] Network errors handled gracefully
- [ ] API rate limiting considered
- [ ] Caching strategy implemented

---

## 🎓 Resources

- Read component JSDoc for usage
- Check `TESTING_GUIDE.md` for testing patterns
- Review example pages for implementation
- Use TypeScript for type safety
- Implement debouncing for search
- Add pagination for large results

---

**Remember: Write code for humans, not computers!** 💡

Last Updated: Feb 11, 2026
