import { create } from 'zustand';
import type { Task } from '@/types/tasks.types';

interface TaskStore {
  items: Task[];
  selectedId: string | null;
  setItems: (items: Task[]) => void;
  addItem: (item: Task) => void;
  updateItem: (item: Task) => void;
  removeItem: (id: string) => void;
  selectItem: (id: string | null) => void;
}

export const useTaskStore = create<TaskStore>((set) => ({
  items: [],
  selectedId: null,
  setItems: (items) => set({ items }),
  addItem: (item) => set((state) => ({ items: [...state.items, item] })),
  updateItem: (item) =>
    set((state) => ({
      items: state.items.map((i) => (i.id === item.id ? item : i)),
    })),
  removeItem: (id) =>
    set((state) => ({
      items: state.items.filter((i) => i.id !== id),
    })),
  selectItem: (id) => set({ selectedId: id }),
}));
