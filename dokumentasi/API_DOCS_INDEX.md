# 📖 API Documentation Index

**Dokumentasi API Lengkap - Pohonku Frontend**

---

## 📚 Dokumen Utama

### 1. **[API_DOCUMENTATION_COMPLETE.md](API_DOCUMENTATION_COMPLETE.md)** 📋
**Panduan Lengkap API Endpoints**

Mencakup:
- ✅ Daftar semua endpoint API dengan detail lengkap
- ✅ Request/Response format untuk setiap endpoint
- ✅ Penjelasan parameter dan headers
- ✅ Contoh response sukses dan error
- ✅ Environment configuration
- ✅ Error handling best practices

**Gunakan untuk:**
- Memahami detail API endpoints
- Referensi format request/response
- Debugging API issues
- Integration dengan backend

---

### 2. **[ARCHITECTURE_AND_INTEGRATION.md](ARCHITECTURE_AND_INTEGRATION.md)** 🏗️
**Arsitektur Sistem & Data Flow**

Mencakup:
- ✅ High-level system architecture
- ✅ Technology stack explanation
- ✅ Data flow diagrams untuk setiap feature
- ✅ Component integration maps
- ✅ Request/Response cycle
- ✅ State management patterns
- ✅ Error handling architecture
- ✅ Performance optimization
- ✅ Security considerations

**Gunakan untuk:**
- Memahami cara sistem bekerja secara keseluruhan
- Melihat data flow end-to-end
- Mengerti component interactions
- Planning new features
- Understanding security patterns

---

### 3. **[API_INTEGRATION_GUIDE.md](API_INTEGRATION_GUIDE.md)** 🚀
**Practical Integration Guide dengan Code Examples**

Mencakup:
- ✅ Quick start setup
- ✅ 10 common tasks dengan code examples lengkap
- ✅ Copy-paste ready code snippets
- ✅ Common patterns & best practices
- ✅ Troubleshooting guide
- ✅ Real-world examples

**Gunakan untuk:**
- Implementasi API di components
- Copy-paste code examples
- Learning by doing
- Troubleshooting issues
- Finding patterns

---

## 🎯 Quick Navigation by Use Case

### Saya ingin...

#### 📋 Baca dokumentasi API endpoints
→ **[API_DOCUMENTATION_COMPLETE.md](API_DOCUMENTATION_COMPLETE.md)**
- Lihat "Daftar Endpoint API" section
- Cek request/response examples

#### 🔧 Implementasi API di component
→ **[API_INTEGRATION_GUIDE.md](API_INTEGRATION_GUIDE.md)**
- Lihat "Common Tasks" section dengan code examples
- Copy-paste dan modify sesuai kebutuhan

#### 🏗️ Pahami arsitektur sistem
→ **[ARCHITECTURE_AND_INTEGRATION.md](ARCHITECTURE_AND_INTEGRATION.md)**
- Lihat architecture diagrams
- Baca data flow sections

#### 🐛 Debug API issues
→ **[API_INTEGRATION_GUIDE.md](API_INTEGRATION_GUIDE.md)**
- Lihat "Troubleshooting" section
- Check error handling patterns di [API_DOCUMENTATION_COMPLETE.md](API_DOCUMENTATION_COMPLETE.md)

#### 📈 Optimize API calls
→ **[ARCHITECTURE_AND_INTEGRATION.md](ARCHITECTURE_AND_INTEGRATION.md)**
- Lihat "Performance Optimization" section
- Check "State Management Pattern"

#### 🔐 Implement security
→ **[ARCHITECTURE_AND_INTEGRATION.md](ARCHITECTURE_AND_INTEGRATION.md)**
- Lihat "Security Considerations" section

---

## 🗂️ API Endpoints Quick Reference

### Species/Trees
```
GET    /api/v1/trees/species                    → getAllSpecies()
GET    /api/v1/trees/species/:id                → getSpeciesById()
GET    /api/v1/trees/species/category/:cat      → getSpeciesByCategory()
GET    /api/v1/trees/species?search=...&cat=... → searchSpecies()
```

### Authentication
```
GET    /api/v1/auth/me                          → getProfile()
```

### Orders/Adoption
```
POST   /api/v1/orders                           → createOrder()
GET    /api/v1/orders/:id                       → getPendingPayments()
POST   /api/v1/orders/:id/payment               → createPayment()
```

### Dashboard
```
GET    /api/v1/adoptions                        → getDashboard()
GET    /api/v1/adoptions/:id                    → getAdoptionDetail()
GET    /api/v1/adoptions/stats                  → getStatsAdoption()
```

---

## 📂 API Modules Reference

### `getTree` (apiSpecies.ts)
```typescript
import { getTree } from '@/lib/apiSpecies';

// Methods:
await getTree.getAllSpecies()
await getTree.getSpeciesById(id)
await getTree.getSpeciesByCategory(category)
await getTree.searchSpecies(search?, category?)
```

### `orderApi` (apiOrder.ts)
```typescript
import { orderApi } from '@/lib/apiOrder';

// Methods:
await orderApi.createOrder(data)
await orderApi.createPayment(orderId)
await orderApi.getPendingPayments(orderId)
```

### `dashboardApi` (apiDashboard.ts)
```typescript
import { dashboardApi } from '@/lib/apiDashboard';

// Methods:
await dashboardApi.getDashboard()
await dashboardApi.getAdoptionDetail(adoptionId)
await dashboardApi.getStatsAdoption()
```

### `getProfile` (apiLogin.ts)
```typescript
import { getProfile } from '@/lib/apiLogin';

// Methods:
await getProfile.getProfile()
```

### `apiFetch` (wraper.ts)
```typescript
import { apiFetch } from '@/lib/wraper';

// Generic method for custom API calls:
await apiFetch<T>(endpoint, options)
```

---

## 🔑 Key Concepts Explained

### Response Format
```typescript
// All API responses follow this structure:
{
  success: boolean,
  data: T,           // Generic type - varies by endpoint
  message: string    // Human-readable message
}
```

### Error Handling
- API errors are thrown as exceptions
- Wrap calls in `try/catch` blocks
- Check `response.success` before using `response.data`

### Authentication
- Token stored in `localStorage.access_token`
- Automatically attached to all requests via `apiFetch`
- 401 response means token is invalid/expired

### Debouncing
- For search: use 300ms debounce to reduce API calls
- Clear previous timeout before setting new one
- Essential for UX and API rate limiting

---

## 🚀 Getting Started

### Step 1: Setup Environment
```bash
# .env.local
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_MIDTRANS_CLIENT_KEY=YOUR_KEY
```

### Step 2: Choose a Task
Pick a common task from [API_INTEGRATION_GUIDE.md](API_INTEGRATION_GUIDE.md#-common-tasks--code-examples)

### Step 3: Copy & Modify
- Copy code example from guide
- Modify for your component
- Test with your API endpoint

### Step 4: Handle Errors
- Wrap in try/catch
- Set error state
- Display user-friendly message

### Step 5: Test
- Check browser console
- Verify API response
- Test error cases

---

## 📊 Common Flows

### Adoption Flow
1. User views species list → `getTree.searchSpecies()`
2. User clicks "Adopsi" → Show OrderModal
3. User fills form → `orderApi.createOrder()`
4. Get payment token → `orderApi.createPayment()`
5. Show Midtrans Snap UI → `window.snap.pay()`
6. Payment confirmed → Redirect

[See full flow](ARCHITECTURE_AND_INTEGRATION.md#-flow-1-user-menjelajahi--mengadopsi-pohon)

### Dashboard Flow
1. User opens /dashboard
2. Parallel fetch → `getDashboard()` + `getStatsAdoption()`
3. Display adoptions list
4. User clicks adoption → `getAdoptionDetail()`
5. Show detail modal

[See full flow](ARCHITECTURE_AND_INTEGRATION.md#-flow-2-user-melihat-dashboard-adopsi)

---

## 🎓 Learning Path

### Beginner
1. Read [API_INTEGRATION_GUIDE.md](API_INTEGRATION_GUIDE.md) - Quick Start section
2. Try Task 1: Fetch All Species
3. Try Task 2: Search & Filter

### Intermediate
1. Read [API_DOCUMENTATION_COMPLETE.md](API_DOCUMENTATION_COMPLETE.md)
2. Try Task 5: Create Order
3. Try Task 7: Fetch Dashboard
4. Implement your own feature

### Advanced
1. Read [ARCHITECTURE_AND_INTEGRATION.md](ARCHITECTURE_AND_INTEGRATION.md)
2. Understand data flows
3. Implement optimizations
4. Add error handling

---

## ⚡ Performance Tips

1. **Debounce Search** - Use 300ms debounce for search inputs
2. **Cache Results** - Store fetched data to avoid redundant calls
3. **Parallel Requests** - Use `Promise.all()` for multiple API calls
4. **Lazy Load** - Load modals/components only when needed
5. **Image Optimization** - Use Next.js Image component

[See more](ARCHITECTURE_AND_INTEGRATION.md#performance-optimization)

---

## 🔐 Security Checklist

- [ ] Token stored in localStorage
- [ ] Token attached to all authenticated requests
- [ ] Validate input on frontend (UX)
- [ ] Backend validates all input (security)
- [ ] Logout removes token
- [ ] 401 responses trigger re-login
- [ ] Sensitive data not logged to console in production

[See more](ARCHITECTURE_AND_INTEGRATION.md#security-considerations)

---

## 📞 Support & Troubleshooting

### Common Issues

| Issue | Solution |
|-------|----------|
| "API URL is not configured" | Check `.env.local` has `NEXT_PUBLIC_API_URL` |
| "401 Unauthorized" | Token missing or expired - user needs to login |
| CORS Error | Backend CORS not configured properly |
| Network timeout | Add retry logic or increase timeout |
| Blank response | Check `response.success` before using `response.data` |

[Full troubleshooting](API_INTEGRATION_GUIDE.md#-troubleshooting)

---

## 📝 Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | Feb 21, 2026 | Initial complete documentation |

---

## 🎯 Documentation Checklist

- [x] Complete API endpoints documented
- [x] Request/response examples provided
- [x] Integration code examples included
- [x] Architecture diagrams created
- [x] Data flow documentation
- [x] Error handling guide
- [x] Troubleshooting section
- [x] Security guidelines
- [x] Performance optimization tips
- [x] Learning path for developers

---

## 📖 How to Use This Documentation

**For Implementation:**
1. Start with [API_INTEGRATION_GUIDE.md](API_INTEGRATION_GUIDE.md)
2. Find your use case in "Common Tasks"
3. Copy code example
4. Modify for your needs

**For Understanding:**
1. Read [ARCHITECTURE_AND_INTEGRATION.md](ARCHITECTURE_AND_INTEGRATION.md)
2. Study the data flow diagrams
3. Understand component interactions

**For Reference:**
1. Check [API_DOCUMENTATION_COMPLETE.md](API_DOCUMENTATION_COMPLETE.md)
2. Find endpoint details
3. Check request/response format

---

## ✅ Quality Checklist

Before committing API-related code:

- [ ] All API calls wrapped in try/catch
- [ ] Loading states managed properly
- [ ] Error messages user-friendly
- [ ] Token included in authenticated requests
- [ ] Response structure checked before using
- [ ] No console.log of sensitive data in production
- [ ] Debounce implemented for search/filter
- [ ] Parallel requests used where applicable
- [ ] Error messages don't reveal internal details
- [ ] Tests written for error scenarios

---

**Last Updated:** February 21, 2026  
**Documentation Status:** ✅ Complete & Production Ready

---

**Need Help?**
- Check the relevant guide in this index
- Read the troubleshooting section
- Review code examples in integration guide
- Check component implementation in `/src` folder
