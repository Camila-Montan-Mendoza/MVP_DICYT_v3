CREATE TABLE IF NOT EXISTS "estado_proyecto" (
	"id" SMALLSERIAL NOT NULL,
	"nombre" VARCHAR(50) NOT NULL,
	CONSTRAINT "estado_proyecto_pkey" PRIMARY KEY("id")
);

CREATE TABLE IF NOT EXISTS "tipo_tramite" (
	"id" SMALLSERIAL NOT NULL,
	"nombre" VARCHAR(255) NOT NULL,
	CONSTRAINT "tipo_tramite_pkey" PRIMARY KEY("id"),
	CONSTRAINT "tipo_tramite_nombre_key" UNIQUE ("nombre")
);

CREATE TABLE IF NOT EXISTS "proveedor" (
	"id" SMALLSERIAL NOT NULL,
	"nombre" VARCHAR(255) NOT NULL,
	"nit" VARCHAR(255),
	"telefono" VARCHAR(255),
	"direccion" VARCHAR(255),
	CONSTRAINT "proveedor_pkey" PRIMARY KEY("id")
);

CREATE TABLE IF NOT EXISTS "forma_pago" (
	"id" SERIAL NOT NULL,
	"nombre" VARCHAR(255) NOT NULL,
	CONSTRAINT "forma_pago_pkey" PRIMARY KEY("id")
);

CREATE TABLE IF NOT EXISTS "evidencia_archivo" (
	"id" UUID NOT NULL DEFAULT gen_random_uuid(),
	"nombre_original" VARCHAR(255) NOT NULL,
	"url" VARCHAR(512) NOT NULL,
	"fecha_subida" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT "evidencia_archivo_pkey" PRIMARY KEY("id")
);

CREATE TABLE IF NOT EXISTS "fuente_financiamiento" (
	"id" UUID NOT NULL DEFAULT gen_random_uuid(),
	"sigla" VARCHAR(50),
	"nombre" VARCHAR(255) NOT NULL,
	"fecha_creacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
	"id_usuario_creador" INTEGER,
	CONSTRAINT "fuente_financiamiento_pkey" PRIMARY KEY("id")
);

CREATE TABLE IF NOT EXISTS "convenio" (
	"id" UUID NOT NULL DEFAULT gen_random_uuid(),
	"id_fuente_financiamiento" UUID NOT NULL,
	"codigo_convenio" VARCHAR(50),
	"codigo_fuente" VARCHAR(10), -- FTE: Clasificador de Fuente de Financiamiento (Ej: 80, 41, 44)
	"codigo_organismo" VARCHAR(10), -- ORG: Clasificador de Organismo Financiador (Ej: 520, 519, 729)
	"numero_libreta" VARCHAR(100),
	"nombre" VARCHAR(255) NOT NULL,
	"presupuesto" DECIMAL(15,2) NOT NULL CHECK ("presupuesto" >= 0),
	"fecha_inicio" DATE,
	"fecha_fin" DATE,
	"id_evidencia_archivo" UUID,
	"fecha_creacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
	"id_usuario_creador" INTEGER,
	CONSTRAINT "convenio_pkey" PRIMARY KEY("id")
);

COMMENT ON COLUMN "convenio"."codigo_fuente" IS 'FTE: Clasificador de Fuente de Financiamiento (Origen de recursos: Donaciones, TGN, etc.). Atributo de catálogo.';
COMMENT ON COLUMN "convenio"."codigo_organismo" IS 'ORG: Clasificador de Organismo Financiador (Entidad específica que provee los fondos: ASDI, ARES, etc.). Atributo de catálogo.';

CREATE TABLE IF NOT EXISTS "tipo_programa" (
	"id" SMALLSERIAL NOT NULL,
	"codigo" VARCHAR(50) NOT NULL UNIQUE,
	"nombre" VARCHAR(100) NOT NULL,
	CONSTRAINT "tipo_programa_pkey" PRIMARY KEY("id")
);

CREATE TABLE IF NOT EXISTS "programa" (
	"id" SERIAL NOT NULL,
	"id_convenio" UUID NOT NULL,
	"id_programa_padre" INTEGER,
	"id_tipo_programa" SMALLINT,
	"codigo_direccion_administrativa" VARCHAR(10) DEFAULT '16', -- DA: Dirección Administrativa (Ej: 16 DICyT)
	"codigo_unidad_ejecutora" VARCHAR(10), -- UE: Unidad Ejecutora (Ej: 33 DICyT, 30 Facultad Tecno)
	"codigo_programa" VARCHAR(10), -- PRG: Código del Programa Presupuestario (Ej: 101, 512, 513)
	"codigo_actividad" VARCHAR(10), -- ACT: Código de Actividad Presupuestaria (Ej: 1, 3, 4, 68)
	"codigo_finalidad_funcion" VARCHAR(10), -- FIN-FUN: Finalidad y Función (Ej: 970 Educación)
	"sigla" VARCHAR(50),
	"nombre" VARCHAR(255) NOT NULL,
	"presupuesto" DECIMAL(15,2) NOT NULL CHECK ("presupuesto" >= 0),
	"fecha_creacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
	"id_usuario_creador" INTEGER,
	CONSTRAINT "programa_pkey" PRIMARY KEY("id")
);

COMMENT ON COLUMN "programa"."codigo_direccion_administrativa" IS 'DA: Dirección Administrativa. Facultad/Área responsable de la ejecución presupuestaria. Atributo categórico.';
COMMENT ON COLUMN "programa"."codigo_unidad_ejecutora" IS 'UE: Unidad Ejecutora. Dependencia técnica u operativa descentralizada. Atributo categórico.';
COMMENT ON COLUMN "programa"."codigo_programa" IS 'PRG: Programa Presupuestario. Agrupa recursos para un objetivo estratégico. Atributo categórico.';
COMMENT ON COLUMN "programa"."codigo_actividad" IS 'ACT: Actividad Presupuestaria. Acción operacional continua para producir bienes/servicios. Atributo categórico.';
COMMENT ON COLUMN "programa"."codigo_finalidad_funcion" IS 'FIN-FUN: Finalidad y Función. Categoriza el gasto según su objetivo socioeconómico. Atributo categórico.';

CREATE TABLE IF NOT EXISTS "programa_usuario" (
	"id_programa" INT NOT NULL,
	"id_usuario" INT NOT NULL,
	"id_rol" SMALLINT NOT NULL,
	CONSTRAINT "programa_usuario_pkey" PRIMARY KEY("id_programa", "id_usuario")
);

CREATE TABLE IF NOT EXISTS "proyecto" (
	"id" SERIAL NOT NULL,
	"id_estado_proyecto" SMALLINT NOT NULL,
	"id_programa" INTEGER NOT NULL,
	"nombre" VARCHAR(255) NOT NULL,
	"codigo" VARCHAR(255) NOT NULL, -- PRY: Código SISIN de proyecto o 0 para gasto corriente sin inversión
	"presupuesto" DECIMAL(15,2) NOT NULL CHECK ("presupuesto" >= 0), -- Presupuesto Aprobado Total (Calculados: Vigente = Aprobado +/- Modificaciones; Saldo = Vigente - Ejecutado)
	"fecha_inicio" DATE NOT NULL,
	"fecha_fin" DATE NOT NULL,
	"fecha_creacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
	"id_usuario_creador" INTEGER,
	CONSTRAINT "proyecto_pkey" PRIMARY KEY("id")
);

COMMENT ON COLUMN "proyecto"."codigo" IS 'PRY: Código SISIN del proyecto de inversión pública (o 0 si no es inversión capitalizable). Atributo de catálogo.';
COMMENT ON COLUMN "proyecto"."presupuesto" IS 'Importe cuantitativo asignado. NOTA: Presupuesto Vigente, Devengado y Saldo son valores calculados derivables de la bitácora y ejecuciones.';

CREATE TABLE IF NOT EXISTS "presupuesto_gestion" (
	"id" SERIAL NOT NULL,
	"id_proyecto" INTEGER NOT NULL,
	"gestion" SMALLINT NOT NULL,
	"presupuesto" DECIMAL(15,2) NOT NULL CHECK ("presupuesto" >= 0),
	"observaciones" TEXT,
	"fecha_creacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
	"id_usuario_creador" INTEGER,
	CONSTRAINT "presupuesto_gestion_pkey" PRIMARY KEY("id"),
	CONSTRAINT "presupuesto_gestion_proyecto_gestion_key" UNIQUE ("id_proyecto", "gestion")
);

CREATE TABLE IF NOT EXISTS "partida_concreta" (
	"id" SERIAL NOT NULL,
	"id_proyecto" INTEGER NOT NULL,
	"id_presupuesto_gestion" INTEGER,
	"id_partida" SMALLINT NOT NULL,
	"presupuesto" DECIMAL(15,2) NOT NULL CHECK ("presupuesto" >= 0),
	CONSTRAINT "partida_concreta_pkey" PRIMARY KEY("id")
);

CREATE TABLE IF NOT EXISTS "item" (
	"id" SERIAL NOT NULL,
	"id_partida" INTEGER NOT NULL,
	"nombre" VARCHAR(255) NOT NULL,
	CONSTRAINT "item_pkey" PRIMARY KEY("id")
);

CREATE TABLE IF NOT EXISTS "bitacora_modificacion_presupuestaria" (
	"id" SERIAL NOT NULL,
	"id_proyecto" INTEGER NOT NULL,
	"justificacion" VARCHAR(255) NOT NULL,
	"fecha" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT "bitacora_modificacion_presupuestaria_pkey" PRIMARY KEY("id")
);

CREATE TABLE IF NOT EXISTS "detalle_modificacion_presupuestaria" (
	"id" SERIAL NOT NULL,
	"id_bitacora_modificacion_presupuestaria" INTEGER NOT NULL,
	"id_partida_concreta" INTEGER NOT NULL,
	"monto" DECIMAL(15,2) NOT NULL CHECK ("monto" <> 0),
	"descripcion" VARCHAR(255) NOT NULL,
	CONSTRAINT "detalle_modificacion_presupuestaria_pkey" PRIMARY KEY("id"),
	CONSTRAINT "detalle_modificacion_partida_unica_por_bitacora_key"
		UNIQUE ("id_bitacora_modificacion_presupuestaria", "id_partida_concreta")
);

CREATE TABLE IF NOT EXISTS "rol" (
	"id" SMALLSERIAL NOT NULL,
	"nombre" VARCHAR(100) NOT NULL,
	CONSTRAINT "rol_pkey" PRIMARY KEY("id")
);

CREATE TABLE IF NOT EXISTS "usuario" (
	"id" SERIAL NOT NULL,
	"username" VARCHAR(100) NOT NULL,
	"password" VARCHAR(255) NOT NULL,
	CONSTRAINT "usuario_pkey" PRIMARY KEY("id"),
	CONSTRAINT "usuario_username_key" UNIQUE ("username")
);

CREATE TABLE IF NOT EXISTS "rol_usuario" (
	"id_rol" SMALLINT NOT NULL,
	"id_usuario" INTEGER NOT NULL,
	CONSTRAINT "rol_usuario_pkey" PRIMARY KEY("id_rol", "id_usuario")
);

CREATE INDEX "rol_usuario_usuario_idx" ON "rol_usuario" ("id_usuario");

CREATE TABLE IF NOT EXISTS "tipo_nivel_ambito" (
	"id" SMALLSERIAL NOT NULL,
	"codigo" VARCHAR(50) NOT NULL UNIQUE,
	"nombre" VARCHAR(100) NOT NULL,
	CONSTRAINT "tipo_nivel_ambito_pkey" PRIMARY KEY("id")
);

COMMENT ON COLUMN "tipo_nivel_ambito"."codigo" IS 'Ej: ''TRAMITE'' (Nivel global del trámite), ''SUBUNIDAD'' (Nivel sub-unidad polimórfica)';

CREATE TABLE IF NOT EXISTS "tipo_entidad_sujeto" (
	"id" SMALLSERIAL NOT NULL,
	"codigo" VARCHAR(50) NOT NULL UNIQUE,
	"nombre" VARCHAR(100) NOT NULL,
	CONSTRAINT "tipo_entidad_sujeto_pkey" PRIMARY KEY("id")
);

COMMENT ON COLUMN "tipo_entidad_sujeto"."codigo" IS 'Ej: ''PROVEEDOR'', ''PARTIDA_CONCRETA'', ''HITO'', ''DOCUMENTO''';

CREATE TABLE IF NOT EXISTS "paso_flujo" (
	"id" SMALLSERIAL NOT NULL,
	"id_tipo_tramite" SMALLINT NOT NULL,
	"nombre" VARCHAR(100) NOT NULL,
	"orden" SMALLINT NOT NULL,
	CONSTRAINT "paso_flujo_pkey" PRIMARY KEY("id")
);

CREATE TABLE IF NOT EXISTS "tarea_paso_flujo" (
	"id" SMALLSERIAL NOT NULL,
	"id_paso_flujo" SMALLINT NOT NULL,
	"id_nivel_ambito" SMALLINT NOT NULL,
	"nombre" VARCHAR(100) NOT NULL,
	"es_inicial" BOOLEAN NOT NULL DEFAULT false,
	"es_final" BOOLEAN NOT NULL DEFAULT false,
	CONSTRAINT "tarea_paso_flujo_pkey" PRIMARY KEY("id")
);

CREATE TABLE IF NOT EXISTS "transicion_flujo" (
	"id" SERIAL NOT NULL,
	"id_tarea_origen" SMALLINT NOT NULL,
	"id_tarea_destino" SMALLINT NOT NULL,
	"nombre_accion" VARCHAR(100) NOT NULL,
	CONSTRAINT "transicion_flujo_pkey" PRIMARY KEY("id")
);

CREATE TABLE IF NOT EXISTS "tramite" (
	"id" SERIAL NOT NULL,
	"id_proyecto" INTEGER NOT NULL,
	"id_tipo_tramite" SMALLINT NOT NULL,
	"id_tarea_tramite" SMALLINT NOT NULL,
	"id_evidencia_archivo" UUID,
	"id_usuario" INTEGER NOT NULL,
	"fecha_creacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
	"fecha_actualizacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
	"rechazado" BOOLEAN NOT NULL DEFAULT false,
	"justificacion" TEXT,
	"custodio" VARCHAR(255),
	"lugar_items" VARCHAR(255),
	CONSTRAINT "tramite_pkey" PRIMARY KEY("id")
);

CREATE TABLE IF NOT EXISTS "sub_tramite_instancia" (
	"id" SERIAL NOT NULL,
	"id_tramite" INTEGER NOT NULL,
	"id_tipo_entidad_sujeto" SMALLINT NOT NULL,
	"id_entidad_sujeto" INTEGER NOT NULL,
	"id_tarea_subunidad" SMALLINT NOT NULL,
	"fecha_creacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
	"metadatos" JSONB,
	CONSTRAINT "sub_tramite_instancia_pkey" PRIMARY KEY("id"),
	CONSTRAINT "sub_tramite_sujeto_unico_key" UNIQUE ("id_tramite", "id_tipo_entidad_sujeto", "id_entidad_sujeto")
);

CREATE TABLE IF NOT EXISTS "historial_tarea_tramite" (
	"id" SERIAL NOT NULL,
	"id_tramite" INTEGER NOT NULL,
	"id_sub_tramite_instancia" INTEGER,
	"id_tarea_anterior" SMALLINT NOT NULL,
	"id_tarea_nuevo" SMALLINT NOT NULL,
	"fecha_cambio" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
	"id_usuario_responsable" INTEGER,
	"observaciones" TEXT,
	CONSTRAINT "historial_tarea_tramite_pkey" PRIMARY KEY("id")
);

CREATE TABLE IF NOT EXISTS "estado_item_tramite" (
	"id" SMALLSERIAL NOT NULL,
	"nombre" VARCHAR(50) NOT NULL UNIQUE,
	"descripcion" VARCHAR(255) NOT NULL,
	CONSTRAINT "estado_item_tramite_pkey" PRIMARY KEY("id")
);

COMMENT ON TABLE "estado_item_tramite" IS 'Estados de ejecución presupuestaria del ítem (Preventivo, Comprometido, Pagado o Revertido por falta de stock/cancelación)';

CREATE TABLE IF NOT EXISTS "item_tramite" (
	"id" SERIAL NOT NULL,
	"id_item" INTEGER NOT NULL,
	"id_tramite" INTEGER NOT NULL,
	"id_estado_item" SMALLINT,
	"cantidad_solicitada" SMALLINT NOT NULL,
	"precio_unitario" DECIMAL(15,2) NOT NULL,
	"existe_en_mercado_virtual" BOOLEAN DEFAULT true,
	"especificacion" TEXT NOT NULL,
	CONSTRAINT "item_tramite_pkey" PRIMARY KEY("id")
);

CREATE TABLE IF NOT EXISTS "cotizacion" (
	"id" SERIAL NOT NULL,
	"id_tramite" INTEGER NOT NULL,
	"id_proveedor" SMALLINT NOT NULL,
	"id_forma_pago" INTEGER,
	"fecha_emision" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
	"lugar_emision" VARCHAR(255),
	"tiempo_entrega_dias" SMALLINT NOT NULL,
	"tiempo_garantia_dias" SMALLINT,
	"validez_oferta_dias" SMALLINT,
	"numero_cuenta_bancaria" VARCHAR(255),
	CONSTRAINT "cotizacion_pkey" PRIMARY KEY("id")
);

CREATE TABLE IF NOT EXISTS "detalle_cotizacion" (
	"id" SERIAL NOT NULL,
	"id_cotizacion" INTEGER NOT NULL,
	"id_tramite_item" INTEGER NOT NULL,
	"especificacion" TEXT NOT NULL,
	"cantidad_existencias" SMALLINT NOT NULL,
	"precio_unitario" DECIMAL(15,2) NOT NULL CHECK ("precio_unitario" >= 0),
	CONSTRAINT "detalle_cotizacion_pkey" PRIMARY KEY("id"),
	CONSTRAINT "detalle_cotizacion_cotizacion_item_key" UNIQUE ("id_cotizacion", "id_tramite_item")
);

CREATE TABLE IF NOT EXISTS "documento_contractual" (
	"id" SERIAL NOT NULL,
	"id_tramite" INTEGER NOT NULL,
	"id_tipo_documento_contractual" SMALLINT NOT NULL,
	"monto_total" DECIMAL(15,2) NOT NULL CHECK ("monto_total" >= 0),
	"fecha_emision" TIMESTAMP NOT NULL,
	"fecha_inicio" DATE,
	"fecha_fin" DATE,
	"observaciones" TEXT,
	"id_archivo" UUID NOT NULL,
	"id_proveedor" SMALLINT NOT NULL,
	CONSTRAINT "documento_contractual_pkey" PRIMARY KEY("id")
);

CREATE TABLE IF NOT EXISTS "acta_recepcion_conformidad" (
	"id" SERIAL NOT NULL,
	"id_tramite" INTEGER NOT NULL,
	"id_tipo_acta" SMALLINT NOT NULL,
	"fecha_emision" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
	"id_usuario_responsable" INTEGER,
	"observaciones" TEXT,
	"id_archivo" UUID NOT NULL,
	CONSTRAINT "acta_recepcion_conformidad_pkey" PRIMARY KEY("id")
);

CREATE TABLE IF NOT EXISTS "solicitud_pago" (
	"id" SERIAL NOT NULL,
	"id_tramite" INTEGER NOT NULL,
	"id_proveedor" SMALLINT NOT NULL,
	"id_estado_solicitud_pago" SMALLINT NOT NULL,
	"monto_solicitado" DECIMAL(15,2) NOT NULL CHECK ("monto_solicitado" > 0),
	"fecha_solicitud" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT "solicitud_pago_pkey" PRIMARY KEY("id")
);

CREATE TABLE IF NOT EXISTS "tipo_documento_contractual" (
	"id" SMALLSERIAL NOT NULL,
	"nombre" VARCHAR(255) NOT NULL,
	CONSTRAINT "tipo_documento_contractual_pkey" PRIMARY KEY("id")
);

CREATE TABLE IF NOT EXISTS "tipo_acta_recepcion_conformidad" (
	"id" SMALLSERIAL NOT NULL,
	"nombre" VARCHAR(255) NOT NULL,
	CONSTRAINT "tipo_acta_recepcion_conformidad_pkey" PRIMARY KEY("id")
);

CREATE TABLE IF NOT EXISTS "rol_tarea_paso_flujo" (
	"id_rol" SMALLINT NOT NULL,
	"id_tarea_paso_flujo" SMALLINT NOT NULL,
	CONSTRAINT "rol_tarea_paso_flujo_pkey" PRIMARY KEY("id_rol", "id_tarea_paso_flujo")
);

CREATE TABLE IF NOT EXISTS "tipo_estado_solicitud_pago" (
	"id" SMALLINT NOT NULL GENERATED BY DEFAULT AS IDENTITY,
	"nombre" VARCHAR(255) NOT NULL,
	CONSTRAINT "tipo_estado_solicitud_pago_pkey" PRIMARY KEY("id")
);

CREATE TABLE IF NOT EXISTS "documento_respaldo_pago" (
	"id" SERIAL NOT NULL,
	"id_solicitud_pago" INTEGER NOT NULL,
	"id_tipo_documento_respaldo" SMALLINT NOT NULL,
	"numero_documento" VARCHAR(255),
	"fecha_emision" TIMESTAMP NOT NULL,
	"observaciones" TEXT,
	CONSTRAINT "documento_respaldo_pago_pkey" PRIMARY KEY("id"),
	CONSTRAINT "documento_respaldo_pago_unique_0" UNIQUE ("id_solicitud_pago", "id_tipo_documento_respaldo")
);

CREATE TABLE IF NOT EXISTS "partida" (
	"id" SMALLSERIAL NOT NULL,
	"codigo" INTEGER NOT NULL UNIQUE,
	CONSTRAINT "partida_pkey" PRIMARY KEY("id")
);

CREATE TABLE IF NOT EXISTS "item_proveedor_tramite" (
	"id" SERIAL NOT NULL,
	"id_item_tramite" INTEGER NOT NULL,
	"id_proveedor" SMALLINT NOT NULL,
	"cantidad_proveida" SMALLINT NOT NULL,
	"precio_unitario" DECIMAL(15,2) NOT NULL CHECK ("precio_unitario" >= 0),
	CONSTRAINT "item_proveedor_tramite_pkey" PRIMARY KEY("id")
);

CREATE TABLE IF NOT EXISTS "proyecto_usuario" (
	"id_proyecto" INT NOT NULL,
	"id_usuario" INT NOT NULL,
	"id_rol" SMALLINT NOT NULL,
	CONSTRAINT "proyecto_usuario_pkey" PRIMARY KEY("id_proyecto", "id_usuario")
);

COMMENT ON TABLE "proyecto_usuario" IS 'Relación muchos-a-muchos entre proyectos y usuarios con su rol en el proyecto';

CREATE TABLE IF NOT EXISTS "tipo_documento_respaldo_pago" (
	"id" SMALLSERIAL NOT NULL,
	"codigo" VARCHAR(50) NOT NULL UNIQUE,
	"nombre" VARCHAR(100) NOT NULL,
	"es_requerido_para_cierre" BOOLEAN NOT NULL DEFAULT false,
	CONSTRAINT "tipo_documento_respaldo_pago_pkey" PRIMARY KEY("id")
);

COMMENT ON COLUMN "tipo_documento_respaldo_pago"."codigo" IS 'Ej: ''MEMORANDUM'', ''COMPROBANTE_C31'', ''CHEQUE'', ''EJECUCION_GASTO''';

-- ─── Foreign Keys (SIN CASCADE) ──────────────────────────────────────────────

ALTER TABLE "convenio"
ADD FOREIGN KEY("id_fuente_financiamiento") REFERENCES "fuente_financiamiento"("id")
ON UPDATE RESTRICT ON DELETE RESTRICT;

ALTER TABLE "programa"
ADD FOREIGN KEY("id_convenio") REFERENCES "convenio"("id")
ON UPDATE RESTRICT ON DELETE RESTRICT;

ALTER TABLE "programa"
ADD FOREIGN KEY("id_programa_padre") REFERENCES "programa"("id")
ON UPDATE RESTRICT ON DELETE SET NULL;

ALTER TABLE "proyecto"
ADD FOREIGN KEY("id_estado_proyecto") REFERENCES "estado_proyecto"("id")
ON UPDATE RESTRICT ON DELETE RESTRICT;

ALTER TABLE "proyecto"
ADD FOREIGN KEY("id_programa") REFERENCES "programa"("id")
ON UPDATE RESTRICT ON DELETE RESTRICT;

ALTER TABLE "partida_concreta"
ADD FOREIGN KEY("id_proyecto") REFERENCES "proyecto"("id")
ON UPDATE RESTRICT ON DELETE RESTRICT;

ALTER TABLE "bitacora_modificacion_presupuestaria"
ADD FOREIGN KEY("id_proyecto") REFERENCES "proyecto"("id")
ON UPDATE RESTRICT ON DELETE RESTRICT;

ALTER TABLE "detalle_modificacion_presupuestaria"
ADD FOREIGN KEY("id_bitacora_modificacion_presupuestaria") REFERENCES "bitacora_modificacion_presupuestaria"("id")
ON UPDATE RESTRICT ON DELETE RESTRICT;

ALTER TABLE "detalle_modificacion_presupuestaria"
ADD FOREIGN KEY("id_partida_concreta") REFERENCES "partida_concreta"("id")
ON UPDATE RESTRICT ON DELETE RESTRICT;

ALTER TABLE "paso_flujo"
ADD FOREIGN KEY("id_tipo_tramite") REFERENCES "tipo_tramite"("id")
ON UPDATE RESTRICT ON DELETE RESTRICT;

ALTER TABLE "tarea_paso_flujo"
ADD FOREIGN KEY("id_paso_flujo") REFERENCES "paso_flujo"("id")
ON UPDATE RESTRICT ON DELETE RESTRICT;

ALTER TABLE "tarea_paso_flujo"
ADD FOREIGN KEY("id_nivel_ambito") REFERENCES "tipo_nivel_ambito"("id")
ON UPDATE RESTRICT ON DELETE RESTRICT;

ALTER TABLE "transicion_flujo"
ADD FOREIGN KEY("id_tarea_origen") REFERENCES "tarea_paso_flujo"("id")
ON UPDATE RESTRICT ON DELETE RESTRICT;

ALTER TABLE "transicion_flujo"
ADD FOREIGN KEY("id_tarea_destino") REFERENCES "tarea_paso_flujo"("id")
ON UPDATE RESTRICT ON DELETE RESTRICT;

ALTER TABLE "rol_usuario"
ADD FOREIGN KEY("id_rol") REFERENCES "rol"("id")
ON UPDATE RESTRICT ON DELETE RESTRICT;

ALTER TABLE "rol_usuario"
ADD FOREIGN KEY("id_usuario") REFERENCES "usuario"("id")
ON UPDATE RESTRICT ON DELETE RESTRICT;

ALTER TABLE "tramite"
ADD FOREIGN KEY("id_proyecto") REFERENCES "proyecto"("id")
ON UPDATE RESTRICT ON DELETE RESTRICT;

ALTER TABLE "tramite"
ADD FOREIGN KEY("id_tipo_tramite") REFERENCES "tipo_tramite"("id")
ON UPDATE RESTRICT ON DELETE RESTRICT;

ALTER TABLE "tramite"
ADD FOREIGN KEY("id_tarea_tramite") REFERENCES "tarea_paso_flujo"("id")
ON UPDATE RESTRICT ON DELETE RESTRICT;

ALTER TABLE "tramite"
ADD FOREIGN KEY("id_evidencia_archivo") REFERENCES "evidencia_archivo"("id")
ON UPDATE RESTRICT ON DELETE SET NULL;

ALTER TABLE "tramite"
ADD FOREIGN KEY("id_usuario") REFERENCES "usuario"("id")
ON UPDATE RESTRICT ON DELETE RESTRICT;

ALTER TABLE "sub_tramite_instancia"
ADD FOREIGN KEY("id_tramite") REFERENCES "tramite"("id")
ON UPDATE RESTRICT ON DELETE RESTRICT;

ALTER TABLE "sub_tramite_instancia"
ADD FOREIGN KEY("id_tipo_entidad_sujeto") REFERENCES "tipo_entidad_sujeto"("id")
ON UPDATE RESTRICT ON DELETE RESTRICT;

ALTER TABLE "sub_tramite_instancia"
ADD FOREIGN KEY("id_tarea_subunidad") REFERENCES "tarea_paso_flujo"("id")
ON UPDATE RESTRICT ON DELETE RESTRICT;

ALTER TABLE "historial_tarea_tramite"
ADD FOREIGN KEY("id_tramite") REFERENCES "tramite"("id")
ON UPDATE RESTRICT ON DELETE RESTRICT;

ALTER TABLE "historial_tarea_tramite"
ADD FOREIGN KEY("id_sub_tramite_instancia") REFERENCES "sub_tramite_instancia"("id")
ON UPDATE RESTRICT ON DELETE SET NULL;

ALTER TABLE "historial_tarea_tramite"
ADD FOREIGN KEY("id_tarea_anterior") REFERENCES "tarea_paso_flujo"("id")
ON UPDATE RESTRICT ON DELETE RESTRICT;

ALTER TABLE "historial_tarea_tramite"
ADD FOREIGN KEY("id_tarea_nuevo") REFERENCES "tarea_paso_flujo"("id")
ON UPDATE RESTRICT ON DELETE RESTRICT;

ALTER TABLE "historial_tarea_tramite"
ADD FOREIGN KEY("id_usuario_responsable") REFERENCES "usuario"("id")
ON UPDATE RESTRICT ON DELETE SET NULL;

ALTER TABLE "item_tramite"
ADD FOREIGN KEY("id_item") REFERENCES "item"("id")
ON UPDATE RESTRICT ON DELETE RESTRICT;

ALTER TABLE "item_tramite"
ADD FOREIGN KEY("id_tramite") REFERENCES "tramite"("id")
ON UPDATE RESTRICT ON DELETE RESTRICT;

ALTER TABLE "cotizacion"
ADD FOREIGN KEY("id_tramite") REFERENCES "tramite"("id")
ON UPDATE RESTRICT ON DELETE RESTRICT;

ALTER TABLE "cotizacion"
ADD FOREIGN KEY("id_proveedor") REFERENCES "proveedor"("id")
ON UPDATE RESTRICT ON DELETE RESTRICT;

ALTER TABLE "cotizacion"
ADD FOREIGN KEY("id_forma_pago") REFERENCES "forma_pago"("id")
ON UPDATE RESTRICT ON DELETE SET NULL;

ALTER TABLE "detalle_cotizacion"
ADD FOREIGN KEY("id_cotizacion") REFERENCES "cotizacion"("id")
ON UPDATE RESTRICT ON DELETE RESTRICT;

ALTER TABLE "detalle_cotizacion"
ADD FOREIGN KEY("id_tramite_item") REFERENCES "item_tramite"("id")
ON UPDATE RESTRICT ON DELETE RESTRICT;

ALTER TABLE "documento_contractual"
ADD FOREIGN KEY("id_tramite") REFERENCES "tramite"("id")
ON UPDATE RESTRICT ON DELETE RESTRICT;

ALTER TABLE "documento_contractual"
ADD FOREIGN KEY("id_tipo_documento_contractual") REFERENCES "tipo_documento_contractual"("id")
ON UPDATE RESTRICT ON DELETE RESTRICT;

ALTER TABLE "documento_contractual"
ADD FOREIGN KEY("id_proveedor") REFERENCES "proveedor"("id")
ON UPDATE RESTRICT ON DELETE RESTRICT;

ALTER TABLE "acta_recepcion_conformidad"
ADD FOREIGN KEY("id_tramite") REFERENCES "tramite"("id")
ON UPDATE RESTRICT ON DELETE RESTRICT;

ALTER TABLE "acta_recepcion_conformidad"
ADD FOREIGN KEY("id_tipo_acta") REFERENCES "tipo_acta_recepcion_conformidad"("id")
ON UPDATE RESTRICT ON DELETE RESTRICT;

ALTER TABLE "acta_recepcion_conformidad"
ADD FOREIGN KEY("id_usuario_responsable") REFERENCES "usuario"("id")
ON UPDATE RESTRICT ON DELETE SET NULL;

ALTER TABLE "solicitud_pago"
ADD FOREIGN KEY("id_tramite") REFERENCES "tramite"("id")
ON UPDATE RESTRICT ON DELETE RESTRICT;

ALTER TABLE "solicitud_pago"
ADD FOREIGN KEY("id_proveedor") REFERENCES "proveedor"("id")
ON UPDATE RESTRICT ON DELETE RESTRICT;

ALTER TABLE "solicitud_pago"
ADD FOREIGN KEY("id_estado_solicitud_pago") REFERENCES "tipo_estado_solicitud_pago"("id")
ON UPDATE RESTRICT ON DELETE RESTRICT;

ALTER TABLE "rol_tarea_paso_flujo"
ADD FOREIGN KEY("id_tarea_paso_flujo") REFERENCES "tarea_paso_flujo"("id")
ON UPDATE RESTRICT ON DELETE RESTRICT;

ALTER TABLE "rol_tarea_paso_flujo"
ADD FOREIGN KEY("id_rol") REFERENCES "rol"("id")
ON UPDATE RESTRICT ON DELETE RESTRICT;

ALTER TABLE "partida_concreta"
ADD FOREIGN KEY("id_partida") REFERENCES "partida"("id")
ON UPDATE RESTRICT ON DELETE RESTRICT;

ALTER TABLE "item_proveedor_tramite"
ADD FOREIGN KEY("id_item_tramite") REFERENCES "item_tramite"("id")
ON UPDATE RESTRICT ON DELETE RESTRICT;

ALTER TABLE "item_proveedor_tramite"
ADD FOREIGN KEY("id_proveedor") REFERENCES "proveedor"("id")
ON UPDATE RESTRICT ON DELETE RESTRICT;

ALTER TABLE "proyecto_usuario"
ADD FOREIGN KEY("id_proyecto") REFERENCES "proyecto"("id")
ON UPDATE RESTRICT ON DELETE RESTRICT;

ALTER TABLE "proyecto_usuario"
ADD FOREIGN KEY("id_usuario") REFERENCES "usuario"("id")
ON UPDATE RESTRICT ON DELETE RESTRICT;

ALTER TABLE "proyecto_usuario"
ADD FOREIGN KEY("id_rol") REFERENCES "rol"("id")
ON UPDATE RESTRICT ON DELETE RESTRICT;

ALTER TABLE "item"
ADD FOREIGN KEY("id_partida") REFERENCES "partida"("id")
ON UPDATE RESTRICT ON DELETE RESTRICT;

ALTER TABLE "documento_respaldo_pago"
ADD FOREIGN KEY("id_tipo_documento_respaldo") REFERENCES "tipo_documento_respaldo_pago"("id")
ON UPDATE RESTRICT ON DELETE RESTRICT;

ALTER TABLE "documento_respaldo_pago"
ADD FOREIGN KEY("id_solicitud_pago") REFERENCES "solicitud_pago"("id")
ON UPDATE RESTRICT ON DELETE RESTRICT;

ALTER TABLE "fuente_financiamiento"
ADD FOREIGN KEY("id_usuario_creador") REFERENCES "usuario"("id")
ON UPDATE RESTRICT ON DELETE RESTRICT;

ALTER TABLE "convenio"
ADD FOREIGN KEY("id_evidencia_archivo") REFERENCES "evidencia_archivo"("id")
ON UPDATE RESTRICT ON DELETE SET NULL;

ALTER TABLE "convenio"
ADD FOREIGN KEY("id_usuario_creador") REFERENCES "usuario"("id")
ON UPDATE RESTRICT ON DELETE RESTRICT;

ALTER TABLE "programa"
ADD FOREIGN KEY("id_tipo_programa") REFERENCES "tipo_programa"("id")
ON UPDATE RESTRICT ON DELETE RESTRICT;

ALTER TABLE "programa"
ADD FOREIGN KEY("id_usuario_creador") REFERENCES "usuario"("id")
ON UPDATE RESTRICT ON DELETE RESTRICT;

ALTER TABLE "programa_usuario"
ADD FOREIGN KEY("id_programa") REFERENCES "programa"("id")
ON UPDATE RESTRICT ON DELETE RESTRICT;

ALTER TABLE "programa_usuario"
ADD FOREIGN KEY("id_usuario") REFERENCES "usuario"("id")
ON UPDATE RESTRICT ON DELETE RESTRICT;

ALTER TABLE "programa_usuario"
ADD FOREIGN KEY("id_rol") REFERENCES "rol"("id")
ON UPDATE RESTRICT ON DELETE RESTRICT;

ALTER TABLE "proyecto"
ADD FOREIGN KEY("id_usuario_creador") REFERENCES "usuario"("id")
ON UPDATE RESTRICT ON DELETE RESTRICT;

ALTER TABLE "presupuesto_gestion"
ADD FOREIGN KEY("id_proyecto") REFERENCES "proyecto"("id")
ON UPDATE RESTRICT ON DELETE RESTRICT;

ALTER TABLE "presupuesto_gestion"
ADD FOREIGN KEY("id_usuario_creador") REFERENCES "usuario"("id")
ON UPDATE RESTRICT ON DELETE RESTRICT;

ALTER TABLE "partida_concreta"
ADD FOREIGN KEY("id_presupuesto_gestion") REFERENCES "presupuesto_gestion"("id")
ON UPDATE RESTRICT ON DELETE RESTRICT;

ALTER TABLE "item_tramite"
ADD FOREIGN KEY("id_estado_item") REFERENCES "estado_item_tramite"("id")
ON UPDATE RESTRICT ON DELETE RESTRICT;