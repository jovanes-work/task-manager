import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import type { Task } from '@/types/tasks.types';
import { TaskList } from './TaskList';

const TASKS: Task[] = [
  {
    id: '1',
    title: 'Tarea uno',
    description: 'Descripción uno',
    status: 'pending',
    createdAt: '2026-03-24T10:00:00.000Z',
  },
  {
    id: '2',
    title: 'Tarea dos',
    description: 'Descripción dos',
    status: 'done',
    createdAt: '2026-03-25T10:00:00.000Z',
  },
];

describe('TaskList', () => {
  const onComplete = vi.fn();
  const onDelete = vi.fn();

  it('muestra un mensaje de carga cuando isLoading es true', () => {
    render(
      <TaskList
        tasks={[]}
        isLoading={true}
        error={null}
        onComplete={onComplete}
        onDelete={onDelete}
      />,
    );
    expect(screen.getByText('Cargando tareas...')).toBeInTheDocument();
  });

  it('muestra el error cuando existe', () => {
    render(
      <TaskList
        tasks={[]}
        isLoading={false}
        error="Error de red"
        onComplete={onComplete}
        onDelete={onDelete}
      />,
    );
    expect(screen.getByText('Error de red')).toBeInTheDocument();
  });

  it('muestra mensaje vacío cuando no hay tareas', () => {
    render(
      <TaskList
        tasks={[]}
        isLoading={false}
        error={null}
        onComplete={onComplete}
        onDelete={onDelete}
      />,
    );
    expect(screen.getByText(/no hay tareas/i)).toBeInTheDocument();
  });

  it('renderiza todas las tareas', () => {
    render(
      <TaskList
        tasks={TASKS}
        isLoading={false}
        error={null}
        onComplete={onComplete}
        onDelete={onDelete}
      />,
    );
    expect(screen.getByText('Tarea uno')).toBeInTheDocument();
    expect(screen.getByText('Tarea dos')).toBeInTheDocument();
  });

  it('llama a onDelete al eliminar una tarea', async () => {
    render(
      <TaskList
        tasks={TASKS}
        isLoading={false}
        error={null}
        onComplete={onComplete}
        onDelete={onDelete}
      />,
    );
    await userEvent.click(screen.getAllByRole('button', { name: /eliminar/i })[0]);
    expect(onDelete).toHaveBeenCalledWith('1');
  });
});
