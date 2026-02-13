import api from '../lib/api';
import type { UserResponse, SingleUserResponse, User } from '../types/user';

export const UserService = {
    getUsers: async (params?: any) => {
        const response = await api.get<UserResponse>('/users', { params });
        return response.data;
    },

    getUser: async (id: number) => {
        const response = await api.get<SingleUserResponse>(`/users/${id}`);
        return response.data;
    },

    createUser: async (data: Partial<User>) => {
        const response = await api.post<SingleUserResponse>('/users', data);
        return response.data;
    },

    updateUser: async (id: number, data: Partial<User>) => {
        const response = await api.put<SingleUserResponse>(`/users/${id}`, data);
        return response.data;
    },

    archiveUser: async (id: number) => {
        const response = await api.delete<SingleUserResponse>(`/users/${id}`);
        return response.data;
    },

    restoreUser: async (id: number) => {
        const response = await api.post<SingleUserResponse>(`/users/${id}/restore`);
        return response.data;
    },

    deletePermanently: async (id: number) => {
        const response = await api.delete<SingleUserResponse>(`/users/${id}/permanent`);
        return response.data;
    }
};
