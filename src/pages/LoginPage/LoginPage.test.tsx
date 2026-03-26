import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';

const mockLogin = vi.fn();
const mockUseAuth = vi.fn();

vi.mock('@/hooks/useAuth', () => ({
  useAuth: () => mockUseAuth(),
}));

import { LoginPage } from './LoginPage';

function buildAuthState(overrides: { error?: string | null } = {}) {
  return { login: mockLogin, isLoading: false, error: null, ...overrides };
}

describe('LoginPage', () => {
  beforeEach(() => {
    mockLogin.mockClear();
    mockUseAuth.mockReturnValue(buildAuthState());
  });

  it('renders the login form', () => {
    render(<LoginPage />);
    expect(screen.getByRole('heading', { name: 'Iniciar sesión' })).toBeInTheDocument();
  });

  it('renders email and password fields', () => {
    render(<LoginPage />);
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
    expect(screen.getByLabelText('Contraseña')).toBeInTheDocument();
  });

  it('shows error from hook when present', () => {
    mockUseAuth.mockReturnValue(buildAuthState({ error: 'Email o contraseña incorrectos' }));
    render(<LoginPage />);
    expect(screen.getByText('Email o contraseña incorrectos')).toBeInTheDocument();
  });
});
