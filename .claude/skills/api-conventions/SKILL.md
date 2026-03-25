---
name: api-conventions
description: Convenciones de servicios HTTP para React + Node. Activar
  SIEMPRE al crear o modificar archivos en services/, al crear endpoints
  en server/, o al escribir llamadas HTTP en cualquier parte del proyecto.
---

# API Conventions — Reglas obligatorias

## 1. Patrón de service — SIEMPRE usar objeto, nunca funciones sueltas

❌ PROHIBIDO — funciones sueltas exportadas:
```typescript
export async function getTasks(): Promise { ... }
export async function createTask(): Promise { ... }
```

✅ CORRECTO — objeto con métodos:
```typescript
export const taskService = {
  getAll: (): Promise => apiClient.get('/tasks'),
  getById: (id: string): Promise => apiClient.get(`/tasks/${id}`),
  create: (dto: CreateTaskDto): Promise => apiClient.post('/tasks', dto),
  update: (id: string, dto: UpdateTaskDto): Promise =>
    apiClient.patch(`/tasks/${id}`, dto),
  delete: (id: string): Promise => apiClient.delete(`/tasks/${id}`),
};
```

Razón: el objeto agrupa todos los métodos de una entidad, es más fácil
de mockear en tests, y es consistente entre todos los services.

## 2. Cliente HTTP centralizado — nunca fetch directo en services

❌ PROHIBIDO — fetch directo en el service:
```typescript
const response = await fetch(`${API_BASE_URL}/tasks`, {
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(data),
});
```

✅ CORRECTO — usar el apiClient de src/lib/apiClient.ts:
```typescript
import { apiClient } from '@/lib/apiClient';
export const taskService = {
  getAll: (): Promise => apiClient.get('/tasks'),
};
```

El apiClient centraliza: base URL, headers, manejo de errores, tokens.
Si no existe, crearlo primero siguiendo el patrón de abajo.

## 3. Patrón de apiClient — crear en src/lib/apiClient.ts

```typescript
const BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000';

async function request(
  endpoint: string,
  options: RequestInit = {},
): Promise {
  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${endpoint}`);
  }

  if (response.status === 204) return undefined as T;
  return response.json() as Promise;
}

export const apiClient = {
  get: (endpoint: string) => request(endpoint),
  post: (endpoint: string, body: unknown) =>
    request(endpoint, { method: 'POST', body: JSON.stringify(body) }),
  patch: (endpoint: string, body: unknown) =>
    request(endpoint, { method: 'PATCH', body: JSON.stringify(body) }),
  delete: (endpoint: string) =>
    request(endpoint, { method: 'DELETE' }),
};
```

## 4. DTOs — siempre tipar entrada y salida

```typescript
// En src/types/index.ts o en el archivo del service
export interface CreateTaskDto {
  title: string;
  description: string;
}

export interface UpdateTaskDto {
  title?: string;
  description?: string;
  status?: Task['status'];
}
```

Reglas:
- Sufijo Dto para objetos de entrada (Create, Update)
- Sufijo Response para objetos de respuesta de la API
- Nunca usar `any` como tipo de retorno

## 5. Variables de entorno — nunca hardcodear URLs

❌ PROHIBIDO:
```typescript
const API_BASE_URL = 'http://localhost:3000';
```

✅ CORRECTO:
```typescript
const BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000';
```

Todas las variables de entorno van en .env (creado manualmente, nunca
por Claude) y se acceden con import.meta.env.VITE_*

## 6. Naming conventions de services

| Archivo          | Export           | Uso en hook/componente     |
|------------------|------------------|----------------------------|
| taskService.ts   | taskService      | taskService.getAll()       |
| authService.ts   | authService      | authService.login(dto)     |
| userService.ts   | userService      | userService.getById(id)    |

- Un archivo por entidad de negocio
- Nombre en camelCase + sufijo Service
- Export nombrado, nunca default export

## 7. Checklist antes de crear un service

[ ] ¿Existe src/lib/apiClient.ts? Si no → crearlo primero
[ ] ¿El service usa objeto taskService = {} en lugar de funciones sueltas?
[ ] ¿Importa apiClient en lugar de usar fetch directo?
[ ] ¿Los DTOs están tipados con interface?
[ ] ¿La URL viene de import.meta.env?
[ ] ¿Máximo 100 líneas? Si supera → dividir por entidad

## 8. Prohibido en services

❌ Importar hooks de React (useState, useEffect, etc.)
❌ Importar componentes
❌ Lógica de negocio compleja (va en hooks/)
❌ console.log (usar logger o eliminar)
❌ fetch directo sin apiClient
❌ URLs hardcodeadas
❌ Default exports