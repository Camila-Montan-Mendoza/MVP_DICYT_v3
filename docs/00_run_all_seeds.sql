-- ─── SCRIPT PRINCIPAL: EJECUTOR DE SEEDS EN ORDEN SECUENCIAL ──────────────────────────────
-- Ejecuta todas las semillas de datos respetando las dependencias de claves foráneas.

\i 01_seed_catalogos_base.sql
\i 02_seed_workflow_compra_menor.sql
\i 03_seed_estructura_financiera.sql
\i 04_seed_tramites_y_ejecucion.sql
