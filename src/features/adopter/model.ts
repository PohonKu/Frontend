export type Locale = "id" | "en";
export type Duration = 1 | 3;
export type PaymentStatus =
  | "PENDING"
  | "PAID"
  | "FAILED"
  | "CANCELLED"
  | "EXPIRED"
  | "UNKNOWN";
export type Species = {
  id: string;
  name: string;
  latinName: string | null;
  category: string;
  story: string;
  description: string;
  image: string | null;
  price: number | null;
  stock: number | null;
  storyLocale: Locale;
  contentDraft?: boolean;
};
export type Draft = { speciesId: string; duration: Duration; tag: string };
export type Order = Omit<Draft, 'duration'> & {
  duration: Duration | null;
  id: string;
  number: string;
  total: number | null;
  status: PaymentStatus;
  createdAt: string;
  expiresAt: string | null;
};
export type Observation = {
  id: string;
  date: string;
  photo: string | null;
  height: number | null;
  diameter: number | null;
  notes: string;
};
export type Adoption = {
  id: string;
  speciesId: string;
  speciesName: string;
  tag: string;
  serial: string | null;
  adoptedAt: string;
  expiresAt: string | null;
  plantedAt: string | null;
  latitude: number | null;
  longitude: number | null;
  certificate: string | null;
  observations: Observation[];
};
export type User = { id: string; name: string; email: string };
export const themes = [
  "Perspektif Keistimewaan",
  "Toponimi Gunungkidul",
  "Native Karst",
  "Sumbu Filosofi",
] as const;
export const money = (amount: number, locale: Locale) =>
  new Intl.NumberFormat(locale === "id" ? "id-ID" : "en-US", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(amount);
export const estimate = (price: number, duration: Duration) =>
  Math.round(price * (duration === 3 ? 1.5 : 1));
export const safeReturn = (path: string | null, locale: Locale): string =>
  path && (/^\/(id|en)(\/|\?|$)/.test(path) || /^\/admin\/(addSpecies|updateTree|daftarCustomer|riwayatOrder|daftarrAdopsi)(\?|$)/.test(path)) && !/[\\\r\n]/.test(path)
    ? path
    : `/${locale}/dashboard`;
// Render as React text, never as HTML. Keep paragraph boundaries and discard executable content.
export const storyText = (html: string) =>
  html
    .replace(/<(script|style)\b[^>]*>[\s\S]*?<\/\1>/gi, "")
    .replace(/<\/(p|div|li|h[1-6])\s*>/gi, "\n\n")
    .replace(/<br\s*\/?\s*>/gi, "\n")
    .replace(/<[^>]*>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .trim();
export const safeUrl = (value: unknown): string | null =>
  typeof value === "string" &&
  (/^https:\/\//i.test(value) || /^\/(?!\/)/.test(value))
    ? value
    : null;
type RecordData = Record<string, unknown>;
export const record = (value: unknown): RecordData =>
  value && typeof value === "object" && !Array.isArray(value)
    ? (value as RecordData)
    : {};
const str = (value: unknown) => (typeof value === "string" ? value : "");
const num = (value: unknown) =>
  value !== null &&
  value !== undefined &&
  value !== "" &&
  Number.isFinite(Number(value))
    ? Number(value)
    : null;
const date = (value: unknown) =>
  typeof value === "string" && Number.isFinite(Date.parse(value))
    ? value
    : null;
export function mapSpecies(raw: unknown): Species {
  const s = record(raw);
  if (!s.id || !s.name) throw new Error("INVALID_DATA");
  return {
    id: str(s.id),
    name: str(s.name),
    latinName: str(s.latinName) || null,
    category: str(s.category),
    story: storyText(str(s.storyContent)),
    description: storyText(str(s.description)),
    image: safeUrl(s.mainImageUrl),
    price: num(s.basePrice),
    stock: num(s.availabelStok),
    storyLocale: s.storyLocale === "en" ? "en" : "id",
  };
}
export function mapOrder(raw: unknown): Order {
  const o = record(raw),
    item = record(o.orderItems);
  if (!o.id) throw new Error("INVALID_DATA");
  const status = ["PENDING", "PAID", "FAILED", "CANCELLED", "EXPIRED"].includes(
    str(o.paymentStatus),
  )
    ? (str(o.paymentStatus) as PaymentStatus)
    : "UNKNOWN";
  return {
    id: str(o.id),
    number: str(o.orderNumber),
    speciesId: str(item.speciesId),
    duration: item.durationYears === 3 ? 3 : item.durationYears === 1 ? 1 : null,
    tag: str(item.nameOnTag),
    total: num(o.totalAmount),
    status,
    createdAt: date(o.createdAt) || "",
    expiresAt: date(o.expiredAt),
  };
}
export function mapAdoption(raw: unknown): Adoption {
  const a = record(raw),
    s = record(a.species),
    t = record(a.tree);
  if (!a.id && !a.adoptionId) throw new Error("INVALID_DATA");
  const updates =
    t.updates ?? t.treeUpdates ?? (t.latestUpdate ? [t.latestUpdate] : []);
  return {
    id: str(a.id || a.adoptionId),
    speciesId: str(a.speciesId || s.id),
    speciesName: str(s.name),
    tag: str(a.nameOnTag),
    serial: str(t.serialNumber) || null,
    adoptedAt: date(a.adoptedAt) || "",
    expiresAt: date(a.expiresAt),
    plantedAt: date(t.plantedAt),
    latitude: num(t.latitude),
    longitude: num(t.longitude),
    certificate: safeUrl(a.certificateUrl),
    observations: (Array.isArray(updates) ? updates : [])
      .map((value) => {
        const u = record(value);
        return {
          id: str(u.id),
          date: date(u.date || u.createdAt) || "",
          photo: safeUrl(u.photoUrl),
          height: num(u.heightCm),
          diameter: num(u.diameterCm),
          notes: str(u.adminNotes),
        };
      })
      .sort((a, b) => b.date.localeCompare(a.date)),
  };
}
