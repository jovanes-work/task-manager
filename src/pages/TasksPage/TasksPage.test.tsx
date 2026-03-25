import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { TasksPage } from './TasksPage';

vi.mock('@/hooks/useTasks', () => ({
  useTasks: () => ({
    tasks: [],
    isLoading: false,
    error: null,
    create: vi.fn(),
    complete: vi.fn(),
    remove: vi.fn(),
    refetch: vi.fn(),
  }),
}));

describe('TasksPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renderiza el título de la página', () => {
    render(<TasksPage />);
    expect(screen.getByRole('heading', { name: /mis tareas/i })).toBeInTheDocument();
  });

  it('renderiza el formulario de creación', () => {
    render(<TasksPage />);
    expect(screen.getByLabelText('Título')).toBeInTheDocument();
  });

  it('renderiza la lista vacía cuando no hay tareas', () => {
    render(<TasksPage />);
    expect(screen.getByText(/no hay tareas/i)).toBeInTheDocument();
  });
});
