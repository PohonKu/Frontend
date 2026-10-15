import { request } from '@/features/adopter/data';
// Compatibility envelope for the existing admin screens; transport/auth live in one client.
export async function apiFetch<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  return { success: true, data: await request(endpoint, options) } as T;
}
