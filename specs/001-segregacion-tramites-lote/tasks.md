# Tasks: Creación y Envío de Trámites de Adquisición Divididos por Tipo de Compra

**Input**: Design documents from `/specs/001-segregacion-tramites-lote/`  
**Prerequisites**: plan.md (required), spec.md (required), research.md, data-model.md, contracts/  
**Tests Policy**: MVP Strategy: Pruebas unitarias bien puntuales para la lógica central de segregación y envío en lote resiliente. Se evitan suites complejas E2E/integración.  
**Organization**: Tareas agrupadas por historia de usuario para permitir desarrollo e implementación independiente.

---

## Format: `- [ ] [TaskID] [P?] [Story] Description`

- **[P]**: Ejecutable en paralelo (archivos independientes)
- **[Story]**: Historia de usuario a la que pertenece ([US1], [US2], [US3], [US4], [US5])

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Estructura de tipos de datos y configuración básica

- [x] T001 Definir interfaces TypeScript (`TramiteSolicitud`, `ItemSolicitud`, `EnvioLoteResultado`) en `types/requisitions.ts`
- [x] T002 [P] Configurar cliente y helper de almacenamiento en Supabase Storage para adjuntos en `lib/supabase/storage.ts`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Lógica central de segregación y servicios compartidos indispensables

- [x] T003 [P] Implementar la función pura de auto-clasificación y segregación de ítems `segregateItemsToRequisitions` en `lib/requisitions/segregator.ts`
- [x] T004 Implementar prueba unitaria puntual para la función de segregación en `tests/unit/segregator.test.ts`
- [x] T005 [P] Implementar servicio de consulta de partidas presupuestarias externas con fallback en `lib/requisitions/budget-service.ts`

---

## Phase 3: User Story 1 - Auto-Clasificación y Segregación de Ítems (Priority: P1) 🎯 MVP

**Goal**: Permitir al investigador agregar ítems y ver cómo se separan automáticamente en hasta 3 borradores homogéneos (Materiales, Activos Fijos, Servicios).

**Independent Test**: Agregar 3 ítems de diferente tipo y verificar en pantalla la generación automática de los 3 trámites independientes sin mezcla.

- [x] T006 [P] [US1] Crear componente formulario para agregar ítems a la lista inicial `components/requisitions/item-input-form.tsx` siguiendo los tokens de `DESIGN.md`
- [x] T007 [US1] Crear componente contenedor y pestañas de trámites segregados `components/requisitions/requisition-container.tsx`
- [x] T008 [US1] Integrar estado de lista de pedido y auto-segregación en la vista principal `app/requisitions/page.tsx`

---

## Phase 4: User Story 2 - Registro de Información por Ítem y Documentos Técnicos (Priority: P1)

**Goal**: Configurar valores numéricos, precio referencial y adjuntar documento técnico (ET para Materiales/Activos, TDR PDF para Servicios).

**Independent Test**: Editar un ítem de Material (Cantidad, Unidad, Precio) comprobando el cálculo del Precio de Referencia y la adjunción obligatoria de la ET.

- [x] T009 [P] [US2] Crear componente de fila/detalle por ítem `components/requisitions/tramite-item-row.tsx` con campos numéricos, precio calculado y selector de ET/TDR
- [x] T010 [US2] Integrar consulta de partida presupuestaria externa con estado "Pendiente de asignación" en `components/requisitions/tramite-item-row.tsx`

---

## Phase 5: User Story 3 - Cabecera, Justificación y Respaldos por Trámite (Priority: P2)

**Goal**: Permitir definir la Justificación obligatoria, adjuntar proformas/cotizaciones de respaldo y registrar Custodio/Ubicación en Activos Fijos.

**Independent Test**: Completar la cabecera de un trámite de Activos Fijos verificando la exigencia de Nombre del Custodio, Ubicación y adjunción de proforma.

- [x] T011 [P] [US3] Crear componente de cabecera general del trámite `components/requisitions/tramite-card-header.tsx` para Justificación y carga de proformas
- [x] T012 [US3] Añadir campos condicionales de Custodio y Ubicación en `components/requisitions/tramite-card-header.tsx` para trámites de Activos Fijos

---

## Phase 6: User Story 4 - Envío Individual de Trámites (Priority: P2)

**Goal**: Enviar un trámite específico completado de forma independiente sin esperar a los demás.

**Independent Test**: Presionar "Enviar Trámite" en un trámite completo y comprobar que pase a estado Enviado emitiendo su número de seguimiento.

- [x] T013 [P] [US4] Crear ruta API para envío individual `app/api/requisitions/submit-single/route.ts`
- [x] T014 [US4] Implementar botón de envío individual y confirmación con toast/notificación en `components/requisitions/requisition-card.tsx`

---

## Phase 7: User Story 5 - Envío en Lote Resiliente Non-Blocking (Priority: P3)

**Goal**: Enviar múltiples trámites a la vez ("Enviar Todos los Trámites"), procesando con éxito los válidos y manteniendo los erróneos en borrador con retroalimentación clara.

**Independent Test**: Con 2 trámites válidos y 1 incompleto, presionar "Enviar Todos los Trámites" y verificar que los 2 válidos se envíen y el incompleto muestre resaltados en rojo.

- [x] T015 [P] [US5] Crear ruta API para envío resiliente en lote `app/api/requisitions/submit-batch/route.ts` utilizando `Promise.allSettled`
- [x] T016 [P] [US5] Crear prueba unitaria puntual para la lógica de respuesta del envío en lote en `tests/unit/batch-submit.test.ts`
- [x] T017 [US5] Crear componente de barra de envío masivo `components/requisitions/batch-submit-bar.tsx` con resaltado visual de errores y resumen de confirmación

---

## Phase 8: Polish & Cross-Cutting Concerns

**Purpose**: Alineación visual final de diseño y verificación de quickstart

- [x] T018 [P] Aplicar margen de seguridad inferior (`pb-16` en móvil) y paleta institucional UMSS (`#003770`, `#BC000C`) per `DESIGN.md` en `app/requisitions/page.tsx`
- [x] T019 Ejecutar guía de validación `specs/001-segregacion-tramites-lote/quickstart.md` y verificar cero errores de compilación

---

## Dependencies & Execution Order

1. **Setup (Phase 1)**: Inicia inmediatamente (T001, T002 en paralelo)
2. **Foundational (Phase 2)**: Depende de Phase 1. T003 y T005 se implementan en paralelo; T004 prueba T003.
3. **User Story 1 (Phase 3)**: Depende de Phase 2. Entrega el MVP funcional inicial.
4. **User Story 2 (Phase 4)**: Depende de US1.
5. **User Story 3 (Phase 5)**: Depende de US1. Puede correr en paralelo con US2.
6. **User Story 4 (Phase 6)**: Depende de US1, US2 y US3.
7. **User Story 5 (Phase 7)**: Depende de US4.
8. **Polish (Phase 8)**: Ajustes finales.
