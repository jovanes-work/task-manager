import type { FC } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { LoginForm } from '@/components/LoginForm';
import styles from './LoginPage.module.css';

export const LoginPage: FC = () => {
  const { login, isLoading, error } = useAuth();

  return (
    <main className={styles['login-page']}>
      <LoginForm
        onSubmit={login}
        isLoading={isLoading}
        error={error}
      />
    </main>
  );
};
