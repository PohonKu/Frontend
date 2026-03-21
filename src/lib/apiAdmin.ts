import { apiFetch } from './wrapper';

// ─── Tree Update ──────────────────────────────────────────────────────────────

export interface TreeUpdatePayload {
  photoUrl: string;
  heightCm: number;
  diameterCm: number;
  co2AbsorbedTotal: number;
  adminNotes?: string;
}

export interface TreeUpdatePatchPayload {
  photoUrl?: string;
  heightCm?: number;
  diameterCm?: number;
  co2AbsorbedTotal?: number;
  adminNotes?: string;
}

// ─── Species ──────────────────────────────────────────────────────────────────

export interface SpeciesPayload {
  name: string;
  latinName: string;
  description: string;
  storyContent: string;
  mainImageUrl: string;
  basePrice: number;
  carbonAbsorptionRate: number;
  availabelStok: number;
  category: string;
}

export interface SpeciesPatchPayload {
  name?: string;
  latinName?: string;
  description?: string;
  storyContent?: string;
  mainImageUrl?: string;
  basePrice?: number;
  carbonAbsorptionRate?: number;
  availabelStok?: number;
  category?: string;
}

// ─── API object ───────────────────────────────────────────────────────────────

export const adminApi = {

  // ── Tree updates ──────────────────────────────────────────────────────────

  async createTreeUpdate(treeId: string, body: TreeUpdatePayload) {
    return apiFetch<any>(`/api/v1/admin/trees/${treeId}/updates`, {
      method: 'POST',
      body: JSON.stringify(body),
    });
  },

  async getUpdatesByTreeId(treeId: string) {
    return apiFetch<any>(`/api/v1/admin/trees/${treeId}/updates`, {
      method: 'GET',
    });
  },

  async updateTreeUpdate(treeId: string, updateId: string, body: TreeUpdatePatchPayload) {
    return apiFetch<any>(`/api/v1/admin/trees/${treeId}/updates/${updateId}`, {
      method: 'PATCH',
      body: JSON.stringify(body),
    });
  },

  async deleteTreeUpdate(treeId: string, updateId: string) {
    return apiFetch<any>(`/api/v1/admin/trees/${treeId}/updates/${updateId}`, {
      method: 'DELETE',
    });
  },

  // ── Trees ─────────────────────────────────────────────────────────────────

  async getAllTrees() {
    return apiFetch<any>(`/api/v1/trees/admin/all`, {
      method: 'GET',
    });
  },

  // ── Species ───────────────────────────────────────────────────────────────

  async getAllSpecies() {
    return apiFetch<any>(`/api/v1/trees/species`, {
      method: 'GET',
    });
  },

  async createSpecies(body: SpeciesPayload) {
    return apiFetch<any>(`/api/v1/trees/species`, {
      method: 'POST',
      body: JSON.stringify(body),
    });
  },

  async updateSpecies(id: string, body: SpeciesPatchPayload) {
    return apiFetch<any>(`/api/v1/trees/species/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(body),
    });
  },

  // ── Orders ────────────────────────────────────────────────────────────────

  async getAllOrder() {
    return apiFetch<any>(`/api/v1/orders/admin/all`, {
      method: 'GET',
    });
  },

  // ── Adoptions ─────────────────────────────────────────────────────────────

  async getAllAdoption() {
    return apiFetch<any>(`/api/v1/adoptions/admin/all`, {
      method: 'GET',
    });
  },
};