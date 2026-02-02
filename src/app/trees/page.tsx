import { getTrees } from '@/services/mockData';
import TreeCatalogView from '@/features/catalog/TreeCatalogView';

export default async function TreeListPage() {
  // Fetch raw tree data server-side
  const trees = await getTrees();

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-16 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        <TreeCatalogView trees={trees} />
      </div>
    </main>
  );
}
