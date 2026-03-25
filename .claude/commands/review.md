---
name: review
description: Ejecuta un code review completo usando el agent especializado.
  Sin argumentos revisa los cambios del último commit. Con argumento revisa
  una carpeta o archivo específico.
argument-hint: ruta/al/archivo-o-carpeta (opcional)
---

Ejecutá un code review completo.

## Si no hay argumentos — revisar últimos cambios
Obtené los archivos modificados con:
```
git diff --name-only HEAD~1 HEAD
```
Revisá todos esos archivos con el agent code-reviewer.

## Si hay argumento — revisar lo especificado
Revisar: $ARGUMENTS

## Instrucciones para el review

Usá el agent code-reviewer para revisar el código.
Pasale los archivos relevantes y pedile el reporte completo
siguiendo su formato estándar.

Al terminar el review mostrá:
- El reporte completo del agent
- Una línea de veredicto final
- Si hay problemas críticos, preguntá: "¿Querés que fixee los problemas críticos ahora?"