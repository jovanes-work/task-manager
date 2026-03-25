import type { FC } from 'react';
import type { Task } from '@/types';
import styles from './TaskCard.module.css';

const STATUS_LABELS: Record<Task['status'], string> = {
  pending: 'Pendiente',
  'in-progress': 'En progreso',
  done: 'Completada',
};

const getStatusColor = (status: string) => {
  if (status === 'pending') {
    return 'gray';
  } else if (status === 'in-progress') {
    return 'blue';
  } else {
    return 'green';
  }
};

interface TaskCardProps {
  task: Task;
  onComplete: (id: string) => void;
  onDelete: (id: string) => void;
}

export const TaskCard: FC<TaskCardProps> = ({ task, onComplete, onDelete }) => {
  const formattedDate = new Date(task.createdAt).toLocaleDateString('es-ES', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });

  return (
    <article className={styles['task-card']}>
      <header className={styles['task-card__header']}>
        <h3 className={styles['task-card__title']}>{task.title}</h3>
        <span
          className={`${styles['task-card__badge']} ${styles[`task-card__badge--${task.status}`]}`}
        >
          {STATUS_LABELS[task.status]}
        </span>
      </header>

      <p className={styles['task-card__description']}>{task.description}</p>

      <footer className={styles['task-card__footer']}>
        <time className={styles['task-card__date']} dateTime={task.createdAt}>
          {formattedDate}
        </time>

        <div className={styles['task-card__actions']}>
          <button
            className={`${styles['task-card__btn']} ${styles['task-card__btn--complete']}`}
            onClick={() => onComplete(task.id)}
            disabled={task.status === 'done'}
            aria-label={`Marcar "${task.title}" como completada`}
          >
            Completar
          </button>
          <button
            className={`${styles['task-card__btn']} ${styles['task-card__btn--delete']}`}
            onClick={() => onDelete(task.id)}
            aria-label={`Eliminar "${task.title}"`}
          >
            Eliminar
          </button>
        </div>
      </footer>
    </article>
  );
};
