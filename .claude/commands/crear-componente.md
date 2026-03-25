---
name: crear-componente
description: Crea un componente React completo con todos sus archivos
  siguiendo la arquitectura del proyecto. Usar cuando se necesita crear
  un componente nuevo desde cero.
argument-hint: NombreComponente
---

Creá un componente React llamado $ARGUMENTS siguiendo
estrictamente la arquitectura del proyecto.

## Pasos obligatorios en orden

### 1. Verificar que no existe
Antes de crear nada, verificá si ya existe
src/components/$ARGUMENTS/ o src/shared/$ARGUMENTS/.
Si existe, avisá y preguntá si sobreescribir.

### 2. Clasificar el componente
Determiná si es:
- Átomo: componente mínimo sin dependencias (Button, Input, Badge, Spinner)
- Molécula: combina átomos ($ARGUMENTS con lógica simple)
- Organismo: combina moléculas (sección completa de UI)

Decile al usuario qué clasificación elegiste y por qué.

### 3. Crear los 4 archivos en src/components/$ARGUMENTS/

**index.tsx** — solo re-export:
```tsx
export { $ARGUMENTS } from './$ARGUMENTS';
```

**$ARGUMENTS.tsx** — el componente:
- import type { FC } from 'react'
- interface $ARGUMENTSProps con todas las props tipadas
- export const $ARGUMENTS: FC<$ARGUMENTSProps>
- Sin lógica de negocio
- Sin llamadas a services
- Sin estado global
- Máximo 200 líneas

**$ARGUMENTS.module.css** — estilos base:
- Clase .container como raíz
- Variables CSS para colores si aplica
- Sin hardcodear colores — usar variables

**$ARGUMENTS.test.tsx** — tests con RTL:
- Importar el tipo de props directamente del componente
- Factory function usando el mismo tipo que las props del componente:
```typescript
  const make$ARGUMENTSProps = (overrides: Partial<$ARGUMENTSProps> = {}): $ARGUMENTSProps => ({
    // valores default aquí
    ...overrides,
  });
```
- Nunca crear un tipo separado para la factory — usar Partial<$ARGUMENTSProps>
- Test de render básico
- Test de cada interacción (clicks, inputs)
- Test de cada prop condicional (variantes, estados)
- Usar userEvent, no fireEvent
- Usar getByRole como query principal

### 4. Verificar antes de terminar
[ ] Los 4 archivos fueron creados
[ ] index.tsx solo tiene el re-export
[ ] Las props usan interface, no type
[ ] No hay JSX.Element como tipo de retorno
[ ] Los tests usan factory function
[ ] Correr: npx tsc --noEmit para verificar tipos

### 5. Mostrar resumen
Al terminar mostrar:
- Clasificación: átomo / molécula / organismo
- Archivos creados con sus rutas
- Props del componente
- Tests escritos