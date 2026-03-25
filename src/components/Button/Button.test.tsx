import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { ButtonProps } from './Button';
import { Button } from './Button';

const makeButtonProps = (overrides: Partial<ButtonProps> = {}): ButtonProps => ({
  children: 'Aceptar',
  variant: 'primary',
  size: 'md',
  isLoading: false,
  ...overrides,
});

describe('Button', () => {
  const onClick = vi.fn();

  beforeEach(() => {
    onClick.mockClear();
  });

  it('renderiza el texto del botón', () => {
    render(<Button {...makeButtonProps()} />);
    expect(screen.getByRole('button', { name: /aceptar/i })).toBeInTheDocument();
  });

  it('llama onClick al hacer click', async () => {
    const user = userEvent.setup();
    render(<Button {...makeButtonProps({ onClick })} />);
    await user.click(screen.getByRole('button', { name: /aceptar/i }));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('no llama onClick cuando está disabled', async () => {
    const user = userEvent.setup();
    render(<Button {...makeButtonProps({ onClick, disabled: true })} />);
    await user.click(screen.getByRole('button', { name: /aceptar/i }));
    expect(onClick).not.toHaveBeenCalled();
  });

  it('no llama onClick cuando isLoading es true', async () => {
    const user = userEvent.setup();
    render(<Button {...makeButtonProps({ onClick, isLoading: true })} />);
    await user.click(screen.getByRole('button'));
    expect(onClick).not.toHaveBeenCalled();
  });

  it('muestra aria-busy cuando isLoading es true', () => {
    render(<Button {...makeButtonProps({ isLoading: true })} />);
    expect(screen.getByRole('button')).toHaveAttribute('aria-busy', 'true');
  });

  it('el botón está deshabilitado cuando isLoading es true', () => {
    render(<Button {...makeButtonProps({ isLoading: true })} />);
    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('el botón está deshabilitado cuando disabled es true', () => {
    render(<Button {...makeButtonProps({ disabled: true })} />);
    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('aplica className adicional', () => {
    render(<Button {...makeButtonProps({ className: 'extra-class' })} />);
    expect(screen.getByRole('button')).toHaveClass('extra-class');
  });

  it('pasa atributos HTML nativos al botón', () => {
    render(<Button {...makeButtonProps({ type: 'submit', 'aria-label': 'Enviar formulario' })} />);
    const btn = screen.getByRole('button', { name: /enviar formulario/i });
    expect(btn).toHaveAttribute('type', 'submit');
  });

  it('renderiza variante secondary', () => {
    render(<Button {...makeButtonProps({ variant: 'secondary', children: 'Cancelar' })} />);
    expect(screen.getByRole('button', { name: /cancelar/i })).toBeInTheDocument();
  });

  it('renderiza variante danger', () => {
    render(<Button {...makeButtonProps({ variant: 'danger', children: 'Eliminar' })} />);
    expect(screen.getByRole('button', { name: /eliminar/i })).toBeInTheDocument();
  });

  it('renderiza variante ghost', () => {
    render(<Button {...makeButtonProps({ variant: 'ghost', children: 'Ver más' })} />);
    expect(screen.getByRole('button', { name: /ver más/i })).toBeInTheDocument();
  });

  it('renderiza tamaño sm', () => {
    render(<Button {...makeButtonProps({ size: 'sm', children: 'Pequeño' })} />);
    expect(screen.getByRole('button', { name: /pequeño/i })).toBeInTheDocument();
  });

  it('renderiza tamaño lg', () => {
    render(<Button {...makeButtonProps({ size: 'lg', children: 'Grande' })} />);
    expect(screen.getByRole('button', { name: /grande/i })).toBeInTheDocument();
  });
});
