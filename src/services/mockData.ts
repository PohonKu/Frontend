// src/services/mockData.ts
import { Tree, TreeSpecies, TreeCategory } from '@/types';

// --- 1. RAW DATA FROM EXCEL ---
// Source: Tanaman Tema_Tahura Bunder.xlsx

const CLUSTER_1: string[] = [ // Perspektif Keistimewaan
  "Nangka", "Drini", "Kemuning", "Secang", "Sawo Kecik", "Kepel", "Ande-ande lumut",
  "Jambu Kluthuk", "Mangir", "Manggis", "Gadung", "Nogosari", "Krisan", "Pucung",
  "Menur", "Preh", "Beringin", "Cengkeh", "Awar-awar", "Kelapa", "Alang-alang",
  "Jambe", "Aren", "Asam Jawa", "Mentaok", "Timoho", "Ploso", "Tanjung", "Gayam", "Salak Pondoh"
];

const CLUSTER_2: string[] = [ // Toponimi Gunungkidul
  "Belimbing", "Klepu", "Pakel", "Pucung/Kluwek", "Jambe", "Winang", "Ploso", "Pace",
  "Mojo", "Kelor", "Kulwo", "Wuni", "Dondong", "Langsep", "Kluwih", "Joho", "Kweni",
  "Waru", "Salam", "Wareng", "Gebang", "Le Gundi", "Dadap", "Wangon", "Munggur",
  "Soga/Sogo", "Ngepoh", "Sambeng", "Kemloka"
];

const CLUSTER_3: string[] = [ // Native Karst
  "Bulu", "Ilat-Ilat", "Serut", "Preh", "Lo", "Bendo", "Rempelas", "Ipik", "Kepil",
  "Tebelo Pusuh", "Mojo", "Pulai", "Bintaos", "Asam Jawa", "Kutu", "Winong", "Kepuh",
  "Dlingsem", "Talok Lanang", "Laban"
];

const CLUSTER_4: string[] = [ // Sumbu Filosofi
  "Asam Jawa", "Tanjung", "Pakel", "Kweni", "Pelem Cempora", "Soka", "Jambu Dersana",
  "Gayam", "Kepel", "Kemuning", "Keben", "Sawo Kecik", "Jambu Klampok Arum", "Kantil"
];

// --- 2. GENERATORS (Smart Deduplication) ---

const generateSmartSpecies = (): TreeSpecies[] => {
  const allSpeciesMap = new Map<string, TreeSpecies>();

  // Helper to process list and assign category
  // If a tree appears in multiple lists, the FIRST category it appears in will be used (Primary Category)
  const processList = (list: string[], category: TreeCategory) => {
    list.forEach((name) => {
      const cleanName = name.trim();

      if (!allSpeciesMap.has(cleanName)) {
        allSpeciesMap.set(cleanName, {
          id: `sp-${cleanName.toLowerCase().replace(/[^\w\s]/gi, '').replace(/\s+/g, '-')}`,
          name: cleanName,
          scientific_name: `Scientific name of ${cleanName}`, // Placeholder
          description: `Tanaman ${cleanName} merupakan bagian penting dari ekosistem ${category}.`,
          story_content: `
            <div class="space-y-4">
              <p class="text-lg leading-relaxed">
                <strong>${cleanName}</strong> memiliki makna mendalam dalam konteks <em>${category}</em>.
                Tanaman ini dipilih karena nilai ekologis dan filosofisnya yang kuat bagi lingkungan sekitar.
              </p>
              <p>
                Di habitat aslinya, pohon ini berfungsi sebagai penyeimbang ekosistem, 
                menyediakan oksigen, dan menjadi rumah bagi berbagai biodiversitas lokal.
              </p>
            </div>
          `,
          image_url: `https://placehold.co/600x400/228B22/FFFFFF/png?text=${encodeURIComponent(cleanName)}`,
          co2_absorption: Math.floor(Math.random() * 40) + 10,
          category: category,
        });
      }
    });
  };

  // Priority Order for Category Assignment
  processList(CLUSTER_1, 'Perspektif Keistimewaan');
  processList(CLUSTER_4, 'Sumbu Filosofi');
  processList(CLUSTER_3, 'Native Karst');
  processList(CLUSTER_2, 'Toponimi Gunungkidul');

  return Array.from(allSpeciesMap.values());
};

const MOCK_SPECIES = generateSmartSpecies();

const generateTrees = (): Tree[] => {
  const trees: Tree[] = [];
  let treeCounter = 1;

  MOCK_SPECIES.forEach((species) => {
    // Generate exactly 1 tree per species
    trees.push({
      id: `tree-${treeCounter}`,
      name: species.name, // Use 'species.name' only, no suffix
      price: 150000,
      status: Math.random() > 0.8 ? 'sold' : 'available',
      location_block: species.category,
      coords: {
        lat: -7.0 + (Math.random() * 0.1),
        lng: 110.0 + (Math.random() * 0.1),
        x_percent: Math.floor(Math.random() * 80) + 10,
        y_percent: Math.floor(Math.random() * 80) + 10,
      },
      species_id: species.id,
      species: species,
    });
    treeCounter++;
  });

  return trees;
};

const MOCK_TREES = generateTrees();

// --- 3. SERVICES ---

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const getTrees = async (): Promise<Tree[]> => {
  await delay(500);
  return MOCK_TREES;
};

export const getTreeById = async (id: string): Promise<Tree | undefined> => {
  await delay(300);
  return MOCK_TREES.find((tree) => tree.id === id);
};

export const getSpecies = async (): Promise<TreeSpecies[]> => {
  await delay(300);
  return MOCK_SPECIES;
};

export const getCategories = async (): Promise<string[]> => {
  return [
    'Perspektif Keistimewaan',
    'Toponimi Gunungkidul',
    'Native Karst',
    'Sumbu Filosofi'
  ];
};