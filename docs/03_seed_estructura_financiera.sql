-- ─── 03 SEED: ESTRUCTURA FINANCIERA INSTITUCIONAL (DICyT SIGEFI) ──────────────────────────────
BEGIN;

-- 1. Fuentes de Financiamiento
INSERT INTO "fuente_financiamiento" ("id", "sigla", "nombre", "id_usuario_creador") VALUES
  ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'ASDI', 'Agencia Sueca de Cooperación Internacional para el Desarrollo', 7),
  ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', 'ARES', 'Académie de Recherche et d''Enseignement Supérieur (Bélgica)', 7),
  ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a33', 'IDH', 'Fondo del Impuesto Directo a los Hidrocarburos (TGN)', 7)
ON CONFLICT ("id") DO NOTHING;

-- 2. Convenios
INSERT INTO "convenio" ("id", "id_fuente_financiamiento", "codigo_convenio", "codigo_fuente", "codigo_organismo", "numero_libreta", "nombre", "presupuesto", "fecha_inicio", "fecha_fin", "id_usuario_creador") VALUES
  ('b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'CONV-ASDI-2025-2027', '80', '520', 'LIB-ASDI-00129384', 'Programa de Fortalecimiento Institucional de Investigación ASDI-UMSS', 1800000.00, '2025-01-01', '2027-12-31', 7),
  ('b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', 'CONV-ARES-2025-2026', '41', '519', 'LIB-ARES-00982341', 'Convenio Bilateral Académico Bélgica-Bolivia VLIR-ARES', 1200000.00, '2025-01-01', '2026-12-31', 7),
  ('b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a33', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a33', 'CONV-IDH-2026', '44', '729', 'LIB-IDH-00441122', 'Fondo Competitivo Proyectos de Investigación IDH UMSS 2026', 850000.00, '2026-01-01', '2026-12-31', 7)
ON CONFLICT ("id") DO NOTHING;

-- 3. Tipos de Programa y Programas
INSERT INTO "tipo_programa" ("id", "codigo", "nombre") VALUES
  (1, 'ASDI_PRG', 'Programa de Apoyo e Innovación Tecnológica (ASDI)'),
  (2, 'ARES_PRG', 'Programa de Biotecnología y Desarrollo Humano (ARES)'),
  (3, 'IDH_PRG', 'Programa de Investigación Científica y Tecnológica IDH')
ON CONFLICT ("id") DO UPDATE SET "codigo" = EXCLUDED."codigo", "nombre" = EXCLUDED."nombre";

INSERT INTO "programa" ("id", "id_convenio", "id_programa_padre", "id_tipo_programa", "codigo_direccion_administrativa", "codigo_unidad_ejecutora", "codigo_programa", "codigo_actividad", "codigo_finalidad_funcion", "sigla", "nombre", "presupuesto", "id_usuario_creador") VALUES
  (1, 'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', NULL, 1, '16', '33', '101', '1', '970', 'PROG-ASDI-FORT', 'Programa de Fortalecimiento a la Gestión de Investigación ASDI', 1800000.00, 7),
  (2, 'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 1, 1, '16', '33', '101', '3', '970', 'SUBP-AGRO', 'Subprograma de Innovación Agrometeorológica y Cambio Climático', 800000.00, 7),
  (3, 'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', NULL, 2, '16', '30', '512', '4', '970', 'PROG-ARES-BIO', 'Programa de Biotecnología Rawsayta Awanachej', 1200000.00, 7),
  (4, 'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a33', NULL, 3, '16', '33', '513', '68', '970', 'PROG-IDH-DOC', 'Programa Doctoral y Proyectos de Investigación IDH', 850000.00, 7)
ON CONFLICT ("id") DO NOTHING;

-- Asignación de Usuarios de Programa (Incluye Lic. Iván Fuentes como Coordinador de Programa)
INSERT INTO "programa_usuario" ("id_programa", "id_usuario", "id_rol") VALUES
  (1, 8, 8), -- Iván Fuentes -> Coordinador Programa ASDI
  (2, 8, 8), -- Iván Fuentes -> Coordinador Subprograma Agrometeorológico
  (3, 8, 8), -- Iván Fuentes -> Coordinador Programa ARES
  (4, 8, 8), -- Iván Fuentes -> Coordinador Programa IDH
  (1, 1, 1),
  (2, 1, 1),
  (3, 2, 1),
  (4, 1, 1)
ON CONFLICT DO NOTHING;

-- 4. Proyectos de Investigación y Usuarios
-- id_estado_proyecto variado a propósito para cubrir los 4 estados de memoria de cálculo (HU Lista de Proyectos)
INSERT INTO "proyecto" ("id", "id_estado_proyecto", "id_programa", "nombre", "codigo", "presupuesto", "fecha_inicio", "fecha_fin", "id_usuario_creador") VALUES
  (1, 1, 2, 'Implementación de IA para la Agricultura de Precisión en el Valle Alto', 'SISIN-89301294', 450000.00, '2025-01-01', '2026-12-31', 1),
  (2, 4, 3, 'Biotecnología Celular y Extractos Vegetales RAWSAYTA', 'SISIN-98210492', 600000.00, '2025-01-15', '2026-12-31', 2),
  (3, 3, 4, 'Estudio Agroecológico de Variedades de Trigo Resistentes a la Sequía', 'SISIN-77102948', 350000.00, '2026-01-01', '2026-12-31', 1),
  (4, 2, 2, 'Investigación Forestal y Monitoreo de Microclimas Tropicales', 'SISIN-66291039', 350000.00, '2026-02-01', '2026-12-31', 2)
ON CONFLICT ("id") DO UPDATE SET "id_estado_proyecto" = EXCLUDED."id_estado_proyecto";

INSERT INTO "proyecto_usuario" ("id_proyecto", "id_usuario", "id_rol") VALUES
  (1, 1, 1),
  (1, 2, 2),
  (2, 2, 1),
  (3, 1, 1),
  (4, 2, 1)
ON CONFLICT DO NOTHING;

-- 5. Presupuestos por Gestión Fiscal y Partidas Concretas
INSERT INTO "presupuesto_gestion" ("id", "id_proyecto", "gestion", "presupuesto", "observaciones", "id_usuario_creador") VALUES
  (1, 1, 2025, 200000.00, 'Gestión 2025 Aprobada', 3),
  (2, 1, 2026, 250000.00, 'Gestión 2026 Aprobada', 3),
  (3, 2, 2025, 300000.00, 'Gestión 2025 Aprobada VLIR', 3),
  (4, 2, 2026, 300000.00, 'Gestión 2026 Aprobada VLIR', 3),
  (5, 3, 2026, 350000.00, 'Gestión 2026 IDH Única', 3),
  (6, 4, 2026, 350000.00, 'Gestión 2026 ASDI Forestal', 3)
ON CONFLICT ("id") DO NOTHING;

INSERT INTO "partida_concreta" ("id", "id_proyecto", "id_presupuesto_gestion", "id_partida", "presupuesto") VALUES
  (1, 1, 2, 1, 70000.00),  -- Proy 1 (2026): Partida 34200 (Bs. 70,000)
  (2, 1, 2, 2, 20000.00),  -- Proy 1 (2026): Partida 39500 (Bs. 20,000)
  (3, 1, 2, 3, 160000.00), -- Proy 1 (2026): Partida 43120 (Bs. 160,000)
  (4, 2, 4, 1, 100000.00), -- Proy 2 (2026): Partida 34200 (Bs. 100,000)
  (5, 2, 4, 4, 150000.00), -- Proy 2 (2026): Partida 43400 (Bs. 150,000)
  (6, 2, 4, 6, 50000.00),  -- Proy 2 (2026): Partida 25600 (Bs. 50,000)
  (7, 3, 5, 5, 80000.00),  -- Proy 3 (2026): Partida 31100 (Bs. 80,000)
  (8, 3, 5, 8, 120000.00), -- Proy 3 (2026): Partida 43110 (Bs. 120,000)
  (9, 4, 6, 7, 90000.00)   -- Proy 4 (2026): Partida 34110 (Bs. 90,000)
ON CONFLICT ("id") DO NOTHING;

COMMIT;
