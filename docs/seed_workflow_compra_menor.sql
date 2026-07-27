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

-- 5. Estados del Paso de Flujo (Nodos Granulares de Tarea Sin Nombres de Roles)
INSERT INTO "estado_paso_flujo" ("id", "id_paso_flujo", "nombre", "es_inicial", "es_final") VALUES
  -- Paso 1: Solicitud
  (1, 1, 'Revisión de disponibilidad presupuestaria y certificación de fondos', true, false),
  (2, 1, 'Revisión técnica inicial de solicitud', false, false),
  (3, 1, 'Subsanación y realización de correcciones', false, false),
  (4, 1, 'Rechazo definitivo de la solicitud', false, true),
  (5, 1, 'Aprobación institucional de la solicitud', false, false),
  (6, 1, 'Verificación en Mercado Virtual y adjudicación provisional', false, false),
  (7, 1, 'Carga de 3 cotizaciones de proveedores', false, false),
  (8, 1, 'Adjudicación formal de proveedores', false, false),

  -- Paso 2: Recepción
  (9, 2, 'Emisión de orden de compra o contrato', false, false),
  (10, 2, 'Firma y formalización de orden de compra o contrato', false, false),
  (11, 2, 'Emisión de acta de recepción provisional', false, false),
  (12, 2, 'Emisión de acta de recepción definitiva', false, false),

  -- Paso 3: Pago
  (13, 3, 'Solicitud de pago a proveedor', false, false),
  (14, 3, 'Generación de memorándum de autorización de pago', false, false),
  (15, 3, 'Emisión de comprobante C-31 de devengado', false, false),
  (16, 3, 'Emisión de cheque o transferencia bancaria', false, false),
  (17, 3, 'Registro de ejecución presupuestaria del gasto', false, false),

  -- Paso 4: Evidencia
  (18, 4, 'Carga de expediente digital de evidencia PDF', false, false),
  (19, 4, 'Trámite completado y archivado', false, true)
ON CONFLICT ("id") DO NOTHING;

-- 6. Transiciones de Flujo (Nombres Limpios de Acciones de Administración Pública)
INSERT INTO "transicion_flujo" ("id", "id_estado_origen", "id_estado_destino", "nombre_accion") VALUES
  -- Paso 1
  (1, 1, 2, 'Aprobar Presupuesto'),
  (2, 1, 3, 'Observar y Solicitar Corrección'),
  (3, 2, 5, 'Aprobar Revisión Inicial'),
  (4, 2, 3, 'Observar Solicitud'),
  (5, 2, 4, 'Rechazar Solicitud'),
  (6, 3, 1, 'Subsanar a Presupuestos'),
  (7, 3, 2, 'Subsanar a Compras'),
  (8, 5, 6, 'Aprobar y Derivar a Compras'),
  (9, 6, 7, 'Habilitar Carga de Cotizaciones'),
  (10, 7, 8, 'Completar Cotizaciones y Adjudicar'),
  (11, 8, 9, 'Finalizar Adjudicación e Iniciar Recepción'),

  -- Paso 2
  (12, 9, 10, 'Emitir Orden de Compra'),
  (13, 10, 11, 'Registrar Firmas e Iniciar Recepción'),
  (14, 11, 11, 'Registrar Entrega Parcial'),
  (15, 11, 12, 'Emitir Acta Definitiva'),
  (16, 12, 13, 'Concluir Recepción e Iniciar Pago'),

  -- Paso 3
  (17, 13, 14, 'Solicitar Pago a Proveedor'),
  (18, 14, 15, 'Emitir Memorándum de Pago'),
  (19, 15, 16, 'Registrar Comprobante C-31'),
  (20, 16, 17, 'Efectuar Desembolso'),
  (21, 17, 18, 'Registrar Ejecución de Gasto'),

  -- Paso 4
  (22, 18, 19, 'Consolidar Expediente y Finalizar Trámite')
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
