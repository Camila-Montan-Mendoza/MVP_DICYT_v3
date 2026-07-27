-- ─── SEED DATA FOR COMPRA MENOR (1.001 Bs. a 20.000 Bs. de Material) ──────────────

-- 1. Insertar Catálogos Básicos
INSERT INTO "estado_proyecto" ("id", "nombre") VALUES
  (1, 'Ejecución')
ON CONFLICT ("id") DO NOTHING;

INSERT INTO "tipo_tramite" ("id", "nombre") VALUES
  (1, 'Compra Menor de 1.001 Bs. a 20.000 Bs. de Material')
ON CONFLICT ("id") DO NOTHING;

-- 2. Insertar Roles de Dominio (Coincidentes con las tablas reales del usuario)
INSERT INTO "rol" ("id", "nombre") VALUES
  (1, 'Investigador Principal'),
  (2, 'Investigador de Apoyo'),
  (3, 'Responsable de Presupuestos'),
  (4, 'Compras y Contrataciones'),
  (5, 'Administradora DICYT'),
  (6, 'Caja Chica y Fondos'),
  (7, 'Administrador del Sistema SIGEFI')
ON CONFLICT ("id") DO NOTHING;

-- 3. Insertar Usuarios con auth_user_id reales de Supabase Auth
INSERT INTO "usuario" ("id", "username", "password", "auth_user_id") VALUES
  (1, 'daniel', NULL, 'cbdf0369-07b2-452e-9a3c-52350f9d510c'),
  (2, 'winsor', NULL, '944df2d1-7d5e-4b0d-a8e4-7d1614442ab5'),
  (3, 'alan', NULL, 'e2d08a9f-0fdf-444e-9b47-022fc8a329f4'),
  (4, 'grober', NULL, '055e0430-e587-4045-99cf-3dffffcabec4'),
  (5, 'eva', NULL, '022531c9-3ed5-421c-a00f-5e9611e7c1d1'),
  (6, 'sergio', NULL, '130d2d56-6bac-446c-a994-fbe3664a3b24'),
  (7, 'carlos', NULL, '526c7df5-cef8-4f04-85f3-2dc9b589bc7d')
ON CONFLICT ("id") DO UPDATE SET "auth_user_id" = EXCLUDED."auth_user_id";

-- Relacionar Usuarios con Roles
INSERT INTO "rol_usuario" ("id_rol", "id_usuario") VALUES
  (1, 1), -- Daniel -> Investigador Principal
  (2, 2), -- Winsor -> Investigador de Apoyo
  (3, 3), -- Alan -> Responsable de Presupuestos
  (4, 4), -- Grober -> Compras y Contrataciones
  (5, 5), -- Eva -> Administradora DICYT
  (6, 6), -- Sergio -> Caja Chica y Fondos
  (7, 7)  -- Carlos -> Administrador del Sistema SIGEFI
ON CONFLICT DO NOTHING;

-- 4. Pasos del Flujo de Trámite (Pasos Macro 1 a 4)
INSERT INTO "paso_flujo" ("id", "id_tipo_tramite", "nombre", "orden") VALUES
  (1, 1, 'PASO 1: Solicitud', 1),
  (2, 1, 'PASO 2: Recepción', 2),
  (3, 1, 'PASO 3: Pago', 3),
  (4, 1, 'PASO 4: Evidencia', 4)
ON CONFLICT ("id") DO NOTHING;

-- 5. Estados del Paso de Flujo (Nodos Granulares de Tarea)
INSERT INTO "estado_paso_flujo" ("id", "id_paso_flujo", "nombre", "es_inicial", "es_final") VALUES
  -- Paso 1: Solicitud
  (1, 1, 'Revisión de presupuesto y fondos (Resp. Presupuesto)', true, false),
  (2, 1, 'Revisión inicial (Resp. Compras)', false, false),
  (3, 1, 'Realizar correcciones (Investigador)', false, false),
  (4, 1, 'Rechazar solicitud (Resp. Compras)', false, true),
  (5, 1, 'Aprobar solicitud (Administrador DICyT)', false, false),
  (6, 1, 'Revisar ítems mercado virtual y adjudicar provisional (Resp. Compras)', false, false),
  (7, 1, 'Subir 3 cotizaciones (Investigador)', false, false),
  (8, 1, 'Adjudicar proveedores (Investigador)', false, false),

  -- Paso 2: Recepción
  (9, 2, 'Emitir orden de compra o contrato (Resp. Compras)', false, false),
  (10, 2, 'Imprimir y efectuar orden de compra o contrato, hacer firmar (Investigador)', false, false),
  (11, 2, 'Realizar acta de recepción provisional (Investigador)', false, false),
  (12, 2, 'Realizar acta de recepción definitiva (Investigador)', false, false),

  -- Paso 3: Pago
  (13, 3, 'Solicitar pago a proveedor (Investigador)', false, false),
  (14, 3, 'Generar memorándum (Administrador DICyT)', false, false),
  (15, 3, 'Emisión de comprobante C-31 (Contabilidad DICyT)', false, false),
  (16, 3, 'Emitir cheque o transferencia (Administrador DICyT)', false, false),
  (17, 3, 'Subir registro de ejecución de gasto (Resp. Presupuesto)', false, false),

  -- Paso 4: Evidencia
  (18, 4, 'Subir documento PDF de evidencia (Investigador)', false, false),
  (19, 4, 'Trámite completado', false, true)
ON CONFLICT ("id") DO NOTHING;

-- 6. Transiciones de Flujo (Acciones de Avanzar / Rebotar)
INSERT INTO "transicion_flujo" ("id", "id_estado_origen", "id_estado_destino", "nombre_accion") VALUES
  -- Paso 1
  (1, 1, 2, 'Fondos Suficientes -> Enviar a Compras'),
  (2, 1, 3, 'Solicitar Correcciones a Investigador'),
  (3, 2, 5, 'Aprobar -> Enviar a Admin DICYT'),
  (4, 2, 3, 'Solicitar Correcciones a Investigador'),
  (5, 2, 4, 'Rechazar Solicitud'),
  (6, 3, 1, 'Reenviar a Presupuestos'),
  (7, 3, 2, 'Reenviar a Compras'),
  (8, 5, 6, 'Aprobar -> Derivar a Mercado Virtual'),
  (9, 6, 7, 'Avanzar a Carga de 3 Cotizaciones'),
  (10, 7, 8, 'Cotizaciones Cargadas -> Adjudicar'),
  (11, 8, 9, 'Finalizar Adjudicación -> Paso 2 Recepción'),

  -- Paso 2
  (12, 9, 10, 'Orden Emitida -> Enviar a Firma'),
  (13, 10, 11, 'Documento Firmado -> Iniciar Recepción'),
  (14, 11, 11, 'Cargar Otra Acta Provisional (Bucle)'),
  (15, 11, 12, 'Conformidad Definitiva -> Crear Acta Definitiva'),
  (16, 12, 13, 'Conformidad Definitiva -> Paso 3 Pago'),

  -- Paso 3
  (17, 13, 14, 'Solicitar Pago -> Admin DICYT'),
  (18, 14, 15, 'Memorándum Generado -> Contabilidad C-31'),
  (19, 15, 16, 'Comprobante C-31 Emitido -> Pago'),
  (20, 16, 17, 'Desembolso Realizado -> Registro Gasto'),
  (21, 17, 18, 'Gasto Registrado -> Paso 4 Evidencia'),

  -- Paso 4
  (22, 18, 19, 'Cargar Evidencia Final -> Completar Trámite')
ON CONFLICT ("id") DO NOTHING;

-- 7. Asignación de Roles por Estado de Paso
INSERT INTO "rol_estado_paso_flujo" ("id_rol", "id_estado_paso_flujo") VALUES
  (3, 1),  -- Nodo 1.1 -> Resp. Presupuesto (Alan)
  (4, 2),  -- Nodo 1.2 -> Compras y Contrataciones (Grober)
  (1, 3),  -- Nodo 1.3 -> Investigador Principal (Daniel)
  (4, 4),  -- Nodo 1.4 -> Compras y Contrataciones (Grober)
  (5, 5),  -- Nodo 1.5 -> Administradora DICYT (Eva)
  (4, 6),  -- Nodo 1.6 -> Compras y Contrataciones (Grober)
  (1, 7),  -- Nodo 1.7 -> Investigador Principal (Daniel)
  (1, 8),  -- Nodo 1.8 -> Investigador Principal (Daniel)
  (4, 9),  -- Nodo 2.1 -> Compras y Contrataciones (Grober)
  (1, 10), -- Nodo 2.2 -> Investigador Principal (Daniel)
  (1, 11), -- Nodo 2.3 -> Investigador Principal (Daniel)
  (1, 12), -- Nodo 2.4 -> Investigador Principal (Daniel)
  (1, 13), -- Nodo 3.1 -> Investigador Principal (Daniel)
  (5, 14), -- Nodo 3.2 -> Administradora DICYT (Eva)
  (6, 15), -- Nodo 3.3 -> Caja Chica y Fondos / Contabilidad (Sergio)
  (5, 16), -- Nodo 3.4 -> Administradora DICYT (Eva)
  (3, 17), -- Nodo 3.5 -> Resp. Presupuesto (Alan)
  (1, 18), -- Nodo 4.1 -> Investigador Principal (Daniel)
  (1, 19)  -- Nodo 4.2 -> Sistema
ON CONFLICT DO NOTHING;
