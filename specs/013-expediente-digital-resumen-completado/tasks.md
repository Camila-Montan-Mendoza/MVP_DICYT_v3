# Tasks: Expediente Digital de Respaldos y Resumen de Trámite Completado (Paso 4)

**Input**: Design documents from `/specs/013-expediente-digital-resumen-completado/`

**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests Policy**: This project is an MVP for fast validation. Tests are strictly OPTIONAL and limited only to essential, targeted unit tests ("pruebas unitarias bien puntuales") for core business logic.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Includes exact file paths in descriptions

## Phase 1: Setup (Shared Infrastructure)

- [x] T001 Define TypeScript data interfaces in `types/expediente.ts`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

- [x] T002 Create Supabase data service `services/expedienteService.ts` with `obtenerArchivosExpediente`, `guardarArchivoExpediente`, `eliminarArchivoExpediente`, `archivarExpedienteFinal`, and `obtenerResumenEjecutivoTramite` methods
- [x] T003 [P] Create unit tests for file size formatting in `tests/unit/expedienteValidation.test.ts`

**Checkpoint**: Foundation ready - user story implementation can now begin

---

## Phase 3: User Story 1 - Carga y Archivación del Expediente Digital Final (Tarea 18) (Priority: P1) 🎯 MVP

**Goal**: Render "Resumen de archivos" card with drag-and-drop file uploader, file list (icon, size, eye view, red trash delete), and "Archivar respaldos" button.

**Independent Test**: Load Tarea 18 for a tramite in Step 4, upload files, verify list rendering with file formats and size, and click "Archivar respaldos" to advance to Tarea 19.

- [x] T004 [P] [US1] Create "Resumen de archivos" mockup card component in `components/tramites/evidencia/TarjetaResumenArchivos.tsx`
- [x] T005 [US1] Implement active workflow view in `components/workflow/views/paso-4-evidencia/tarea-18-expediente-digital-active.tsx` fetching real data from Supabase DB and handling dossier archiving

**Checkpoint**: User Story 1 is fully functional and testable independently (MVP ready)

---

## Phase 4: User Story 2 - Visor Resumen Ejecutivo Integral del Trámite Completado (Tarea 19) (Priority: P2)

**Goal**: Render executive summary card consolidating all 4 steps with the `TRÁMITE COMPLETADO Y ARCHIVADO` badge.

**Independent Test**: Load Tarea 19 for a completed tramite, verify full executive summary with request, reception, payment, and dossier sections.

- [x] T006 [P] [US2] Create executive summary card component in `components/tramites/evidencia/FichaResumenEjecutivoTramite.tsx`
- [x] T007 [US2] Implement active and passive workflow views in `components/workflow/views/paso-4-evidencia/tarea-19-tramite-completado-active.tsx` and `passive.tsx`

**Checkpoint**: User Stories 1 AND 2 work independently

---

## Phase 5: User Story 3 - Previsualización y Eliminación de Archivos (Priority: P3)

**Goal**: Provide document modal preview and draft file removal controls in the dossier uploader.

**Independent Test**: Click eye icon on any uploaded file to preview document modal, click red trash icon to delete file from draft list.

- [x] T008 [P] [US3] Connect modal preview and delete handlers in `components/tramites/evidencia/TarjetaResumenArchivos.tsx`

**Checkpoint**: All user stories are independently functional

---

## Phase 6: Polish & Cross-Cutting Concerns

- [x] T009 [P] Implement passive workflow view in `components/workflow/views/paso-4-evidencia/tarea-18-expediente-digital-passive.tsx` for read-only dossier viewing
- [x] T010 Run TypeScript build verification (`npx tsc --noEmit`) and validate end-to-end workflow

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: Can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3+)**: Depend on Foundational phase completion
- **Polish (Phase 6)**: Depend on user stories completion

---

## Parallel Opportunities

- T003 [P] can run in parallel with T002
- T004 [P] [US1] can run in parallel with T006 [P] [US2] and T008 [P] [US3]
- T009 [P] can run in parallel with T010
