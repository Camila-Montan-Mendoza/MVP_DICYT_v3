# Feature Specification: Descarga de Plantilla y Transcripción de Proformas/Cotizaciones por el Investigador

**Feature Branch**: `007-registro-cotizaciones-proformas`  
**Created**: 2026-07-28  
**Status**: Draft

**Input**: User description: "Descarga de plantilla general en blanco de proforma y transcripción digital de proformas/cotizaciones obtenidas en el mercado por el Investigador Principal/Apoyo. Incluye validación de topes de cantidad solicitada, control aritmético, flete para el interior, regla de existencias (exigencia de 4ta cotización si 2 de 3 son 'Sin Existencia'), y diseño exacto del modal de registro de proforma."

---

## User Scenarios & Testing _(mandatory)_

<!--
  MVP & TESTING NOTE: This project is an MVP for fast validation.
  Limit testing to essential, targeted unit tests ("pruebas unitarias bien puntuales") for critical core logic.
  DESIGN SYSTEM NOTE: All UI components strictly adhere to DESIGN.md (institutional UMSS colors Azul #002855 / #001B47, Rojo #BC000C).
-->

### User Story 1 (HU-1): Descarga de Plantilla General de Proforma en Blanco (Card, Conversation, Confirmation)

#### Card (Tarjeta)

**Como** Investigador Principal o Investigador de Apoyo,  
**Quiero** descargar e imprimir la plantilla oficial de proforma en blanco de la UMSS desde la interfaz de cotizaciones,  
**Para** presentarla físicamente a las empresas proveedoras del mercado para su llenado, firma y sellado manuscrito.

#### Design (Diseño)

- 🔗 Figma - `Cotizaciones Registradas` (Botón `Plantilla de proforma` en la cabecera)

#### Conversation (Conversación)

- El botón `Plantilla de proforma` está visible de forma destacada en la vista principal de la tarea.
- Genera y descarga un archivo PDF formateado de acuerdo con la norma de la UMSS listo para imprimir.

#### Confirmation (Criterios de Aceptación)

- **Dado que** el Investigador está en la tarea de Registrar Cotizaciones,
- **Cuando** presiona el botón "Plantilla de proforma",
- **Entonces** el sistema descarga automáticamente el PDF de la plantilla en blanco.

---

### User Story 2 (HU-2): Transcripción Digital de Proforma Física en Modal Interactivo

#### Card (Tarjeta)

**Como** Investigador Principal o Investigador de Apoyo,  
**Quiero** transcribir los datos de las proformas físicas obtenidas mediante el modal "Nueva Cotización - Proforma",  
**Para** registrar digitalmente los datos del proveedor, condiciones comerciales (tiempo de entrega, validez de oferta, garantía) y precios por ítem.

#### Design (Diseño)

- 🔗 Figma - Modal `Nueva Cotización - Proforma`
  - Sección `DATOS DEL PROVEEDOR`: `No. de NIT`, `Teléfono`, `Dirección`, `Proforma preparada por`.
  - Sección `CONDICIONES DEL PROVEEDOR`: `Tiempo Entrega (Días)`, `Validez de Oferta (Días)`, `Tiempo Garantía (Años)`.
  - Tabla de ítems con switch `Con existencia` / `Sin existencia`, cálculo automático de `Total (Bs.)`.

#### Conversation (Conversación)

- **Selección Acotada**: Solo se pueden agregar e incluir ítems que pertenecen a la solicitud original del trámite.
- **Control de Cantidad Máxima**: Si la cantidad cotizada supera la cantidad solicitada previamente, el sistema muestra la alerta: `"La cantidad cotizada no puede ser mayor a la cantidad solicitada ([N] unidades)"`.
- **Cálculo Automático**: Total (Bs.) = Cantidad × Precio Unitario (Bs.).

#### Confirmation (Criterios de Aceptación)

- **Dado que** el Investigador abre el modal "Nueva Cotización - Proforma",
- **Cuando** ingresa el NIT, teléfono, dirección, condiciones de entrega/garantía y precio unitario por ítem,
- **Entonces** el sistema valida que la cantidad no exceda el tope solicitado y calcula automáticamente los totales.

---

### User Story 3 (HU-3): Regla de Existencias y Exigencia de 4ta Cotización

#### Card (Tarjeta)

**Como** Investigador Principal o Investigador de Apoyo,  
**Quiero** que el sistema evalúe el estado de existencia de los ítems transcritos en las 3 proformas,  
**Para** que si 2 de las 3 proformas registran "Sin Existencia", el sistema exija obligatoriamente transcribir una 4ta cotización con existencia antes de avanzar a la adjudicación.

#### Design (Diseño)

- 🔗 Figma - `Cotizaciones Registradas` (Tabla con lista de proformas cargadas y botón `Cotización realizada`)

#### Conversation (Conversación)

- **Regla 1**: Si 1 de 3 cotizaciones es "Sin Existencia", se puede continuar con las 2 válidas.
- **Regla 2**: Si 2 de 3 cotizaciones son "Sin Existencia", el botón `Cotización realizada` bloquea el avance y exige transcribir una 4ta proforma con existencia.

#### Confirmation (Criterios de Aceptación)

- **Dado que** se han registrado 3 cotizaciones,
- **Cuando** 2 de las 3 cotizaciones están marcadas como "Sin Existencia",
- **Entonces** el sistema requiere obligatoriamente una 4ta proforma para permitir finalizar la tarea.

---

## Functional Requirements

- **FR-1**: El sistema DEBE ofrecer un botón para descargar la Plantilla de Proforma en Blanco (PDF).
- **FR-2**: El sistema DEBE presentar la tabla de cotizaciones registradas con las columnas: `PROVEEDOR`, `TOTAL BS.`, `TIEMPO ENTREGA` y `ACCIONES` (editar/eliminar).
- **FR-3**: El modal `Nueva Cotización - Proforma` DEBE solicitar: NIT, Teléfono, Dirección, Nombre de quien preparó la proforma, Tiempo de Entrega (Días), Validez de Oferta (Días) y Tiempo de Garantía (Años).
- **FR-4**: El sistema DEBE restringir la selección de ítems únicamente a los solicitados en el trámite original.
- **FR-5**: El sistema DEBE validar que la cantidad en la proforma no sea superior a la cantidad solicitada original, bloqueando el guardado si se excede.
- **FR-6**: El sistema DEBE calcular automáticamente `Total = Cantidad * Precio Unitario`.
- **FR-7**: El sistema DEBE permitir marcar cada ítem con el switch `Con existencia` / `Sin existencia`.
- **FR-8**: El sistema DEBE exigir la transcripción de una 4ta proforma si 2 de las 3 cotizaciones iniciales presentan estado `Sin Existencia`.

---

## Success Criteria

- **SC-1**: El 100% de las proformas transcritas respetan los topes de cantidad de la solicitud original.
- **SC-2**: Ninguna cotización con 2 ítems "Sin Existencia" puede avanzar a la adjudicación sin la 4ta proforma.
- **SC-3**: El cálculo aritmético de totales es 100% automatizado sin margen de error manual.

---

## Assumptions

- Las proformas físicas son obtenidas por los investigadores en el mercado local o nacional y transcritas fielmente en el sistema.
- Los datos ingresados se persisten directamente en Supabase PostgreSQL en la tabla `cotizacion` / `item_cotizacion`.
