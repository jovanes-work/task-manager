import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import type { BadgeProps } from './Badge';
import { Badge } from './Badge';

const makeBadgeProps = (overrides: Partial<BadgeProps> = {}): BadgeProps => ({
  children: 'Label',
  variant: 'default',
  size: 'md',
  ...overrides,
});

describe('Badge', () => {
  it('renderiza el contenido', () => {
    render(<Badge {...makeBadgeProps()} />);
    expect(screen.getByText('Label')).toBeInTheDocument();
  });

  it('renderiza con variante success', () => {
    render(<Badge {...makeBadgeProps({ variant: 'success', children: 'Activo' })} />);
    expect(screen.getByText('Activo')).toBeInTheDocument();
  });

  it('renderiza con variante warning', () => {
    render(<Badge {...makeBadgeProps({ variant: 'warning', children: 'Pendiente' })} />);
    expect(screen.getByText('Pendiente')).toBeInTheDocument();
  });

  it('renderiza con variante error', () => {
    render(<Badge {...makeBadgeProps({ variant: 'error', children: 'Error' })} />);
    expect(screen.getByText('Error')).toBeInTheDocument();
  });

  it('renderiza con variante info', () => {
    render(<Badge {...makeBadgeProps({ variant: 'info', children: 'Info' })} />);
    expect(screen.getByText('Info')).toBeInTheDocument();
  });

  it('renderiza con tamaño sm', () => {
    render(<Badge {...makeBadgeProps({ size: 'sm', children: 'Small' })} />);
    expect(screen.getByText('Small')).toBeInTheDocument();
  });

  it('renderiza con tamaño lg', () => {
    render(<Badge {...makeBadgeProps({ size: 'lg', children: 'Large' })} />);
    expect(screen.getByText('Large')).toBeInTheDocument();
  });

  it('aplica className adicional', () => {
    const { container } = render(
      <Badge {...makeBadgeProps({ className: 'extra-class' })} />,
    );
    expect(container.firstChild).toHaveClass('extra-class');
  });

  it('renderiza como elemento span', () => {
    const { container } = render(<Badge {...makeBadgeProps()} />);
    expect(container.firstChild?.nodeName).toBe('SPAN');
  });
});
