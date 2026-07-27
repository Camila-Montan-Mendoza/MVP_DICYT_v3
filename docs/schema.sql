-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- ─── Catálogos y Entidades Base ──────────────────────────────────────────────

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

CREATE TABLE IF NOT EXISTS "tipo_estado_solicitud_pago" (
	"id" SMALLSERIAL NOT NULL,
	"nombre" VARCHAR(255) NOT NULL,
	CONSTRAINT "tipo_estado_solicitud_pago_pkey" PRIMARY KEY("id")
);

-- Servicio Centralizado de Archivos / Multimedia (URLs)
CREATE TABLE IF NOT EXISTS "archivo" (
	"id" UUID NOT NULL DEFAULT gen_random_uuid(),
	"nombre_original" VARCHAR(255) NOT NULL,
	"mime_type" VARCHAR(100) NOT NULL,
	"url" VARCHAR(512) NOT NULL,
	"fecha_subida" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT "archivo_pkey" PRIMARY KEY("id")
);

-- ─── Estructura Financiera ──────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS "fuente_financiamiento" (
	"id" UUID NOT NULL,
	"nombre" VARCHAR(255) NOT NULL,
	CONSTRAINT "fuente_financiamiento_pkey" PRIMARY KEY("id")
);

CREATE TABLE IF NOT EXISTS "convenio" (
	"id" UUID NOT NULL DEFAULT gen_random_uuid(),
	"id_fuente_financiamiento" UUID NOT NULL,
	"nombre" VARCHAR(255) NOT NULL,
	"presupuesto" DECIMAL(15,2) NOT NULL CHECK ("presupuesto" >= 0),
	CONSTRAINT "convenio_pkey" PRIMARY KEY("id")
);

CREATE TABLE IF NOT EXISTS "programa" (
	"id" SERIAL NOT NULL,
	"id_convenio" UUID NOT NULL,
	"id_programa_padre" INTEGER,
	"nombre" VARCHAR(255) NOT NULL,
	"presupuesto" DECIMAL(15,2) NOT NULL CHECK ("presupuesto" >= 0),
	CONSTRAINT "programa_pkey" PRIMARY KEY("id")
);

CREATE TABLE IF NOT EXISTS "proyecto" (
	"id" SERIAL NOT NULL,
	"id_estado_proyecto" SMALLINT NOT NULL,
	"id_programa" INTEGER NOT NULL,
	"nombre" VARCHAR(255) NOT NULL,
	"codigo" VARCHAR(255) NOT NULL,
	"presupuesto" DECIMAL(15,2) NOT NULL CHECK ("presupuesto" >= 0),
	"fecha_inicio" DATE NOT NULL,
	"fecha_fin" DATE NOT NULL,
	CONSTRAINT "proyecto_pkey" PRIMARY KEY("id")
);

CREATE TABLE IF NOT EXISTS "partida_concreta" (
	"id" SERIAL NOT NULL,
	"id_proyecto" INTEGER NOT NULL,
	"codigo" SMALLINT NOT NULL,
	"presupuesto" DECIMAL(15,2) NOT NULL CHECK ("presupuesto" >= 0),
	CONSTRAINT "partida_concreta_pkey" PRIMARY KEY("id")
);

CREATE TABLE IF NOT EXISTS "item" (
	"id" SERIAL NOT NULL,
	"id_partida" INTEGER NOT NULL,
	"nombre" VARCHAR(255) NOT NULL,
	CONSTRAINT "item_pkey" PRIMARY KEY("id")
);

-- Modificaciones Presupuestarias
CREATE TABLE IF NOT EXISTS "tipo_modificacion_presupuestaria" (
	"id" SMALLSERIAL NOT NULL,
	"nombre" VARCHAR(50) NOT NULL,
	CONSTRAINT "tipo_modificacion_presupuestaria_pkey" PRIMARY KEY("id")
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
	"id_partida_origen" INTEGER NOT NULL,
	"id_partida_destino" INTEGER NOT NULL,
	"id_tipo_modificacion" SMALLINT NOT NULL,
	"monto" DECIMAL(15,2) NOT NULL CHECK ("monto" > 0),
	"descripcion" VARCHAR(255) NOT NULL,
	CONSTRAINT "detalle_modificacion_presupuestaria_pkey" PRIMARY KEY("id")
);

-- ─── Usuarios, Roles y Workflow ─────────────────────────────────────────────

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

CREATE INDEX IF NOT EXISTS "rol_usuario_usuario_idx" ON "rol_usuario" ("id_usuario");

CREATE TABLE IF NOT EXISTS "paso_flujo" (
	"id" SMALLSERIAL NOT NULL,
	"id_tipo_tramite" SMALLINT NOT NULL,
	"nombre" VARCHAR(100) NOT NULL,
	"orden" SMALLINT NOT NULL,
	CONSTRAINT "paso_flujo_pkey" PRIMARY KEY("id")
);

CREATE TABLE IF NOT EXISTS "estado_paso_flujo" (
	"id" SMALLSERIAL NOT NULL,
	"id_paso_flujo" SMALLINT NOT NULL,
	"nombre" VARCHAR(100) NOT NULL,
	"es_inicial" BOOLEAN NOT NULL DEFAULT false,
	"es_final" BOOLEAN NOT NULL DEFAULT false,
	CONSTRAINT "estado_paso_flujo_pkey" PRIMARY KEY("id")
);

CREATE TABLE IF NOT EXISTS "rol_estado_paso_flujo" (
	"id_rol" SMALLINT NOT NULL,
	"id_estado_paso_flujo" SMALLINT NOT NULL,
	CONSTRAINT "rol_estado_paso_flujo_pkey" PRIMARY KEY("id_rol", "id_estado_paso_flujo")
);

CREATE TABLE IF NOT EXISTS "transicion_flujo" (
	"id" SERIAL NOT NULL,
	"id_estado_origen" SMALLINT NOT NULL,
	"id_estado_destino" SMALLINT NOT NULL,
	"nombre_accion" VARCHAR(100) NOT NULL,
	CONSTRAINT "transicion_flujo_pkey" PRIMARY KEY("id")
);

CREATE TABLE IF NOT EXISTS "tramite" (
	"id" SERIAL NOT NULL,
	"id_proyecto" INTEGER NOT NULL,
	"id_tipo_tramite" SMALLINT NOT NULL,
	"id_estado_tramite" SMALLINT NOT NULL,
	"id_proveedor_adjudicado" SMALLINT,
	"fecha_creacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
	"fecha_actualizacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
	"rechazado" BOOLEAN NOT NULL DEFAULT false,
	CONSTRAINT "tramite_pkey" PRIMARY KEY("id")
);

CREATE TABLE IF NOT EXISTS "proveedor_tramite" (
	"id_proveedor" SMALLINT NOT NULL,
	"id_tramite" INTEGER NOT NULL,
	CONSTRAINT "proveedor_tramite_pkey" PRIMARY KEY("id_proveedor", "id_tramite")
);

CREATE TABLE IF NOT EXISTS "historial_estado_tramite" (
	"id" SERIAL NOT NULL,
	"id_tramite" INTEGER NOT NULL,
	"id_estado_anterior" SMALLINT NOT NULL,
	"id_estado_nuevo" SMALLINT NOT NULL,
	"fecha_cambio" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
	"id_usuario_responsable" INTEGER,
	"observaciones" TEXT,
	CONSTRAINT "historial_estado_tramite_pkey" PRIMARY KEY("id")
);

CREATE TABLE IF NOT EXISTS "tramite_item" (
	"id" SERIAL NOT NULL,
	"id_item" INTEGER NOT NULL,
	"id_tramite" INTEGER NOT NULL,
	"existe_en_mercado_virtual" BOOLEAN NOT NULL DEFAULT true,
	CONSTRAINT "tramite_item_pkey" PRIMARY KEY("id")
);

-- ─── Cotizaciones (Composición) ──────────────────────────────────────────────

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
	"especificacion" VARCHAR(255) NOT NULL,
	"precio" DECIMAL(15,2) NOT NULL CHECK ("precio" >= 0),
	CONSTRAINT "detalle_cotizacion_pkey" PRIMARY KEY("id"),
	CONSTRAINT "detalle_cotizacion_cotizacion_item_key" UNIQUE ("id_cotizacion", "id_tramite_item")
);

-- ─── Documentos Contractuales y Actas ────────────────────────────────────────

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

-- ─── Solicitud de Pago y Seguimiento por Hitos ────────────────────────────────

CREATE TABLE IF NOT EXISTS "solicitud_pago" (
	"id" SERIAL NOT NULL,
	"id_tramite" INTEGER NOT NULL,
	"id_proveedor" SMALLINT NOT NULL,
	"id_estado_solicitud_pago" SMALLINT NOT NULL,
	"monto_solicitado" DECIMAL(15,2) NOT NULL CHECK ("monto_solicitado" > 0),
	"fecha_solicitud" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT "solicitud_pago_pkey" PRIMARY KEY("id")
);

CREATE TABLE IF NOT EXISTS "pago_memorandum" (
	"id_solicitud_pago" INTEGER NOT NULL,
	"fecha_emision" TIMESTAMP NOT NULL,
	"id_archivo" UUID NOT NULL,
	CONSTRAINT "pago_memorandum_pkey" PRIMARY KEY("id_solicitud_pago")
);

CREATE TABLE IF NOT EXISTS "pago_comprobante_c31" (
	"id_solicitud_pago" INTEGER NOT NULL,
	"fecha_emision" TIMESTAMP NOT NULL,
	"id_archivo" UUID NOT NULL,
	CONSTRAINT "pago_comprobante_c31_pkey" PRIMARY KEY("id_solicitud_pago")
);

CREATE TABLE IF NOT EXISTS "pago_cheque" (
	"id_solicitud_pago" INTEGER NOT NULL,
	"fecha_emision" TIMESTAMP NOT NULL,
	"id_archivo" UUID NOT NULL,
	CONSTRAINT "pago_cheque_pkey" PRIMARY KEY("id_solicitud_pago")
);

CREATE TABLE IF NOT EXISTS "ejecucion_gasto" (
	"id_solicitud_pago" INTEGER NOT NULL,
	"fecha_ejecucion" TIMESTAMP NOT NULL,
	"id_archivo" UUID NOT NULL,
	CONSTRAINT "ejecucion_gasto_pkey" PRIMARY KEY("id_solicitud_pago")
);
