# 🚀 Live Search Integration Guide

Panduan lengkap untuk menggunakan dan mengintegrasikan LiveSearchSpecies ke halaman Anda.

---

## 🎯 Quick Start

### Step 1: Import Component
```tsx
import LiveSearchSpecies from '@/components/LiveSearchSpecies';
```

### Step 2: Use in Your Page
```tsx
'use client';
import LiveSearchSpecies from '@/components/LiveSearchSpecies';

export default function Page() {
  return <LiveSearchSpecies />;
}
```

### Step 3: (Optional) Handle Results
```tsx
'use client';
import { useState } from 'react';
import LiveSearchSpecies from '@/components/LiveSearchSpecies';

export default function Page() {
  const [results, setResults] = useState([]);

  return (
    <div>
      <LiveSearchSpecies onResultsUpdate={setResults} />
      <p>Selected: {results.length} species</p>
    </div>
  );
}
```

---

## 📖 Full Documentation

### Props

```typescript
interface LiveSearchProps {
  /**
   * Callback function yang dipanggil ketika hasil filter berubah
   * @param results - Array of filtered species
   */
  onResultsUpdate?: (results: Species[]) => void;

  /**
   * Custom component untuk menampilkan hasil
   * Akan menerima prop 'species' dengan array hasil filter
   */
  children?: React.ReactNode;
}
```

### Species Interface

```typescript
interface Species {
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
```

---

## 💻 Implementation Examples

### Example 1: Basic Usage
```tsx
'use client';
import LiveSearchSpecies from '@/components/LiveSearchSpecies';

export default function SpeciesPage() {
  return (
    <main>
      <h1>Browse Species</h1>
      <LiveSearchSpecies />
    </main>
  );
}
```

### Example 2: With Results Tracking
```tsx
'use client';
import { useState } from 'react';
import LiveSearchSpecies from '@/components/LiveSearchSpecies';

export default function Page() {
  const [results, setResults] = useState<any[]>([]);
  const [totalCount, setTotalCount] = useState(0);

  const handleResultsUpdate = (species: any[]) => {
    setResults(species);
    setTotalCount(species.length);
  };

  return (
    <div>
      <LiveSearchSpecies onResultsUpdate={handleResultsUpdate} />
      <div className="mt-4 p-4 bg-blue-50 rounded">
        <p>Results: {totalCount} species found</p>
      </div>
    </div>
  );
}
```

### Example 3: With Custom Display
```tsx
'use client';
import { useState } from 'react';
import LiveSearchSpecies from '@/components/LiveSearchSpecies';
import MyCustomCardComponent from './MyCustomCard';

export default function Page() {
  const [results, setResults] = useState([]);

  return (
    <LiveSearchSpecies onResultsUpdate={setResults}>
      <div className="grid grid-cols-2 gap-4">
        {results.map(species => (
          <MyCustomCardComponent key={species.id} species={species} />
        ))}
      </div>
    </LiveSearchSpecies>
  );
}
```

### Example 4: With Additional Filters
```tsx
'use client';
import { useState } from 'react';
import LiveSearchSpecies from '@/components/LiveSearchSpecies';

export default function Page() {
  const [results, setResults] = useState<any[]>([]);
  const [maxPrice, setMaxPrice] = useState(1000000);

  // Filter results further by price
  const priceFilteredResults = results.filter(
    s => s.basePrice <= maxPrice
  );

  return (
    <div>
      <LiveSearchSpecies onResultsUpdate={setResults} />
      
      <div className="mt-6 p-4 bg-gray-100 rounded">
        <h3 className="font-bold mb-2">Additional Filter</h3>
        <label className="block">
          Max Price: Rp {maxPrice.toLocaleString('id-ID')}
          <input
            type="range"
            min="0"
            max="5000000"
            step="100000"
            value={maxPrice}
            onChange={(e) => setMaxPrice(Number(e.target.value))}
            className="w-full"
          />
        </label>
        <p className="mt-2 text-sm">
          Showing {priceFilteredResults.length} species
        </p>
      </div>
    </div>
  );
}
```

### Example 5: Integration with Adoption Page
```tsx
'use client';
import { useState } from 'react';
import LiveSearchSpecies from '@/components/LiveSearchSpecies';

export default function AdoptTreePage() {
  const [selectedSpecies, setSelectedSpecies] = useState(null);
  const [results, setResults] = useState([]);

  const handleAdopt = (species: any) => {
    setSelectedSpecies(species);
    // Navigate to adoption form
    // router.push(`/adopt/${species.id}`);
  };

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">Adopt a Tree</h1>
      
      <LiveSearchSpecies onResultsUpdate={setResults}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {results.map(species => (
            <div
              key={species.id}
              className="border rounded-lg p-4 hover:shadow-lg cursor-pointer"
            >
              {species.mainImageUrl && (
                <img
                  src={species.mainImageUrl}
                  alt={species.name}
                  className="w-full h-48 object-cover rounded mb-3"
                />
              )}
              <h3 className="font-bold text-lg">{species.name}</h3>
              <p className="text-gray-600 italic text-sm">{species.latinName}</p>
              <p className="text-gray-700 mt-2">{species.description}</p>
              
              <button
                onClick={() => handleAdopt(species)}
                className="mt-4 w-full bg-green-500 text-white py-2 rounded hover:bg-green-600"
              >
                Adopt Now
              </button>
            </div>
          ))}
        </div>
      </LiveSearchSpecies>
    </div>
  );
}
```

---

## 🎨 Styling Customization

### Override Default Styles
```tsx
'use client';
import LiveSearchSpecies from '@/components/LiveSearchSpecies';

export default function Page() {
  return (
    <div className="custom-container">
      <LiveSearchSpecies />
    </div>
  );
}

// In your CSS
export const styles = `
  .custom-container :global(.bg-white) {
    background-color: #f0f9ff;
  }
`;
```

### Using Custom Component for Styling
```tsx
'use client';
import LiveSearchSpecies from '@/components/LiveSearchSpecies';

const CustomDisplay = ({ species }: { species: any[] }) => (
  <div className="my-custom-grid">
    {species.map(item => (
      <div key={item.id} className="my-custom-card">
        <h3>{item.name}</h3>
        {/* Custom markup */}
      </div>
    ))}
  </div>
);

export default function Page() {
  return (
    <LiveSearchSpecies>
      <CustomDisplay species={[]} />
    </LiveSearchSpecies>
  );
}
```

---

## 🔄 State Management

### Lifting State Up
```tsx
'use client';
import { useState } from 'react';
import LiveSearchSpecies from '@/components/LiveSearchSpecies';

export default function ParentComponent() {
  const [selectedSpecies, setSelectedSpecies] = useState(null);

  return (
    <div>
      <LiveSearchSpecies 
        onResultsUpdate={(results) => {
          // Handle results in parent
          console.log('Results updated:', results);
        }}
      />
    </div>
  );
}
```

### Context Integration
```tsx
'use client';
import { createContext, useContext, useState } from 'react';
import LiveSearchSpecies from '@/components/LiveSearchSpecies';

const SpeciesContext = createContext();

export function SpeciesProvider({ children }) {
  const [filteredSpecies, setFilteredSpecies] = useState([]);

  return (
    <SpeciesContext.Provider value={{ filteredSpecies, setFilteredSpecies }}>
      {children}
    </SpeciesContext.Provider>
  );
}

export function useSpecies() {
  return useContext(SpeciesContext);
}

// Usage
export default function Page() {
  const { setFilteredSpecies } = useSpecies();

  return (
    <LiveSearchSpecies onResultsUpdate={setFilteredSpecies} />
  );
}
```

---

## 🧪 Testing Examples

### Test Case: Search Functionality
```tsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import LiveSearchSpecies from '@/components/LiveSearchSpecies';

test('filters species on search input', async () => {
  render(<LiveSearchSpecies />);
  
  const searchInput = screen.getByPlaceholderText('Cari nama species...');
  await userEvent.type(searchInput, 'Jati');
  
  // Assert results are filtered
  expect(screen.getByText(/Jati/i)).toBeInTheDocument();
});
```

### Test Case: Category Filter
```tsx
test('filters by category', async () => {
  render(<LiveSearchSpecies />);
  
  const categorySelect = screen.getByDisplayValue('Semua Kategori');
  await userEvent.selectOption(categorySelect, 'Tropis');
  
  // Assert category filter works
  const cards = screen.getAllByText('Tropis');
  expect(cards.length).toBeGreaterThan(0);
});
```

---

## 🚀 Performance Tips

### 1. Memoize Results
```tsx
import { useMemo } from 'react';

export default function Page() {
  const [results, setResults] = useState([]);

  const memoizedResults = useMemo(() => results, [results]);

  return <LiveSearchSpecies onResultsUpdate={setResults} />;
}
```

### 2. Debounce Callback
```tsx
import { useCallback, useRef } from 'react';

export default function Page() {
  const timeoutRef = useRef();

  const handleResultsUpdate = useCallback((results) => {
    clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      console.log('Results:', results);
    }, 300);
  }, []);

  return <LiveSearchSpecies onResultsUpdate={handleResultsUpdate} />;
}
```

### 3. Virtual Scrolling for Large Lists
```tsx
import { FixedSizeList } from 'react-window';

const CustomDisplay = ({ species }) => (
  <FixedSizeList
    height={600}
    itemCount={species.length}
    itemSize={100}
    width="100%"
  >
    {({ index, style }) => (
      <div style={style}>
        {/* Render item */}
      </div>
    )}
  </FixedSizeList>
);
```

---

## 🔌 API Integration

### Component uses these APIs:
```
GET /api/v1/trees/species
  ↓
Load semua species (1x saat mount)
  ↓
Filter client-side (real-time)
```

### No additional API calls for:
- Search input
- Category filter
- Combination filters

---

## 📱 Responsive Design

Component sudah responsive untuk:
- Mobile (320px+)
- Tablet (640px+)
- Desktop (1024px+)

Tidak perlu CSS tambahan untuk responsive behavior.

---

## ♿ Accessibility

Component sudah include:
- Semantic HTML
- Form inputs dengan labels
- Button dengan meaningful text
- Color contrast compliant
- Keyboard navigation ready

---

## 🐛 Common Issues & Solutions

### Issue 1: Data tidak muncul
**Cause:** Database kosong atau API error
**Solution:** Check browser console, verify database seeded

### Issue 2: Filter tidak bekerja
**Cause:** Search query case-sensitive
**Solution:** Component sudah handle case-insensitive, check spelling

### Issue 3: Performa lambat
**Cause:** Dataset besar tanpa pagination
**Solution:** Implement pagination atau virtual scrolling

---

## 📚 Integration Checklist

- [ ] Import component
- [ ] Add to page
- [ ] Test search functionality
- [ ] Test category filter
- [ ] Test combined filters
- [ ] Handle results (if needed)
- [ ] Custom styling (if needed)
- [ ] Mobile testing
- [ ] Error scenarios
- [ ] Performance check

---

## 🎓 Next Steps

1. **Copy component** dari `src/components/LiveSearchSpecies.tsx`
2. **Integrate** ke halaman Anda
3. **Test** semua fitur
4. **Customize** styling sesuai kebutuhan
5. **Deploy** dengan confidence

---

## 📞 Resources

- [LIVE_SEARCH_DOCUMENTATION.md](./LIVE_SEARCH_DOCUMENTATION.md) - Fitur details
- [BEST_PRACTICES.md](./BEST_PRACTICES.md) - Code patterns
- [FAQ_TROUBLESHOOTING.md](./FAQ_TROUBLESHOOTING.md) - Common issues

---

**Status:** ✅ Ready to Use

Last Updated: February 12, 2026
