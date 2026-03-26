import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { LoginForm } from './LoginForm';

const mockOnSubmit = vi.fn();

function buildProps(overrides: Partial<React.ComponentProps<typeof LoginForm>> = {}) {
  return { onSubmit: mockOnSubmit, isLoading: false, error: null, ...overrides };
}

describe('LoginForm', () => {
  beforeEach(() => {
    mockOnSubmit.mockClear();
  });

  it('renders email and password fields', () => {
    render(<LoginForm {...buildProps()} />);
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
    expect(screen.getByLabelText('Contraseña')).toBeInTheDocument();
  });

  it('renders the submit button', () => {
    render(<LoginForm {...buildProps()} />);
    expect(screen.getByRole('button', { name: 'Ingresar' })).toBeInTheDocument();
  });

  it('shows API error when error prop is provided', () => {
    render(<LoginForm {...buildProps({ error: 'Email o contraseña incorrectos' })} />);
    expect(screen.getByText('Email o contraseña incorrectos')).toBeInTheDocument();
  });

  it('shows loading state when isLoading is true', () => {
    render(<LoginForm {...buildProps({ isLoading: true })} />);
    expect(screen.getByRole('button', { name: 'Ingresando...' })).toBeDisabled();
  });

  it('shows validation error when email is empty on submit', async () => {
    render(<LoginForm {...buildProps()} />);
    await userEvent.click(screen.getByRole('button', { name: 'Ingresar' }));
    expect(await screen.findByText('El email es obligatorio')).toBeInTheDocument();
    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it('shows validation error when email format is invalid', async () => {
    render(<LoginForm {...buildProps()} />);
    await userEvent.type(screen.getByLabelText('Email'), 'not-an-email');
    await userEvent.click(screen.getByRole('button', { name: 'Ingresar' }));
    expect(await screen.findByText('Ingresá un email válido')).toBeInTheDocument();
    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it('shows validation error when password is empty on submit', async () => {
    render(<LoginForm {...buildProps()} />);
    await userEvent.type(screen.getByLabelText('Email'), 'test@example.com');
    await userEvent.click(screen.getByRole('button', { name: 'Ingresar' }));
    expect(await screen.findByText('La contraseña es obligatoria')).toBeInTheDocument();
    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it('shows validation error when password is too short', async () => {
    render(<LoginForm {...buildProps()} />);
    await userEvent.type(screen.getByLabelText('Email'), 'test@example.com');
    await userEvent.type(screen.getByLabelText('Contraseña'), '123');
    await userEvent.click(screen.getByRole('button', { name: 'Ingresar' }));
    expect(
      await screen.findByText('La contraseña debe tener al menos 6 caracteres'),
    ).toBeInTheDocument();
    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it('calls onSubmit with credentials when form is valid', async () => {
    render(<LoginForm {...buildProps()} />);
    await userEvent.type(screen.getByLabelText('Email'), 'test@example.com');
    await userEvent.type(screen.getByLabelText('Contraseña'), 'password123');
    await userEvent.click(screen.getByRole('button', { name: 'Ingresar' }));
    expect(mockOnSubmit).toHaveBeenCalledWith({
      email: 'test@example.com',
      password: 'password123',
    });
  });

  it('clears field error when user starts typing', async () => {
    render(<LoginForm {...buildProps()} />);
    await userEvent.click(screen.getByRole('button', { name: 'Ingresar' }));
    expect(await screen.findByText('El email es obligatorio')).toBeInTheDocument();
    await userEvent.type(screen.getByLabelText('Email'), 'a');
    expect(screen.queryByText('El email es obligatorio')).not.toBeInTheDocument();
  });
});
