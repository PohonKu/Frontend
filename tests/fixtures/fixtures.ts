import { Adoption, Species, themes } from "../../src/features/adopter/model";
import legacyContent from './legacy-content.json';
const archive: Partial<Record<string, Pick<Species, 'latinName' | 'category' | 'story' | 'description' | 'image'>>> = legacyContent;
// Deterministic UI examples, not an inventory, price list or scientific source.
export const speciesFixtures: Species[] = [
  ["sawo-kecik", "Sawo Kecik", 0, 12, 150000],
  ["gayam", "Gayam", 3, 6, 150000],
  ["wuni", "Wuni", 1, 4, 125000],
  ["kepel", "Kepel", 3, 8, 180000],
  ["serut", "Serut", 2, 0, 120000],
  ["kemuning", "Kemuning", 0, null, null],
].map(([id, name, category, stock, price]) => ({
  id: String(id),
  name: String(name),
  latinName: null,
  category: themes[Number(category)],
  stock: stock === null ? null : Number(stock),
  price: price === null ? null : Number(price),
  story: "",
  description: "",
  image: null,
  storyLocale: "id",
  // Only public botanical content is reused; no users/orders or historic inventory.
  ...(archive[String(name)] || {}),
  contentDraft: String(name) in legacyContent,
}));
export const adoptionFixtures: Adoption[] = [
  {
    id: "demo-adoption",
    speciesId: "sawo-kecik",
    speciesName: "Sawo Kecik",
    tag: "Sahabat Hutan",
    serial: "DEMO-SK-001",
    adoptedAt: "2026-04-01T00:00:00Z",
    expiresAt: "2027-04-01T00:00:00Z",
    plantedAt: "2026-04-15T00:00:00Z",
    latitude: null,
    longitude: null,
    certificate: null,
    observations: [
      {
        id: "demo-observation",
        date: "2026-09-01T00:00:00Z",
        photo: null,
        height: 85,
        diameter: 1.8,
        notes:
          "Catatan contoh: pengukuran berkala telah dicatat. Data ini untuk pratinjau antarmuka, bukan observasi lapangan.",
      },
    ],
  },
];
