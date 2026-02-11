/**
 * Testing Search Species API
 * File ini digunakan untuk test endpoint searchSpecies
 * 
 * Jalankan test dengan: npm test (jika menggunakan Jest)
 * atau jalankan file ini langsung untuk manual testing
 */

import { getTree } from '@/lib/apiSpecies';

/**
 * Test 1: Search berdasarkan nama
 */
async function testSearchByName() {
  console.log('\n=== TEST 1: Search berdasarkan nama ===');
  try {
    console.log('Searching for "Jati"...');
    const result = await getTree.searchSpecies('Jati');
    
    console.log('✅ Success:', {
      success: result.success,
      count: result.count,
      message: result.message,
      results: result.data.length > 0 ? result.data.length : 'No data'
    });
    
    if (result.data.length > 0) {
      console.log('First result:', result.data[0]);
    }
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

/**
 * Test 2: Search berdasarkan kategori
 */
async function testSearchByCategory() {
  console.log('\n=== TEST 2: Search berdasarkan kategori ===');
  try {
    console.log('Searching category "Tropis"...');
    const result = await getTree.searchSpecies(undefined, 'Tropis');
    
    console.log('✅ Success:', {
      success: result.success,
      count: result.count,
      message: result.message,
      results: result.data.length > 0 ? result.data.length : 'No data'
    });
    
    if (result.data.length > 0) {
      console.log('Sample results:', result.data.slice(0, 2));
    }
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

/**
 * Test 3: Search dengan nama dan kategori
 */
async function testSearchCombined() {
  console.log('\n=== TEST 3: Search kombinasi nama dan kategori ===');
  try {
    console.log('Searching for "Pohon" in category "Hutan"...');
    const result = await getTree.searchSpecies('Pohon', 'Hutan');
    
    console.log('✅ Success:', {
      success: result.success,
      count: result.count,
      message: result.message,
      results: result.data.length > 0 ? result.data.length : 'No data'
    });
    
    if (result.data.length > 0) {
      console.log('Sample results:', result.data.slice(0, 2));
    }
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

/**
 * Test 4: Search dengan nama kosong
 */
async function testEmptySearch() {
  console.log('\n=== TEST 4: Search dengan parameter kosong ===');
  try {
    console.log('Calling searchSpecies()...');
    const result = await getTree.searchSpecies();
    
    console.log('✅ Success:', {
      success: result.success,
      count: result.count,
      message: result.message,
      results: result.data.length > 0 ? result.data.length : 'No data'
    });
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

/**
 * Test 5: Search dengan nama yang tidak ada
 */
async function testSearchNoResults() {
  console.log('\n=== TEST 5: Search dengan hasil kosong ===');
  try {
    console.log('Searching for "XXXXXXXXXXXX" (tidak ada)...');
    const result = await getTree.searchSpecies('XXXXXXXXXXXX');
    
    console.log('✅ Success:', {
      success: result.success,
      count: result.count,
      message: result.message,
      results: result.data.length
    });
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

/**
 * Test 6: Compare getAllSpecies dengan searchSpecies
 */
async function testCompareApis() {
  console.log('\n=== TEST 6: Perbandingan getAllSpecies vs searchSpecies ===');
  try {
    // Get all
    console.log('Fetching getAllSpecies...');
    const allResult = await getTree.getAllSpecies();
    
    // Search with no filter (should be same as getAllSpecies)
    console.log('Fetching searchSpecies dengan no filter...');
    const searchResult = await getTree.searchSpecies();
    
    console.log('✅ Comparison:', {
      getAllSpecies_count: allResult.count,
      searchSpecies_count: searchResult.count,
      isSame: allResult.count === searchResult.count
    });
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

/**
 * Test 7: Performance test
 */
async function testPerformance() {
  console.log('\n=== TEST 7: Performance test ===');
  try {
    const startTime = performance.now();
    const result = await getTree.searchSpecies('test');
    const endTime = performance.now();
    
    console.log('✅ Performance:', {
      duration: `${(endTime - startTime).toFixed(2)}ms`,
      resultsCount: result.count
    });
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

/**
 * Run all tests
 */
async function runAllTests() {
  console.log('🚀 Starting API Search Species Tests...');
  console.log('================================');
  
  await testSearchByName();
  await testSearchByCategory();
  await testSearchCombined();
  await testEmptySearch();
  await testSearchNoResults();
  await testCompareApis();
  await testPerformance();
  
  console.log('\n================================');
  console.log('✅ All tests completed!');
}

// Export untuk digunakan di file lain
export {
  testSearchByName,
  testSearchByCategory,
  testSearchCombined,
  testEmptySearch,
  testSearchNoResults,
  testCompareApis,
  testPerformance,
  runAllTests
};

// Uncomment baris di bawah untuk menjalankan tests saat file ini di-import
// (Pastikan hanya di dev mode)
// if (typeof window === 'undefined' && process.env.NODE_ENV === 'development') {
//   runAllTests();
// }
