import { useState } from 'react';
import type { FC, FormEvent, ChangeEvent } from 'react';
import type { LoginCredentialsDto } from '@/types/auth.types';
import styles from './LoginForm.module.css';

interface LoginFormProps {
  onSubmit: (credentials: LoginCredentialsDto) => void;
  isLoading?: boolean;
  error?: string | null;
}

interface FormErrors {
  email?: string;
  password?: string;
}

function validateEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export const LoginForm: FC<LoginFormProps> = ({ onSubmit, isLoading = false, error = null }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fieldErrors, setFieldErrors] = useState<FormErrors>({});

  const validate = (): boolean => {
    const errors: FormErrors = {};
    if (!email.trim()) {
      errors.email = 'El email es obligatorio';
    } else if (!validateEmail(email)) {
      errors.email = 'Ingresá un email válido';
    }
    if (!password) {
      errors.password = 'La contraseña es obligatoria';
    } else if (password.length < 6) {
      errors.password = 'La contraseña debe tener al menos 6 caracteres';
    }
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    if (!validate()) return;
    onSubmit({ email: email.trim(), password });
  };

  const handleEmailChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setEmail(e.target.value);
    if (fieldErrors.email) setFieldErrors((prev) => ({ ...prev, email: undefined }));
  };

  const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setPassword(e.target.value);
    if (fieldErrors.password) setFieldErrors((prev) => ({ ...prev, password: undefined }));
  };

  return (
    <form className={styles['login-form']} onSubmit={handleSubmit} noValidate>
      <h2 className={styles['login-form__title']}>Iniciar sesión</h2>

      {error ? <p className={styles['login-form__error']} role="alert">{error}</p> : null}

      <div className={styles['login-form__field']}>
        <label htmlFor="login-email" className={styles['login-form__label']}>
          Email
        </label>
        <input
          id="login-email"
          type="email"
          className={[
            styles['login-form__input'],
            fieldErrors.email ? styles['login-form__input--error'] : '',
          ]
            .filter(Boolean)
            .join(' ')}
          value={email}
          onChange={handleEmailChange}
          placeholder="tu@email.com"
          autoComplete="email"
          disabled={isLoading}
          aria-describedby={fieldErrors.email ? 'login-email-error' : undefined}
          aria-invalid={!!fieldErrors.email}
        />
        {fieldErrors.email ? (
          <span
            id="login-email-error"
            className={styles['login-form__field-error']}
            role="alert"
          >
            {fieldErrors.email}
          </span>
        ) : null}
      </div>

      <div className={styles['login-form__field']}>
        <label htmlFor="login-password" className={styles['login-form__label']}>
          Contraseña
        </label>
        <input
          id="login-password"
          type="password"
          className={[
            styles['login-form__input'],
            fieldErrors.password ? styles['login-form__input--error'] : '',
          ]
            .filter(Boolean)
            .join(' ')}
          value={password}
          onChange={handlePasswordChange}
          placeholder="Mínimo 6 caracteres"
          autoComplete="current-password"
          disabled={isLoading}
          aria-describedby={fieldErrors.password ? 'login-password-error' : undefined}
          aria-invalid={!!fieldErrors.password}
        />
        {fieldErrors.password ? (
          <span
            id="login-password-error"
            className={styles['login-form__field-error']}
            role="alert"
          >
            {fieldErrors.password}
          </span>
        ) : null}
      </div>

      <button
        type="submit"
        className={styles['login-form__btn']}
        disabled={isLoading}
        aria-busy={isLoading}
      >
        {isLoading ? 'Ingresando...' : 'Ingresar'}
      </button>
    </form>
  );
};
