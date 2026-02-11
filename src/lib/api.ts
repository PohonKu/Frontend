const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export async function getSpecies() {
  const res = await fetch(`${BASE_URL}/api/v1/trees/species`, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch species");
  }

  return res.json();
}
