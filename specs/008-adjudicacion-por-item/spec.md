# Feature Specification: Cuadro Comparativo y Adjudicación Flexible por Ítem

**Feature Branch**: `008-adjudicacion-por-item`

**Created**: 2026-07-29

**Status**: Draft

**Input**: User description: "Cuadro comparativo y adjudicación flexible por ítem realizada por el Investigador Principal Como Investigador, Quiero evaluar el cuadro comparativo de cotizaciones para seleccionar de forma independiente el proveedor ganador por cada ítem (o dividir cantidades entre proveedores según disponibilidad), Para elegir la mejor oferta técnica/económica para cada ítem, identificando los ítems sin stock que no se podrán comprar para liberar automáticamente su presupuesto al proyecto."

## User Scenarios & Testing _(mandatory)_

### User Story 1 - Selección Independiente de Proveedor por Ítem (Priority: P1)

Como Investigador Principal del proyecto DICYT, quiero visualizar el cuadro comparativo de cotizaciones y seleccionar de forma independiente un proveedor ganador diferente para cada ítem de la solicitud, para optimizar la elección técnica y económica por producto.

**Mockup**: ![Mockup HU1](mockups/hu1-seleccion-independiente-item.png)

**Why this priority**: Es el núcleo del proceso de adjudicación granular. Permite romper la rigidez de adjudicar la cotización completa a un solo proveedor y maximizar el beneficio del proyecto.

**Independent Test**: Se puede probar abriendo una solicitud con cotizaciones recibidas de al menos 2 proveedores para 2 ítems distintos, adjudicando el Ítem A al Proveedor X y el Ítem B al Proveedor Y de manera independiente.

**Acceptance Scenarios**:

1. **Given** que el Investigador Principal está revisando el cuadro comparativo de un trámite con múltiples ítems y cotizaciones, **When** selecciona al Proveedor A para el Ítem 1 y al Proveedor B para el Ítem 2, **Then** el sistema permite la selección independiente sin forzar al mismo proveedor para el resto de los ítems.
2. **Given** que se ha seleccionado un proveedor para un ítem, **When** el Investigador cambia de opinión y selecciona otro proveedor válido para ese mismo ítem, **Then** el sistema actualiza el ganador del ítem recalculando el subtotal adjudicado en tiempo real.

---

### User Story 2 - Adjudicación Dividida por Cantidades en un Ítem (Priority: P1)

Como Investigador Principal, quiero dividir la cantidad solicitada de un ítem entre dos o más proveedores cuando un solo proveedor no cuente con la disponibilidad total, para asegurar el aprovisionamiento parcial del material requerido.

**Mockup**: ![Mockup HU2](mockups/hu2-adjudicacion-dividida.png)

**Why this priority**: Resuelve problemas de disponibilidad en el mercado local y evita que la falta de stock total de un único proveedor paralice la adquisición requerida.

**Independent Test**: Se puede probar en un ítem de 5 unidades donde el Proveedor A ofrece 2 unidades y el Proveedor B ofrece 3 unidades, asignando 2 al Proveedor A y 3 al Proveedor B de forma combinada.

**Acceptance Scenarios**:

1. **Given** un ítem que requiere 5 unidades y proveedores con stock parcial (Proveedor A ofrece 2 u., Proveedor B ofrece 3 u.), **When** el Investigador asigna 2 unidades al Proveedor A y 3 unidades al Proveedor B, **Then** el sistema valida que la suma de las cantidades adjudicadas (5) coincida con la cantidad total solicitada y habilita la generación de órdenes de compra independientes por proveedor.
2. **Given** la asignación dividida de un ítem, **When** el Investigador intenta asignar una cantidad combinada mayor a la cantidad solicitada (ej. 4 unidades al A y 3 al B para un total de 7 sobre 5 solicitadas), **Then** el sistema muestra un mensaje de error impidiendo guardar la distribución hasta que la suma sea menor o igual a la cantidad solicitada.

---

### User Story 3 - Restricciones de Selección (Sin Stock y Techo de Precio Referencial) (Priority: P2)

Como Investigador Principal, quiero que el sistema deshabilite visualmente las celdas de cotizaciones "Sin Existencia" o que superen el Precio Referencial Inicial del ítem, para evitar errores en la adjudicación y cumplir las normativas financieras.

**Mockup**: ![Mockup HU3](mockups/hu3-bloqueo-sin-stock-y-techo-precio.png)

**Why this priority**: Garantiza la integridad del proceso y previene adjudicaciones inválidas por falta de existencias o sobreprecio por encima de la reserva aprobada.

**Independent Test**: Se puede probar en un cuadro comparativo donde el Proveedor X marque "Sin Existencia" en un ítem y el Proveedor Y cotice un precio unitario mayor al Precio Referencial del ítem, verificando que ambos controles de selección aparezcan deshabilitados.

**Acceptance Scenarios**:

1. **Given** que un proveedor cotizó un ítem como "Sin Existencia", **When** el Investigador visualiza la celda correspondiente a dicho proveedor e ítem, **Then** la celda se muestra deshabilitada con la etiqueta "Sin Stock", impidiendo su selección.
2. **Given** que una oferta de un proveedor supera el Precio Referencial Inicial fijado para ese ítem, **When** el Investigador revisa la celda de cotización, **Then** el sistema deshabilita la casilla de selección y despliega la alerta "El precio cotizado supera el precio referencial inicial".

---

### User Story 4 - Confirmación, Liberación Presupuestaria Automática y Justificación General (Priority: P1)

Como Investigador Principal, quiero justificar obligatoriamente las decisiones de adjudicación y confirmar el proceso para que los ítems o saldos sin stock no adjudicados liberen automáticamente su saldo preventivo hacia el presupuesto disponible de la partida del proyecto.

**Mockup**: ![Mockup HU4](mockups/hu4-confirmacion-liberacion-presupuestaria.png)

**Why this priority**: Cierra el ciclo financiero de la compra, desafectando saldos del Preventivo presupuestario sin intervención manual y registrando el respaldo legal/técnico de la decisión.

**Independent Test**: Se puede probar en un trámite donde 1 ítem quede "No Adjudicado por Falta de Stock" (o adjudicado parcialmente). Al confirmar la adjudicación con la justificación requerida, se verifica la desafectación del saldo sobrante en la partida presupuestaria.

**Acceptance Scenarios**:

1. **Given** que el Investigador ha terminado de configurar la adjudicación de todos los ítems, **When** hace clic en "Confirmar Adjudicación" sin haber llenado el campo "Justificación General de Adjudicación", **Then** el sistema bloquea el envío y marca el campo de texto como obligatorio.
2. **Given** que el Investigador completa la Justificación General y confirma la adjudicación donde existen ítems o cantidades sobrantes no adjudicadas por falta de stock, **Then** el sistema marca dicho ítem/saldo como "No Adjudicado por Falta de Stock", excluye ese monto de las Órdenes de Compra y desafecta/libera automáticamente el dinero reservado en el Preventivo, retornándolo inmediatamente al saldo disponible de la partida del proyecto.

---

### Edge Cases

- **Ningún proveedor con stock en ningún ítem**: Si todos los ítems quedan con la etiqueta "Sin Stock", el sistema permite confirmar la adjudicación justificada declarando el trámite desierto por falta de stock y liberando el 100% del Preventivo al presupuesto disponible de la partida.
- **Stock parcial que no cubre el total y no hay otros proveedores**: Si un ítem solicita 10 unidades pero el único proveedor con stock solo ofrece 4 unidades, el Investigador puede adjudicar las 4 unidades. Las 6 unidades restantes quedan marcadas como "No Adjudicadas por Falta de Stock" y su saldo presupuestario referencial se desafecta automáticamente.
- **Empate en precio y calidad**: Si dos proveedores ofrecen exactamente el mismo precio unitario (menor o igual al referencial) y ambas ofertas tienen stock disponible, la interfaz permite elegir cualquiera de los dos o dividir la cantidad, dependiendo del criterio justificado por el Investigador.

## Requirements _(mandatory)_

### Functional Requirements

- **FR-001**: El sistema DEBE presentar un cuadro comparativo matricial donde las filas representen los ítems solicitados y las columnas representen los proveedores que presentaron cotización.
- **FR-002**: El sistema DEBE permitir la selección independiente del proveedor ganador para cada ítem individual del trámite.
- **FR-003**: El sistema DEBE permitir la adjudicación de cantidades parciales de un mismo ítem repartidas entre dos o más proveedores, validando que la suma total adjudicada no exceda la cantidad requerida del ítem.
- **FR-004**: El sistema DEBE marcar visualmente como deshabilitadas con el distintivo "Sin Stock" las celdas de cotización donde el proveedor declaró "Sin Existencia" para dicho ítem, bloqueando cualquier acción de selección.
- **FR-005**: El sistema DEBE deshabilitar y bloquear la selección de cualquier oferta cuyo precio unitario cotizado supere el Precio Referencial Inicial asignado al ítem, mostrando el mensaje "El precio cotizado supera el precio referencial inicial".
- **FR-006**: El sistema DEBE identificar y clasificar automáticamente los ítems o saldo de cantidades que no hayan sido adjudicados por falta de stock con el estado "No Adjudicado por Falta de Stock".
- **FR-007**: El sistema DEBE exigir la entrada obligatoria de un texto en el campo "Justificación General de Adjudicación" a nivel del trámite antes de permitir la confirmación final de la adjudicación.
- **FR-008**: Al confirmar la adjudicación, el sistema DEBE calcular el monto total adjudicado por proveedor y generar automáticamente las previas para las Órdenes de Compra independientes correspondientes a cada proveedor con ítems asignados.
- **FR-009**: Al confirmar la adjudicación, el sistema DEBE calcular el monto total no adjudicado (proveniente de ítems desiertos o cantidades no cubiertas por falta de stock) y ejecutar la desafectación/liberación automática de dicho saldo en el Preventivo Presupuestario, abonándolo de inmediato al saldo disponible de la partida del proyecto.
- **FR-010**: El sistema DEBE mantener un registro de auditoría inmutable de la tabla de adjudicación seleccionada, la justificación ingresada, los montos adjudicados y los montos desafectados del preventivo.

### Key Entities

- **CuadroComparativo**: Entidad principal del trámite que agrupa las cotizaciones recibidas de los proveedores para los ítems de una solicitud de compra.
- **ItemSolicitud**: Cada bien o servicio requerido en el trámite, con su cantidad solicitada, unidad de medida y Precio Referencial Inicial.
- **CotizacionProveedorItem**: Registro de la oferta de un proveedor para un ítem específico, que incluye precio unitario cotizado, disponibilidad de stock (Con Stock / Sin Existencia / Cantidad Disponible) y observaciones.
- **AdjudicacionItemDetalle**: Registro de la decisión de adjudicación por ítem, que vincula la cantidad adjudicada (parcial o total) al proveedor seleccionado, o indica "No Adjudicado por Falta of Stock".
- **PreventivoPresupuestario**: Registro del monto reservado para la compra en la partida del proyecto DICYT, sobre el cual se realiza la desafectación/liberación del saldo no ejecutado.

## Success Criteria _(mandatory)_

### Measurable Outcomes

- **SC-001**: El Investigador Principal puede evaluar y completar la adjudicación por ítem de una solicitud de 10 productos en menos de 3 minutos.
- **SC-002**: El 100% de las ofertas con "Sin Existencia" o precio superior al referencial quedan bloqueadas automáticamente en la interfaz sin permitir adjudicaciones erróneas.
- **SC-003**: La desafectación presupuestaria preventiva y retorno del saldo no adjudicado a la partida del proyecto se ejecuta automáticamente en menos de 2 segundos al confirmar el formulario.
- **SC-004**: El 100% de los trámites adjudicados cuentan con la Justificación General registrada en la base de datos previa a la emisión de las Órdenes de Compra.

## Assumptions

- **A-001**: El Investigador Principal tiene el rol y permisos adecuados en la plataforma DICYT para realizar la evaluación y adjudicación del cuadro comparativo.
- **A-002**: El cuadro comparativo cuenta previamente con las cotizaciones registradas en la fase de cotización/proformas (trámite en estado de evaluación de ofertas).
- **A-003**: El Preventivo Presupuestario del trámite ya fue emitido y respaldado previamente por el monto referencial total inicial.
- **A-004**: La interfaz respeta el sistema de diseño visual definido en `DESIGN.md` (colores institucionales UMSS `--primary` #003770, `--secondary` #BC000C, diseño minimalista sin saturación y componentes shadcn/ui).
