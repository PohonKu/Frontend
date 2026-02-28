'use client';

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
  return (
    <div className="flex flex-wrap justify-center items-center gap-3 md:gap-4">
      <span className="text-sm font-medium text-gray-500 hidden md:inline-block">Filter:</span>
      {CLUSTERS.map((cluster) => {
        const isActive = activeCluster === cluster;
        const count = counts?.[cluster] || 0;

        return (
          <button
            key={cluster}
            onClick={() => onClusterChange(cluster)}
            className={`
              relative px-5 py-2.5 rounded-full font-medium text-sm whitespace-nowrap
              transition-all duration-200 ease-out border
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
  );
}
