import axios from 'axios';
import { Item } from '../types/item';

const api = axios.create({
  baseURL: `http://localhost:3001`,
});

export const getItems = () => api.get<Item[]>('/items');
export const getItem = (id: number) => api.get<Item>(`/items/${id}`);
export const createItem = (item: Omit<Item, 'id'>) => api.post<Item>('/items', item);
export const updateItem = (id: number, item: Partial<Item>) => api.put<Item>(`/items/${id}`, item);
export const deleteItem = (id: number) => api.delete<{ success: boolean }>(`/items/${id}`);

export const createSocialPost = (formData: FormData) => 
  api.post<{ success: boolean }>('/social-post/all', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });