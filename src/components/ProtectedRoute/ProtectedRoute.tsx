import type { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';

interface ProtectedRouteProps {
  children: ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps): ReactNode {
  const isAuthenticated = useAuthStore((state) => state.user !== null && state.token !== null);

  if (!isAuthenticated) {
    return <Navigate to='/login' replace />;
  }

  return children;
}
