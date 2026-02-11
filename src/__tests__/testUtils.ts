/**
 * Search Species API Testing Utilities
 * File ini berisi helper functions untuk testing search API
 */

import { getTree } from '@/lib/apiSpecies';

/**
 * Logger utility untuk console output yang lebih rapi
 */
export class TestLogger {
  static section(title: string) {
    console.log('\n' + '='.repeat(60));
    console.log(`📋 ${title}`);
    console.log('='.repeat(60));
  }

  static success(message: string, data?: any) {
    console.log(`✅ ${message}`);
    if (data) console.log(data);
  }

  static error(message: string, error?: any) {
    console.error(`❌ ${message}`);
    if (error) console.error(error);
  }

  static info(message: string, data?: any) {
    console.log(`ℹ️  ${message}`);
    if (data) console.log(data);
  }

  static warning(message: string, data?: any) {
    console.warn(`⚠️  ${message}`);
    if (data) console.warn(data);
  }

  static time(label: string, duration: number) {
    console.log(`⏱️  ${label}: ${duration.toFixed(2)}ms`);
  }
}

/**
 * Validator untuk API response
 */
export class ResponseValidator {
  static validateSearchResponse(response: any): boolean {
    const hasRequiredFields = 
      response.success !== undefined &&
      Array.isArray(response.data) &&
      typeof response.count === 'number' &&
      typeof response.message === 'string';

    if (!hasRequiredFields) {
      TestLogger.error('Response missing required fields');
      return false;
    }

    if (response.data.length !== response.count) {
      TestLogger.warning('Data count mismatch', {
        dataLength: response.data.length,
        count: response.count
      });
    }

    return true;
  }

  static validateSpeciesData(species: any): boolean {
    const requiredFields = ['id', 'name', 'category', 'basePrice'];
    const hasAllFields = requiredFields.every(field => field in species);

    if (!hasAllFields) {
      TestLogger.error('Species data missing required fields', {
        required: requiredFields,
        received: Object.keys(species)
      });
      return false;
    }

    return true;
  }
}

/**
 * Performance tester
 */
export class PerformanceTester {
  static async measure(
    label: string,
    fn: () => Promise<any>
  ): Promise<{ result: any; duration: number }> {
    const startTime = performance.now();
    const result = await fn();
    const endTime = performance.now();
    const duration = endTime - startTime;

    TestLogger.time(label, duration);

    return { result, duration };
  }

  static async measureMultiple(
    label: string,
    fn: () => Promise<any>,
    iterations: number = 5
  ): Promise<{ average: number; min: number; max: number }> {
    const durations: number[] = [];

    TestLogger.info(`Running ${iterations} iterations...`);

    for (let i = 0; i < iterations; i++) {
      const { duration } = await this.measure(`${label} (${i + 1}/${iterations})`, fn);
      durations.push(duration);
    }

    const average = durations.reduce((a, b) => a + b, 0) / durations.length;
    const min = Math.min(...durations);
    const max = Math.max(...durations);

    TestLogger.success(`Performance Summary:`, {
      average: `${average.toFixed(2)}ms`,
      min: `${min.toFixed(2)}ms`,
      max: `${max.toFixed(2)}ms`
    });

    return { average, min, max };
  }
}

/**
 * Comparator untuk membandingkan hasil API
 */
export class ResponseComparator {
  static compare(actual: any, expected: any, fields: string[]): boolean {
    const mismatches: any[] = [];

    fields.forEach(field => {
      if (actual[field] !== expected[field]) {
        mismatches.push({
          field,
          expected: expected[field],
          actual: actual[field]
        });
      }
    });

    if (mismatches.length > 0) {
      TestLogger.error('Mismatches found:', mismatches);
      return false;
    }

    return true;
  }

  static compareArrays(actual: any[], expected: any[]): boolean {
    if (actual.length !== expected.length) {
      TestLogger.warning('Array length mismatch', {
        expected: expected.length,
        actual: actual.length
      });
      return false;
    }

    return true;
  }
}

/**
 * Test data generator
 */
export class TestDataGenerator {
  static generateSearchQueries() {
    return [
      { search: 'Jati', category: undefined },
      { search: undefined, category: 'Tropis' },
      { search: 'Pohon', category: 'Hutan' },
      { search: '', category: '' },
      { search: 'XXXXX', category: undefined }, // No results
    ];
  }

  static generateBulkSpecies(count: number = 5) {
    return Array.from({ length: count }, (_, i) => ({
      name: `Test Species ${i + 1}`,
      latinName: `Species latin ${i + 1}`,
      storyContent: `Story content ${i + 1}`,
      mainImageUrl: `https://example.com/image${i + 1}.jpg`,
      basePrice: 100000 * (i + 1),
      carbonAbsorptionRate: 10 + i,
      description: `Description for species ${i + 1}`,
      availabelStock: 100 + (i * 10),
      category: 'Test'
    }));
  }
}

/**
 * Main Test Runner
 */
export class SearchSpeciesTestRunner {
  private results: any[] = [];

  async runTest(
    testName: string,
    testFn: () => Promise<any>
  ): Promise<any> {
    try {
      TestLogger.section(testName);
      const startTime = performance.now();
      const result = await testFn();
      const duration = performance.now() - startTime;

      this.results.push({
        testName,
        status: 'PASSED',
        duration,
        timestamp: new Date().toISOString()
      });

      return result;
    } catch (error) {
      TestLogger.error(`Test failed: ${testName}`, error);
      this.results.push({
        testName,
        status: 'FAILED',
        error: error instanceof Error ? error.message : String(error),
        timestamp: new Date().toISOString()
      });
      return null;
    }
  }

  async runAllTests() {
    TestLogger.section('🚀 Search Species API - Complete Test Suite');

    // Test 1: Search by name
    await this.runTest('Search by Name', async () => {
      const result = await getTree.searchSpecies('Jati');
      ResponseValidator.validateSearchResponse(result);
      TestLogger.success('Search by name completed', {
        count: result.count,
        message: result.message
      });
      return result;
    });

    // Test 2: Filter by category
    await this.runTest('Filter by Category', async () => {
      const result = await getTree.searchSpecies(undefined, 'Tropis');
      ResponseValidator.validateSearchResponse(result);
      TestLogger.success('Filter by category completed', {
        count: result.count,
        message: result.message
      });
      return result;
    });

    // Test 3: Combined search
    await this.runTest('Combined Search', async () => {
      const result = await getTree.searchSpecies('Pohon', 'Hutan');
      ResponseValidator.validateSearchResponse(result);
      TestLogger.success('Combined search completed', {
        count: result.count,
        message: result.message
      });
      return result;
    });

    // Test 4: Empty search
    await this.runTest('Empty Search', async () => {
      const result = await getTree.searchSpecies();
      ResponseValidator.validateSearchResponse(result);
      TestLogger.success('Empty search completed', {
        count: result.count,
        message: result.message
      });
      return result;
    });

    // Test 5: API Comparison
    await this.runTest('API Comparison', async () => {
      const searchResult = await getTree.searchSpecies();
      const allResult = await getTree.getAllSpecies();

      const isSame = searchResult.count === allResult.count;
      TestLogger.success('API comparison completed', {
        searchCount: searchResult.count,
        allCount: allResult.count,
        isSame
      });
      return { isSame };
    });

    // Test 6: Performance
    await this.runTest('Performance Test', async () => {
      const { average } = await PerformanceTester.measureMultiple(
        'Search Performance',
        () => getTree.searchSpecies('test'),
        3
      );
      return { average };
    });

    // Summary
    this.printSummary();
  }

  private printSummary() {
    console.log('\n' + '='.repeat(60));
    console.log('📊 TEST SUMMARY');
    console.log('='.repeat(60));

    const passed = this.results.filter(r => r.status === 'PASSED').length;
    const failed = this.results.filter(r => r.status === 'FAILED').length;
    const total = this.results.length;

    console.log(`Total Tests: ${total}`);
    console.log(`✅ Passed: ${passed}`);
    console.log(`❌ Failed: ${failed}`);
    console.log(`Success Rate: ${((passed / total) * 100).toFixed(2)}%`);

    console.log('\nDetailed Results:');
    this.results.forEach(result => {
      const status = result.status === 'PASSED' ? '✅' : '❌';
      console.log(
        `${status} ${result.testName} - ${result.duration?.toFixed(2)}ms`
      );
    });

    console.log('\n' + '='.repeat(60));
  }

  getResults() {
    return this.results;
  }
}

/**
 * Export untuk easy access
 */
export const createTestRunner = () => new SearchSpeciesTestRunner();
