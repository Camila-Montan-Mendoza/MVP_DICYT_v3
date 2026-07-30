-- ─── 04 SEED: TRÁMITES Y EJECUCIÓN PRESUPUESTARIA (DICyT SIGEFI) ──────────────────────────────
BEGIN;

-- 1. Archivos Digitales de Evidencia
INSERT INTO "evidencia_archivo" ("id", "nombre_original", "url") VALUES
  ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380f01', 'Orden_de_Compra_OC-2026-0045.pdf', '/storage/docs/OC-2026-0045.pdf'),
  ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380f02', 'Orden_de_Compra_OC-2026-0012.pdf', '/storage/docs/OC-2026-0012.pdf'),
  ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380f03', 'Acta_Recepcion_ACTA-DEF-2026-003.pdf', '/storage/docs/ACTA-DEF-2026-003.pdf'),
  ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380f04', 'Acta_Recepcion_ACTA-DEF-2026-008.pdf', '/storage/docs/ACTA-DEF-2026-008.pdf')
ON CONFLICT ("id") DO NOTHING;

-- 2. Instancias de Trámites Reales en el Workflow de Compra
INSERT INTO "tramite" ("id", "id_proyecto", "id_tipo_tramite", "id_tarea_tramite", "id_usuario", "fecha_creacion", "justificacion", "custodio", "lugar_items") VALUES
  (1, 1, 1, 1, 1, '2026-01-15 09:00:00', 'Adquisición de Servidor GPU para entrenamiento de modelos IA agrometeorológicos', 'Dr. Daniel Pérez', 'Laboratorio de IA y Computación Avanzada - FCyT'),
  (2, 1, 1, 2, 1, '2026-01-18 10:30:00', 'Adquisición de reactivos químicos y papelería para laboratorio de campo', 'Dr. Daniel Pérez', 'Estación Experimental de Pairumani'),
  (3, 2, 1, 6, 2, '2026-01-20 14:15:00', 'Compra de Kits de Extracción ADN y Microscopio Biológico LED para Proyecto RAWSAYTA', 'Ing. Winsor Soliz', 'Laboratorio de Biotecnología Vegetal - FCyT'),
  (4, 2, 1, 9, 2, '2026-01-22 11:00:00', 'Adquisición de Centrífuga Refrigerada de Alta Velocidad', 'Ing. Winsor Soliz', 'Laboratorio Biotecnología'),
  (5, 3, 1, 13, 1, '2026-01-25 15:45:00', 'Adquisición de insumos de alimentos y papelería para talleres de difusión de resultados del trigo', 'Dr. Daniel Pérez', 'Centro de Investigaciones Agrícolas Pairumani'),
  (6, 1, 1, 19, 1, '2026-01-28 16:30:00', 'Compra de Laptop de Alto Rendimiento para Procesamiento de Datos Satelitales', 'Dr. Daniel Pérez', 'Oficina DICyT - Edificio Central')
ON CONFLICT ("id") DO NOTHING;

-- 3. Ítems Solicitados por Trámite ("item_tramite")
INSERT INTO "item_tramite" ("id", "id_item", "id_tramite", "id_estado_item", "cantidad_solicitada", "precio_unitario", "existe_en_mercado_virtual", "especificacion") VALUES
  (1, 5, 1, 1, 1, 24500.00, true, 'Servidor GPU NVIDIA RTX 4090 24GB GDDR6X PCI-Express 4.0'),
  (2, 1, 2, 1, 2, 3500.00, false, 'Kit de Reactivos de Extracción de ADN Vegetal marca Qiagen 250 reacciones'),
  (3, 3, 2, 1, 5, 220.00, true, 'Cajas de Papel Bond Carta 75g (5 millares por caja)'),
  (4, 7, 3, 1, 1, 18000.00, true, 'Microscopio Biológico Binocular LED Óptica Planacromática 1000x'),
  (5, 8, 4, 2, 1, 22000.00, false, 'Centrífuga Refrigerada de Alta Velocidad 15000 RPM para Microtubos 2ml'),
  (6, 9, 5, 3, 3, 4500.00, true, 'Servicio de Catering y Refrigerios para 50 personas en Taller Agrícola'),
  (7, 6, 6, 3, 1, 19800.00, true, 'Laptop Trabajo Pesado Intel Core i9 64GB RAM SSD 2TB pantalla 16 pulgadas')
ON CONFLICT ("id") DO NOTHING;

-- 4. Historial de Auditoría de Tareas ("historial_tarea_tramite")
INSERT INTO "historial_tarea_tramite" ("id", "id_tramite", "id_sub_tramite_instancia", "id_tarea_anterior", "id_tarea_nuevo", "fecha_cambio", "id_usuario_responsable", "observaciones") VALUES
  (1, 1, NULL, 1, 1, '2026-01-15 09:00:00', 1, 'Trámite de compra iniciado por Dr. Daniel Pérez para el proyecto IA'),
  (2, 2, NULL, 1, 2, '2026-01-18 10:30:00', 3, 'Presupuesto verificado y certificado por Lic. Alan. Derivado a Compras.'),
  (3, 3, NULL, 2, 6, '2026-01-20 14:15:00', 4, 'Revisión aprobada por Grover Villarroel. Derivado a verificación en Mercado Virtual.'),
  (4, 4, NULL, 8, 9, '2026-01-22 11:00:00', 4, 'Adjudicación concluida. Emitida Orden de Compra por Grover Villarroel.'),
  (5, 5, NULL, 11, 13, '2026-01-25 15:45:00', 1, 'Acta de recepción definitiva firmada. Derivado a solicitud de pago.'),
  (6, 6, NULL, 18, 19, '2026-01-28 16:30:00', 5, 'Expediente digital verificado por Lic. Eva. Trámite completado y archivado')
ON CONFLICT ("id") DO NOTHING;

-- 5. Cotizaciones (Alineado con columnas de schema.sql: tiempo_entrega_dias)
INSERT INTO "cotizacion" ("id", "id_tramite", "id_proveedor", "id_forma_pago", "tiempo_entrega_dias", "tiempo_garantia_dias", "validez_oferta_dias", "numero_cuenta_bancaria") VALUES
  (1, 3, 2, 1, 5, 365, 30, 'BNB-1002938491'),
  (2, 3, 4, 1, 7, 365, 30, 'BISA-2009812391'),
  (3, 4, 2, 1, 10, 730, 45, 'BNB-1002938491')
ON CONFLICT ("id") DO NOTHING;

INSERT INTO "detalle_cotizacion" ("id", "id_cotizacion", "id_tramite_item", "especificacion", "cantidad_existencias", "precio_unitario") VALUES
  (1, 1, 4, 'Microscopio Biológico Binocular LED Óptica Planacromática 1000x marca Olympus', 2, 18000.00),
  (2, 2, 4, 'Microscopio Biológico Binocular LED Óptica Planacromática 1000x marca Nikon', 1, 19500.00),
  (3, 3, 5, 'Centrífuga Refrigerada de Alta Velocidad 15000 RPM marca Eppendorf', 1, 22000.00)
ON CONFLICT ("id") DO NOTHING;

-- 6. Documentos Contractuales (Alineado con columnas de schema.sql: monto_total, fecha_emision, fecha_inicio, fecha_fin, observaciones, id_archivo, id_proveedor)
INSERT INTO "documento_contractual" ("id", "id_tramite", "id_tipo_documento_contractual", "monto_total", "fecha_emision", "fecha_inicio", "fecha_fin", "observaciones", "id_archivo", "id_proveedor") VALUES
  (1, 4, 1, 22000.00, '2026-01-23 09:00:00', '2026-01-23', '2026-02-23', 'Orden de Compra emitida formalmente a Laboratorios Bioquímica Andina', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380f01', 2),
  (2, 6, 1, 19800.00, '2026-01-26 10:00:00', '2026-01-26', '2026-02-26', 'Orden de Compra para Laptop Servidor', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380f02', 1)
ON CONFLICT ("id") DO NOTHING;

-- 7. Actas de Recepción y Conformidad (Alineado con columnas de schema.sql: fecha_emision, id_usuario_responsable, observaciones, id_archivo)
INSERT INTO "acta_recepcion_conformidad" ("id", "id_tramite", "id_tipo_acta", "fecha_emision", "id_usuario_responsable", "observaciones", "id_archivo") VALUES
  (1, 5, 2, '2026-01-25 14:00:00', 1, 'Conformidad total por entrega de servicios de catering', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380f03'),
  (2, 6, 2, '2026-01-27 15:30:00', 1, 'Conformidad total por entrega de Laptop i9 en laboratorio', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380f04')
ON CONFLICT ("id") DO NOTHING;

-- 8. Solicitudes de Pago y Respaldos Digitales
INSERT INTO "solicitud_pago" ("id", "id_tramite", "id_proveedor", "id_estado_solicitud_pago", "monto_solicitado", "fecha_solicitud") VALUES
  (1, 5, 3, 4, 13500.00, '2026-01-25 16:00:00'),
  (2, 6, 1, 4, 19800.00, '2026-01-27 17:00:00')
ON CONFLICT ("id") DO NOTHING;

INSERT INTO "documento_respaldo_pago" ("id", "id_solicitud_pago", "id_tipo_documento_respaldo", "numero_documento", "fecha_emision", "observaciones") VALUES
  (1, 1, 1, 'MEMO-PAGO-2026-089', '2026-01-25 16:30:00', 'Memorándum firmado por Lic. Eva'),
  (2, 1, 2, 'C31-2026-0001293', '2026-01-25 17:00:00', 'Comprobante C31 de Devengado SIGEP emitido por Lic. Sergio'),
  (3, 1, 3, 'CHQ-2026-99201', '2026-01-25 17:30:00', 'Cheque desembolsado al proveedor Imprentas Central SRL'),
  (4, 2, 1, 'MEMO-PAGO-2026-095', '2026-01-27 17:30:00', 'Memorándum de Pago por Laptop'),
  (5, 2, 2, 'C31-2026-0001450', '2026-01-28 09:30:00', 'Comprobante C31 emitido en SIGEP'),
  (6, 2, 3, 'TRF-2026-88129', '2026-01-28 11:00:00', 'Transferencia bancaria efectuada')
ON CONFLICT ("id") DO NOTHING;

-- 9. Bitácora de Modificaciones Presupuestarias (Traspasos Internos)
INSERT INTO "bitacora_modificacion_presupuestaria" ("id", "id_proyecto", "justificacion", "fecha") VALUES
  (1, 1, 'Traspaso interno de presupuesto de Útiles de Escritorio a Equipos de Computación para compra de Servidor GPU', '2026-01-20 10:00:00'),
  (2, 2, 'Traspaso presupuestario de Publicaciones a Reactivos Químicos para urgencia de laboratorio', '2026-02-05 14:30:00')
ON CONFLICT ("id") DO NOTHING;

INSERT INTO "detalle_modificacion_presupuestaria" ("id", "id_bitacora_modificacion_presupuestaria", "id_partida_concreta", "monto", "descripcion") VALUES
  (1, 1, 2, -5000.00, 'Reducción de saldo en Útiles de Escritorio (39500)'),
  (2, 1, 3, 5000.00, 'Incremento de saldo en Equipos de Computación (43120) para Servidor GPU'),
  (3, 2, 6, -10000.00, 'Reducción de partida Publicaciones (25600)'),
  (4, 2, 4, 10000.00, 'Incremento en Reactivos Químicos (34200) para compra urgente de kits ADN')
ON CONFLICT ("id") DO NOTHING;

COMMIT;
