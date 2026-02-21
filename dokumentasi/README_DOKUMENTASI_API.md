# 📚 Pohonku API Documentation - README

**Status:** ✅ Production Ready  
**Version:** 1.0  
**Last Updated:** February 21, 2026

---

## 🎯 Welcome to Pohonku API Documentation

Dokumentasi lengkap untuk API Pohonku Frontend mencakup **spesifikasi endpoint, arsitektur sistem, panduan integrasi, dan contoh implementasi**.

Cocok untuk:
- ✅ Frontend Developers
- ✅ Backend Developers  
- ✅ API Designers
- ✅ Project Managers
- ✅ New Team Members

---

## 📖 5 Dokumen Utama

### 1. 📋 [API_DOCUMENTATION_COMPLETE.md](./API_DOCUMENTATION_COMPLETE.md)
**Referensi Teknis Lengkap API**

Dokumentasi lengkap semua endpoint API dengan detail:
- 13+ endpoint API dengan request/response format
- Environment configuration & setup
- Implementation di frontend (wrapper, modules, hooks)
- Flow end-to-end untuk 3 skenario utama
- Error handling & best practices

**Waktu baca:** 30-45 menit  
**Untuk:** Referensi endpoint, format data, troubleshooting

👉 **[Baca Sekarang](./API_DOCUMENTATION_COMPLETE.md)**

---

### 2. 🏗️ [ARCHITECTURE_AND_INTEGRATION.md](./ARCHITECTURE_AND_INTEGRATION.md)
**Arsitektur Sistem & Data Flow**

Dokumentasi desain sistem lengkap:
- High-level architecture diagram (complete stack)
- 4 Data flow diagrams detail (adoption, dashboard, payment, search)
- Component integration maps dengan state management
- API request/response cycle
- State management patterns (useState, debounce, cache)
- Error handling architecture (3 layers)
- Performance optimization (5 techniques)
- Security best practices (5 aspects)

**Waktu baca:** 45-60 menit  
**Untuk:** Understanding system design, planning features, design patterns

👉 **[Baca Sekarang](./ARCHITECTURE_AND_INTEGRATION.md)**

---

### 3. 🚀 [API_INTEGRATION_GUIDE.md](./API_INTEGRATION_GUIDE.md)
**Panduan Integrasi Praktis dengan Code Examples**

Panduan implementasi dengan 10 code examples siap pakai:
- Quick start setup (3 langkah)
- 10 common tasks dengan full code examples:
  1. Fetch all species
  2. Search & filter (dengan debounce)
  3. Get by category
  4. Get detail by ID
  5. Create order
  6. Payment processing
  7. Fetch dashboard
  8. Fetch stats
  9. Get adoption detail
  10. Get user profile
- 5 common patterns & best practices
- Comprehensive troubleshooting guide

**Waktu baca:** 20-30 menit  
**Untuk:** Implementation, copy-paste code, learning by doing

👉 **[Baca Sekarang](./API_INTEGRATION_GUIDE.md)**

---

### 4. 💡 [REAL_WORLD_EXAMPLES.md](./REAL_WORLD_EXAMPLES.md)
**Production-Ready Implementation Examples**

Contoh implementasi production-grade:
- Complete Adopt Feature (full page code)
- Dashboard with Real Data (full page code)
- Live Search Implementation
- Error Handling & Retry Logic
- State Management Patterns
- Performance Optimization

**Waktu baca:** 30-40 menit  
**Untuk:** Copy production-ready code, understand best practices

👉 **[Baca Sekarang](./REAL_WORLD_EXAMPLES.md)**

---

### 5. 📑 [API_DOCS_INDEX.md](./API_DOCS_INDEX.md)
**Navigation Hub & Quick Reference**

Hub navigasi dan referensi cepat:
- Quick navigation by use case
- API endpoints quick reference
- API modules reference
- Key concepts explained
- Getting started guide
- Common flows overview
- Learning path (beginner → advanced)
- Performance tips
- Security checklist
- Quality checklist

**Waktu baca:** 10-15 menit  
**Untuk:** Finding what you need quickly

👉 **[Baca Sekarang](./API_DOCS_INDEX.md)**

---

## 🚀 Quick Start (3 Langkah)

### Step 1: Setup Environment
```bash
# Create .env.local in project root
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_MIDTRANS_CLIENT_KEY=YOUR_MIDTRANS_KEY
```

### Step 2: Choose Your Task
Pilih dari [10 Common Tasks](./API_INTEGRATION_GUIDE.md#-common-tasks--code-examples)

### Step 3: Copy & Modify
Copy code example → Modify untuk kebutuhan Anda → Test

---

## 📚 How to Use This Documentation

### Saya adalah developer baru
1. Baca [API_DOCS_INDEX.md](./API_DOCS_INDEX.md) - Overview (5 min)
2. Baca [API_INTEGRATION_GUIDE.md](./API_INTEGRATION_GUIDE.md) - Quick Start (10 min)
3. Coba Task 1: Fetch All Species (15 min)

**Estimasi:** 30 menit untuk productive

---

### Saya perlu implement fitur adoption
1. Baca [API_DOCUMENTATION_COMPLETE.md#flow-1](./API_DOCUMENTATION_COMPLETE.md#-flow-1-user-menjelajahi--mengadopsi-pohon)
2. Lihat [API_INTEGRATION_GUIDE.md#task-5](./API_INTEGRATION_GUIDE.md#task-5-create-order-adoption)
3. Check [REAL_WORLD_EXAMPLES.md#full-adopt-flow](./REAL_WORLD_EXAMPLES.md#full-adopt-flow-implementation)

**Estimasi:** 1-2 jam untuk implementasi

---

### Saya perlu understand system design
1. Baca [ARCHITECTURE_AND_INTEGRATION.md#high-level-architecture](./ARCHITECTURE_AND_INTEGRATION.md#high-level-architecture-diagram)
2. Baca [ARCHITECTURE_AND_INTEGRATION.md#data-flow-architecture](./ARCHITECTURE_AND_INTEGRATION.md#data-flow-architecture)
3. Study component integration maps

**Estimasi:** 1 jam untuk understanding

---

### Saya perlu debug API issue
1. Check [API_INTEGRATION_GUIDE.md#troubleshooting](./API_INTEGRATION_GUIDE.md#-troubleshooting)
2. Check relevant endpoint di [API_DOCUMENTATION_COMPLETE.md](./API_DOCUMENTATION_COMPLETE.md#daftar-endpoint-api)
3. Check error handling di [ARCHITECTURE_AND_INTEGRATION.md#error-handling](./ARCHITECTURE_AND_INTEGRATION.md#error-handling-architecture)

**Estimasi:** 10-20 menit untuk debugging

---

## 🗺️ Navigasi by Feature

### 🌱 Fitur: Adopt/Adopsi Pohon
- **Dokumentasi:** [API_DOCUMENTATION_COMPLETE.md#flow-1](./API_DOCUMENTATION_COMPLETE.md#-flow-1-user-menjelajahi--mengadopsi-pohon)
- **Diagram:** [ARCHITECTURE_AND_INTEGRATION.md#adoption-flow](./ARCHITECTURE_AND_INTEGRATION.md#2-order-creation-flow)
- **Code:** [API_INTEGRATION_GUIDE.md#task-5](./API_INTEGRATION_GUIDE.md#task-5-create-order-adoption)
- **Example:** [REAL_WORLD_EXAMPLES.md#full-adopt-flow](./REAL_WORLD_EXAMPLES.md#full-adopt-flow-implementation)
- **Source:** [src/app/adopt/page.tsx](../src/app/adopt/page.tsx)

### 📊 Fitur: Dashboard
- **Dokumentasi:** [API_DOCUMENTATION_COMPLETE.md#flow-2](./API_DOCUMENTATION_COMPLETE.md#-flow-2-user-melihat-dashboard-adopsi)
- **Diagram:** [ARCHITECTURE_AND_INTEGRATION.md#dashboard-flow](./ARCHITECTURE_AND_INTEGRATION.md#4-dashboardadoption-view-flow)
- **Code:** [API_INTEGRATION_GUIDE.md#task-7](./API_INTEGRATION_GUIDE.md#task-7-fetch-dashboard-adoptions)
- **Example:** [REAL_WORLD_EXAMPLES.md#dashboard-with-real-data](./REAL_WORLD_EXAMPLES.md#dashboard-with-real-data)
- **Source:** [src/app/dashboard/page.tsx](../src/app/dashboard/page.tsx)

### 🔍 Fitur: Search
- **Dokumentasi:** [API_DOCUMENTATION_COMPLETE.md#flow-3](./API_DOCUMENTATION_COMPLETE.md#-flow-3-user-search-spesies-dengan-live-search)
- **Diagram:** [ARCHITECTURE_AND_INTEGRATION.md#search-flow](./ARCHITECTURE_AND_INTEGRATION.md#3-search-spesies-dengan-live-search)
- **Code:** [API_INTEGRATION_GUIDE.md#task-2](./API_INTEGRATION_GUIDE.md#task-2-search--filter-species)
- **Example:** [REAL_WORLD_EXAMPLES.md#live-search-implementation](./REAL_WORLD_EXAMPLES.md#live-search-implementation)

### 💳 Fitur: Payment
- **Dokumentasi:** [API_DOCUMENTATION_COMPLETE.md#payment-flow](./API_DOCUMENTATION_COMPLETE.md#3-payment-processing-flow)
- **Code:** [API_INTEGRATION_GUIDE.md#task-6](./API_INTEGRATION_GUIDE.md#task-6-process-payment-with-midtrans)
- **Example:** [REAL_WORLD_EXAMPLES.md#full-adopt-flow](./REAL_WORLD_EXAMPLES.md#full-adopt-flow-implementation)

---

## 📊 API Endpoints Reference

### Species (13+ endpoints)
```
GET    /api/v1/trees/species                    getAllSpecies()
GET    /api/v1/trees/species/:id                getSpeciesById()
GET    /api/v1/trees/species/category/:cat      getSpeciesByCategory()
GET    /api/v1/trees/species?search=...&cat=... searchSpecies()
```

[View all details →](./API_DOCUMENTATION_COMPLETE.md#daftar-endpoint-api)

---

## 🎓 Learning Paths

### Path 1: Beginner (2-3 hours)
- ✅ [API_DOCS_INDEX.md](./API_DOCS_INDEX.md) - Quick Start
- ✅ [API_INTEGRATION_GUIDE.md](./API_INTEGRATION_GUIDE.md) - Task 1-3
- ✅ Try implementing: Fetch species list

### Path 2: Intermediate (4-6 hours)
- ✅ [API_DOCUMENTATION_COMPLETE.md](./API_DOCUMENTATION_COMPLETE.md) - Full reference
- ✅ [API_INTEGRATION_GUIDE.md](./API_INTEGRATION_GUIDE.md) - All tasks
- ✅ Try implementing: Complete adopt feature

### Path 3: Advanced (6-8 hours)
- ✅ [ARCHITECTURE_AND_INTEGRATION.md](./ARCHITECTURE_AND_INTEGRATION.md) - Full system
- ✅ [REAL_WORLD_EXAMPLES.md](./REAL_WORLD_EXAMPLES.md) - All patterns
- ✅ Try implementing: New feature from scratch

---

## 💡 Common Questions Answered

### Q1: Bagaimana cara ambil data dari API?
**A:** [API_INTEGRATION_GUIDE.md#task-1](./API_INTEGRATION_GUIDE.md#task-1-fetch-all-species)
```typescript
const response = await getTree.getAllSpecies();
if (response.success) {
  const species = response.data;
}
```

### Q2: Bagaimana handle errors?
**A:** [API_INTEGRATION_GUIDE.md#error-handling--retry](./API_INTEGRATION_GUIDE.md#error-handling--retry)
```typescript
try {
  // API call
} catch (err) {
  setError(err.message);
}
```

### Q3: Token mana yang harus digunakan?
**A:** `access_token` di localStorage, automatically attached via `apiFetch`

[Read more →](./ARCHITECTURE_AND_INTEGRATION.md#token-management-pattern)

### Q4: Bagaimana optimize search?
**A:** Use debounce (300ms) [API_INTEGRATION_GUIDE.md#task-2](./API_INTEGRATION_GUIDE.md#task-2-search--filter-species)

### Q5: Bagaimana parallel API calls?
**A:** Use `Promise.all()` [ARCHITECTURE_AND_INTEGRATION.md#parallel-requests](./ARCHITECTURE_AND_INTEGRATION.md#parallel-requests)

[More Q&A →](./API_DOCS_INDEX.md#-support--troubleshooting)

---

## 🔧 Troubleshooting

| Issue | Solution |
|-------|----------|
| "API URL is not configured" | Check `.env.local` |
| "401 Unauthorized" | Token missing or expired |
| CORS Error | Backend CORS misconfigured |
| Network timeout | Add retry logic |
| No data showing | Check `response.success` |

[Full troubleshooting guide →](./API_INTEGRATION_GUIDE.md#-troubleshooting)

---

## ✅ Implementation Checklist

Before submitting code:

- [ ] All API calls wrapped in try/catch
- [ ] Loading states managed
- [ ] Error messages user-friendly
- [ ] Token included in auth requests
- [ ] Response structure verified
- [ ] Debounce for search (300ms)
- [ ] Parallel requests where applicable
- [ ] No sensitive data in logs
- [ ] Environment variables configured

[Full checklist →](./API_DOCS_INDEX.md#-quality-checklist)

---

## 📞 Support

### Need Help?
1. Check [API_DOCS_INDEX.md](./API_DOCS_INDEX.md) - Quick navigation
2. Read relevant guide from 5 main docs above
3. Check [Troubleshooting section](./API_INTEGRATION_GUIDE.md#-troubleshooting)
4. Review [source code](../src/) for examples

### Found an Issue?
1. Check [Common Issues table](./API_INTEGRATION_GUIDE.md#-troubleshooting)
2. Search documentation for your error message
3. Check [API_DOCUMENTATION_COMPLETE.md](./API_DOCUMENTATION_COMPLETE.md#error-handling--best-practices)

---

## 📊 Documentation Statistics

| Metric | Count |
|--------|-------|
| Total Documentation Files | 6 |
| Total Pages (est.) | 50+ |
| API Endpoints Documented | 13+ |
| Code Examples | 30+ |
| Diagrams & Flowcharts | 10+ |
| Use Cases Covered | 10+ |
| Design Patterns | 8+ |
| Error Scenarios | 15+ |

---

## 🎯 Key Features of This Documentation

### ✅ Comprehensive
- Semua endpoint documented
- Semua flow dijelaskan
- Semua pattern ditunjukkan

### ✅ Practical
- Code examples siap pakai
- Real-world implementations
- Best practices included

### ✅ Well-Organized
- 5 dokumen terstruktur
- Navigation hub included
- Cross-references throughout

### ✅ Developer-Friendly
- Quick reference sections
- Learning paths provided
- Troubleshooting guide

---

## 📁 File Structure

```
dokumentasi/
├── API_DOCUMENTATION_COMPLETE.md      ← Full technical reference
├── ARCHITECTURE_AND_INTEGRATION.md    ← System design
├── API_INTEGRATION_GUIDE.md           ← Practical guide with code
├── REAL_WORLD_EXAMPLES.md             ← Production examples
├── API_DOCS_INDEX.md                  ← Navigation hub
├── DOCUMENTATION_TO_CODE_MAPPING.md   ← Mapping docs to code
├── API_SUMMARY.md                     ← Summary overview
└── README.md                          ← This file
```

---

## 🚀 Next Steps

1. **Read** → [API_DOCS_INDEX.md](./API_DOCS_INDEX.md) (10 min)
2. **Choose** → Your first feature to implement
3. **Find** → Related documentation above
4. **Code** → Using provided examples
5. **Test** → With your API
6. **Deploy** → When ready

---

## 📝 Documentation Version

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | Feb 21, 2026 | Initial complete documentation |

---

## 🎉 Final Notes

Dokumentasi ini dirancang untuk:
- ✅ Frontend developers implementing features
- ✅ Backend developers understanding integration
- ✅ API designers planning new endpoints
- ✅ Project managers tracking progress
- ✅ New team members onboarding

Semua dokumentasi **siap untuk production** dengan kualitas enterprise-grade.

**Happy coding! 🚀**

---

**Created by:** Pohonku Development Team  
**Last Updated:** February 21, 2026  
**Status:** ✅ Production Ready

---

## 📖 Where to Start?

### I'm a frontend developer
→ Start with [API_INTEGRATION_GUIDE.md](./API_INTEGRATION_GUIDE.md)

### I'm a backend developer
→ Start with [ARCHITECTURE_AND_INTEGRATION.md](./ARCHITECTURE_AND_INTEGRATION.md)

### I'm new to this project
→ Start with [API_DOCS_INDEX.md](./API_DOCS_INDEX.md)

### I need to fix a bug
→ Check [TROUBLESHOOTING](./API_INTEGRATION_GUIDE.md#-troubleshooting)

### I need full API reference
→ Go to [API_DOCUMENTATION_COMPLETE.md](./API_DOCUMENTATION_COMPLETE.md)

---

**Questions?** Check the 5 main documentation files above or search for your topic in [API_DOCS_INDEX.md](./API_DOCS_INDEX.md).
