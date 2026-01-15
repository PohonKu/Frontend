// src/components/ui/TreeCard.tsx
import { Tree } from '@/types';

interface TreeCardProps {
  tree: Tree;
}

export const TreeCard = ({ tree }: TreeCardProps) => {
  return (
    <div className="group border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-all bg-white h-full flex flex-col">
      <div className="h-40 bg-gray-100 relative overflow-hidden shrink-0">
        <img
          src={tree.species?.image_url}
          alt={tree.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm px-2 py-1 rounded text-xs font-semibold shadow-sm">
          {tree.location_block}
        </div>
      </div>
      
      <div className="p-4 flex flex-col flex-grow">
        <h3 className="font-bold text-gray-900 mb-1">{tree.name}</h3>
        <p className="text-sm text-gray-500 mb-3">{tree.species?.scientific_name}</p>

        <div className="mt-auto flex items-center justify-between pt-4 border-t border-gray-50">
          <span className="text-green-700 font-bold">
            Rp {tree.price.toLocaleString('id-ID')}
          </span>
          <span className={`text-xs px-2 py-1 rounded-full capitalize ${
            tree.status === 'available' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
          }`}>
            {tree.status}
          </span>
        </div>
      </div>
    </div>
  );
};