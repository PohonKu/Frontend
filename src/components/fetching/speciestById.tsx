"use client";

import { Species } from "@/types/spcies";

type Props = {
  species: Species;
};

export default function SpeciesDetail({ species }: Props) {
  return (
    <div className="p-6 border rounded-xl shadow-sm space-y-4">
      <h2 className="text-2xl font-bold">{species.name}</h2>

      {species.mainImageUrl && (
        <img
          src={species.mainImageUrl}
          alt={species.name}
          className="w-full max-w-md rounded-lg object-cover"
        />
      )}

      {species.description && (
        <p className="text-gray-600">{species.description}</p>
      )}
    </div>
  );
}
