// src/app/page.tsx
import { getTrees, getCategories } from '@/services/mockData';
import { CatalogView } from '@/modules/catalog/CatalogView';

export default async function Home() {
  const trees = await getTrees();
  const categories = await getCategories();

  return (
    <main className="container mx-auto p-4 md:p-8">
      {/* SECTION 1: Header */}
      <div className="mb-8 p-6 bg-green-50 rounded-xl border border-green-100">
        <h1 className="text-3xl font-bold text-green-900 mb-2">PohonKu Marketplace</h1>
        <p className="text-green-800">Welcome to the tree adoption platform.</p>
      </div>
      {/* Pastikan div Header ditutup di atas! */}

      {/* SECTION 2: Catalog */}
      {/* CatalogView adalah elemen block (div), jadi aman di sini */}
      <CatalogView trees={trees} categories={categories} />
    </main>
  );
}