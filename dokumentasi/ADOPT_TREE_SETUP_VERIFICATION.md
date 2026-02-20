# ✅ Setup Verification Checklist

Gunakan checklist ini untuk memverifikasi bahwa implementasi fitur adopsi pohon sudah sempurna!

---

## 📁 1. File Verification

### Frontend Files Check
```bash
# Jalankan command ini untuk verify semua file sudah ada:
ls -la src/app/adopt/
ls -la src/components/adopt/
ls -la src/lib/useMidtrans.ts
```

**Expected Output:**
```
✅ src/app/adopt/page.tsx
✅ src/app/adopt/layout.tsx
✅ src/app/adopt/adopt.css
✅ src/components/adopt/AdoptSpeciesCard.tsx
✅ src/components/adopt/OrderModal.tsx
✅ src/components/adopt/PaymentModal.tsx
✅ src/lib/useMidtrans.ts
```

### Checklist:
- [ ] `src/app/adopt/page.tsx` exists
- [ ] `src/app/adopt/layout.tsx` exists
- [ ] `src/app/adopt/adopt.css` exists
- [ ] `src/components/adopt/AdoptSpeciesCard.tsx` exists
- [ ] `src/components/adopt/OrderModal.tsx` exists
- [ ] `src/components/adopt/PaymentModal.tsx` exists
- [ ] `src/lib/useMidtrans.ts` exists
- [ ] `src/lib/apiPayment.ts` exists (sudah ada sebelumnya)

---

## 🔧 2. Environment Variables Check

### Verify .env.local File
```bash
# Check environment variables
cat .env.local | grep NEXT_PUBLIC
```

**Expected:**
```
✅ NEXT_PUBLIC_API_URL=http://localhost:2000
✅ NEXT_PUBLIC_MIDTRANS_CLIENT_KEY=your-key
```

### Checklist:
- [ ] `.env.local` file exists
- [ ] `NEXT_PUBLIC_API_URL` is set
- [ ] `NEXT_PUBLIC_MIDTRANS_CLIENT_KEY` is set
- [ ] Backend URL is correct
- [ ] Midtrans key is not empty

---

## 📦 3. Dependencies Check

### Verify Installed Packages
```bash
# Check if required packages installed
npm list next
npm list react
npm list lucide-react
```

**Expected:**
```
✅ next@latest
✅ react@latest
✅ lucide-react@latest (atau icons library lain)
```

### Checklist:
- [ ] next installed
- [ ] react installed
- [ ] react-dom installed
- [ ] image optimization working
- [ ] icons library available

---

## 🚀 4. Development Server Check

### Start Dev Server
```bash
npm run dev
```

**Expected Output:**
```
> next dev

  ▲ Next.js 14.x.x
  - Local:        http://localhost:3000
  - Environments: .env.local

✓ Ready in 2.5s
```

### Checklist:
- [ ] Dev server starts without error
- [ ] Port 3000 available
- [ ] No compilation errors
- [ ] Console shows "Ready"

---

## 🌐 5. Browser Navigation Check

### Test Route Access
```bash
# Browser: http://localhost:3000/adopt
```

**Expected:**
- [ ] Page loads without 404 error
- [ ] Shows title "🌱 Adopsi Pohon Gunungkidul"
- [ ] Filter section visible (search + category)
- [ ] Grid area visible (might be empty if no data)
- [ ] Navbar shows "Adopt a Tree" button

### Checklist:
- [ ] Route `/adopt` accessible
- [ ] Page title correct
- [ ] Filter section rendered
- [ ] No 404 errors
- [ ] No React errors
- [ ] Layout looks good

---

## 📡 6. Backend API Check

### Test Backend Connection
```bash
# Check if backend API is responding
curl -X GET "http://localhost:2000/api/v1/species" \
  -H "Authorization: Bearer test-token"
```

**Expected Response:**
```json
{
  "success": true,
  "data": [ /* species array */ ]
}
```

### Checklist:
- [ ] Backend server running
- [ ] API endpoint `/api/v1/species` working (200 status)
- [ ] Response has `success` and `data` fields
- [ ] Data contains species with required fields:
  - [ ] id
  - [ ] name
  - [ ] latinName
  - [ ] category
  - [ ] basePrice
  - [ ] mainImageUrl

---

## 📊 7. Console Verification

### Check Browser Console (F12 → Console Tab)

**Expected (Good):**
```javascript
// No errors (no red text)
// Warnings OK (yellow text)
// Info messages OK (blue text)
```

**Checklist:**
- [ ] No red error messages
- [ ] No undefined variable errors
- [ ] No API 404 errors
- [ ] No CORS errors
- [ ] No module not found errors

### Specific Checks:
```javascript
// Open browser console and run:

// 1. Check API URL
console.log(process.env.NEXT_PUBLIC_API_URL); 
// Expected: "http://localhost:2000"

// 2. Check if window.snap available (after Midtrans loads)
console.log(window.snap); 
// Expected: undefined initially, then becomes object

// 3. Check localStorage (after login)
console.log(localStorage.getItem('access_token'));
// Expected: token string or null
```

**Checklist:**
- [ ] API URL correct in console
- [ ] window.snap loads (check after page load)
- [ ] access_token available (after login)

---

## 🧪 8. Component Test

### Test Adopt Button
```bash
1. Load http://localhost:3000/adopt
2. Cari tombol "🌱 Adopsi Sekarang"
3. Klik tombol
```

**Expected:**
- [ ] OrderModal muncul
- [ ] Modal shows species details
- [ ] Form input "Nama di Tag" visible
- [ ] No JavaScript errors
- [ ] Backdrop (overlay) visible

### Test Filter
```bash
1. Buka dropdown kategori
2. Pilih kategori
3. Tunggu hasil filter
```

**Expected:**
- [ ] Dropdown opens/closes smoothly
- [ ] Results update after selection
- [ ] Count updates
- [ ] No API errors in Network tab

### Test Search
```bash
1. Ketik di search input
2. Tunggu 300ms (debounce)
3. Lihat hasil
```

**Expected:**
- [ ] Search updates grid
- [ ] Real-time filtering works
- [ ] No multiple API calls (debounce working)
- [ ] Results relevant

---

## 🔐 9. Security Check

### Verify Authentication
```bash
1. Not logged in → Try to adopt
2. Expected: Either login first or API returns 401
```

**Checklist:**
- [ ] Token passed in Authorization header
- [ ] Backend validates token
- [ ] 401 error if token missing
- [ ] Sensitive data not exposed in frontend

### Verify Input Validation
```bash
1. Open modal
2. Try submit without name
3. Expected: Error message or disabled button
```

**Checklist:**
- [ ] Form validation works
- [ ] Error messages shown
- [ ] No XSS vulnerability (sanitize inputs)
- [ ] Max length enforced (100 chars)

---

## 💳 10. Midtrans Setup Check

### Verify Midtrans Configuration
```bash
# Check if Midtrans script loads
# Open DevTools → Network tab
# Look for: app.sandbox.midtrans.com/snap/snap.js
```

**Expected:**
- [ ] Script status 200 (loaded successfully)
- [ ] window.snap object available
- [ ] No CORS errors
- [ ] Client key set correctly

### Checklist:
- [ ] Midtrans account created
- [ ] Client key obtained
- [ ] Client key in environment variable
- [ ] Script loading without errors
- [ ] snap object accessible

---

## ⚡ 11. Performance Check

### Measure Page Load Time
```bash
# Open DevTools → Network tab
# Reload page
# Check "Finish" time
```

**Expected:**
```
✅ Finish time: < 3 seconds
✅ DOMContentLoaded: < 2 seconds
✅ DOM size: reasonable (not bloated)
```

### Checklist:
- [ ] Page loads < 3s
- [ ] No slow network requests
- [ ] Images lazy loaded
- [ ] No large bundle sizes
- [ ] CSS loading properly

---

## 📱 12. Responsive Design Check

### Test Mobile View
```bash
DevTools → Toggle device toolbar (Ctrl+Shift+M)
```

**Mobile (< 640px):**
- [ ] Grid shows 1 column
- [ ] Buttons clickable (not too small)
- [ ] Text readable
- [ ] Modal fits screen
- [ ] No horizontal scroll

**Tablet (640-1024px):**
- [ ] Grid shows 2 columns
- [ ] Layout looks balanced
- [ ] All elements visible
- [ ] Modal readable

**Desktop (> 1024px):**
- [ ] Grid shows 3 columns
- [ ] Hover effects work
- [ ] Spacing good
- [ ] Full functionality

### Checklist:
- [ ] Mobile responsive OK
- [ ] Tablet responsive OK
- [ ] Desktop responsive OK
- [ ] No layout broken
- [ ] Touch targets adequate

---

## 🎨 13. UI/UX Check

### Visual Verification
```bash
1. Open http://localhost:3000/adopt
2. Visual check:
```

**Checklist:**
- [ ] Colors match design (green theme)
- [ ] Fonts readable
- [ ] Spacing consistent
- [ ] Buttons obvious/clickable
- [ ] Loading spinners visible
- [ ] Error messages clear
- [ ] Hover effects smooth
- [ ] No broken images

---

## 🗂️ 14. File Structure Check

### Verify Code Organization
```bash
# Check imports work correctly
grep -r "from '@/components/adopt" src/
grep -r "from '@/lib" src/
```

**Expected:**
- [ ] All imports use @ alias
- [ ] No circular imports
- [ ] No missing files
- [ ] Path resolution correct

### Checklist:
- [ ] Import paths correct
- [ ] No "module not found" errors
- [ ] File structure organized
- [ ] Components modular

---

## 📚 15. Documentation Check

### Verify Docs Complete
```bash
# Check documentation files exist
ls -la dokumentasi/ADOPT_TREE_*.md
```

**Expected Files:**
```
✅ ADOPT_TREE_INDEX.md
✅ ADOPT_TREE_SUMMARY.md
✅ ADOPT_TREE_QUICK_START.md
✅ ADOPT_TREE_DOCUMENTATION.md
✅ ADOPT_TREE_TESTING_GUIDE.md
✅ ADOPT_TREE_USER_GUIDE.md
✅ ADOPT_TREE_IMPLEMENTATION.md
```

### Checklist:
- [ ] All doc files exist
- [ ] Index file created
- [ ] Quick start guide complete
- [ ] Technical doc complete
- [ ] Testing guide complete
- [ ] User guide complete
- [ ] Implementation doc complete

---

## ✅ Final Verification Checklist

### Backend Ready:
- [ ] API /api/v1/species working
- [ ] API /api/v1/orders working
- [ ] API /api/v1/orders/{id}/payment working
- [ ] Database has species data
- [ ] Authentication working

### Frontend Ready:
- [ ] All 8 files created
- [ ] Dev server running
- [ ] Route /adopt accessible
- [ ] Components render without error
- [ ] Filters working
- [ ] Modal functionality working

### Environment Ready:
- [ ] .env.local configured
- [ ] API URL correct
- [ ] Midtrans key set
- [ ] Backend running
- [ ] Database populated

### Testing Ready:
- [ ] Page loads without errors
- [ ] Components visible
- [ ] Filters functional
- [ ] Modals work
- [ ] No console errors
- [ ] Network requests OK

### Documentation Ready:
- [ ] All docs created
- [ ] Index file complete
- [ ] Quick start written
- [ ] Testing guide complete
- [ ] User guide complete

---

## 🎯 Success Criteria

**ALL of the following must be TRUE:**

✅ All 8 frontend files exist and compile without error
✅ Page `/adopt` loads and displays correctly
✅ Filter functionality works (category + search)
✅ Adopt button opens modal
✅ Form validates input
✅ API calls work (no 404/500 errors)
✅ Loading/error states visible
✅ Responsive design working
✅ No console errors
✅ Midtrans script loads
✅ All 7 documentation files created
✅ Environment variables set correctly

**If ALL are TRUE:** ✅ SETUP SUCCESSFUL - Ready for testing!

---

## 🚀 Next Steps After Verification

If all verification checks pass:

1. ✅ Run full testing suite (ADOPT_TREE_TESTING_GUIDE.md)
2. ✅ Fix any issues found
3. ✅ Deploy to production
4. ✅ Announce to users
5. ✅ Monitor for issues

---

## 📞 Verification Support

If verification fails:
1. Check specific section above for details
2. Review error message in console
3. Check documentation for solutions
4. Compare with working setup

---

**Verification Date**: _____________
**Verified By**: ____________________
**Status**: [ ] PASS  [ ] FAIL
**Issues Found**: ____________________

---

**Good luck with verification! 🎉**
