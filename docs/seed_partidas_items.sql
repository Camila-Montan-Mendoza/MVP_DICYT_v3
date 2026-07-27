-- ─── SEED DATA FOR PARTIDAS CONCRETAS E ÍTEMS (Clasificador de Objeto del Gasto) ──────────────

-- 1. Asegurar Estructura Financiera Inicial (Fuente de Financiamiento, Convenio, Programa y Proyecto 1)
INSERT INTO "fuente_financiamiento" ("id", "nombre") VALUES
  ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'TGN - Recursos Propios DICYT')
ON CONFLICT ("id") DO NOTHING;

INSERT INTO "convenio" ("id", "id_fuente_financiamiento", "nombre", "presupuesto") VALUES
  ('b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Convenio de Cooperación e Investigación DICYT 2026', 500000.00)
ON CONFLICT ("id") DO NOTHING;

INSERT INTO "programa" ("id", "id_convenio", "id_programa_padre", "nombre", "presupuesto") VALUES
  (1, 'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', NULL, 'Programa de Innovación Tecnológica y Ciencia', 500000.00)
ON CONFLICT ("id") DO NOTHING;

-- Asegurar alteración de tipo de columna si fuera necesario para códigos de 5 dígitos (34200, 43120, etc.)
ALTER TABLE "partida_concreta" ALTER COLUMN "codigo" TYPE INTEGER;

INSERT INTO "proyecto" ("id", "id_estado_proyecto", "id_programa", "nombre", "codigo", "presupuesto", "fecha_inicio", "fecha_fin") VALUES
  (1, 1, 1, 'Implementación de IA para la Agricultura', 'PROY-2026-001', 250000.00, '2026-01-01', '2026-12-31')
ON CONFLICT ("id") DO NOTHING;

-- 2. Insertar Partidas Concretas (Basado en el Clasificador por Objeto del Gasto Oficial)
INSERT INTO "partida_concreta" ("id", "id_proyecto", "codigo", "presupuesto") VALUES
  -- Grupo 30000: MATERIALES Y SUMINISTROS
  (1, 1, 34200, 45000.00), -- Productos Químicos y Farmacéuticos (Reactivos e insumos)
  (2, 1, 39500, 15000.00), -- Útiles de Escritorio y Oficina (Tóner, papel, papelería)
  (3, 1, 31100, 10000.00), -- Alimentos y Bebidas para Personas (Refrigerios de trabajo)
  (4, 1, 39700, 12000.00), -- Útiles y Materiales Eléctricos (Cables, fusibles, baterías, conectores)
  (5, 1, 39100, 8000.00),  -- Material de Limpieza e Higiene (Desinfectantes, detergentes, alcohol)
  (6, 1, 34110, 20000.00), -- Combustibles, Lubricantes y Derivados

  -- Grupo 40000: ACTIVOS REALES
  (7, 1, 43120, 60000.00), -- Equipo de Computación (Servidores, tarjetas GPU, Laptops de alta gama)
  (8, 1, 43110, 25000.00), -- Equipo de Oficina y Muebles (Escritorios, sillas ergonómicas, estantes)
  (9, 1, 43400, 35000.00), -- Equipo Médico y de Laboratorio (Microscopios, balanzas de precisión)
  (10, 1, 43500, 20000.00),-- Equipo de Comunicación (Access Points Wi-Fi, Antenas GPS, Routers)

  -- Grupo 20000: SERVICIOS NO PERSONALES
  (11, 1, 21600, 18000.00),-- Internet y Telecomunicaciones
  (12, 1, 24120, 15000.00),-- Mantenimiento y Reparación de Equipos y Maquinaria
  (13, 1, 25600, 7000.00)  -- Servicios de Imprenta, Fotocopiado y Fotográficos
ON CONFLICT ("id") DO NOTHING;

-- 3. Insertar Catálogo de Ítems Específicos Asociados a sus Partidas Presupuestarias
INSERT INTO "item" ("id", "id_partida", "nombre") VALUES
  -- Ítems para Partida 34200 (Productos Químicos y Farmacéuticos - ID 1)
  (1, 1, 'Kit de Reactivos para Extracción de ADN Vegetal'),
  (2, 1, 'Frascos de Alcohol Etílico al 96% (1 Litro)'),
  (3, 1, 'Solución Buffer Fosfato Salino (PBS 1X)'),
  (4, 1, 'Tubos Eppendorf Graduados de 1.5 ml (Caja de 500 unidades)'),

  -- Ítems para Partida 39500 (Útiles de Escritorio y Oficina - ID 2)
  (5, 2, 'Cajas de Papel Bond Tamaño Carta 75g (500 Hojas)'),
  (6, 2, 'Tóner HP LaserJet Pro Negro Original'),
  (7, 2, 'Bolígrafos de Tinta Gel Azul (Caja de 12 unidades)'),
  (8, 2, 'Engrapadoras Metálicas de Uso Rudo con Ganchos'),

  -- Ítems para Partida 31100 (Alimentos y Bebidas para Personas - ID 3)
  (9, 3, 'Servicio de Refrigerio y Almuerzo de Trabajo para Seminario'),
  (10, 3, 'Agua Embotellada Purificada de 500 ml (Paquete de 24)'),

  -- Ítems para Partida 39700 (Útiles y Materiales Eléctricos - ID 4)
  (11, 4, 'Bobina de Cable UTP Categoría 6e para Redes (305 metros)'),
  (12, 4, 'Multi-contactos con Supresor de Picos de 6 Tomas'),
  (13, 4, 'Baterías Recargables AA Níquel-Metal (Paquete de 4)'),

  -- Ítems para Partida 43120 (Equipo de Computación - ID 7)
  (14, 7, 'Tarjeta Gráfica GPU NVIDIA RTX 4090 24GB para Procesamiento IA'),
  (15, 7, 'Computadora Portátil Laptop Intel Core i9 32GB RAM SSD 1TB'),
  (16, 7, 'Monitor Profesional IPS 27 Pulgadas 4K UHD'),
  (17, 7, 'Servidor de Almacenamiento NAS 4 Bahías 16TB Total'),

  -- Ítems para Partida 43110 (Equipo de Oficina y Muebles - ID 8)
  (18, 8, 'Silla Ergonómica Ejecutiva con Soporte Lumbar Ajustable'),
  (19, 8, 'Escritorio de Melamina Reforzado con Cajonera'),

  -- Ítems para Partida 43400 (Equipo Médico y de Laboratorio - ID 9)
  (20, 9, 'Balanza Analítica de Precisión Digital 0.0001g'),
  (21, 9, 'Microscopio Binocular Biológico con Iluminación LED'),

  -- Ítems para Partida 43500 (Equipo de Comunicación - ID 10)
  (22, 10, 'Router Inalámbrico Wi-Fi 6 Mesh Doble Banda'),
  (23, 10, 'Antena GPS Receptor de Alta Precision para Mapeo Agricola'),

  -- Ítems para Partida 21600 (Internet - ID 11)
  (24, 11, 'Servicio Mensual de Internet Fibra Óptica Empresarial 300 Mbps'),

  -- Ítems para Partida 24120 (Mantenimiento - ID 12)
  (25, 12, 'Servicio Técnico de Mantenimiento Preventivo y Limpieza de Servidores'),

  -- Ítems para Partida 25600 (Imprenta - ID 13)
  (26, 13, 'Impresión y Encuadernado de 50 Empastados de Memoria Científica')
ON CONFLICT ("id") DO NOTHING;
