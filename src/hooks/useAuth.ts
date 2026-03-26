import { useState, useCallback } from 'react';
import { authService } from '@/services/authService';
import { useAuthStore } from '@/store/authStore';
import { AUTH_ERROR_FALLBACK } from '@/constants/auth.constants';
import type { LoginCredentialsDto } from '@/types/auth.types';

export function useAuth() {
  const { user, setAuth, logout } = useAuthStore();
  const isAuthenticated = useAuthStore((state) => state.user !== null && state.token !== null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = useCallback(
    async (credentials: LoginCredentialsDto): Promise<void> => {
      setIsLoading(true);
      setError(null);
      try {
        const { user: loggedUser, token } = await authService.login(credentials);
        setAuth(loggedUser, token);
      } catch (err) {
        setError(err instanceof Error ? err.message : AUTH_ERROR_FALLBACK);
      } finally {
        setIsLoading(false);
      }
    },
    [setAuth],
  );

  return { user, isAuthenticated, isLoading, error, login, logout };
}
