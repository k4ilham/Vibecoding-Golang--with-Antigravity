import api from '../lib/api';
import type { ServiceResponse, SingleServiceResponse, Service } from '../types/service';

export const LaundryService = {
    getServices: async (params?: any) => {
        const response = await api.get<ServiceResponse>('/services', { params });
        return response.data;
    },

    getService: async (id: number) => {
        const response = await api.get<SingleServiceResponse>(`/services/${id}`);
        return response.data;
    },

    createService: async (data: Partial<Service>) => {
        const response = await api.post<SingleServiceResponse>('/services', data);
        return response.data;
    },

    updateService: async (id: number, data: Partial<Service>) => {
        const response = await api.put<SingleServiceResponse>(`/services/${id}`, data);
        return response.data;
    },

    archiveService: async (id: number) => {
        const response = await api.delete<SingleServiceResponse>(`/services/${id}`);
        return response.data;
    },

    restoreService: async (id: number) => {
        const response = await api.post<SingleServiceResponse>(`/services/${id}/restore`);
        return response.data;
    },

    deletePermanently: async (id: number) => {
        const response = await api.delete<SingleServiceResponse>(`/services/${id}/permanent`);
        return response.data;
    }
};
