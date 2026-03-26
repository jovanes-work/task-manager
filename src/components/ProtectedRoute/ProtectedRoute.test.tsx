import { render, screen } from '@testing-library/react';
import { describe, it, expect, beforeEach } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import type { AuthUser } from '@/types/auth.types';
import { ProtectedRoute } from './ProtectedRoute';

const makeUser = (overrides: Partial<AuthUser> = {}): AuthUser => ({
  id: '1',
  email: 'test@example.com',
  name: 'Test User',
  ...overrides,
});

const renderWithRouter = (ui: React.ReactNode) =>
  render(<MemoryRouter>{ui}</MemoryRouter>);

describe('ProtectedRoute', () => {
  beforeEach(() => {
    useAuthStore.setState({ user: null, token: null });
  });

  it('renderiza los children cuando el usuario esta autenticado', () => {
    useAuthStore.setState({ user: makeUser(), token: 'valid-token' });

    renderWithRouter(
      <ProtectedRoute>
        <div role='main'>Contenido protegido</div>
      </ProtectedRoute>,
    );

    expect(screen.getByRole('main')).toBeInTheDocument();
  });

  it('redirige a /login cuando el usuario no esta autenticado', () => {
    renderWithRouter(
      <ProtectedRoute>
        <div role='main'>Contenido protegido</div>
      </ProtectedRoute>,
    );

    expect(screen.queryByRole('main')).not.toBeInTheDocument();
  });

  it('no renderiza los children si solo tiene user pero no token', () => {
    useAuthStore.setState({ user: makeUser(), token: null });

    renderWithRouter(
      <ProtectedRoute>
        <div role='main'>Contenido protegido</div>
      </ProtectedRoute>,
    );

    expect(screen.queryByRole('main')).not.toBeInTheDocument();
  });

  it('no renderiza los children si solo tiene token pero no user', () => {
    useAuthStore.setState({ user: null, token: 'orphan-token' });

    renderWithRouter(
      <ProtectedRoute>
        <div role='main'>Contenido protegido</div>
      </ProtectedRoute>,
    );

    expect(screen.queryByRole('main')).not.toBeInTheDocument();
  });
});
