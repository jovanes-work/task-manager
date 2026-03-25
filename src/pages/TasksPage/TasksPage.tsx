import type { FC } from 'react';
import { useTasks } from '@/hooks/useTasks';
import { CreateTaskForm } from '@/components/CreateTaskForm';
import { TaskList } from '@/components/TaskList';
import styles from './TasksPage.module.css';

export const TasksPage: FC = () => {
  const { tasks, isLoading, error, create, complete, remove } = useTasks();

  return (
    <main className={styles['tasks-page']}>
      <header className={styles['tasks-page__header']}>
        <h1 className={styles['tasks-page__heading']}>Mis tareas</h1>
      </header>

      <section className={styles['tasks-page__form']} aria-label="Crear nueva tarea">
        <CreateTaskForm onSubmit={create} isLoading={isLoading} />
      </section>

      <section className={styles['tasks-page__list']} aria-label="Listado de tareas">
        <TaskList
          tasks={tasks}
          isLoading={isLoading}
          error={error}
          onComplete={complete}
          onDelete={remove}
        />
      </section>
    </main>
  );
};
