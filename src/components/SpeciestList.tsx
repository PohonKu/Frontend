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
          <p className="font-semibold">{item.name}</p>
          {item.description && (
            <p className="text-sm text-gray-500">{item.description}</p>
          )}
        </div>
      ))}
    </div>
  );
}
