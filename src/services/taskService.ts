import { apiClient } from '@/lib/apiClient';
import type { Task } from '@/types';

export interface CreateTaskDto {
  title: string;
  description: string;
}

export interface UpdateTaskDto {
  title?: string;
  description?: string;
  status?: Task['status'];
}

export const taskService = {
  getAll: (): Promise<Task[]> => apiClient.get('/tasks'),
  getById: (id: string): Promise<Task> => apiClient.get(`/tasks/${id}`),
  create: (dto: CreateTaskDto): Promise<Task> => apiClient.post('/tasks', dto),
  update: (id: string, dto: UpdateTaskDto): Promise<Task> =>
    apiClient.patch(`/tasks/${id}`, dto),
  delete: (id: string): Promise<void> => apiClient.delete(`/tasks/${id}`),
};
