# ❓ FAQ & Troubleshooting - Search Species API

## 🔥 Common Issues & Solutions

### Issue 1: API Returns 404 Error

**Symptom:**
```
Failed to fetch species
fetch error: 404 not found
```

**Causes & Solutions:**

1. **Backend not running**
   ```bash
   # Check if backend running on port 3001
   lsof -i :3001
   
   # If not, start it
   cd Backend
   npm run dev
   ```

2. **Wrong API URL**
   ```env
   # Check .env.local
   NEXT_PUBLIC_API_URL=http://localhost:3001  # Correct
   NEXT_PUBLIC_API_URL=http://localhost:3000  # ❌ Wrong
   ```

3. **Route not defined**
   ```typescript
   // Check backend/routes/tree.routes.ts
   router.get('/species/search', treeController.searchSpecies);  // ✅ Should exist
   ```

---

### Issue 2: Search Returns No Results

**Symptom:**
```json
{
  "success": true,
  "data": [],
  "count": 0
}
```

**Solutions:**

1. **Database is empty**
   ```bash
   # Seed database
   npm run seed
   
   # Or check data exists
   npm run prisma:studio
   ```

2. **Search term doesn't match**
   ```typescript
   // Database has "Pohon Jati"
   await getTree.searchSpecies('jati');    // ✅ Case-insensitive works
   await getTree.searchSpecies('pohon');   // ✅ Partial match works
   await getTree.searchSpecies('xyz');     // ❌ No match
   ```

3. **Category filter too strict**
   ```typescript
   // Check available categories
   await getTree.getSpeciesByCategory('Tropis');
   await getTree.getSpeciesByCategory('tropis');  // ❌ Case sensitive
   ```

---

### Issue 3: CORS Error

**Symptom:**
```
Access to XMLHttpRequest blocked by CORS policy
```

**Solution:**

```typescript
// In backend (index.ts or main.ts)
import cors from 'cors';

app.use(cors({
  origin: 'http://localhost:3000',  // Frontend URL
  credentials: true
}));

// Or allow all (dev only)
app.use(cors());
```

---

### Issue 4: Images Not Loading

**Symptom:**
```
<img> Failed to load resource
```

**Solutions:**

1. **Verify image URLs in database**
   ```bash
   npm run prisma:studio
   # Check mainImageUrl field
   ```

2. **Images hosted externally**
   ```
   Need valid HTTPS URL
   Example: https://example.com/image.jpg
   ```

3. **CORS on image server**
   ```
   If images from different domain,
   ensure CORS headers allow requests
   ```

---

### Issue 5: Slow Performance

**Symptom:**
```
API takes > 1000ms to respond
```

**Solutions:**

1. **Add database indexes**
   ```prisma
   // schema.prisma
   model TreeSpecies {
     @@index([name])
     @@index([category])
     @@index([name, category])
   }
   ```

2. **Add pagination**
   ```typescript
   // Limit results
   const result = await getTree.searchSpecies(query);
   const paginated = result.data.slice(0, 20);
   ```

3. **Implement debouncing**
   ```typescript
   import { debounce } from 'lodash';
   
   const debouncedSearch = debounce((q) => {
     getTree.searchSpecies(q);
   }, 300);
   ```

---

### Issue 6: Component Not Displaying

**Symptom:**
```
SearchSpeciesContainer is not showing
```

**Solutions:**

1. **Check if it's a client component**
   ```typescript
   // MUST have this
   'use client';
   
   export const SearchSpeciesContainer = () => { ... }
   ```

2. **Import statement missing**
   ```typescript
   // ✅ Correct
   import SearchSpeciesContainer from '@/components/SearchSpeciesContainer';
   
   // ❌ Wrong
   import SearchSpeciesContainer from '@components/SearchSpeciesContainer';
   ```

3. **Check CSS classes**
   ```tsx
   // If styling broken, verify Tailwind is configured
   npm install -D tailwindcss postcss autoprefixer
   ```

---

### Issue 7: Type Errors in TypeScript

**Symptom:**
```
Property 'data' does not exist on type 'any'
```

**Solution:**

```typescript
// Define proper types
interface SearchResult {
  success: boolean;
  data: TreeSpecies[];
  count: number;
  message: string;
}

// Use types
const result: SearchResult = await getTree.searchSpecies(query);
```

---

## ❓ FAQ

### Q1: Can I use SearchSpeciesContainer without children?
**A:** Yes! It has default grid display.
```tsx
<SearchSpeciesContainer onResultsUpdate={setResults} />
```

### Q2: How do I customize the search UI?
**A:** Pass custom component as children.
```tsx
<SearchSpeciesContainer>
  <MyCustomResultComponent />
</SearchSpeciesContainer>
```

### Q3: Can I add more categories?
**A:** Yes, update the select in SearchSpeciesContainer:
```tsx
<option value="NewCategory">New Category</option>
```

### Q4: How do I add pagination?
**A:** Limit results in the container:
```typescript
const [page, setPage] = useState(1);
const itemsPerPage = 20;
const paginated = results.slice(
  (page - 1) * itemsPerPage,
  page * itemsPerPage
);
```

### Q5: Can I search by multiple fields?
**A:** Currently name & category. Extend like:
```typescript
async searchSpecies(
  searchName?: string,
  category?: string,
  latinName?: string  // Add this
)
```

### Q6: Is search case-sensitive?
**A:** No, the database query uses `mode: 'insensitive'`.

### Q7: Can I sort results?
**A:** Yes, see `/search-advanced` page for example.

### Q8: How do I test API locally?
**A:** Use cURL, Postman, or browser console:
```bash
curl "http://localhost:3001/api/v1/trees/species/search?search=jati"
```

### Q9: How do I handle API errors?
**A:** SearchSpeciesContainer has built-in error display:
```tsx
{error && (
  <div className="alert alert-error">{error}</div>
)}
```

### Q10: Can I export search results?
**A:** Not built-in, but you can add:
```typescript
const exportAsCSV = (data) => {
  const csv = data.map(item => 
    `${item.name},${item.category},${item.basePrice}`
  ).join('\n');
  // Create download
};
```

---

## 🧪 Testing Issues

### Test Fails with "Network Error"

**Check:**
1. Backend running? `npm run dev` in Backend folder
2. Correct API URL? Check `.env.local`
3. Database connected? Check logs

### Test Hangs/Times Out

**Check:**
1. Is database query slow? Add indexes
2. Is API blocking? Check backend logs
3. Network latency? Increase timeout

### Test Returns Unexpected Results

**Check:**
1. Database seeding completed?
2. Filters working correctly?
3. Case sensitivity issues?

---

## 🔧 Development Tips

### Enable Detailed Logging
```typescript
// Add to SearchSpeciesContainer
if (process.env.NODE_ENV === 'development') {
  console.log('Search query:', { searchQuery, selectedCategory });
  console.log('Results:', results);
  console.log('Loading:', loading);
  console.log('Error:', error);
}
```

### Use React DevTools
```
1. Install React DevTools extension
2. Inspect SearchSpeciesContainer
3. Check props & state
4. Verify callbacks working
```

### Debug API Calls
```typescript
// Add logging to apiSpecies.ts
async searchSpecies(...) {
  console.log('Calling search with:', { searchName, category });
  const res = await fetch(url);
  console.log('Response:', res.status);
  return res.json();
}
```

### Monitor Network Tab
```
1. Open DevTools > Network tab
2. Perform search
3. Check request/response
4. Verify headers
5. Check response time
```

---

## 📊 Performance Debugging

### Check Response Time
```typescript
const start = performance.now();
const result = await getTree.searchSpecies(query);
const duration = performance.now() - start;
console.log(`Search took ${duration}ms`);
```

### Profile Component Rendering
```typescript
import { Profiler } from 'react';

<Profiler id="SearchContainer" onRender={onRender}>
  <SearchSpeciesContainer />
</Profiler>

const onRender = (id, phase, actualDuration) => {
  console.log(`${id} (${phase}) took ${actualDuration}ms`);
};
```

### Check Bundle Size
```bash
npm install -D @next/bundle-analyzer
# See bundle-analyzer config in next.config.js
npm run analyze
```

---

## 🔐 Security Notes

### Prevent XSS
```typescript
// ✅ Safe - React escapes by default
<div>{userInput}</div>

// ❌ Unsafe - Don't use dangerouslySetInnerHTML
<div dangerouslySetInnerHTML={{ __html: userInput }} />
```

### Input Validation
```typescript
// Validate search input length
if (searchQuery.length > 100) {
  setError('Search query too long');
  return;
}
```

### API Authentication (Future)
```typescript
// If backend requires auth
const result = await fetch(url, {
  headers: {
    'Authorization': `Bearer ${token}`
  }
});
```

---

## 📞 Getting Help

1. **Check TESTING_GUIDE.md** - Testing procedures
2. **Check BEST_PRACTICES.md** - Code patterns
3. **Check component JSDoc** - Component usage
4. **Check example pages** - Working implementations
5. **Browser console** - Error messages
6. **Backend logs** - API errors

---

## ✅ Pre-Launch Checklist

- [ ] All tests pass
- [ ] No console errors
- [ ] Network tab shows < 500ms response time
- [ ] Works on mobile
- [ ] Accessibility tested
- [ ] Images load correctly
- [ ] Error messages are helpful
- [ ] Loading states visible
- [ ] Environment variables set
- [ ] Database seeded
- [ ] Backend running
- [ ] All pages accessible

---

**If issue persists, check:**
1. Error message in console
2. Network tab in DevTools
3. Backend logs
4. Database status
5. Environment variables

Good luck! 🚀

Last Updated: Feb 11, 2026
