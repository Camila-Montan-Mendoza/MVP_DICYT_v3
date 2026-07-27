-- ─── SEED DATA FOR PARTIDAS Y ÍTEMS (Catálogo de Partida + Partida Concreta) ──────────────

-- 1. Asegurar Estructura Financiera Inicial (Fuente de Financiamiento, Convenio, Programa y Proyecto 1)
INSERT INTO "fuente_financiamiento" ("id", "nombre") VALUES
  ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'ASDI')
ON CONFLICT ("id") DO NOTHING;

INSERT INTO "convenio" ("id", "id_fuente_financiamiento", "nombre", "presupuesto") VALUES
  ('b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Convenio DICYT Investigación 2026', 800000.00)
ON CONFLICT ("id") DO NOTHING;

INSERT INTO "programa" ("id", "id_convenio", "id_programa_padre", "nombre", "presupuesto") VALUES
  (1, 'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', NULL, 'Programa de Innovación Tecnológica Agrometeorológica', 800000.00)
ON CONFLICT ("id") DO NOTHING;

INSERT INTO "proyecto" ("id", "id_estado_proyecto", "id_programa", "nombre", "codigo", "presupuesto", "fecha_inicio", "fecha_fin") VALUES
  (1, 1, 1, 'Implementación de IA para la Agricultura', 'PROY-2026-001', 250000.00, '2026-01-01', '2026-12-31')
ON CONFLICT ("id") DO NOTHING;

-- 2. Tabla Catálogo General de Partidas ("partida")
CREATE TABLE IF NOT EXISTS "partida" (
	"id" SMALLSERIAL NOT NULL,
	"codigo" INTEGER NOT NULL,
	"nombre" VARCHAR(255) NOT NULL,
	"descripcion" TEXT,
	CONSTRAINT "partida_pkey" PRIMARY KEY("id")
);

ALTER TABLE "partida" ALTER COLUMN "codigo" TYPE INTEGER;

INSERT INTO "partida" ("id", "codigo", "nombre", "descripcion") VALUES
  (1, 34200, 'Productos Químicos y Farmacéuticos', 'Reactivos de laboratorio, compuestos químicos y fármacos'),
  (2, 39500, 'Útiles de Escritorio y Oficina', 'Papelería, tóners, bolígrafos y suministros de oficina'),
  (3, 31100, 'Alimentos y Bebidas para Personas', 'Servicios de catering, refrigerios y alimentos de trabajo'),
  (4, 39700, 'Útiles y Materiales Eléctricos', 'Cables de red, conectores, baterías y repuestos eléctricos'),
  (5, 39100, 'Material de Limpieza e Higiene', 'Detergentes, alcohol etílico y productos de bioseguridad'),
  (6, 34110, 'Combustibles, Lubricantes y Derivados', 'Diésel, gasolina y aceites para vehículos e instrumental'),
  (7, 43120, 'Equipo de Computación', 'Servidores, GPUs, laptops, monitores y almacenamiento NAS'),
  (8, 43110, 'Equipo de Oficina y Muebles', 'Escritorios, sillas ergonómicas, estantes y armarios'),
  (9, 43400, 'Equipo Médico y de Laboratorio', 'Microscopios, balanzas analíticas y espectrofotómetros'),
  (10, 43500, 'Equipo de Comunicación', 'Access Points, routers, antenas GPS y centrales telefónicas'),
  (11, 21600, 'Internet y Telecomunicaciones', 'Enlaces de fibra óptica y servicios de transmisión de datos'),
  (12, 24120, 'Mantenimiento y Reparación de Equipos', 'Servicios de reparación y mantenimiento de maquinaria y activos'),
  (13, 25600, 'Servicios de Imprenta, Fotocopiado y Fotográficos', 'Empastado, impresión de libros y memorias institucionales')
ON CONFLICT ("id") DO NOTHING;

-- 3. Partidas Concretas del Proyecto ("partida_concreta" relacionando id_proyecto con id_partida)
CREATE TABLE IF NOT EXISTS "partida_concreta" (
	"id" SERIAL NOT NULL,
	"id_proyecto" INTEGER NOT NULL,
	"id_partida" SMALLINT NOT NULL,
	"presupuesto" DECIMAL(15,2) NOT NULL CHECK ("presupuesto" >= 0),
	CONSTRAINT "partida_concreta_pkey" PRIMARY KEY("id")
);

INSERT INTO "partida_concreta" ("id", "id_proyecto", "id_partida", "presupuesto") VALUES
  (1, 1, 1, 45000.00), -- Proyecto 1, Partida 1 (34200: Productos Químicos)
  (2, 1, 2, 15000.00), -- Proyecto 1, Partida 2 (39500: Útiles de Escritorio)
  (3, 1, 3, 10000.00), -- Proyecto 1, Partida 3 (31100: Alimentos y Bebidas)
  (4, 1, 4, 12000.00), -- Proyecto 1, Partida 4 (39700: Útiles Eléctricos)
  (5, 1, 5, 8000.00),  -- Proyecto 1, Partida 5 (39100: Material de Limpieza)
  (6, 1, 6, 20000.00), -- Proyecto 1, Partida 6 (34110: Combustibles)
  (7, 1, 7, 60000.00), -- Proyecto 1, Partida 7 (43120: Equipo de Computación)
  (8, 1, 8, 25000.00), -- Proyecto 1, Partida 8 (43110: Equipo de Oficina)
  (9, 1, 9, 35000.00), -- Proyecto 1, Partida 9 (43400: Equipo Médico y Laboratorio)
  (10, 1, 10, 20000.00),-- Proyecto 1, Partida 10 (43500: Equipo de Comunicación)
  (11, 1, 11, 18000.00),-- Proyecto 1, Partida 11 (21600: Internet)
  (12, 1, 12, 15000.00),-- Proyecto 1, Partida 12 (24120: Mantenimiento)
  (13, 1, 13, 7000.00)  -- Proyecto 1, Partida 13 (25600: Imprenta)
ON CONFLICT ("id") DO NOTHING;

-- 4. Catálogo de Ítems Disponibles ("item" relacionando id_partida)
INSERT INTO "item" ("id", "id_partida", "nombre") VALUES
  (1, 1, 'Kit de Reactivos para Extracción de ADN Vegetal'),
  (2, 1, 'Frascos de Alcohol Etílico al 96% (1 Litro)'),
  (3, 2, 'Tóner HP LaserJet Pro Negro Original'),
  (4, 2, 'Cajas de Papel Bond Tamaño Carta 75g'),
  (5, 7, 'Tarjeta Gráfica GPU NVIDIA RTX 4090 24GB'),
  (6, 7, 'Computadora Portátil Intel Core i9 32GB RAM'),
  (7, 1, 'Reactivos de Extracto Botánico Bioquímico'),
  (8, 9, 'Microscopio Binocular Biológico LED'),
  (9, 8, 'Proyector Multimedia 4K y Ecran Retráctil'),
  (10, 6, 'Bidones de Diésel Oíl para Equipo de Campo')
ON CONFLICT ("id") DO NOTHING;
