"use client";

import { Species } from "@/types/spcies";

type Props = {
  species: Species[];
};

export default function SpeciesList({ species }: Props) {
  return (
    <div className="space-y-2">
      {species.map((item) => (
        <div
          key={item.id}
          className="p-4 border rounded-lg shadow-sm hover:bg-gray-50"
        >
          {/** ambil nama */}
          <p className="font-semibold">{item.name}</p>
          {/** ambil description */}
          {item.description && (
            <p className="text-sm text-gray-500">{item.description}</p>
          )}
          {item.storyContent && (
            <p className="text-sm text-gray-500">{item.storyContent}</p>
          )}
          <p>
            {item.id}
          </p>
          <p>
            {item.basePrice}
          </p>
        </div>
      ))}
    </div>
  );
}