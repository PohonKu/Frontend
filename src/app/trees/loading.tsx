import React from 'react';

export default function Loading() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-16 px-4 md:px-8">
      <div className="max-w-7xl mx-auto w-full animate-pulse">
        
        {/* Header Skeleton */}
        <div className="mb-8 md:mb-10 text-center px-4 flex flex-col items-center">
          <div className="h-10 sm:h-12 md:h-14 bg-gray-200 rounded-lg w-64 md:w-96 mb-3 md:mb-4"></div>
          <div className="h-4 sm:h-5 bg-gray-100 rounded-lg w-full max-w-2xl"></div>
          <div className="h-4 sm:h-5 bg-gray-100 rounded-lg w-3/4 max-w-lg mt-2"></div>
        </div>

        {/* Control Bar (Search & Filters) Skeleton */}
        <div className="mb-8 md:mb-10 px-4 flex flex-col items-center gap-5 md:gap-6 w-full max-w-7xl mx-auto">
          {/* Search Bar Skeleton */}
          <div className="w-full max-w-[600px] h-12 md:h-14 bg-gray-100 rounded-full shrink-0"></div>
          
          {/* Tabs Skeleton */}
          <div className="flex flex-wrap justify-center gap-2">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-10 w-24 sm:w-32 bg-gray-100 rounded-full"></div>
            ))}
          </div>
        </div>

        {/* Results Info Skeleton */}
        <div className="mb-4 md:mb-6 px-4 flex items-center justify-between">
          <div className="h-4 w-48 bg-gray-200 rounded"></div>
        </div>

        {/* Grid Skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8 px-4 md:px-0">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 h-[420px] flex flex-col">
              {/* Image box */}
              <div className="h-48 bg-gray-200 w-full shrink-0"></div>
              
              {/* Content box */}
              <div className="p-5 flex flex-col flex-1">
                {/* Title and subtitle */}
                <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-100 rounded w-1/2 mb-6"></div>
                
                {/* Price and Stock row */}
                <div className="flex justify-between items-center mb-6">
                  <div className="space-y-2">
                    <div className="h-3 bg-gray-100 rounded w-12"></div>
                    <div className="h-5 bg-gray-200 rounded w-24"></div>
                  </div>
                  <div className="space-y-2 flex flex-col items-end">
                    <div className="h-3 bg-gray-100 rounded w-16"></div>
                    <div className="h-5 bg-gray-200 rounded w-12"></div>
                  </div>
                </div>

                {/* Button Skeleton */}
                <div className="h-12 bg-gray-200 rounded-lg w-full mt-auto"></div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </main>
  );
}
