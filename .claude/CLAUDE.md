# Task Manager — Contexto del proyecto

## Stack técnico
- Frontend: React 18 + TypeScript + Vite
- Estilos: CSS Modules (sin styled-components, sin Tailwind)
- Estado global: Zustand
- Data fetching: React Query
- Testing: Vitest + React Testing Library
- Linter: ESLint + Prettier
- Node: Express + TypeScript (en /server)

## Comandos
- `npm run dev`        → inicia el frontend (puerto 5173)
- `npm run server`     → inicia el backend (puerto 3000)
- `npm test`           → corre todos los tests
- `npm run test:watch` → tests en modo watch
- `npm run lint`       → corre ESLint
- `npm run build`      → build de producción

## Estructura de carpetas src/
src/
├── components/   → Componentes UI reutilizables (dumb, sin lógica de negocio)
├── hooks/        → Custom hooks reutilizables (use*)
├── pages/        → Una carpeta por ruta. Solo orquestan, no tienen lógica propia
├── layouts/      → Wrappers de página (MainLayout, AuthLayout)
├── shared/       → Componentes usados en 3+ lugares distintos
├── services/     → Llamadas HTTP. Una función por endpoint
├── store/        → Estado global Zustand. Un archivo por dominio
├── helpers/      → Funciones puras sin side effects ni React
├── types/        → Interfaces y types TypeScript compartidos
├── constants/    → Valores fijos. UPPER_SNAKE_CASE
├── assets/       → Imágenes, SVGs, fuentes
└── styles/       → CSS global, variables, design tokens

## Arquitectura: Feature-Sliced Design + Atomic Design

### Regla de dependencias (nunca violar)
pages → layouts → components/shared → hooks → services/store → helpers/types

Esto significa:
- pages puede importar de cualquier capa inferior
- components NUNCA importa de pages
- services NUNCA importa de components
- helpers NUNCA importa de nada de React

### Tamaños máximos
- Componente:     200 líneas máximo
- Hook:           150 líneas máximo
- Service:        100 líneas máximo
- Helper:         50 líneas máximo
- Si un archivo supera el límite → dividirlo antes de continuar

### Atomic Design
- Átomo:     Componente mínimo. Button, Input, Badge, Spinner
- Molécula:  Combina átomos. FormField, SearchBar, TaskCard
- Organismo: Combina moléculas. TaskList, LoginForm, Header
- Página:    Orquesta organismos. En pages/, no en components/

## Estructura interna de cada componente
Cada componente vive en su propia carpeta:
NombreComponente/
├── index.tsx                    → solo: export { NombreComponente }
├── NombreComponente.tsx         → el componente
├── NombreComponente.module.css  → estilos
└── NombreComponente.test.tsx    → tests

NUNCA crear un componente como archivo suelto fuera de su carpeta.

## Reglas TypeScript
- Prohibido `any` → usar `unknown` con type narrowing
- Props siempre con `interface`, no `type`
- Retornos de función siempre tipados explícitamente
- Prohibido `as` para castear (salvo casos justificados con comentario)
- Siempre usar `import type` para importar solo tipos

## Reglas de código
- Prohibido `console.log` en código que no sea debug temporal
- Prohibido lógica de negocio en componentes visuales
- Prohibido llamadas a fetch/axios fuera de services/
- Prohibido estado global en componentes (usar store/)
- Prohibido importar subiendo más de 2 niveles (../../..)
  → usar path alias @/ configurado en vite.config.ts
- Cada función hace UNA sola cosa
- Nombres descriptivos: nada de `data`, `item`, `temp`, `x`

## Formato de código (Prettier)
- 2 espacios de indentación
- Comillas simples
- Punto y coma al final
- Trailing comma en objetos y arrays
- Línea máxima: 100 caracteres
- JSX: una prop por línea si hay más de 2 props

## Convenciones de naming
| Tipo            | Convención      | Ejemplo                   |
|-----------------|-----------------|---------------------------|
| Componente      | PascalCase      | TaskCard, LoginForm        |
| Hook            | camelCase use*  | useTaskList, useAuthUser   |
| Service         | camelCase       | taskService, authService   |
| Store           | camelCase use*  | useTaskStore, useAuthStore |
| Helper          | camelCase       | formatDate, groupByStatus  |
| Type/Interface  | PascalCase      | Task, ApiResponse, User    |
| Constante       | UPPER_SNAKE     | MAX_TASKS, API_BASE_URL    |
| CSS class       | kebab-case      | .task-card, .btn-primary   |
| Archivo         | mismo que export| TaskCard.tsx, taskService.ts|

## Skills activos en este proyecto
- react-architecture → activar al crear/modificar cualquier .tsx o .ts
- api-conventions    → activar al crear/modificar services/ o server/
- testing-patterns   → activar al crear/modificar archivos .test.*

## Lo que NO se negocia
1. Respetar la estructura de carpetas
2. Máximo 200 líneas por componente
3. TypeScript estricto, cero `any`
4. Tests para toda lógica de negocio
5. Un componente = una carpeta = una responsabilidad