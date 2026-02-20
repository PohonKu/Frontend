import { apiFetch } from './wraper';

interface CreateOrderPayload {
  speciesId: string;
  nameOnTag: string;
}

export const orderApi = {
  async createOrder(data: CreateOrderPayload) {
    return apiFetch<any>('/api/v1/orders', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async createPayment(orderId: string) {
    return apiFetch<any>(`/api/v1/orders/${orderId}/payment`, {
      method: 'POST',
    });
  },

  async getPendingPayments(orderId: string) {
    return apiFetch<any>(`/api/v1/orders/${orderId}`, {
      method: 'GET',
    });
  }
};
