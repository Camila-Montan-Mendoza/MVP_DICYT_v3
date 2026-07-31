# Feature Specification: Realizar Modificación Presupuestaria de Proyecto

**Feature Directory**: `specs/022-modificacion-presupuestaria`

**Created**: 2026-07-31

**Status**: Draft

**Input**: User description: "Como Investigador Principal, deseo ver todas las partidas de mi proyecto con su monto disponible, mover montos entre partidas existentes o añadir partidas nuevas, con una justificación que indique automáticamente los códigos de las partidas de origen y destino más un texto complementario, y poder imprimir la solicitud en el formato oficial, para cubrir un déficit sin excederme del presupuesto disponible. Incluye subdivisión en la navegación de Trámites (Compras/Contrataciones vs Modificaciones Presupuestarias)."

---

## User Scenarios & Testing

### User Story 1 - Navegación y Listado de Modificaciones Presupuestarias (Priority: P1) 🎯 MVP

Como Investigador Principal o Responsable de Presupuestos, quiero acceder a la sección de "Modificaciones Presupuestarias" dentro del módulo de Trámites, para visualizar el historial de solicitudes de modificación registradas con su estado actual y disponer de la opción de crear una nueva modificación.

**Mockup**: ![Mockup HU1 - Listado de modificaciones](mockups/hu1-lista-modificaciones.png)

**Why this priority**: Es la puerta de entrada y el punto de acceso para listar, filtrar e iniciar trámites de modificación presupuestaria.

**Independent Test**: Navegar a la sección Trámites, hacer clic en la pestaña "Modificaciones Presupuestarias", verificar que se listan las solicitudes registradas con su código (`#TR-2026-XXXX`), proyecto, fecha, estado y monto total modificado.

**Acceptance Scenarios**:

1. **Given** un usuario autenticado en la sección Trámites, **When** selecciona la pestaña "Modificaciones Presupuestarias", **Then** el sistema muestra la tabla con el listado de modificaciones registradas en el proyecto.
2. **Given** la lista de modificaciones, **When** el Investigador Principal presiona "+ Nueva Modificación Presupuestaria", **Then** el sistema abre el modal de selección de partidas.

---

### User Story 2 - Modal de Selección de Partidas y Detección de Déficit (Priority: P1)

Como Investigador Principal, quiero ver en un modal todas las partidas de mi proyecto con su saldo disponible actual y un aviso si existe un déficit detectado, para seleccionar los montos a quitar de partidas con saldo y aumentar en partidas con necesidad.

**Mockup**: ![Mockup HU2 - Modal modificar presupuesto](mockups/hu2-modal-modificar-presupuesto.png)

**Why this priority**: Permite la selección inicial de saldos y la detección rápida del monto deficitario a cubrir.

**Independent Test**: Abrir el modal "Modificar Presupuesto", filtrar por texto o estado de partida, ingresar un monto a quitar en una partida con saldo suficiente y un monto a aumentar, verificar que los totales de Quitar y Aumentar se calculan dinámicamente.

**Acceptance Scenarios**:

1. **Given** el modal "Modificar Presupuesto" abierto, **When** el usuario visualiza la tabla, **Then** se listan todas las partidas del proyecto con su código, descripción, saldo actual disponible y campos de entrada para "Quitar (-)" y "Aumentar (+)".
2. **Given** un trámite con déficit, **When** se abre el modal desde una solicitud de compra sin saldo suficiente, **Then** se despliega una alerta flotante destacada "DÉFICIT DETECTADO" indicando el total requerido para cubrir el déficit.
3. **Given** una partida con saldo actual, **When** el usuario ingresa un monto a quitar mayor a su saldo disponible, **Then** el sistema bloquea la entrada y muestra una advertencia de saldo insuficiente.
4. **Given** la selección de partidas completada, **When** el usuario presiona "+ Agregar movimientos", **Then** el sistema traslada las partidas seleccionadas al panel principal de modificación.

---

### User Story 3 - Panel de Detalle y Balance de Modificación Presupuestaria (Priority: P1)

Como Investigador Principal, quiero visualizar en dos paneles paralelos las partidas afectadas (origen "De") y las partidas beneficiadas (destino "A"), con una validación en tiempo real del cuadre de montos, para asegurar que la suma total quitada sea exactamente igual a la suma total asignada.

**Mockup**: ![Mockup HU3 - Panel de detalle y balance](mockups/hu3-panel-detalle-balance.png)

**Why this priority**: Es el núcleo de la edición detallada y garantiza la regla de negocio fundamental del cuadre a cero ($Total\,Quitado = Total\,Aumentado$).

**Independent Test**: Ajustar montos en los paneles "Partidas Afectadas (De)" y "Partidas Beneficiadas (A)", verificar que la tarjeta "ESTADO DE VALIDACIÓN" muestra "Balance: 0.00 Bs — Montos Validados" en verde cuando cuadran, o bloquea el envío si existe diferencia.

**Acceptance Scenarios**:

1. **Given** la pantalla de detalle de modificación, **When** se cargan las partidas, **Then** se presentan dos tablas paralelas: "Partidas Afectadas (De)" a la izquierda y "Partidas Beneficiadas (A)" a la derecha, cada una con su buscador local y botón de eliminación por fila.
2. **Given** cambios en los montos de cualquier tabla, **When** el total quitado es exactamente igual al total aumentado, **Then** la tarjeta de validación muestra en verde "Balance: 0.00 Bs — Montos Validados" y habilita el botón "Confirmar Modificación".
3. **Given** un desbalance entre lo quitado y lo aumentado, **When** el usuario intenta enviar, **Then** el sistema muestra la diferencia, marca la inconsistencia en rojo y deshabilita la confirmación.

---

### User Story 4 - Justificación con Códigos Automáticos y Texto Complementario (Priority: P1)

Como Investigador Principal, quiero que el sistema genere automáticamente los códigos de las partidas de origen y destino en la justificación formal, para evitar errores de digitación manual y permitirme añadir el motivo explicativo complementario.

**Mockup**: ![Mockup HU4 - Justificación con códigos automáticos](mockups/hu4-[#JUSTIFICACION].png)

**Why this priority**: Automatiza el formato requerido por la normativa de la DICYT evitando errores de codificación manual.

**Independent Test**: Seleccionar partidas origen (ej. 31120, 39700) y destino (ej. 22110), ingresar un texto de motivo en el área de justificación, y verificar que el texto final ensamblado contiene tanto los códigos automáticos como el texto libre.

**Acceptance Scenarios**:

1. **Given** partidas origen y destino seleccionadas, **When** el usuario revisa el área de justificación, **Then** el sistema encabeza automáticamente el texto con `"De: [códigos origen] A: [códigos destino]"`.
2. **Given** el campo de justificación libre, **When** el investigador redacta el motivo del ajuste, **Then** el motivo complementario se anexa a la justificación formal del trámite.

---

### User Story 5 - Envío a Revisión y Aplicación Diferida en la Memoria de Cálculo (Priority: P1)

Como Investigador Principal y Responsable de Presupuestos, quiero que la modificación registrada pase al estado "Pendiente de revisión" sin alterar saldos inmediatamente, y que al ser aprobada se actualicen de forma atómica los montos asignados y disponibles en la memoria de cálculo del proyecto.

**Why this priority**: Garantiza el control presupuestario y la integridad atómica de los saldos del proyecto.

**Acceptance Scenarios**:

1. **Given** una modificación validada y justificada, **When** el Investigador presiona "Confirmar Modificación", **Then** el trámite se registra en estado "Pendiente de revisión" y no altera los saldos actuales del proyecto hasta su aprobación.
2. **Given** una solicitud en estado "Pendiente de revisión", **When** el Responsable de Presupuestos la aprueba, **Then** el sistema recalcula atómicamente el monto asignado y el saldo disponible de cada partida afectada en la memoria de cálculo del proyecto.

---

### User Story 6 - Impresión/Exportación en Formato Oficial (Priority: P2)

Como Investigador Principal, quiero imprimir o exportar la solicitud de modificación presupuestaria aprobada en el formato oficial impreso, con las tablas de partidas afectadas, partidas beneficiadas, justificación y firmas correspondientes.

**Why this priority**: Proporciona el respaldo documental físico que exige la normativa institucional de la UMSS.

**Acceptance Scenarios**:

1. **Given** una modificación aprobada, **When** el usuario hace clic en "Imprimir Solicitud", **Then** se genera una vista limpia o PDF con las tablas "De la partida afectada" y "En favor a la partida", justificación completa y bloque de firmas del Investigador.

---

## Requirements

### Functional Requirements

- **FR-001**: El sistema DEBE ofrecer una sub-navegación dentro de Trámites dividida en "Compras / Contrataciones" y "Modificaciones Presupuestarias".
- **FR-002**: El sistema DEBE listar las modificaciones presupuestarias del proyecto con su código de trámite (`#TR-2026-XXXX`), fecha, solicitante, estado y total presupuestario modificado.
- **FR-003**: El sistema DEBE abrir un modal de selección de partidas que enumere todas las partidas de la memoria de cálculo con su saldo disponible actual y permita buscar por código, nombre o ítem.
- **FR-004**: En caso de iniciarse por déficit de compra, el modal DEBE calcular y mostrar una alerta destacada "DÉFICIT DETECTADO" con el monto total requerido.
- **FR-005**: El sistema NO DEBE permitir retirar de una partida de origen un monto superior a su saldo disponible actual.
- **FR-006**: El sistema DEBE permitir buscar e incorporar partidas del catálogo general que aún no formen parte del proyecto, únicamente como partidas de destino ("Aumentar"), nunca de origen ("Quitar").
- **FR-007**: El sistema DEBE presentar la edición detallada en dos paneles paralelos: "Partidas Afectadas (De)" y "Partidas Beneficiadas (A)".
- **FR-008**: El sistema DEBE validar en tiempo real que $\sum Monto\,Quitado === \sum Monto\,Aumentado$, mostrando el estado de validación en verde cuando cuadre a $0,00\,Bs$ y deshabilitando la confirmación si no cuadra.
- **FR-009**: El sistema DEBE armar automáticamente el prefijo de justificación con la lista de códigos de origen y destino (`De: [códigos] A: [códigos]`) y permitir anexar texto libre complementario.
- **FR-010**: Al confirmar, el trámite DEBE registrarse en estado "Pendiente de revisión" sin modificar los saldos de la memoria de cálculo.
- **FR-011**: Al ser aprobada la solicitud por el Responsable de Presupuestos, el sistema DEBE actualizar atómicamente la memoria de cálculo del proyecto (monto asignado y disponible recalculado).
- **FR-012**: Todas las interfaces DEBEN cumplir con `DESIGN.md` (paleta institucional UMSS `#003770`, `#BC000C`, componentes shadcn/ui, íconos SVG de `lucide-react`, cero emojis).

### Key Entities

- **ModificacionPresupuestaria**: Trámite de modificación. Atributos: `id`, `codigoTramite`, `proyectoId`, `solicitanteId`, `solicitanteNombre`, `fecha`, `estado` (`PENDIENTE`, `APROBADO`, `RECHAZADO`), `totalModificado`, `justificacionCodigos`, `justificacionTexto`, `fechaAprobacion`.
- **MovimientoPartida**: Fila individual de traspaso. Atributos: `id`, `modificacionId`, `partidaOrigenId`, `partidaOrigenCodigo`, `partidaDestinoId`, `partidaDestinoCodigo`, `monto`.
- **PartidaProyecto**: Partida asociada al proyecto con `montoAsignado`, `montoComprometido`, `montoEjecutado`, `montoDisponible`.

---

## Success Criteria

### Measurable Outcomes

- **SC-001**: El Investigador Principal puede configurar una modificación presupuestaria equilibrada y registrarla en menos de 2 minutos.
- **SC-002**: El 100% de los intentos de envío con montos desbalanceados ($\sum Quitado \neq \sum Aumentado$) son bloqueados automáticamente por la validación en tiempo real.
- **SC-003**: El 100% de las justificaciones guardadas incluyen de forma automática y precisa los códigos de las partidas de origen y destino afectadas.
- **SC-004**: Ningún saldo disponible es modificado en el sistema antes de la aprobación explícita de la modificación.

---

## Assumptions & Gaps

- **Membreste Institucional y Firma Formal**: La numeración correlativa tipo "EMBATE 89/2026" y autoridades destinatarias fijas se dejan como campos configurables o parametrizables para la fase de exportación final.
- **Mock Data First**: Toda la persistencia opera mediante `mockModificacionService` sincronizado con `localStorage` (`sigefi_mock_modificaciones`).
