import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { CreateTaskForm } from './CreateTaskForm';

describe('CreateTaskForm', () => {
  it('renderiza los campos de título y descripción', () => {
    render(<CreateTaskForm onSubmit={vi.fn()} />);
    expect(screen.getByLabelText('Título')).toBeInTheDocument();
    expect(screen.getByLabelText('Descripción')).toBeInTheDocument();
  });

  it('el botón está deshabilitado si los campos están vacíos', () => {
    render(<CreateTaskForm onSubmit={vi.fn()} />);
    expect(screen.getByRole('button', { name: /crear tarea/i })).toBeDisabled();
  });

  it('llama a onSubmit con los valores del formulario al hacer submit', async () => {
    const onSubmit = vi.fn();
    render(<CreateTaskForm onSubmit={onSubmit} />);

    await userEvent.type(screen.getByLabelText('Título'), 'Mi tarea');
    await userEvent.type(screen.getByLabelText('Descripción'), 'Descripción de prueba');
    await userEvent.click(screen.getByRole('button', { name: /crear tarea/i }));

    expect(onSubmit).toHaveBeenCalledOnce();
    expect(onSubmit).toHaveBeenCalledWith({
      title: 'Mi tarea',
      description: 'Descripción de prueba',
    });
  });

  it('limpia los campos tras un submit exitoso', async () => {
    render(<CreateTaskForm onSubmit={vi.fn()} />);
    const titleInput = screen.getByLabelText('Título');
    const descInput = screen.getByLabelText('Descripción');

    await userEvent.type(titleInput, 'Mi tarea');
    await userEvent.type(descInput, 'Descripción');
    await userEvent.click(screen.getByRole('button', { name: /crear tarea/i }));

    expect(titleInput).toHaveValue('');
    expect(descInput).toHaveValue('');
  });

  it('muestra "Creando..." cuando isLoading es true', () => {
    render(<CreateTaskForm onSubmit={vi.fn()} isLoading={true} />);
    expect(screen.getByRole('button', { name: /creando/i })).toBeInTheDocument();
  });
});
