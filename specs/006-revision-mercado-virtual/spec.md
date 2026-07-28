# Feature Specification: Verificación de Disponibilidad en Mercado Virtual SIGEP por Ítem

**Feature Branch**: `006-revision-mercado-virtual`  
**Created**: 2026-07-28  
**Status**: Draft

**Input**: User description: "Verificación de disponibilidad en Mercado Virtual SIGEP por ítem (Grover - Resp. Compras). Evaluación de existencia ítem por ítem para Materiales y Activos Fijos (Servicios se omiten), registro de datos de proveedor del catálogo SIGEP con sugerencia inteligente, derivación automática de ítems no encontrados a cotización, y botón de descarga de Plantilla Oficial de Proforma en Blanco."

---

## User Scenarios & Testing _(mandatory)_

<!--
  MVP & TESTING NOTE: This project is an MVP for fast validation.
  Limit testing to essential, targeted unit tests ("pruebas unitarias bien puntuales") for critical core logic.
  DESIGN SYSTEM NOTE: All UI components strictly adhere to DESIGN.md (institutional UMSS colors Azul #002855 / #003770, Rojo #BC000C, badges de estado verde para "Encontrado", rojo para "No encontrado").
-->

### User Story 1 (HU-1): Verificación Granular por Ítem en Mercado Virtual

#### Card (Tarjeta)

**Como** Responsable de Compras (Ing. Grover Villarroel),  
**Quiero** consultar la lista de ítems del trámite (Materiales o Activos Fijos) y marcar individualmente si cada ítem existe o no en el Mercado Virtual del SIGEP,  
**Para** clasificar los ítems disponibles en catálogo público y filtrar únicamente los faltantes para el proceso de cotizaciones.

#### Design (Diseño)

- 🔗 Figma - `revision_de_items_en_mercado_virtual`
- 🔗 Figma - `modal_registro_proveedor_item_MV`
- 🔗 Figma - `modal_visualizacion_proveedor_item_MV`

#### Conversation (Conversación)

- **Aplica solo a Materiales y Activos Fijos**: En trámites de Servicios, esta tarea se omite automáticamente avanzando al siguiente estado.
- **Doble Ventana Operativa**: Grover trabaja con 2 ventanas (el sistema SIGEFI DICyT y el sistema externo SIGEP).
- **Estados por Ítem**: Cada ítem puede estar en estado `Pendiente`, `Encontrado` (Verde) o `No encontrado` (Rojo).
- **Acción Global**: Al finalizar la clasificación de todos los ítems, el botón `Revisión realizada` permite avanzar la tarea.

#### Confirmation (Criterios de Aceptación)

- **Dado que** Grover está revisando un trámite de Materiales o Activos Fijos,
- **Cuando** evalúa la existencia de un ítem en el portal externo de SIGEP,
- **Entonces** puede seleccionar el estado `Encontrado` o `No encontrado` en el selector desplegable de dicho ítem.

---

### User Story 2 (HU-2): Registro y Visualización de Proveedor SIGEP para Ítems Encontrados

#### Card (Tarjeta)

**Como** Responsable de Compras (Ing. Grover Villarroel),  
**Quiero** registrar los datos del catálogo SIGEP (Nombre del proveedor, NIT, Unidad, Cantidad disponible y Precio unitario) para cada ítem marcado como existente,  
**Para** eximir a dicho ítem del requisito de 3 cotizaciones y guardar la referencia del proveedor adjudicado directo.

#### Design (Diseño)

- 🔗 Figma - `modal_registro_proveedor_item_MV`
- 🔗 Figma - `modal_visualizacion_proveedor_item_MV`

#### Conversation (Conversación)

- **Modal de Registro**: Al cambiar el estado de un ítem a `Encontrado`, se abre el modal para ingresar: Nombre del Proveedor, NIT, Unidad, Cantidad disponible y Precio unitario.
- **Sugerencia de Proveedor Previo**: Si ya se registró un proveedor en un ítem anterior del mismo trámite, el sistema lo sugiere en una lista/dropdown para evitar la reescritura.
- **Ficha de Proveedor en Tabla**: Una vez registrado, la columna "PROVEEDOR" muestra la tarjeta del proveedor con el botón de ojo (para ver detalles) y el botón de cruz (para desasignar/eliminar).

#### Confirmation (Criterios de Aceptación)

- **Dado que** Grover marca un ítem como `Encontrado`,
- **Cuando** se despliega el modal de registro,
- **Entonces** debe ingresar Nombre/Razón Social, NIT, Unidad, Cantidad y Precio unitario del catálogo SIGEP, quedando exento de cotizaciones.
- **Dado que** ya existe un proveedor registrado en otro ítem del mismo trámite,
- **Cuando** registra un nuevo ítem existente,
- **Entonces** el sistema le sugiere reutilizar el proveedor ya ingresado.

---

### User Story 3 (HU-3): Derivación Automática de Ítems Inexistentes y Descarga de Proforma en Blanco

#### Card (Tarjeta)

**Como** Responsable de Compras (Ing. Grover Villarroel),  
**Quiero** que los ítems marcados como `No encontrado` se agrupen automáticamente para la siguiente etapa de cotización y disponer de un botón para descargar la Plantilla Oficial de Proforma en Blanco,  
**Para** entregar a los investigadores la plantilla normativa impresa que deben presentar a los cotizadores.

#### Design (Diseño)

- 🔗 Figma - `revision_de_items_en_mercado_virtual`

#### Conversation (Conversación)

- **Agrupamiento Automático**: Todos los ítems marcados como `No encontrado` pasan a la lista de ítems pendientes de cotización.
- **Descarga de Proforma**: Incluye un botón interactivo "Descargar Proforma en Blanco" que genera o descarga el PDF oficial para cotización física.

#### Confirmation (Criterios de Aceptación)

- **Dado que** existen ítems marcados como `No encontrado`,
- **Cuando** Grover completa la revisión haciendo clic en "Revisión realizada",
- **Entonces** el sistema avanza el trámite derivando solo los ítems no encontrados a la tarea de registro de cotizaciones.

---

## Functional Requirements

- **FR-1**: El sistema DEBE permitir marcar el estado de Mercado Virtual por cada ítem (`Pendiente`, `Encontrado`, `No encontrado`).
- **FR-2**: El sistema DEBE omitir automáticamente la revisión de Mercado Virtual cuando el trámite pertenezca a la categoría `SERVICIO`.
- **FR-3**: El sistema DEBE solicitar mediante un modal los campos obligatorios (_Nombre del Proveedor, NIT, Unidad, Cantidad disponible, Precio unitario_) cuando un ítem se marque como `Encontrado`.
- **FR-4**: El sistema DEBE ofrecer autocompletado o sugerencia rápida de proveedores previamente registrados dentro del mismo trámite.
- **FR-5**: El sistema DEBE permitir la previsualización y eliminación del proveedor asignado a un ítem en la tabla.
- **FR-6**: El sistema DEBE agrupar únicamente los ítems `No encontrado` para la subsiguiente tarea de cotización.
- **FR-7**: El sistema DEBE proveer la funcionalidad para descargar la Plantilla Oficial de Proforma en Blanco (PDF).

---

## Success Criteria

- **SC-1**: El 100% de los ítems en trámites de Materiales y Activos Fijos pueden ser clasificados individualmente en Mercado Virtual.
- **SC-2**: Los ítems clasificados como `Encontrado` quedan exentos de la regla de 3 cotizaciones.
- **SC-3**: El registro de un proveedor recurrente en el modal requiere 1 solo clic mediante la sugerencia inteligente.

---

## Assumptions

- Grover consulta el portal público de SIGEP en una pestaña secundaria del navegador web.
- Los trámites de servicios no requieren verificación en Mercado Virtual.
