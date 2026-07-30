-- ─── 02 SEED: WORKFLOW COMPRA MENOR (DICyT SIGEFI) ──────────────────────────────
BEGIN;

-- 1. Pasos Macro del Flujo de Trámite
INSERT INTO "paso_flujo" ("id", "id_tipo_tramite", "nombre", "orden") VALUES
  (1, 1, 'Solicitud', 1),
  (2, 1, 'Recepción', 2),
  (3, 1, 'Pago y Evidencia', 3)
ON CONFLICT ("id") DO UPDATE SET "nombre" = EXCLUDED."nombre", "orden" = EXCLUDED."orden";

-- 2. Nodos de Tareas por Paso de Flujo
INSERT INTO "tarea_paso_flujo" ("id", "id_paso_flujo", "id_nivel_ambito", "nombre", "es_inicial", "es_final") VALUES
  -- Paso 1: Solicitud
  (1, 1, 1, 'Revisión presupuestaria', true, false),
  (2, 1, 1, 'Revisión de solicitud', false, false),
  (3, 1, 1, 'Corregir observaciones', false, false),
  (4, 1, 1, 'Rechazo definitivo de la solicitud', false, true),
  (6, 1, 1, 'Revisar items en Mercado Virtual y adjudicar', false, false),
  (7, 1, 1, 'Subir 3 cotizaciones', false, false),
  (8, 1, 1, 'Adjudicar proveedores', false, false),

  -- Paso 2: Recepción
  (9, 2, 1, 'Emitir orden de compra o contrato', false, false),
  (10, 2, 1, 'Efectuar orden de compra o contrato', false, false),
  (11, 2, 1, 'Emitir acta de recepción', false, false),

  -- Paso 3: Pago y Evidencia
  (13, 3, 1, 'Solicitud de pago a proveedor', false, false),
  (18, 3, 1, 'Resumen de archivos', false, false),
  (19, 3, 1, 'Trámite completado', false, true)
ON CONFLICT ("id") DO UPDATE SET 
  "id_paso_flujo" = EXCLUDED."id_paso_flujo",
  "id_nivel_ambito" = EXCLUDED."id_nivel_ambito",
  "nombre" = EXCLUDED."nombre",
  "es_inicial" = EXCLUDED."es_inicial",
  "es_final" = EXCLUDED."es_final";

-- 3. Transiciones de Flujo (Ordenadas secuencialmente por tarea origen -> tarea destino)
INSERT INTO "transicion_flujo" ("id", "id_tarea_origen", "id_tarea_destino", "nombre_accion") VALUES
  -- ─── Transiciones de Paso 1: Solicitud ───────────────────────────────────
  -- Tarea 1 (Revisión presupuestaria) -> Tarea 2 (Revisión de solicitud)
  (1, 1, 2, 'Aprobar Presupuesto'),
  -- Tarea 1 (Revisión presupuestaria) -> Tarea 3 (Corregir observaciones)
  (2, 1, 3, 'Observar y Solicitar Corrección'),
  -- Tarea 2 (Revisión de solicitud) -> Tarea 6 (Revisar items en Mercado Virtual)
  (17, 2, 6, 'Aprobar Solicitud y Derivar a Mercado Virtual'),
  -- Tarea 2 (Revisión de solicitud) -> Tarea 3 (Corregir observaciones)
  (3, 2, 3, 'Observar Solicitud'),
  -- Tarea 2 (Revisión de solicitud) -> Tarea 4 (Rechazo definitivo de la solicitud)
  (4, 2, 4, 'Rechazar Solicitud'),
  -- Tarea 3 (Corregir observaciones) -> Tarea 1 (Revisión presupuestaria)
  (5, 3, 1, 'Subsanar a Presupuestos'),
  -- Tarea 3 (Corregir observaciones) -> Tarea 2 (Revisión de solicitud)
  (6, 3, 2, 'Subsanar a Compras'),
  -- Tarea 6 (Revisar items en Mercado Virtual) -> Tarea 7 (Subir 3 cotizaciones)
  (7, 6, 7, 'Habilitar Carga de Cotizaciones'),
  -- Tarea 6 (Revisar items en Mercado Virtual) -> Tarea 9 (Emitir orden de compra o contrato)
  (8, 6, 9, 'Adjudicar desde Mercado Virtual'),
  -- Tarea 7 (Subir 3 cotizaciones) -> Tarea 8 (Adjudicar proveedores)
  (9, 7, 8, 'Completar Cotizaciones y Adjudicar'),
  -- Tarea 8 (Adjudicar proveedores) -> Tarea 9 (Emitir orden de compra o contrato)
  (10, 8, 9, 'Finalizar Adjudicación e Iniciar Recepción'),

  -- ─── Transiciones de Paso 2: Recepción ───────────────────────────────────
  -- Tarea 9 (Emitir orden de compra o contrato) -> Tarea 10 (Efectuar orden de compra o contrato)
  (11, 9, 10, 'Emitir Orden de Compra'),
  -- Tarea 10 (Efectuar orden de compra o contrato) -> Tarea 11 (Emitir acta de recepción)
  (12, 10, 11, 'Registrar Firmas e Iniciar Recepción'),
  -- Tarea 11 (Emitir acta de recepción) -> Tarea 11 (Bucle de Acta Provisional)
  (14, 11, 11, 'Emitir Acta Provisional'),
  -- Tarea 11 (Emitir acta de recepción) -> Tarea 13 (Solicitud de pago a proveedor)
  (13, 11, 13, 'Emitir Acta Definitiva'),

  -- ─── Transiciones de Paso 3: Pago y Evidencia ───────────────────────────
  -- Tarea 13 (Solicitud de pago a proveedor) -> Tarea 18 (Resumen de archivos)
  (15, 13, 18, 'Solicitar Pago a Proveedor'),
  -- Tarea 18 (Resumen de archivos) -> Tarea 19 (Trámite completado)
  (16, 18, 19, 'Consolidar Expediente y Finalizar Trámite')
ON CONFLICT ("id") DO UPDATE SET 
  "id_tarea_origen" = EXCLUDED."id_tarea_origen",
  "id_tarea_destino" = EXCLUDED."id_tarea_destino",
  "nombre_accion" = EXCLUDED."nombre_accion";

-- 4. Asignación de Roles por Tarea
INSERT INTO "rol_tarea_paso_flujo" ("id_rol", "id_tarea_paso_flujo") VALUES
  (3, 1),  -- Tarea 1 -> Resp. Presupuestos (Alan)
  (4, 2),  -- Tarea 2 -> Resp. Compras (Grover)
  (1, 3),  -- Tarea 3 -> Investigador Principal (Daniel)
  (4, 4),  -- Tarea 4 -> Resp. Compras (Grover)
  (4, 6),  -- Tarea 6 -> Resp. Compras (Grover)
  (1, 7),  -- Tarea 7 -> Investigador Principal (Daniel)
  (1, 8),  -- Tarea 8 -> Investigador Principal (Daniel)
  (4, 9),  -- Tarea 9 -> Resp. Compras (Grover)
  (1, 10), -- Tarea 10 -> Investigador Principal (Daniel)
  (1, 11), -- Tarea 11 -> Investigador Principal (Daniel)
  (1, 13), -- Tarea 13 -> Investigador Principal (Daniel)
  (5, 18), -- Tarea 18 -> Administradora DICyT / Archivo (Eva)
  (7, 19)  -- Tarea 19 -> Administrador del Sistema
ON CONFLICT DO NOTHING;

COMMIT;
