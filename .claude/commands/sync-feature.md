---
name: sync-feature
description: Genera el stack completo de una feature: tipos, service,
  store, componentes y página. Usar cuando se necesita crear una feature
  nueva desde cero con todas sus capas.
argument-hint: nombre-feature
---

Creá el stack completo para la feature "$ARGUMENTS".

## Orden de creación — respetar este orden exacto

### 1. Tipos — src/types/$ARGUMENTS.types.ts
Definir todas las interfaces de la feature:
- La entidad principal (ej: Task, User, Product)
- DTOs de entrada (Create$ARGUMENTSDto, Update$ARGUMENTSDto)
- Tipos de estado (loading, error, etc.)

```typescript
export interface $ARGUMENTS {
  id: string;
  // ... campos según el dominio
  createdAt: string;
}

export interface Create$ARGUMENTSDto {
  // campos requeridos para crear
}

export interface Update$ARGUMENTSDto {
  // campos opcionales para actualizar
}
```

### 2. Service — src/services/${ARGUMENTS}Service.ts
Usar el patrón del skill api-conventions:
- Verificar que existe src/lib/apiClient.ts, si no crearlo
- Objeto con métodos: getAll, getById, create, update, delete
- Importar tipos desde @/types/$ARGUMENTS.types

### 3. Store — src/store/${ARGUMENTS}Store.ts
Usar Zustand:
```typescript
import { create } from 'zustand';
import type { $ARGUMENTS } from '@/types/$ARGUMENTS.types';

interface $ARGUMENTSStore {
  items: $ARGUMENTS[];
  selectedId: string | null;
  setItems: (items: $ARGUMENTS[]) => void;
  addItem: (item: $ARGUMENTS) => void;
  removeItem: (id: string) => void;
  selectItem: (id: string | null) => void;
}

export const use$ARGUMENTSStore = create<$ARGUMENTSStore>((set) => ({
  items: [],
  selectedId: null,
  setItems: (items) => set({ items }),
  addItem: (item) => set((state) => ({ items: [...state.items, item] })),
  removeItem: (id) => set((state) => ({
    items: state.items.filter((i) => i.id !== id),
  })),
  selectItem: (id) => set({ selectedId: id }),
}));
```

### 4. Hook — src/hooks/use$ARGUMENTS.ts
Encapsula toda la lógica de la feature:
- Conecta el service con el store
- Maneja loading y error
- Exporta las acciones y el estado
- Sin lógica en los componentes

```typescript
export function use$ARGUMENTS() {
  const { items, setItems, addItem, removeItem } = use$ARGUMENTSStore();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // fetchAll, create, remove...

  return { items, isLoading, error, /* acciones */ };
}
```

### 5. Componentes — src/components/
Crear los componentes mínimos necesarios:
- $ARGUMENTSList/ — lista de items (organismo)
- $ARGUMENTSCard/ — tarjeta individual (molécula)
- Create$ARGUMENTSForm/ — formulario de creación (molécula)
Cada uno con sus 4 archivos siguiendo react-architecture.

### 6. Página — src/pages/$ARGUMENTSPage/
```typescript
export const $ARGUMENTSPage: FC = () => {
  return (
    
      
      <$ARGUMENTSList />
    
  );
};
```

### 7. Verificación final
Correr: npx tsc --noEmit
Si hay errores de tipos, fixearlos antes de terminar.

### 8. Resumen al terminar
Mostrar tabla con todos los archivos creados:
| Archivo | Tipo | Descripción |
|---------|------|-------------|
| ...     | ...  | ...         |

### 9. Review automático al terminar
Una vez creados todos los archivos, invocá el agent code-reviewer
para revisar todo lo generado.

Pasale todos los archivos creados y pedile el reporte completo.
Si el veredicto es 🔴, mostrá los problemas críticos y preguntá
si fixearlos antes de terminar.