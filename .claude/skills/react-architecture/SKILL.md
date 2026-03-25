---
name: react-architecture
description: Arquitectura React + TypeScript con Feature-Sliced Design y
  Atomic Design. Activar SIEMPRE al crear, editar, mover o refactorizar
  cualquier archivo .tsx, .ts, componente, hook, página, layout o servicio.
  Define la estructura obligatoria, patrones de código y checklist de calidad.
---

# React Architecture — Reglas obligatorias

## 1. Estructura de carpetas (no modificar esta jerarquía)

src/
├── components/     → Átomos y moléculas reutilizables. Sin lógica de negocio.
├── hooks/          → Custom hooks reutilizables. Solo lógica React.
├── pages/          → Una carpeta por ruta. Orquesta, no procesa.
├── layouts/        → Wrappers de página. Reciben children, no datos de negocio.
├── shared/         → Componentes usados en 3+ features. Agnósticos del dominio.
├── services/       → Llamadas HTTP. Una función por endpoint. Sin React.
├── store/          → Estado global Zustand. Un archivo por dominio.
├── helpers/        → Funciones puras. Sin side effects. Sin React.
├── types/          → Interfaces TypeScript compartidas entre 2+ archivos.
├── constants/      → Valores fijos. UPPER_SNAKE_CASE.
├── assets/         → Imágenes, SVGs, fuentes. Sin lógica.
└── styles/         → CSS global, variables, design tokens.

### Regla de dependencias — NUNCA violar
pages → layouts → components/shared → hooks → services/store → helpers/types

✅ Una page puede importar de components
✅ Un component puede importar de hooks
✅ Un hook puede importar de services
❌ Un component NUNCA importa de pages
❌ Un service NUNCA importa de components o hooks
❌ Un helper NUNCA importa nada de React


## 2. Estructura interna de cada componente

REGLA: cada componente = su propia carpeta. Sin excepciones.

src/components/TaskCard/
├── index.tsx                   → re-export únicamente
├── TaskCard.tsx                → el componente
├── TaskCard.module.css         → estilos con CSS Modules
└── TaskCard.test.tsx           → tests unitarios

### index.tsx — solo esto, nada más
```tsx
export { TaskCard } from './TaskCard';
```

### Nunca hacer esto ❌
src/components/TaskCard.tsx     ← archivo suelto, PROHIBIDO
src/components/taskCard.tsx     ← minúscula, PROHIBIDO
src/components/task-card.tsx    ← kebab-case, PROHIBIDO


## 3. Patrón de componente TypeScript

### Regla de tipado de componentes — SIEMPRE seguir este patrón

**Por qué:** el proyecto usa `jsx: "react-jsx"` en tsconfig. En este modo el namespace
global `JSX` no está disponible, por lo que `JSX.Element` como tipo de retorno
produce el error _"Cannot find namespace JSX"_. `FC` es el patrón moderno de React 18.

```tsx
// ✅ CORRECTO
import type { FC } from 'react';
export const MiComponente: FC<MiComponenteProps> = ({ ... }) => { ... };

// ✅ CORRECTO — sin props
export const MiComponente: FC = () => { ... };

// ❌ PROHIBIDO — JSX.Element no está disponible con jsx: "react-jsx"
export const MiComponente: FC<Props> = (): JSX.Element => { ... };

// ❌ PROHIBIDO — import namespace, no type
import React from 'react';
export const MiComponente: React.FC<Props> = ({ ... }) => { ... };

// ❌ PROHIBIDO — React.FC sin import type
export const MiComponente: React.FC<Props> = ({ ... }) => { ... };
```

El tipo de retorno **nunca** se declara explícitamente en componentes: `FC` ya lo infiere.
Esta excepción aplica solo a componentes — las funciones utilitarias y hooks
siguen requiriendo tipo de retorno explícito.

---

### Átomo — componente mínimo (Button, Input, Badge, Spinner)
```tsx
import type { FC, ButtonHTMLAttributes } from 'react';
import styles from './Button.module.css';

interface ButtonProps extends ButtonHTMLAttributes {
  variant?: 'primary' | 'secondary' | 'danger';
  isLoading?: boolean;
}

export const Button: FC = ({
  variant = 'primary',
  isLoading = false,
  children,
  disabled,
  ...rest
}) => {
  return (
    
      {isLoading ?  : children}
    
  );
};
```

### Molécula — combina átomos (TaskCard, FormField, SearchBar)
```tsx
import type { FC } from 'react';
import { Button } from '@/components/Button';
import { Badge } from '@/components/Badge';
import type { Task } from '@/types';
import styles from './TaskCard.module.css';

interface TaskCardProps {
  task: Task;
  onComplete: (id: string) => void;
  onDelete: (id: string) => void;
}

export const TaskCard: FC = ({ task, onComplete, onDelete }) => {
  return (
    
      
        {task.title}
        
      
      {task.description}
      
         onComplete(task.id)}>
          Completar
        
         onDelete(task.id)}>
          Eliminar
        
      
    
  );
};
```

### Organismo — combina moléculas (TaskList, LoginForm, Header)
```tsx
import type { FC } from 'react';
import { TaskCard } from '@/components/TaskCard';
import { EmptyState } from '@/components/EmptyState';
import { Spinner } from '@/components/Spinner';
import { useTaskList } from '@/hooks/useTaskList';
import styles from './TaskList.module.css';

export const TaskList: FC = () => {
  const { tasks, isLoading, completeTask, deleteTask } = useTaskList();

  if (isLoading) return ;
  if (tasks.length === 0) return ;

  return (
    
      {tasks.map((task) => (
        
          
        
      ))}
    
  );
};
```

### Página — orquesta organismos (nunca tiene lógica propia)
```tsx
import type { FC } from 'react';
import { MainLayout } from '@/layouts/MainLayout';
import { TaskList } from '@/components/TaskList';
import { CreateTaskForm } from '@/components/CreateTaskForm';

export const TasksPage: FC = () => {
  return (
    
      
      
    
  );
};
```


## 4. Patrón de custom hook

```tsx
import { useState, useCallback } from 'react';
import { taskService } from '@/services/taskService';
import { useTaskStore } from '@/store/taskStore';
import type { Task, CreateTaskDto } from '@/types';

// El hook encapsula TODA la lógica. El componente solo llama funciones.
export function useTaskList() {
  const { tasks, setTasks, addTask, removeTask } = useTaskStore();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const completeTask = useCallback(async (id: string) => {
    try {
      await taskService.complete(id);
      setTasks(tasks.map((t) => (t.id === id ? { ...t, status: 'done' } : t)));
    } catch {
      setError('No se pudo completar la tarea');
    }
  }, [tasks, setTasks]);

  const deleteTask = useCallback(async (id: string) => {
    try {
      await taskService.delete(id);
      removeTask(id);
    } catch {
      setError('No se pudo eliminar la tarea');
    }
  }, [removeTask]);

  return { tasks, isLoading, error, completeTask, deleteTask };
}
```

Reglas de hooks:
- Nombre siempre empieza con `use`
- Retornan un objeto con nombres descriptivos (nunca array salvo casos tipo useState)
- Lógica de negocio va en el hook, no en el componente
- Si el hook supera 150 líneas → dividirlo en hooks más pequeños
- Un hook por responsabilidad (useTaskList no hace auth)


## 5. Patrón de service

```typescript
import { apiClient } from '@/lib/apiClient';
import type { Task, CreateTaskDto, UpdateTaskDto } from '@/types';

// Sin React. Sin hooks. Solo HTTP.
export const taskService = {
  getAll: (): Promise =>
    apiClient.get('/tasks'),

  getById: (id: string): Promise =>
    apiClient.get(`/tasks/${id}`),

  create: (dto: CreateTaskDto): Promise =>
    apiClient.post('/tasks', dto),

  update: (id: string, dto: UpdateTaskDto): Promise =>
    apiClient.patch(`/tasks/${id}`, dto),

  complete: (id: string): Promise =>
    apiClient.patch(`/tasks/${id}`, { status: 'done' }),

  delete: (id: string): Promise =>
    apiClient.delete(`/tasks/${id}`),
};
```


## 6. Patrón de store Zustand

```typescript
import { create } from 'zustand';
import type { Task } from '@/types';

interface TaskStore {
  tasks: Task[];
  selectedTaskId: string | null;
  setTasks: (tasks: Task[]) => void;
  addTask: (task: Task) => void;
  removeTask: (id: string) => void;
  selectTask: (id: string | null) => void;
}

export const useTaskStore = create((set) => ({
  tasks: [],
  selectedTaskId: null,
  setTasks: (tasks) => set({ tasks }),
  addTask: (task) => set((state) => ({ tasks: [...state.tasks, task] })),
  removeTask: (id) =>
    set((state) => ({ tasks: state.tasks.filter((t) => t.id !== id) })),
  selectTask: (id) => set({ selectedTaskId: id }),
}));
```


## 7. Límites de tamaño y cuándo dividir

| Archivo       | Máximo    | Señal de división                              |
|---------------|-----------|------------------------------------------------|
| Componente    | 200 líneas| Tiene más de 1 sección visual independiente    |
| Hook          | 150 líneas| Maneja más de 1 responsabilidad                |
| Service       | 100 líneas| Tiene endpoints de más de 1 entidad            |
| Helper        | 50 líneas | Tiene más de 3-4 funciones distintas           |
| Store         | 80 líneas | Mezcla más de 1 dominio de negocio             |

### Cómo dividir un componente grande
Si TaskList.tsx llega a 200 líneas:
- Extraer la lógica a useTaskList hook
- Extraer sub-secciones a componentes hijos
- Extraer el CSS a su module.css propio
- Nunca juntar dos componentes en un mismo archivo


## 8. Checklist antes de crear cualquier archivo

Antes de escribir una sola línea de código, verificar:

[ ] ¿Qué tipo de archivo es? (átomo / molécula / organismo / página / hook / service / store / helper)
[ ] ¿La carpeta destino es la correcta según la jerarquía?
[ ] ¿Ya existe algo similar que pueda reutilizar?
[ ] ¿El nombre sigue la convención? (PascalCase componente, camelCase hook/service)
[ ] Si es componente: ¿tiene su propia carpeta con los 4 archivos?
[ ] ¿Va a importar de una capa superior? → PROHIBIDO, reorganizar
[ ] ¿La lógica de negocio va en el hook, no en el componente?
[ ] ¿Las props están tipadas con interface?
[ ] ¿Tiene test? Si no, crearlo en el mismo paso


## 9. Prohibido — lista completa

### Estructura
❌ Componente como archivo suelto fuera de su carpeta
❌ Más de un componente por archivo
❌ Lógica en index.tsx (solo re-export)
❌ Importar subiendo más de 2 niveles (usar @/ alias)

### TypeScript
❌ `any` — usar `unknown` con type narrowing
❌ `as` para castear sin comentario explicativo
❌ Props con `type` en lugar de `interface`
❌ Funciones utilitarias y hooks sin tipo de retorno explícito
❌ `JSX.Element` como tipo de retorno — causa _"Cannot find namespace JSX"_ con `jsx: "react-jsx"`; usar `FC`
❌ `import React from 'react'` — usar `import type { FC } from 'react'`
❌ `React.FC` — usar `FC` directamente con `import type { FC } from 'react'`

### Lógica
❌ `fetch` o `axios` fuera de services/
❌ Estado global con useState cuando debería ser store/
❌ Lógica de negocio dentro de componentes visuales
❌ Efectos secundarios fuera de hooks o services
❌ `console.log` que no sea debug temporal

### Código
❌ Nombres genéricos: `data`, `item`, `temp`, `res`, `x`, `i` (salvo índices)
❌ Funciones que hacen más de una cosa
❌ Comentarios que explican qué hace el código (el código debe ser autodocumentado)
❌ Código comentado — si no se usa, se borra
❌ Magic numbers sueltos (usar constants/)


## 10. Path aliases — usar siempre

En vite.config.ts configurar:
```typescript
resolve: {
  alias: { '@': '/src' }
}
```

Usar siempre @/ en lugar de rutas relativas:
✅ import { Button } from '@/components/Button';
❌ import { Button } from '../../components/Button';