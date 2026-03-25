import { renderHook, act, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useTasks } from './useTasks';
import { taskService } from '@/services/taskService';
import type { Task } from '@/types/tasks.types';

const makeTask = (overrides: Partial<Task> = {}): Task => ({
  id: '1',
  title: 'Tarea de prueba',
  description: 'Descripción de prueba',
  status: 'pending',
  createdAt: '2024-01-01T00:00:00.000Z',
  ...overrides,
});

const { mockStore } = vi.hoisted(() => {
  const mockStore = {
    items: [] as Task[],
    setItems: vi.fn(),
    addItem: vi.fn(),
    updateItem: vi.fn(),
    removeItem: vi.fn(),
  };
  return { mockStore };
});

vi.mock('@/store/taskStore', () => ({
  useTaskStore: () => mockStore,
}));

vi.mock('@/services/taskService', () => ({
  taskService: {
    getAll: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
  },
}));

describe('useTasks', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockStore.items = [];
    vi.mocked(taskService.getAll).mockResolvedValue([]);
  });

  it('carga las tareas al montar y limpia el loading', async () => {
    const tasks = [makeTask()];
    vi.mocked(taskService.getAll).mockResolvedValue(tasks);

    const { result } = renderHook(() => useTasks());

    expect(result.current.isLoading).toBe(true);
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(mockStore.setItems).toHaveBeenCalledWith(tasks);
  });

  it('expone error si getAll falla', async () => {
    vi.mocked(taskService.getAll).mockRejectedValue(new Error('Error de red'));

    const { result } = renderHook(() => useTasks());

    await waitFor(() => expect(result.current.error).toBe('Error de red'));
    expect(result.current.isLoading).toBe(false);
  });

  it('agrega la tarea al store al crear', async () => {
    const newTask = makeTask({ id: '2', title: 'Nueva tarea' });
    vi.mocked(taskService.create).mockResolvedValue(newTask);

    const { result } = renderHook(() => useTasks());
    await waitFor(() => expect(result.current.isLoading).toBe(false));

    await act(async () => {
      await result.current.create({ title: 'Nueva tarea', description: 'Descripción' });
    });

    expect(taskService.create).toHaveBeenCalledWith({
      title: 'Nueva tarea',
      description: 'Descripción',
    });
    expect(mockStore.addItem).toHaveBeenCalledWith(newTask);
  });

  it('expone error si create falla', async () => {
    vi.mocked(taskService.create).mockRejectedValue(new Error('Error al crear'));

    const { result } = renderHook(() => useTasks());
    await waitFor(() => expect(result.current.isLoading).toBe(false));

    await act(async () => {
      await result.current.create({ title: 'T', description: 'D' });
    });

    expect(result.current.error).toBe('Error al crear');
  });

  it('marca la tarea como done al completar', async () => {
    const updatedTask = makeTask({ id: '1', status: 'done' });
    vi.mocked(taskService.update).mockResolvedValue(updatedTask);

    const { result } = renderHook(() => useTasks());
    await waitFor(() => expect(result.current.isLoading).toBe(false));

    await act(async () => {
      await result.current.complete('1');
    });

    expect(taskService.update).toHaveBeenCalledWith('1', { status: 'done' });
    expect(mockStore.updateItem).toHaveBeenCalledWith(updatedTask);
  });

  it('elimina la tarea del store al borrar', async () => {
    vi.mocked(taskService.delete).mockResolvedValue(undefined as unknown as void);

    const { result } = renderHook(() => useTasks());
    await waitFor(() => expect(result.current.isLoading).toBe(false));

    await act(async () => {
      await result.current.remove('1');
    });

    expect(taskService.delete).toHaveBeenCalledWith('1');
    expect(mockStore.removeItem).toHaveBeenCalledWith('1');
  });

  it('expone error si remove falla', async () => {
    vi.mocked(taskService.delete).mockRejectedValue(new Error('Error al eliminar'));

    const { result } = renderHook(() => useTasks());
    await waitFor(() => expect(result.current.isLoading).toBe(false));

    await act(async () => {
      await result.current.remove('1');
    });

    expect(result.current.error).toBe('Error al eliminar');
  });

  it('refetch vuelve a llamar getAll', async () => {
    const { result } = renderHook(() => useTasks());
    await waitFor(() => expect(result.current.isLoading).toBe(false));

    await act(async () => {
      await result.current.refetch();
    });

    expect(taskService.getAll).toHaveBeenCalledTimes(2);
  });
});
