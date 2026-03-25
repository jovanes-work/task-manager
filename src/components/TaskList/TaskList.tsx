import type { FC } from 'react';
import type { Task } from '@/types/tasks.types';
import { TaskCard } from '@/components/TaskCard';
import styles from './TaskList.module.css';

interface TaskListProps {
  tasks: Task[];
  isLoading: boolean;
  error: string | null;
  onComplete: (id: string) => void;
  onDelete: (id: string) => void;
}

export const TaskList: FC<TaskListProps> = ({ tasks, isLoading, error, onComplete, onDelete }) => {
  if (isLoading) {
    return <p className={styles['task-list__message']}>Cargando tareas...</p>;
  }

  if (error) {
    return <p className={styles['task-list__error']}>{error}</p>;
  }

  if (tasks.length === 0) {
    return <p className={styles['task-list__message']}>No hay tareas. ¡Creá la primera!</p>;
  }

  return (
    <ul className={styles['task-list']} aria-label="Lista de tareas">
      {tasks.map((task) => (
        <li key={task.id} className={styles['task-list__item']}>
          <TaskCard
            task={task}
            onComplete={onComplete}
            onDelete={onDelete}
          />
        </li>
      ))}
    </ul>
  );
};
