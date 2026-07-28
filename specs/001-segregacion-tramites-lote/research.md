# Technical Research: Creación y Envío de Trámites de Adquisición Divididos por Tipo de Compra

**Feature**: `001-segregacion-tramites-lote`  
**Date**: 2026-07-27

## Decisions & Rationale

### 1. Algoritmo de Auto-Clasificación y Segregación de Ítems

- **Decision**: Implementar una función helper síncrona en el cliente/dominio (`segregateItemsToRequisitions(itemList)`) que clasifique cada ítem según su `categoria` ("Material", "Activo Fijo", "Servicio") y agrupe automáticamente hasta 3 borradores de trámites homogéneos.
- **Rationale**: Proporciona retroalimentación instantánea al usuario al agregar un ítem sin latencia de red. Garantiza la regla de segregación estricta (0% mezcla de categorías).
- **Alternatives Considered**: Clasificación server-side previa (descartada por agregar latencia innecesaria en la UI previa al guardado).

### 2. Lógica de Envío en Lote Resiliente (Non-Blocking Batch Submit)

- **Decision**: Utilizar `Promise.allSettled` sobre los trámites activos para procesar el envío independiente de cada trámite.
- **Rationale**: Si el usuario presiona "Enviar Todos los Trámites", los trámites válidos se persisten y envían generando su número de seguimiento (`TR-YYYY-XXXX`), mientras que el trámite fallido captura su error y mantiene la tarjeta en pantalla destacando visualmente el campo o anexo faltante.
- **Alternatives Considered**: Transacción atómica "todo o nada" (descartada porque violaría la regla del negocio de no bloquear trámites válidos cuando uno falla).

### 3. Integración con Servicio Externo de Partidas Presupuestarias

- **Decision**: Función asíncrona `lookupBudgetLine(itemCode, description)` con timeout de 1.5s y valor de reserva ("Pendiente de asignación - Presupuestos").
- **Rationale**: Cumple el requisito FR-005: si el servicio externo no devuelve coincidencia o está fuera de línea, la partida se marca como pendiente y la solicitud puede guardarse/enviarse sin bloqueos.

### 4. Gestión de Archivos Adjuntos (ET, TDR y Respaldos)

- **Decision**: Manejo en estado React local (`File` objects) con validación previa de tipo (`.pdf`, `.png`, `.jpg`) y tamaño máximo (10MB per file), subida a Supabase Storage bucket `requisition-attachments`.
- **Rationale**: Para Materiales y Activos Fijos se exige ET; para Servicios se exige TDR (PDF); para la cabecera del trámite se exigen proformas/cotizaciones.

### 5. Sistema de Diseño e Interfaz UI

- **Decision**: Componentes de `shadcn/ui` reutilizables estilizados con tokens institucionales de `DESIGN.md` (`--primary: #003770`, `--secondary: #BC000C`, `--background: #fdfdfd`, `--foreground: #2c3e50`).
- **Rationale**: Asegura la identidad visual de la UMSS, estética minimalista, espacios generosos y diseño responsivo adaptado al layout principal (`AppLayout.tsx`).

### 6. Estrategia de Pruebas MVP

- **Decision**: Pruebas unitarias altamente enfocadas ("pruebas unitarias bien puntuales") limitadas a la función de segregación de trámites (`segregateItemsToRequisitions`) y la lógica de validación de envío en lote resiliente.
- **Rationale**: Alineado con las pautas de MVP para máxima velocidad de desarrollo y validación rápida.
