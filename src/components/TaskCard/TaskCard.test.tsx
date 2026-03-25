import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { Task } from '@/types';
import { TaskCard } from './TaskCard';

const TASK_PENDING: Task = {
  id: '1',
  title: 'Escribir tests',
  description: 'Cubrir los componentes principales con Vitest',
  status: 'pending',
  createdAt: '2026-03-24T10:00:00.000Z',
};

const TASK_IN_PROGRESS: Task = { ...TASK_PENDING, id: '2', status: 'in-progress' };
const TASK_DONE: Task = { ...TASK_PENDING, id: '3', status: 'done' };

describe('TaskCard', () => {
  const onComplete = vi.fn();
  const onDelete = vi.fn();

  beforeEach(() => {
    onComplete.mockClear();
    onDelete.mockClear();
  });

  it('renderiza el título y la descripción', () => {
    render(<TaskCard task={TASK_PENDING} onComplete={onComplete} onDelete={onDelete} />);

    expect(screen.getByText('Escribir tests')).toBeInTheDocument();
    expect(screen.getByText('Cubrir los componentes principales con Vitest')).toBeInTheDocument();
  });

  it('muestra el badge "Pendiente" para status pending', () => {
    render(<TaskCard task={TASK_PENDING} onComplete={onComplete} onDelete={onDelete} />);
    expect(screen.getByText('Pendiente')).toBeInTheDocument();
  });

  it('muestra el badge "En progreso" para status in-progress', () => {
    render(<TaskCard task={TASK_IN_PROGRESS} onComplete={onComplete} onDelete={onDelete} />);
    expect(screen.getByText('En progreso')).toBeInTheDocument();
  });

  it('muestra el badge "Completada" para status done', () => {
    render(<TaskCard task={TASK_DONE} onComplete={onComplete} onDelete={onDelete} />);
    expect(screen.getByText('Completada')).toBeInTheDocument();
  });

  it('llama a onComplete con el id al hacer clic en Completar', async () => {
    render(<TaskCard task={TASK_PENDING} onComplete={onComplete} onDelete={onDelete} />);
    await userEvent.click(screen.getByRole('button', { name: /marcar.*completada/i }));
    expect(onComplete).toHaveBeenCalledOnce();
    expect(onComplete).toHaveBeenCalledWith('1');
  });

  it('llama a onDelete con el id al hacer clic en Eliminar', async () => {
    render(<TaskCard task={TASK_PENDING} onComplete={onComplete} onDelete={onDelete} />);
    await userEvent.click(screen.getByRole('button', { name: /eliminar/i }));
    expect(onDelete).toHaveBeenCalledOnce();
    expect(onDelete).toHaveBeenCalledWith('1');
  });

  it('deshabilita el botón Completar cuando la tarea ya está done', () => {
    render(<TaskCard task={TASK_DONE} onComplete={onComplete} onDelete={onDelete} />);
    expect(screen.getByRole('button', { name: /marcar.*completada/i })).toBeDisabled();
  });

  it('muestra la fecha de creación formateada', () => {
    render(<TaskCard task={TASK_PENDING} onComplete={onComplete} onDelete={onDelete} />);
    expect(screen.getByRole('time')).toBeInTheDocument();
  });
});
