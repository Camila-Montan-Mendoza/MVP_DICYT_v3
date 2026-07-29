# Implementation Plan: Expediente Digital de Respaldos y Resumen de Trámite Completado (Paso 4)

**Branch**: `013-expediente-digital-resumen-completado` | **Date**: 2026-07-29 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/013-expediente-digital-resumen-completado/spec.md`

## Summary

Implementar la conexión real a Supabase PostgreSQL y los componentes UI del Paso 4 (Evidencia) para la **Tarea 18 (`Tarea18ExpedienteDigitalActive`)** y la **Tarea 19 (`Tarea19TramiteCompletadoActive`)**. En la Tarea 18 se creará la interfaz "Resumen de archivos" idéntica a la maqueta para cargar, previsualizar, eliminar y **"Archivar respaldos"** en Supabase (`expediente_digital`). En la Tarea 19 se construirá el Visor de Resumen Ejecutivo Integral que consolida todo el historial del trámite con el badge `TRÁMITE COMPLETADO Y ARCHIVADO`.

## Technical Context

**Language/Version**: TypeScript / Next.js 15 (React 19, Turbopack)
**Primary Dependencies**: Supabase JS SDK, Lucide React icons, TailwindCSS, shadcn/ui components
**Storage**: Supabase Postgres DB (`expediente_digital`, `tramite`, `orden_contractual`, `acta_recepcion`, `solicitud_pago`, `historial_estado_tramite`)
**Testing**: Pruebas unitarias para formateo de tamaño de archivos y estructura de expediente (`tests/unit/expedienteValidation.test.ts`).
**Target Platform**: Navegador Web Desktop / Móvil (Responsive)
**Project Type**: Next.js App Router Web Application
**Performance Goals**: Carga de la lista de archivos y ficha ejecutiva en < 1 segundo.
**Constraints**: Fiel reproducción del diseño institucional de la maqueta ("Resumen de archivos") e integración en `components/workflow/views/paso-4-evidencia/`.

## Constitution Check

_GATE: Pass_

## Project Structure

### Documentation (this feature)

```text
specs/013-expediente-digital-resumen-completado/
├── spec.md              # Especificación funcional
├── plan.md              # Plan de implementación técnica (este archivo)
├── research.md          # Investigación de backend Supabase y componentes UI
├── data-model.md        # Modelo de entidades expediente_digital
├── quickstart.md        # Guía rápida de validación
└── contracts/           # Contrato de servicio expedienteService.ts
```

### Source Code (repository root)

```text
components/
├── workflow/
│   └── views/
│       └── paso-4-evidencia/
│           ├── tarea-18-expediente-digital-active.tsx     # Carga y archivación de respaldos
│           ├── tarea-18-expediente-digital-passive.tsx    # Lectura del expediente digital
│           ├── tarea-19-tramite-completado-active.tsx     # Resumen ejecutivo integral
│           └── tarea-19-tramite-completado-passive.tsx    # Lectura del trámite completado
└── tramites/
    └── evidencia/
        ├── TarjetaResumenArchivos.tsx                     # Tarjeta maqueta "Resumen de archivos"
        └── FichaResumenEjecutivoTramite.tsx               # Resumen integral de los 4 pasos

services/
└── expedienteService.ts                                    # Conexión real Supabase DB
```

**Structure Decision**: Aplicación Next.js App Router implementando la Tarea 18 y Tarea 19 dentro de `components/workflow/views/paso-4-evidencia/` con componentes auxiliares en `components/tramites/evidencia/`.
