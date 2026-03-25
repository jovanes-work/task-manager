import { apiClient } from '@/lib/apiClient';
import type { Task, CreateTaskDto, UpdateTaskDto } from '@/types/tasks.types';

export const taskService = {
  getAll: (): Promise<Task[]> => apiClient.get('/tasks'),
  getById: (id: string): Promise<Task> => apiClient.get(`/tasks/${id}`),
  create: (dto: CreateTaskDto): Promise<Task> => apiClient.post('/tasks', dto),
  update: (id: string, dto: UpdateTaskDto): Promise<Task> =>
    apiClient.patch(`/tasks/${id}`, dto),
  delete: (id: string): Promise<void> => apiClient.delete(`/tasks/${id}`),
};
