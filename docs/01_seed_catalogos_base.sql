-- ─── 01 SEED: CATÁLOGOS BASE Y USUARIOS (DICyT SIGEFI) ──────────────────────────────
BEGIN;

-- 1. Roles del Sistema DICYT
INSERT INTO "rol" ("id", "nombre") VALUES
  (1, 'Investigador Principal'),
  (2, 'Investigador de Apoyo'),
  (3, 'Resp. de Presupuestos'),
  (4, 'Resp. de Compras'),
  (5, 'Administradora DICyT'),
  (6, 'Resp. Caja Chica y Fondos'),
  (7, 'Administrador del Sistema SIGEFI'),
  (8, 'Coordinador de Programa')
ON CONFLICT ("id") DO UPDATE SET "nombre" = EXCLUDED."nombre";

-- 2. Usuarios Operativos Reales
INSERT INTO "usuario" ("id", "username", "password") VALUES
  (1, 'daniel.perez', '$2a$10$wN3wVpB9xJ4...'), -- Dr. Daniel Pérez (Investigador Principal)
  (2, 'winsor.soliz', '$2a$10$wN3wVpB9xJ4...'), -- Ing. Winsor Soliz (Investigador de Apoyo)
  (3, 'alan.presupuestos', '$2a$10$wN3wVpB9xJ4...'), -- Lic. Alan (Resp. de Presupuestos)
  (4, 'grober.compras', '$2a$10$wN3wVpB9xJ4...'), -- Grover Villarroel (Resp. de Compras)
  (5, 'eva.administracion', '$2a$10$wN3wVpB9xJ4...'), -- Lic. Eva (Administradora DICyT)
  (6, 'sergio.caja', '$2a$10$wN3wVpB9xJ4...'), -- Lic. Sergio (Resp. Caja Chica y Fondos)
  (7, 'admin.sigefi', '$2a$10$wN3wVpB9xJ4...'), -- Administrador del Sistema
  (8, 'ivan.fuentes', '$2a$10$wN3wVpB9xJ4...') -- Lic. Iván Fuentes (Coordinador de Programa)
ON CONFLICT ("id") DO UPDATE SET "username" = EXCLUDED."username";

INSERT INTO "rol_usuario" ("id_rol", "id_usuario") VALUES
  (1, 1), (2, 2), (3, 3), (4, 4), (5, 5), (6, 6), (7, 7), (8, 8)
ON CONFLICT DO NOTHING;

-- 3. Tipos de Ámbito y Entidad Sujeto
INSERT INTO "tipo_nivel_ambito" ("id", "codigo", "nombre") VALUES
  (1, 'TRAMITE', 'Nivel Global del Trámite'),
  (2, 'SUBUNIDAD', 'Nivel Sub-Unidad Polimórfica')
ON CONFLICT ("id") DO UPDATE SET "codigo" = EXCLUDED."codigo", "nombre" = EXCLUDED."nombre";

INSERT INTO "tipo_entidad_sujeto" ("id", "codigo", "nombre") VALUES
  (1, 'PROVEEDOR', 'Proveedor'),
  (2, 'PARTIDA_CONCRETA', 'Partida Concreta'),
  (3, 'HITO', 'Hito Presupuestario'),
  (4, 'DOCUMENTO', 'Documento Respaldatorio')
ON CONFLICT ("id") DO UPDATE SET "codigo" = EXCLUDED."codigo", "nombre" = EXCLUDED."nombre";

-- 4. Catálogos de Soporte Financiero y Administrativo
INSERT INTO "tipo_tramite" ("id", "nombre") VALUES
  (1, 'Compra Menor de 1001 Bs. a 20.000 Bs.')
ON CONFLICT ("id") DO UPDATE SET "nombre" = EXCLUDED."nombre";

-- Estados del flujo de memoria de cálculo del proyecto (HU: Lista de Proyectos)
INSERT INTO "estado_proyecto" ("id", "nombre") VALUES
  (1, 'Pendiente de memoria de cálculo'),
  (2, 'En revisión de memoria de cálculo'),
  (3, 'Observado'),
  (4, 'Habilitado para ejecutar partidas')
ON CONFLICT ("id") DO UPDATE SET "nombre" = EXCLUDED."nombre";

INSERT INTO "estado_item_tramite" ("id", "nombre", "descripcion") VALUES
  (1, 'PREVENTIVO', 'Reserva presupuestaria interna inicial'),
  (2, 'COMPROMETIDO', 'Afectación presupuestaria definitiva formalizada con contrato u orden'),
  (3, 'PAGADO', 'Gasto devengado y pagado respaldado con C31'),
  (4, 'REVERTIDO', 'Saldo devuelto a la partida por anulación o desistimiento')
ON CONFLICT ("id") DO UPDATE SET "nombre" = EXCLUDED."nombre", "descripcion" = EXCLUDED."descripcion";

INSERT INTO "forma_pago" ("id", "nombre") VALUES
  (1, 'Transferencia Bancaria SIGEP (C31)'),
  (2, 'Cheque Fiscal'),
  (3, 'Fondo Rotatorio (Caja Chica)'),
  (4, 'Fondo de Avance')
ON CONFLICT ("id") DO UPDATE SET "nombre" = EXCLUDED."nombre";

INSERT INTO "tipo_documento_contractual" ("id", "nombre") VALUES
  (1, 'Orden de Compra'),
  (2, 'Orden de Servicio'),
  (3, 'Contrato')
ON CONFLICT ("id") DO UPDATE SET "nombre" = EXCLUDED."nombre";

INSERT INTO "tipo_acta_recepcion_conformidad" ("id", "nombre") VALUES
  (1, 'Acta de Recepción Provisional'),
  (2, 'Acta de Recepción Definitiva y Conformidad'),
  (3, 'Acta de Conformidad')
ON CONFLICT ("id") DO UPDATE SET "nombre" = EXCLUDED."nombre";

INSERT INTO "tipo_estado_solicitud_pago" ("id", "nombre") VALUES
  (1, 'Solicitado'),
  (2, 'En Revisión de Contabilidad'),
  (3, 'Comprobante C31 Emitido'),
  (4, 'Pagado y Desembolsado')
ON CONFLICT ("id") DO UPDATE SET "nombre" = EXCLUDED."nombre";

INSERT INTO "tipo_documento_respaldo_pago" ("id", "codigo", "nombre", "es_requerido_para_cierre") VALUES
  (1, 'MEMORANDUM', 'Memorándum de Autorización de Pago', true),
  (2, 'COMPROBANTE_C31', 'Comprobante C31 de Devengado SIGEP', true),
  (3, 'CHEQUE', 'Cheque Fiscal / Transferencia Bancaria', true),
  (4, 'EJECUCION_GASTO', 'Reporte de Ejecución Presupuestaria SIGEP', false)
ON CONFLICT ("id") DO UPDATE SET "codigo" = EXCLUDED."codigo", "nombre" = EXCLUDED."nombre";

-- 5. Partidas, Ítems y Proveedores Generales
INSERT INTO "partida" ("id", "codigo") VALUES
  (1, 34200), (2, 39500), (3, 43120), (4, 43400), (5, 31100), (6, 25600), (7, 34110), (8, 43110), (9, 21600)
ON CONFLICT ("id") DO UPDATE SET "codigo" = EXCLUDED."codigo";

INSERT INTO "item" ("id", "id_partida", "nombre") VALUES
  (1, 1, 'Kit de Reactivos de Extracción de ADN Vegetal marca Qiagen'),
  (2, 1, 'Alcohol Etílico Absoluto al 99.8% Grado Analítico (1 Litro)'),
  (3, 2, 'Cajas de Papel Bond Tamaño Carta 75g de Alta Blancura'),
  (4, 2, 'Tóner HP LaserJet Pro Negro Original CF258A'),
  (5, 3, 'Servidor GPU NVIDIA RTX 4090 24GB para Procesamiento de IA'),
  (6, 3, 'Laptop Trabajo Pesado Intel Core i9 64GB RAM SSD 2TB'),
  (7, 4, 'Microscopio Biológico Binocular LED Óptica Planacromática'),
  (8, 4, 'Centrífuga Refrigerada de Alta Velocidad para Microtubos'),
  (9, 5, 'Refrigerios y Servicios de Catering para Talleres de Campo'),
  (10, 6, 'Impresión y Empastado de Libros de Resultados de Investigación'),
  (11, 7, 'Bidones de Diésel Oíl para Vehículo de Campo (100 Litros)'),
  (12, 8, 'Escritorios Ergonómicos Ejecutivos de Melamina de 1.50m')
ON CONFLICT ("id") DO UPDATE SET "nombre" = EXCLUDED."nombre";

INSERT INTO "proveedor" ("id", "nombre", "nit", "telefono", "direccion") VALUES
  (1, 'COMERCIALIZADORA TECH-BOLIVIA S.R.L.', '1029384019', '4458291', 'Av. Heroínas #456, Cochabamba'),
  (2, 'LABORATORIOS & BIOQUÍMICA ANDINA S.A.', '2049182012', '4412093', 'Calle España #123, Cochabamba'),
  (3, 'IMPRENTAS Y PAPELERÍA CENTRAL SRL', '3019284029', '4482910', 'Av. Ayacucho #789, Cochabamba'),
  (4, 'DISTRIBUIDORA DE INSUMOS CIENTÍFICOS BOLIVIA', '4091823019', '4439182', 'Calle Jordán #234, Cochabamba')
ON CONFLICT ("id") DO UPDATE SET "nombre" = EXCLUDED."nombre";

COMMIT;
