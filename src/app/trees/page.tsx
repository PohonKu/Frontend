import { Tree, Species, TreeCategory } from '@/types';
import TreeCatalogView from '@/features/catalog/TreeCatalogView';
import { getTrees } from '@/services/mockData';
import ClientAuthGuard from '@/components/auth/ClientAuthGuard';
// Map API category string to our TreeCategory/location_block
function mapCategory(apiCategory: string): string {
  const map: Record<string, string> = {
    'Tanaman Perspektif Keistimewaan': 'Perspektif Keistimewaan',
    'Tanaman Toponimi Gunungkidul': 'Toponimi Gunungkidul',
    'Tanaman Native Karst': 'Native Karst',
    'Tanaman Sumbu Filosofi': 'Sumbu Filosofi',
  };
  return map[apiCategory] || apiCategory;
}

// Fetch species from real API and transform into Tree[] shape
async function fetchTreesFromAPI(): Promise<Tree[]> {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://be-production-5612.up.railway.app';
  const res = await fetch(`${apiUrl}/api/v1/trees/species`, {
    next: { revalidate: 60 }, // Cache for 60s on the server
  });

  if (!res.ok) throw new Error(`API returned ${res.status}`);
  const json = await res.json();
  if (!json.success || !Array.isArray(json.data)) throw new Error('Unexpected API shape');

  const trees: Tree[] = [];

  json.data.forEach((species: any) => {
    const totalAvailable = species.availabelStok ?? 0;
    const count = Math.max(totalAvailable, 1); // At least 1 tree per species

    const mappedSpecies: Species = {
      id: species.id,
      name: species.name,
      latinName: species.latinName,
      description: species.description || '',
      storyContent: species.storyContent || '',
      mainImageUrl: species.mainImageUrl || '',
      carbonAbsorptionRate: species.carbonAbsorptionRate || 0,
      availableStock: totalAvailable,
      category: mapCategory(species.category),
    };

    for (let i = 0; i < count; i++) {
      trees.push({
        id: `${species.id}-${i}`,
        name: `${species.name} #${String(i + 1).padStart(2, '0')}`,
        price: parseInt(species.basePrice) || 150000,
        status: i < totalAvailable ? 'available' : 'sold',
        location_block: mapCategory(species.category),
        coords: { lat: 0, lng: 0 },
        species_id: species.id,
        species: mappedSpecies,
      });
    }
  });

  return trees;
}

export default async function TreeListPage() {
  let trees: Tree[];

  try {
    trees = await fetchTreesFromAPI();
  } catch (err) {
    console.warn('Species API not available, falling back to mock data:', err);
    trees = await getTrees();
  }

  return (
    <ClientAuthGuard>
      <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-16 px-4 md:px-8">
        <div className="max-w-7xl mx-auto">
          <TreeCatalogView trees={trees} />
        </div>
      </main>
    </ClientAuthGuard>
  );
}
