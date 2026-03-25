import { useState, useEffect, useCallback } from 'react';
import { taskService } from '@/services/taskService';
import { useTaskStore } from '@/store/taskStore';
import type { CreateTaskDto } from '@/types/tasks.types';

export function useTasks() {
  const { items, setItems, addItem, updateItem, removeItem } = useTaskStore();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAll = useCallback(async (): Promise<void> => {
    setIsLoading(true);
    setError(null);
    try {
      const tasks = await taskService.getAll();
      setItems(tasks);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar las tareas');
    } finally {
      setIsLoading(false);
    }
  }, [setItems]);

  const create = useCallback(
    async (dto: CreateTaskDto): Promise<void> => {
      setError(null);
      try {
        const newTask = await taskService.create(dto);
        addItem(newTask);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error al crear la tarea');
      }
    },
    [addItem],
  );

  const complete = useCallback(
    async (id: string): Promise<void> => {
      setError(null);
      try {
        const updated = await taskService.update(id, { status: 'done' });
        updateItem(updated);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error al completar la tarea');
      }
    },
    [updateItem],
  );

  const remove = useCallback(
    async (id: string): Promise<void> => {
      setError(null);
      try {
        await taskService.delete(id);
        removeItem(id);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error al eliminar la tarea');
      }
    },
    [removeItem],
  );

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  return { tasks: items, isLoading, error, create, complete, remove, refetch: fetchAll };
}
