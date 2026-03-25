---
name: testing-patterns
description: Patrones de testing con Vitest y React Testing Library.
  Activar SIEMPRE al crear o modificar archivos .test.tsx, .test.ts,
  .spec.tsx, o .spec.ts. También activar cuando se pide "escribí tests",
  "agregá tests", o "cobertura de tests".
---

# Testing Patterns — Reglas obligatorias

## 1. Stack de testing

- Test runner: Vitest (no Jest — la sintaxis es igual pero el import es distinto)
- Componentes: React Testing Library (@testing-library/react)
- Eventos: @testing-library/user-event (no fireEvent — userEvent es más realista)
- Assertions: @testing-library/jest-dom (matchers como toBeInTheDocument)
- Mocks: vi.fn(), vi.mock(), vi.spyOn() (no jest.fn())

## 2. Estructura de cada test — patrón AAA

```typescript
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { Task } from '@/types';
import { TaskCard } from './TaskCard';

// Factory function para datos de prueba — siempre usar factories
const makeTask = (overrides: Partial = {}): Task => ({
  id: '1',
  title: 'Tarea de prueba',
  description: 'Descripción de prueba',
  status: 'pending',
  createdAt: '2024-01-01T00:00:00.000Z',
  ...overrides,
});

describe('TaskCard', () => {
  // Arrange compartido — usar beforeEach para mocks
  const onComplete = vi.fn();
  const onDelete = vi.fn();

  beforeEach(() => {
    onComplete.mockClear();
    onDelete.mockClear();
  });

  it('renderiza el título y la descripción', () => {
    // Arrange
    const task = makeTask({ title: 'Mi tarea' });

    // Act
    render();

    // Assert
    expect(screen.getByText('Mi tarea')).toBeInTheDocument();
    expect(screen.getByText('Descripción de prueba')).toBeInTheDocument();
  });

  it('llama onComplete con el id al hacer click en Completar', async () => {
    // Arrange
    const user = userEvent.setup();
    const task = makeTask({ id: '42' });
    render();

    // Act
    await user.click(screen.getByRole('button', { name: /completar/i }));

    // Assert
    expect(onComplete).toHaveBeenCalledWith('42');
    expect(onComplete).toHaveBeenCalledTimes(1);
  });

  it('muestra el badge con el status correcto', () => {
    const task = makeTask({ status: 'in-progress' });
    render();
    expect(screen.getByText(/en progreso/i)).toBeInTheDocument();
  });
});
```

## 3. Factory functions — siempre, nunca objetos literales

❌ PROHIBIDO — objeto literal en cada test:
```typescript
const task = {
  id: '1',
  title: 'Test',
  description: 'Test desc',
  status: 'pending' as const,
  createdAt: '2024-01-01',
};
```

✅ CORRECTO — factory function con overrides:
```typescript
const makeTask = (overrides: Partial = {}): Task => ({
  id: '1',
  title: 'Tarea de prueba',
  description: 'Descripción de prueba',
  status: 'pending',
  createdAt: '2024-01-01T00:00:00.000Z',
  ...overrides,
});

// Uso:
const task = makeTask({ status: 'done' }); // solo sobreescribe lo necesario
```

## 4. Queries — orden de preferencia

Usar siempre en este orden (de más a menos accesible):
1. getByRole — botones, inputs, headings (preferido)
2. getByLabelText — inputs con label
3. getByPlaceholderText — inputs sin label
4. getByText — texto visible
5. getByTestId — último recurso, solo si no hay otra opción

❌ PROHIBIDO:
```typescript
container.querySelector('.btn-primary') // nunca CSS selectors
getByTestId('task-title')               // solo como último recurso
```

✅ CORRECTO:
```typescript
screen.getByRole('button', { name: /completar/i })
screen.getByRole('heading', { name: /mi tarea/i })
```

## 5. Mocks de services — vi.mock()

```typescript
import { vi } from 'vitest';
import { taskService } from '@/services/taskService';

vi.mock('@/services/taskService', () => ({
  taskService: {
    getAll: vi.fn(),
    create: vi.fn(),
    delete: vi.fn(),
  },
}));

// En el test:
vi.mocked(taskService.getAll).mockResolvedValue([makeTask()]);
```

## 6. Tests de hooks — renderHook

```typescript
import { renderHook, act } from '@testing-library/react';
import { useTaskList } from './useTaskList';

it('carga las tareas al montar', async () => {
  vi.mocked(taskService.getAll).mockResolvedValue([makeTask()]);

  const { result } = renderHook(() => useTaskList());

  expect(result.current.isLoading).toBe(true);
  await act(async () => {});
  expect(result.current.tasks).toHaveLength(1);
});
```

## 7. Qué testear en cada tipo de archivo

| Tipo         | Qué testear                                          |
|--------------|------------------------------------------------------|
| Componente   | Render, clicks, props condicionales, estados         |
| Hook         | Estado inicial, cambios de estado, llamadas a service|
| Helper       | Input/output de cada función pura                    |
| Service      | No se testea directo — se mockea en hooks/componentes|

## 8. Prohibido en tests

❌ fireEvent — usar userEvent que simula comportamiento real
❌ act() manual innecesario — RTL lo maneja solo en la mayoría de casos
❌ Snapshots — son frágiles y no documentan el comportamiento
❌ Testear implementación interna — testear comportamiento visible
❌ it.only o describe.only sin comentario explicando por qué
❌ Tests sin expect — un test sin assertion siempre pasa, es inútil
❌ Más de un concepto por test — un it = una cosa que verificar