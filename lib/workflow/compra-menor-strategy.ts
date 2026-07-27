export type ActorRolCode = "I" | "RP" | "RC" | "AD" | "CD";

export interface AccionTransicion {
  id: string;
  label: string;
  siguienteNodoId: string;
  tipo: "AVANZAR" | "REBOTAR" | "RECHAZAR" | "REPETIR_BUCLE";
  varianteBtn: "primary" | "secondary" | "danger" | "outline";
}

export interface NodoWorkflow {
  id: string;
  pasoNumero: 1 | 2 | 3 | 4;
  pasoNombre: string;
  nombre: string;
  actorRol: ActorRolCode;
  actorNombreRol: string;
  instruccion: string;
  acciones: AccionTransicion[];
}

export const NODOS_COMPRA_MENOR: Record<string, NodoWorkflow> = {
  // PASO 1: Solicitud
  node_1_1: {
    id: "node_1_1",
    pasoNumero: 1,
    pasoNombre: "Solicitud",
    nombre: "Revisión de presupuesto y fondos",
    actorRol: "RP",
    actorNombreRol: "Responsable de Presupuesto (Alan)",
    instruccion: "Verificar disponibilidad de saldo en partidas asignadas y certificar fondos.",
    acciones: [
      {
        id: "act_1_1_a",
        label: "✓ Fondos Suficientes (Avanzar a Revisión Inicial)",
        siguienteNodoId: "node_1_2",
        tipo: "AVANZAR",
        varianteBtn: "primary",
      },
      {
        id: "act_1_1_b",
        label: "⚠️ Rebotar a Correcciones (Investigador)",
        siguienteNodoId: "node_1_3",
        tipo: "REBOTAR",
        varianteBtn: "secondary",
      },
    ],
  },
  node_1_2: {
    id: "node_1_2",
    pasoNumero: 1,
    pasoNombre: "Solicitud",
    nombre: "Revisión inicial",
    actorRol: "RC",
    actorNombreRol: "Responsable de Compras (Grover)",
    instruccion: "Revisión técnica inicial de especificaciones y documentación de respaldo.",
    acciones: [
      {
        id: "act_1_2_a",
        label: "✓ Aprobar (Enviar a Administrador DICYT)",
        siguienteNodoId: "node_1_5",
        tipo: "AVANZAR",
        varianteBtn: "primary",
      },
      {
        id: "act_1_2_b",
        label: "⚠️ Solicitar Correcciones a Investigador",
        siguienteNodoId: "node_1_3",
        tipo: "REBOTAR",
        varianteBtn: "secondary",
      },
      {
        id: "act_1_2_c",
        label: "🛑 Rechazar Solicitud",
        siguienteNodoId: "node_1_4",
        tipo: "RECHAZAR",
        varianteBtn: "danger",
      },
    ],
  },
  node_1_3: {
    id: "node_1_3",
    pasoNumero: 1,
    pasoNombre: "Solicitud",
    nombre: "Realizar correcciones",
    actorRol: "I",
    actorNombreRol: "Investigador Principal (Daniel / Marcelino)",
    instruccion: "Corregir las observaciones enviadas por Presupuestos o Compras.",
    acciones: [
      {
        id: "act_1_3_a",
        label: "Reenviar a Presupuestos",
        siguienteNodoId: "node_1_1",
        tipo: "AVANZAR",
        varianteBtn: "primary",
      },
      {
        id: "act_1_3_b",
        label: "Reenviar a Compras",
        siguienteNodoId: "node_1_2",
        tipo: "AVANZAR",
        varianteBtn: "secondary",
      },
    ],
  },
  node_1_4: {
    id: "node_1_4",
    pasoNumero: 1,
    pasoNombre: "Solicitud",
    nombre: "Rechazar solicitud",
    actorRol: "RC",
    actorNombreRol: "Responsable de Compras (Grover)",
    instruccion: "Trámite rechazado de forma definitiva.",
    acciones: [],
  },
  node_1_5: {
    id: "node_1_5",
    pasoNumero: 1,
    pasoNombre: "Solicitud",
    nombre: "Aprobar solicitud",
    actorRol: "AD",
    actorNombreRol: "Administrador DICYT (Eva)",
    instruccion: "Aprobación institucional de la solicitud de compra menor.",
    acciones: [
      {
        id: "act_1_5_a",
        label: "✓ Aprobar y Derivar a Mercado Virtual",
        siguienteNodoId: "node_1_6",
        tipo: "AVANZAR",
        varianteBtn: "primary",
      },
    ],
  },
  node_1_6: {
    id: "node_1_6",
    pasoNumero: 1,
    pasoNombre: "Solicitud",
    nombre: "Revisar ítems mercado virtual y adjudicar provisional",
    actorRol: "RC",
    actorNombreRol: "Responsable de Compras (Grover)",
    instruccion: "Verificar disponibilidad en Mercado Virtual SIGEP y emitir reporte de inexistencias.",
    acciones: [
      {
        id: "act_1_6_a",
        label: "Avanzar a Carga de 3 Cotizaciones",
        siguienteNodoId: "node_1_7",
        tipo: "AVANZAR",
        varianteBtn: "primary",
      },
    ],
  },
  node_1_7: {
    id: "node_1_7",
    pasoNumero: 1,
    pasoNombre: "Solicitud",
    nombre: "Subir 3 cotizaciones",
    actorRol: "I",
    actorNombreRol: "Investigador Principal (Daniel / Marcelino)",
    instruccion: "Adjuntar las 3 cotizaciones de proveedores del mercado local.",
    acciones: [
      {
        id: "act_1_7_a",
        label: "Cotizaciones Cargadas -> Adjudicar Proveedor",
        siguienteNodoId: "node_1_8",
        tipo: "AVANZAR",
        varianteBtn: "primary",
      },
    ],
  },
  node_1_8: {
    id: "node_1_8",
    pasoNumero: 1,
    pasoNombre: "Solicitud",
    nombre: "Adjudicar proveedores",
    actorRol: "I",
    actorNombreRol: "Investigador Principal (Daniel / Marcelino)",
    instruccion: "Seleccionar proveedor adjudicado basándose en cuadro comparativo de menor precio.",
    acciones: [
      {
        id: "act_1_8_a",
        label: "Finalizar Adjudicación -> Avanzar a Paso 2: Recepción",
        siguienteNodoId: "node_2_1",
        tipo: "AVANZAR",
        varianteBtn: "primary",
      },
    ],
  },

  // PASO 2: Recepción
  node_2_1: {
    id: "node_2_1",
    pasoNumero: 2,
    pasoNombre: "Recepción",
    nombre: "Emitir orden de compra o contrato",
    actorRol: "RC",
    actorNombreRol: "Responsable de Compras (Grover)",
    instruccion: "Emitir Orden de Compra formal (o contrato si supera norma técnica).",
    acciones: [
      {
        id: "act_2_1_a",
        label: "Orden de Compra / Contrato Emitido -> Enviar a Firma",
        siguienteNodoId: "node_2_2",
        tipo: "AVANZAR",
        varianteBtn: "primary",
      },
    ],
  },
  node_2_2: {
    id: "node_2_2",
    pasoNumero: 2,
    pasoNombre: "Recepción",
    nombre: "Imprimir y efectuar orden de compra o contrato, hacer firmar respectivamente",
    actorRol: "I",
    actorNombreRol: "Investigador Principal (Daniel / Marcelino)",
    instruccion: "Gestionar firmas físicas/digitales de autoridad y proveedor.",
    acciones: [
      {
        id: "act_2_2_a",
        label: "Documento Firmado -> Iniciar Recepción de Material",
        siguienteNodoId: "node_2_3",
        tipo: "AVANZAR",
        varianteBtn: "primary",
      },
    ],
  },
  node_2_3: {
    id: "node_2_3",
    pasoNumero: 2,
    pasoNombre: "Recepción",
    nombre: "Realizar acta de recepción provisional",
    actorRol: "I",
    actorNombreRol: "Investigador Principal (Daniel / Marcelino)",
    instruccion: "Registrar entregas parciales del proveedor en laboratorio o almacén.",
    acciones: [
      {
        id: "act_2_3_loop",
        label: "➕ Registrar Otra Acta Provisional (Entrega Parcial)",
        siguienteNodoId: "node_2_3",
        tipo: "REPETIR_BUCLE",
        varianteBtn: "outline",
      },
      {
        id: "act_2_3_a",
        label: "✓ Entrega Completa -> Crear Acta Definitiva",
        siguienteNodoId: "node_2_4",
        tipo: "AVANZAR",
        varianteBtn: "primary",
      },
    ],
  },
  node_2_4: {
    id: "node_2_4",
    pasoNumero: 2,
    pasoNombre: "Recepción",
    nombre: "Realizar acta de recepción definitiva",
    actorRol: "I",
    actorNombreRol: "Investigador Principal (Daniel / Marcelino)",
    instruccion: "Emitir el Acta de Conformidad Definitiva del material recibido.",
    acciones: [
      {
        id: "act_2_4_a",
        label: "Conformidad Definitiva -> Avanzar a Paso 3: Pago",
        siguienteNodoId: "node_3_1",
        tipo: "AVANZAR",
        varianteBtn: "primary",
      },
    ],
  },

  // PASO 3: Pago
  node_3_1: {
    id: "node_3_1",
    pasoNumero: 3,
    pasoNombre: "Pago",
    nombre: "Solicitar pago a proveedor",
    actorRol: "I",
    actorNombreRol: "Investigador Principal (Daniel / Marcelino)",
    instruccion: "Enviar la solicitud de desembolso o pago directo a favor del proveedor.",
    acciones: [
      {
        id: "act_3_1_a",
        label: "Enviar Solicitud de Pago -> Administrador DICYT",
        siguienteNodoId: "node_3_2",
        tipo: "AVANZAR",
        varianteBtn: "primary",
      },
    ],
  },
  node_3_2: {
    id: "node_3_2",
    pasoNumero: 3,
    pasoNombre: "Pago",
    nombre: "Generar memorándum",
    actorRol: "AD",
    actorNombreRol: "Administrador DICYT (Eva)",
    instruccion: "Emitir memorándum de autorización de pago a Contabilidad.",
    acciones: [
      {
        id: "act_3_2_a",
        label: "Memorándum Generado -> Enviar a Contabilidad",
        siguienteNodoId: "node_3_3",
        tipo: "AVANZAR",
        varianteBtn: "primary",
      },
    ],
  },
  node_3_3: {
    id: "node_3_3",
    pasoNumero: 3,
    pasoNombre: "Pago",
    nombre: "Emisión de comprobante C-31",
    actorRol: "CD",
    actorNombreRol: "Contabilidad DICYT",
    instruccion: "Registrar y emitir el Comprobante C-31 de devengado.",
    acciones: [
      {
        id: "act_3_3_a",
        label: "Comprobante C-31 Emitido -> Proceder a Pago",
        siguienteNodoId: "node_3_4",
        tipo: "AVANZAR",
        varianteBtn: "primary",
      },
    ],
  },
  node_3_4: {
    id: "node_3_4",
    pasoNumero: 3,
    pasoNombre: "Pago",
    nombre: "Emitir cheque o transferencia",
    actorRol: "AD",
    actorNombreRol: "Administrador DICYT (Eva)",
    instruccion: "Efectuar la transferencia bancaria o emisión de cheque al proveedor.",
    acciones: [
      {
        id: "act_3_4_a",
        label: "Desembolso Efectuado -> Derivar a Registro Presupuestario",
        siguienteNodoId: "node_3_5",
        tipo: "AVANZAR",
        varianteBtn: "primary",
      },
    ],
  },
  node_3_5: {
    id: "node_3_5",
    pasoNumero: 3,
    pasoNombre: "Pago",
    nombre: "Subir registro de ejecución de gasto",
    actorRol: "RP",
    actorNombreRol: "Responsable de Presupuesto (Alan)",
    instruccion: "Registrar la ejecución efectiva del gasto en el sistema presupuestario.",
    acciones: [
      {
        id: "act_3_5_a",
        label: "Ejecución Registrada -> Avanzar a Paso 4: Evidencia",
        siguienteNodoId: "node_4_1",
        tipo: "AVANZAR",
        varianteBtn: "primary",
      },
    ],
  },

  // PASO 4: Evidencia
  node_4_1: {
    id: "node_4_1",
    pasoNumero: 4,
    pasoNombre: "Evidencia",
    nombre: "Subir documento PDF de evidencia",
    actorRol: "I",
    actorNombreRol: "Investigador Principal (Daniel / Marcelino)",
    instruccion: "Cargar el expediente digital consolidado en PDF (facturas, fotos, actas).",
    acciones: [
      {
        id: "act_4_1_a",
        label: "Cargar Evidencia Final -> Concluir Trámite",
        siguienteNodoId: "node_4_2",
        tipo: "AVANZAR",
        varianteBtn: "primary",
      },
    ],
  },
  node_4_2: {
    id: "node_4_2",
    pasoNumero: 4,
    pasoNombre: "Evidencia",
    nombre: "Trámite completado",
    actorRol: "I",
    actorNombreRol: "Sistema SIGEFI DICYT",
    instruccion: "Trámite finalizado exitosamente y archivado.",
    acciones: [],
  },
};
