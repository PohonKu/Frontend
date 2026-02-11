import { Species } from "@/types/spcies";
import SpeciesList from "@/components/SpeciestList";
import {getSpecies}  from "@/lib/api";


export default async function Page() {
  const species = await getSpecies();
  const data = species.data;
  
  console.log("species:", species);
  console.log("isArray:", Array.isArray(species));

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Tree Species</h1>
      <SpeciesList species={data} />
    </div>
  );
}
