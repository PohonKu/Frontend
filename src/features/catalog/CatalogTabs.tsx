'use client';

import { useState, useRef, useEffect } from 'react';
import { ChevronRight } from 'lucide-react';
import { TreeCluster } from './types';

interface CatalogTabsProps {
  activeCluster: TreeCluster;
  onClusterChange: (cluster: TreeCluster) => void;
  counts?: Partial<Record<TreeCluster, number>>;
}

const CLUSTERS: TreeCluster[] = [
  'All',
  'Perspektif Keistimewaan',
  'Toponimi Gunungkidul',
  'Native Karst',
  'Sumbu Filosofi',
];

export default function CatalogTabs({ activeCluster, onClusterChange, counts }: CatalogTabsProps) {
  const [canScrollRight, setCanScrollRight] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);

  const checkScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      // 5px buffer for rounding errors
      setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 5);
    }
  };

  useEffect(() => {
    checkScroll();
    window.addEventListener('resize', checkScroll);
    return () => window.removeEventListener('resize', checkScroll);
  }, [counts, activeCluster]);

  return (
    <div className="w-full -mx-4 px-4 md:mx-0 md:px-0 relative">
      {/* Scrollable Container */}
      <div 
        ref={scrollRef}
        onScroll={checkScroll}
        className="flex flex-nowrap md:flex-wrap justify-start md:justify-center items-center gap-3 md:gap-4 overflow-x-auto pb-2 md:pb-0 scrollbar-hide snap-x" 
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        <span className="text-sm font-medium text-gray-500 hidden md:inline-block shrink-0">Filter:</span>
      {CLUSTERS.map((cluster) => {
        const isActive = activeCluster === cluster;
        const count = counts?.[cluster] || 0;

        return (
          <button
            key={cluster}
            onClick={() => onClusterChange(cluster)}
            className={`
              relative px-5 py-2.5 rounded-full font-medium text-sm whitespace-nowrap
              transition-all duration-200 ease-out border shrink-0 snap-center
              ${isActive
                ? 'bg-[#1A581E] border-[#1A581E] text-white shadow-md'
                : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300 hover:text-gray-900 hover:bg-gray-50'
              }
              focus:outline-none focus:ring-4 focus:ring-[#1A581E]/20
              transform active:scale-95 flex items-center gap-1.5
            `}
          >
            <span>{cluster}</span>
            {count > 0 && (
              <span className={isActive ? 'text-white/90' : 'text-gray-500'}>
                ({count})
              </span>
            )}
          </button>
        );
      })}
      </div>
      {/* Right fade gradient for indicating scrollability on mobile */}
      <div 
        className={`absolute right-0 top-0 bottom-2 w-16 bg-gradient-to-l from-white via-white/80 to-transparent pointer-events-none md:hidden flex items-center justify-end pr-1 transition-opacity duration-300 ${
          canScrollRight ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <ChevronRight className="w-5 h-5 text-gray-400 animate-pulse" />
      </div>
    </div>
  );
}
