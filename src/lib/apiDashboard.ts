import { apiFetch } from './wrapper';



export const dashboardApi = {
    async getDashboard() {
        return apiFetch<any>('/api/v1/adoptions', {
            method: 'GET',
        });
    },

    async getAdoptionDetail(adoptionId: string) {
        return apiFetch<any>(`/api/v1/adoptions/${adoptionId}`, {
            method: 'GET',
        });
    },

    async getStatsAdoption() {
        return apiFetch<any>('/api/v1/adoptions/stats', {
            method: 'GET',
        });
    }
};
