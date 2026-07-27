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
	"id" SERIAL NOT NULL,
	"codigo" INTEGER NOT NULL,
	"nombre" VARCHAR(255) NOT NULL,
	"descripcion" TEXT,
	CONSTRAINT "partida_pkey" PRIMARY KEY("id")
);

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

-- 3. Partidas Concretas del Proyecto ("partida_concreta")
ALTER TABLE "partida_concreta" ALTER COLUMN "codigo" TYPE INTEGER;

INSERT INTO "partida_concreta" ("id", "id_proyecto", "codigo", "presupuesto") VALUES
  (1, 1, 34200, 45000.00), -- Productos Químicos y Farmacéuticos
  (2, 1, 39500, 15000.00), -- Útiles de Escritorio y Oficina
  (3, 1, 31100, 10000.00), -- Alimentos y Bebidas para Personas
  (4, 1, 39700, 12000.00), -- Útiles y Materiales Eléctricos
  (5, 1, 39100, 8000.00),  -- Material de Limpieza e Higiene
  (6, 1, 34110, 20000.00), -- Combustibles, Lubricantes y Derivados
  (7, 1, 43120, 60000.00), -- Equipo de Computación
  (8, 1, 43110, 25000.00), -- Equipo de Oficina y Muebles
  (9, 1, 43400, 35000.00), -- Equipo Médico y de Laboratorio
  (10, 1, 43500, 20000.00),-- Equipo de Comunicación
  (11, 1, 21600, 18000.00),-- Internet y Telecomunicaciones
  (12, 1, 24120, 15000.00),-- Mantenimiento y Reparación de Equipos
  (13, 1, 25600, 7000.00)  -- Servicios de Imprenta
ON CONFLICT ("id") DO NOTHING;

-- 4. Catálogo de Ítems Disponibles ("item")
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
