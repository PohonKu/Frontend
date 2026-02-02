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
    <div className="flex flex-wrap gap-3 items-center">
      <span className="text-sm font-medium text-gray-700 mr-2">Filter:</span>
      {CLUSTERS.map((cluster) => {
        const isActive = activeCluster === cluster;
        const count = counts?.[cluster] || 0;

        return (
          <button
            key={cluster}
            onClick={() => onClusterChange(cluster)}
            className={`
              relative px-5 py-2.5 rounded-full font-medium text-sm
              transition-all duration-200 ease-out
              ${isActive
                ? 'bg-[#1A581E] text-white shadow-md'
                : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200 hover:border-[#1A581E]/30'
              }
              focus:outline-none focus:ring-2 focus:ring-[#1A581E] focus:ring-offset-2
              transform active:scale-95
            `}
          >
            {cluster}
            {count > 0 && (
              <span
                className={`
                  ml-2 text-xs px-2 py-0.5 rounded-full
                  ${isActive ? 'bg-white/20' : 'bg-gray-100'}
                `}
              >
                {count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
