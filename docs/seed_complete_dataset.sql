-- ─── COMPLETE RICH DATASET SEED FOR MVP DICYT SIGEFI ──────────────────────────────

-- 1. Insertar Roles del Sistema DICYT
INSERT INTO "rol" ("id", "nombre") VALUES
  (1, 'Investigador Principal'),
  (2, 'Coordinador de Proyecto'),
  (3, 'Responsable de Presupuestos'),
  (4, 'Compras y Contrataciones'),
  (5, 'Administrador / Director DICYT'),
  (6, 'Caja Chica y Fondos')
ON CONFLICT ("id") DO NOTHING;

-- 2. Insertar Usuarios Operativos Reales
INSERT INTO "usuario" ("id", "username", "password") VALUES
  (1, 'daniel.perez', '$2a$10$wN3wVpB9xJ4...'), -- Dr. Daniel Pérez (Investigador)
  (2, 'winsor.soliz', '$2a$10$wN3wVpB9xJ4...'), -- Ing. Winsor Soliz (Investigador)
  (3, 'alan.presupuestos', '$2a$10$wN3wVpB9xJ4...'), -- Alan (Resp. Presupuestos)
  (4, 'grober.compras', '$2a$10$wN3wVpB9xJ4...'), -- Grober Villarroel (Compras)
  (5, 'eva.administracion', '$2a$10$wN3wVpB9xJ4...'), -- Eva (Administración)
  (6, 'sergio.caja', '$2a$10$wN3wVpB9xJ4...') -- Sergio (Tesorería / Caja)
ON CONFLICT ("id") DO NOTHING;

INSERT INTO "rol_usuario" ("id_rol", "id_usuario") VALUES
  (1, 1), (1, 2), (3, 3), (4, 4), (5, 5), (6, 6)
ON CONFLICT DO NOTHING;

-- 3. Estructura Financiera Completa (Fuentes, Convenios, Programas y Proyectos)
INSERT INTO "fuente_financiamiento" ("id", "nombre") VALUES
  ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'TGN - Recursos Propios DICYT'),
  ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', 'Cooperación Internacional VLIR-UOS'),
  ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a33', 'Fondo de Apoyo a la Investigación Doctoral')
ON CONFLICT ("id") DO NOTHING;

INSERT INTO "convenio" ("id", "id_fuente_financiamiento", "nombre", "presupuesto") VALUES
  ('b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Convenio DICYT Investigación 2026', 800000.00),
  ('b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', 'Convenio Bilateral Bélgica-Bolivia VLIR', 1200000.00),
  ('b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a33', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a33', 'Convenio Formación Posgrado Sandwich', 450000.00)
ON CONFLICT ("id") DO NOTHING;

INSERT INTO "programa" ("id", "id_convenio", "id_programa_padre", "nombre", "presupuesto") VALUES
  (1, 'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', NULL, 'Programa de Innovación Tecnológica Agrometeorológica', 800000.00),
  (2, 'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', NULL, 'Programa de Biotecnología Rawsayta Awanachej', 1200000.00),
  (3, 'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a33', NULL, 'Programa Doctoral Sandwich en Ciencia Agrícola', 450000.00)
ON CONFLICT ("id") DO NOTHING;

ALTER TABLE "partida_concreta" ALTER COLUMN "codigo" TYPE INTEGER;

INSERT INTO "proyecto" ("id", "id_estado_proyecto", "id_programa", "nombre", "codigo", "presupuesto", "fecha_inicio", "fecha_fin") VALUES
  (1, 1, 1, 'Implementación de IA para la Agricultura', 'PROY-2026-001', 250000.00, '2026-01-01', '2026-12-31'),
  (2, 1, 2, 'VLIR RAWSAYTA AWANACHEJ', 'PROY-2026-002', 450000.00, '2026-01-15', '2027-01-15'),
  (3, 1, 3, 'Programa Doctoral Sandwich En Agricultura', 'PROY-2026-003', 180000.00, '2026-02-01', '2026-11-30'),
  (4, 1, 1, 'Investigación Forestal Tropical', 'PROY-2026-004', 310000.00, '2026-03-01', '2026-12-31')
ON CONFLICT ("id") DO NOTHING;

-- 4. Partidas Concretas de Objeto del Gasto (5 Dígitos)
INSERT INTO "partida_concreta" ("id", "id_proyecto", "codigo", "presupuesto") VALUES
  (1, 1, 34200, 45000.00), -- Productos Químicos y Farmacéuticos
  (2, 1, 39500, 15000.00), -- Útiles de Escritorio y Oficina
  (3, 1, 43120, 60000.00), -- Equipo de Computación
  (4, 2, 34200, 80000.00), -- Productos Químicos para VLIR
  (5, 2, 43400, 95000.00), -- Equipo Médico y de Laboratorio
  (6, 3, 43110, 40000.00), -- Equipo de Oficina y Muebles
  (7, 4, 34110, 30000.00)  -- Combustibles y Lubricantes
ON CONFLICT ("id") DO NOTHING;

-- 5. Catálogo de Ítems Disponibles
INSERT INTO "item" ("id", "id_partida", "nombre") VALUES
  (1, 1, 'Kit de Reactivos para Extracción de ADN Vegetal'),
  (2, 1, 'Frascos de Alcohol Etílico al 96% (1 Litro)'),
  (3, 2, 'Tóner HP LaserJet Pro Negro Original'),
  (4, 2, 'Cajas de Papel Bond Tamaño Carta 75g'),
  (5, 3, 'Tarjeta Gráfica GPU NVIDIA RTX 4090 24GB'),
  (6, 3, 'Computadora Portátil Intel Core i9 32GB RAM'),
  (7, 4, 'Reactivos de Extracto Botánico Bioquímico'),
  (8, 5, 'Microscopio Binocular Biológico LED'),
  (9, 6, 'Proyector Multimedia 4K y Ecran Retráctil'),
  (10, 7, 'Bidones de Diésel Oíl para Equipo de Campo')
ON CONFLICT ("id") DO NOTHING;

-- 6. Proveedores Adjudicados
INSERT INTO "proveedor" ("id", "nombre", "nit", "telefono", "direccion") VALUES
  (1, 'COMERCIALIZADORA TECH-BOLIVIA S.R.L.', '1029384019', '4458291', 'Av. Heroínas #456, Cochabamba'),
  (2, 'LABORATORIOS & BIOQUÍMICA ANDINA S.A.', '2049182012', '4412093', 'Calle España #123, Cochabamba'),
  (3, 'IMPRENTAS Y PAPELERÍA CENTRAL SRL', '3019284029', '4482910', 'Av. Ayacucho #789, Cochabamba')
ON CONFLICT ("id") DO NOTHING;

-- 7. Trámites Registrados en Diversos Estados del Flujo de Compra Menor
INSERT INTO "tramite" ("id", "id_proyecto", "id_tipo_tramite", "id_estado_tramite", "id_proveedor_adjudicado", "fecha_creacion") VALUES
  -- Trámite 1: En inicio (Paso 1.1: Revisión presupuestaria)
  (1, 1, 1, 1, NULL, '2026-01-15 10:00:00'),
  -- Trámite 2: En revisión de Compras (Paso 1.2: Revisión técnica)
  (2, 2, 1, 2, NULL, '2026-01-18 14:30:00'),
  -- Trámite 3: En cotizaciones y adjudicación (Paso 1.8: Adjudicación formal)
  (3, 1, 1, 8, 1, '2026-01-20 09:15:00'),
  -- Trámite 4: En recepción provisional (Paso 2.3: Entrega parcial)
  (4, 2, 1, 11, 2, '2026-01-22 16:00:00'),
  -- Trámite 5: En solicitud de pago (Paso 3.1: Pago a proveedor)
  (5, 4, 1, 13, 3, '2026-01-24 11:20:00'),
  -- Trámite 6: Trámite completado y archivado (Paso 4.2)
  (6, 3, 1, 19, 1, '2026-01-25 17:45:00')
ON CONFLICT ("id") DO NOTHING;

-- 8. Ítems Solicitados por Trámite
INSERT INTO "tramite_item" ("id", "id_item", "id_tramite", "existe_en_mercado_virtual") VALUES
  (1, 5, 1, true),  -- GPU RTX 4090 en Trámite 1
  (2, 1, 1, false), -- Kit ADN en Trámite 1
  (3, 7, 2, true),  -- Reactivos en Trámite 2
  (4, 9, 6, true)   -- Proyector en Trámite 6
ON CONFLICT ("id") DO NOTHING;

-- 9. Historial de Auditoría de Transiciones de Estado
INSERT INTO "historial_estado_tramite" ("id_tramite", "id_estado_anterior", "id_estado_nuevo", "id_usuario_responsable", "observaciones") VALUES
  (1, 1, 1, 1, 'Trámite iniciado por Dr. Daniel Pérez para investigación en IA'),
  (2, 1, 2, 3, 'Sello preventivo aprobado por Alan. Derivado a Compras.'),
  (3, 1, 8, 4, 'Cotizaciones cargadas y proveedor adjudicado por Grober Villarroel'),
  (4, 8, 11, 1, 'Acta provisional emitida por recepción parcial de laboratorio'),
  (5, 11, 13, 1, 'Conformidad emitida. Derivado a Tesorería para pago'),
  (6, 18, 19, 5, 'Expediente digital consolidado y trámite completado')
ON CONFLICT DO NOTHING;
