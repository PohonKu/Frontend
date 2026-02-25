const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

class GetTree {
  async getAllSpecies() {
    const res = await fetch(`${BASE_URL}/api/v1/trees/species`, {
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error("Failed to fetch species");
    }

    return res.json();
  }

  async getSpeciesById(id: string) {
    const res = await fetch(`${BASE_URL}/api/v1/trees/species/${id}`, {
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error("Failed to fetch species by id");
    }

    return res.json();
  }

  async getSpeciesByCategory(category: string) {
    const res = await fetch(`${BASE_URL}/api/v1/trees/species/category/${category}`, {
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error("Failed to fetch species by id");
    }

    return res.json();
  }

  async searchSpecies(searchName?: string, category?: string) {
    const params = new URLSearchParams();

    if (searchName) {
      params.append('search', searchName);
    }

    if (category) {
      params.append('category', category);
    }

    const queryString = params.toString();
    const url = queryString
      ? `${BASE_URL}/api/v1/trees/species?${queryString}`
      : `${BASE_URL}/api/v1/trees/species`;

    const res = await fetch(url, {
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error("Failed to search species");
    }

    return res.json();
  }
}

export const getTree = new GetTree();
