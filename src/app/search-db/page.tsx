'use client';

import React from 'react';
import ServerSideSearchSpecies from '@/components/ServerSideSearchSpecies';

/**
 * Search DB Page (Server-Side Search Demo)
 * 
 * Halaman demonstrasi pencarian dengan server-side filtering.
 * Fitur utama:
 * - Search dilakukan di backend (database query)
 * - Tidak perlu load semua data ke frontend dulu
 * - Lebih efisien untuk dataset besar (1000+ items)
 * - Debounce untuk mengurangi API calls saat user mengetik
 */
export default function SearchDBPage() {
  const [results, setResults] = React.useState<any[]>([]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white py-8 px-4">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl font-bold">🔍 Server-Side Search Species</h1>
          <p className="text-blue-100 mt-2">
            Pencarian dengan database query - ideal untuk dataset besar
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Comparison Box */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Server-Side (This Page) */}
          <div className="bg-blue-50 border-l-4 border-blue-500 p-6 rounded-lg">
            <h3 className="font-bold text-blue-900 mb-3">
              ⚡ Server-Side Search (Halaman Ini)
            </h3>
            <ul className="text-blue-800 text-sm space-y-2">
              <li>✅ Query dilakukan di database backend</li>
              <li>✅ Hanya hasil yang match dikirim ke FE</li>
              <li>✅ Hemat bandwidth & memory</li>
              <li>✅ Lebih aman (filtering di server)</li>
              <li>✅ Cocok untuk 1000+ items</li>
              <li>✅ Scalable untuk dataset besar</li>
            </ul>
          </div>

          {/* Client-Side (Live Search) */}
          <div className="bg-green-50 border-l-4 border-green-500 p-6 rounded-lg">
            <h3 className="font-bold text-green-900 mb-3">
              ⚙️ Client-Side Search (Live Search)
            </h3>
            <ul className="text-green-800 text-sm space-y-2">
              <li>✅ Load semua data saat load halaman</li>
              <li>✅ Filter di browser (instant response)</li>
              <li>✅ Tidak ada API call saat filter</li>
              <li>✅ Offline ready</li>
              <li>✅ Cocok untuk 100-500 items</li>
              <li>✅ Kurang cocok untuk dataset besar</li>
            </ul>
          </div>
        </div>

        {/* Server-Side Search Component */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          <ServerSideSearchSpecies onResultsUpdate={setResults} />
        </div>

        {/* Results Count */}
        {results.length > 0 && (
          <div className="mt-6 bg-white rounded-lg shadow-md p-6">
            <p className="text-sm text-gray-600">
              Total hasil yang ditampilkan: <span className="font-bold text-blue-600">{results.length}</span> spesies
            </p>
          </div>
        )}

    

        {/* Tips Box */}
        <div className="mt-8 bg-yellow-50 border-l-4 border-yellow-500 p-6 rounded-lg">
          <h3 className="font-bold text-yellow-900 mb-3">💡 Tips Penggunaan</h3>
          <ul className="text-yellow-800 text-sm space-y-2">
            <li>
              ✓ <strong>Mulai dengan live search (client-side)</strong> untuk
              UX yang cepat
            </li>
            <li>
              ✓ <strong>Migrasi ke server-side search</strong> jika dataset
              bertambah besar
            </li>
            <li>
              ✓ <strong>Gunakan pagination</strong> untuk dataset sangat besar
              (100,000+)
            </li>
            <li>
              ✓ <strong>Implement caching</strong> di frontend untuk results
              yang sering dicari
            </li>
            <li>
              ✓ <strong>Monitor API performance</strong> di backend (lihat
              query time)
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
