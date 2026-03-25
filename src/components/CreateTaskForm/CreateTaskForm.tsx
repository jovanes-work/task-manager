import { useState } from 'react';
import type { FC, FormEvent, ChangeEvent } from 'react';
import type { CreateTaskDto } from '@/types/tasks.types';
import styles from './CreateTaskForm.module.css';

interface CreateTaskFormProps {
  onSubmit: (dto: CreateTaskDto) => void;
  isLoading?: boolean;
}

export const CreateTaskForm: FC<CreateTaskFormProps> = ({ onSubmit, isLoading = false }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    const trimmedTitle = title.trim();
    const trimmedDescription = description.trim();
    if (!trimmedTitle || !trimmedDescription) return;
    onSubmit({ title: trimmedTitle, description: trimmedDescription });
    setTitle('');
    setDescription('');
  };

  return (
    <form className={styles['create-task-form']} onSubmit={handleSubmit} noValidate>
      <h2 className={styles['create-task-form__title']}>Nueva tarea</h2>

      <div className={styles['create-task-form__field']}>
        <label htmlFor="task-title" className={styles['create-task-form__label']}>
          Título
        </label>
        <input
          id="task-title"
          type="text"
          className={styles['create-task-form__input']}
          value={title}
          onChange={(e: ChangeEvent<HTMLInputElement>) => setTitle(e.target.value)}
          placeholder="Ej: Revisar documentación"
          required
          disabled={isLoading}
        />
      </div>

      <div className={styles['create-task-form__field']}>
        <label htmlFor="task-description" className={styles['create-task-form__label']}>
          Descripción
        </label>
        <textarea
          id="task-description"
          className={styles['create-task-form__textarea']}
          value={description}
          onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setDescription(e.target.value)}
          placeholder="Ej: Leer las guías de estilo del proyecto"
          rows={3}
          required
          disabled={isLoading}
        />
      </div>

      <button
        type="submit"
        className={styles['create-task-form__btn']}
        disabled={isLoading || !title.trim() || !description.trim()}
      >
        {isLoading ? 'Creando...' : 'Crear tarea'}
      </button>
    </form>
  );
};
