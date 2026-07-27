-- ─── SCHEMA DEFINITION MVP DICYT SIGEFI ──────────────────────────────

CREATE TABLE IF NOT EXISTS "estado_proyecto" (
	"id" SMALLSERIAL NOT NULL,
	"nombre" VARCHAR(50) NOT NULL,
	PRIMARY KEY("id")
);

CREATE TABLE IF NOT EXISTS "tipo_tramite" (
	"id" SMALLSERIAL NOT NULL,
	"nombre" VARCHAR(255) NOT NULL,
	PRIMARY KEY("id"),
	CONSTRAINT "tipo_tramite_nombre_key" UNIQUE ("nombre")
);

CREATE TABLE IF NOT EXISTS "proveedor" (
	"id" SMALLSERIAL NOT NULL,
	"nombre" VARCHAR(255) NOT NULL,
	"nit" VARCHAR(255),
	"telefono" VARCHAR(255),
	"direccion" VARCHAR(255),
	PRIMARY KEY("id")
);

CREATE TABLE IF NOT EXISTS "forma_pago" (
	"id" SERIAL NOT NULL,
	"nombre" VARCHAR(255) NOT NULL,
	PRIMARY KEY("id")
);

CREATE TABLE IF NOT EXISTS "evidencia_archivo" (
	"id" UUID NOT NULL DEFAULT gen_random_uuid(),
	"nombre_original" VARCHAR(255) NOT NULL,
	"url" VARCHAR(512) NOT NULL,
	"fecha_subida" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
	PRIMARY KEY("id")
);

CREATE TABLE IF NOT EXISTS "fuente_financiamiento" (
	"id" UUID NOT NULL,
	"nombre" VARCHAR(255) NOT NULL,
	PRIMARY KEY("id")
);

CREATE TABLE IF NOT EXISTS "convenio" (
	"id" UUID NOT NULL DEFAULT gen_random_uuid(),
	"id_fuente_financiamiento" UUID NOT NULL,
	"nombre" VARCHAR(255) NOT NULL,
	"presupuesto" DECIMAL(15,2) NOT NULL CHECK ("presupuesto" >= 0),
	PRIMARY KEY("id")
);

CREATE TABLE IF NOT EXISTS "programa" (
	"id" SERIAL NOT NULL,
	"id_convenio" UUID NOT NULL,
	"id_programa_padre" INTEGER,
	"nombre" VARCHAR(255) NOT NULL,
	"presupuesto" DECIMAL(15,2) NOT NULL CHECK ("presupuesto" >= 0),
	PRIMARY KEY("id")
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
	PRIMARY KEY("id")
);

CREATE TABLE IF NOT EXISTS "partida" (
	"id" SMALLSERIAL NOT NULL,
	"codigo" INTEGER NOT NULL UNIQUE,
	"nombre" VARCHAR(255),
	"descripcion" TEXT,
	PRIMARY KEY("id")
);

CREATE TABLE IF NOT EXISTS "partida_concreta" (
	"id" SERIAL NOT NULL,
	"id_proyecto" INTEGER NOT NULL,
	"id_partida" SMALLINT NOT NULL,
	"presupuesto" DECIMAL(15,2) NOT NULL CHECK ("presupuesto" >= 0),
	PRIMARY KEY("id")
);

CREATE TABLE IF NOT EXISTS "item" (
	"id" SERIAL NOT NULL,
	"id_partida_concreta" INTEGER NOT NULL,
	"nombre" VARCHAR(255) NOT NULL,
	PRIMARY KEY("id")
);

CREATE TABLE IF NOT EXISTS "tipo_modificacion_presupuestaria" (
	"id" SMALLSERIAL NOT NULL,
	"nombre" VARCHAR(50) NOT NULL,
	PRIMARY KEY("id")
);

CREATE TABLE IF NOT EXISTS "bitacora_modificacion_presupuestaria" (
	"id" SERIAL NOT NULL,
	"id_proyecto" INTEGER NOT NULL,
	"justificacion" VARCHAR(255) NOT NULL,
	"fecha" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
	PRIMARY KEY("id")
);

CREATE TABLE IF NOT EXISTS "detalle_modificacion_presupuestaria" (
	"id" SERIAL NOT NULL,
	"id_bitacora_modificacion_presupuestaria" INTEGER NOT NULL,
	"id_partida_concreta_origen" INTEGER NOT NULL,
	"id_partida_concreta_destino" INTEGER NOT NULL,
	"id_tipo_modificacion" SMALLINT NOT NULL,
	"monto" DECIMAL(15,2) NOT NULL CHECK ("monto" > 0),
	"descripcion" VARCHAR(255) NOT NULL,
	PRIMARY KEY("id")
);

CREATE TABLE IF NOT EXISTS "rol" (
	"id" SMALLSERIAL NOT NULL,
	"nombre" VARCHAR(100) NOT NULL,
	PRIMARY KEY("id")
);

CREATE TABLE IF NOT EXISTS "usuario" (
	"id" SERIAL NOT NULL,
	"username" VARCHAR(100) NOT NULL,
	"password" VARCHAR(255) NOT NULL,
	PRIMARY KEY("id"),
	CONSTRAINT "usuario_username_key" UNIQUE ("username")
);

CREATE TABLE IF NOT EXISTS "rol_usuario" (
	"id_rol" SMALLINT NOT NULL,
	"id_usuario" INTEGER NOT NULL,
	PRIMARY KEY("id_rol", "id_usuario")
);

CREATE INDEX IF NOT EXISTS "rol_usuario_usuario_idx"
ON "rol_usuario" ("id_usuario");

CREATE TABLE IF NOT EXISTS "paso_flujo" (
	"id" SMALLSERIAL NOT NULL,
	"id_tipo_tramite" SMALLINT NOT NULL,
	"nombre" VARCHAR(100) NOT NULL,
	"orden" SMALLINT NOT NULL,
	PRIMARY KEY("id")
);

CREATE TABLE IF NOT EXISTS "estado_paso_flujo" (
	"id" SMALLSERIAL NOT NULL,
	"id_paso_flujo" SMALLINT NOT NULL,
	"nombre" VARCHAR(100) NOT NULL,
	"es_inicial" BOOLEAN NOT NULL DEFAULT false,
	"es_final" BOOLEAN NOT NULL DEFAULT false,
	PRIMARY KEY("id")
);

CREATE TABLE IF NOT EXISTS "transicion_flujo" (
	"id" SERIAL NOT NULL,
	"id_estado_origen" SMALLINT NOT NULL,
	"id_estado_destino" SMALLINT NOT NULL,
	"nombre_accion" VARCHAR(100) NOT NULL,
	PRIMARY KEY("id")
);

CREATE TABLE IF NOT EXISTS "tramite" (
	"id" SERIAL NOT NULL,
	"id_proyecto" INTEGER NOT NULL,
	"id_tipo_tramite" SMALLINT NOT NULL,
	"id_estado_tramite" SMALLINT NOT NULL,
	"id_evidencia_archivo" UUID,
	"id_usuario" INTEGER NOT NULL,
	"fecha_creacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
	"fecha_actualizacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
	"rechazado" BOOLEAN NOT NULL DEFAULT false,
	"justificacion" TEXT,
	"custodio" VARCHAR(255),
	"lugar_items" VARCHAR(255),
	PRIMARY KEY("id")
);

CREATE TABLE IF NOT EXISTS "historial_estado_tramite" (
	"id" SERIAL NOT NULL,
	"id_tramite" INTEGER NOT NULL,
	"id_estado_anterior" SMALLINT NOT NULL,
	"id_estado_nuevo" SMALLINT NOT NULL,
	"fecha_cambio" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
	"id_usuario_responsable" INTEGER,
	"observaciones" TEXT,
	PRIMARY KEY("id")
);

CREATE TABLE IF NOT EXISTS "item_tramite" (
	"id" SERIAL NOT NULL,
	"id_item" INTEGER NOT NULL,
	"id_tramite" INTEGER NOT NULL,
	"cantidad_solicitada" SMALLINT NOT NULL,
	"precio" DECIMAL(15,2) NOT NULL,
	"existe_en_mercado_virtual" BOOLEAN DEFAULT true,
	"especificacion" TEXT NOT NULL,
	PRIMARY KEY("id")
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
	PRIMARY KEY("id")
);

CREATE TABLE IF NOT EXISTS "detalle_cotizacion" (
	"id" SERIAL NOT NULL,
	"id_cotizacion" INTEGER NOT NULL,
	"id_tramite_item" INTEGER NOT NULL,
	"especificacion" TEXT NOT NULL,
	"cantidad_existencias" SMALLINT NOT NULL,
	"precio" DECIMAL(15,2) NOT NULL CHECK ("precio" >= 0),
	PRIMARY KEY("id"),
	CONSTRAINT "detalle_cotizacion_cotizacion_item_key" UNIQUE ("id_cotizacion", "id_tramite_item")
);

CREATE TABLE IF NOT EXISTS "tipo_documento_contractual" (
	"id" SMALLSERIAL NOT NULL,
	"nombre" VARCHAR(255) NOT NULL,
	PRIMARY KEY("id")
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
	PRIMARY KEY("id")
);

CREATE TABLE IF NOT EXISTS "tipo_acta_recepcion_conformidad" (
	"id" SMALLSERIAL NOT NULL,
	"nombre" VARCHAR(255) NOT NULL,
	PRIMARY KEY("id")
);

CREATE TABLE IF NOT EXISTS "acta_recepcion_conformidad" (
	"id" SERIAL NOT NULL,
	"id_tramite" INTEGER NOT NULL,
	"id_tipo_acta" SMALLINT NOT NULL,
	"fecha_emision" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
	"id_usuario_responsable" INTEGER,
	"observaciones" TEXT,
	"id_archivo" UUID NOT NULL,
	PRIMARY KEY("id")
);

CREATE TABLE IF NOT EXISTS "tipo_estado_solicitud_pago" (
	"id" SMALLINT NOT NULL GENERATED BY DEFAULT AS IDENTITY,
	"nombre" VARCHAR(255) NOT NULL,
	PRIMARY KEY("id")
);

CREATE TABLE IF NOT EXISTS "solicitud_pago" (
	"id" SERIAL NOT NULL,
	"id_tramite" INTEGER NOT NULL,
	"id_proveedor" SMALLINT NOT NULL,
	"id_estado_solicitud_pago" SMALLINT NOT NULL,
	"monto_solicitado" DECIMAL(15,2) NOT NULL CHECK ("monto_solicitado" > 0),
	"fecha_solicitud" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
	PRIMARY KEY("id")
);

CREATE TABLE IF NOT EXISTS "rol_estado_paso_flujo" (
	"id_rol" SMALLINT NOT NULL,
	"id_estado_paso_flujo" SMALLINT NOT NULL,
	PRIMARY KEY("id_rol", "id_estado_paso_flujo")
);

CREATE TABLE IF NOT EXISTS "memorandum" (
	"id_solicitud_pago" INTEGER NOT NULL,
	"fecha_emision" TIMESTAMP NOT NULL,
	"id_archivo" UUID NOT NULL,
	PRIMARY KEY("id_solicitud_pago")
);

CREATE TABLE IF NOT EXISTS "comprobante_c31" (
	"id_solicitud_pago" INTEGER NOT NULL,
	"fecha_emision" TIMESTAMP NOT NULL,
	"id_archivo" UUID NOT NULL,
	PRIMARY KEY("id_solicitud_pago")
);

CREATE TABLE IF NOT EXISTS "cheque" (
	"id_solicitud_pago" INTEGER NOT NULL,
	"fecha_emision" TIMESTAMP NOT NULL,
	"id_archivo" UUID NOT NULL,
	PRIMARY KEY("id_solicitud_pago")
);

CREATE TABLE IF NOT EXISTS "ejecucion_gasto" (
	"id_solicitud_pago" INTEGER NOT NULL,
	"fecha_ejecucion" TIMESTAMP NOT NULL,
	"id_archivo" UUID NOT NULL,
	PRIMARY KEY("id_solicitud_pago")
);

CREATE TABLE IF NOT EXISTS "item_proveedor_tramite" (
	"id" SERIAL NOT NULL,
	"id_item_tramite" INTEGER NOT NULL,
	"id_proveedor" SMALLINT NOT NULL,
	"cantidad_proveida" SMALLINT NOT NULL,
	"precio" DECIMAL NOT NULL,
	PRIMARY KEY("id")
);

CREATE TABLE IF NOT EXISTS "proyecto_usuario" (
	"id" INTEGER NOT NULL GENERATED BY DEFAULT AS IDENTITY,
	"id_usuario" INTEGER NOT NULL,
	"id_proyecto" INTEGER NOT NULL,
	"id_rol" SMALLINT,
	PRIMARY KEY("id")
);

-- ─── Foreign Keys ─────────────────────────────────────────────

ALTER TABLE "convenio"
ADD FOREIGN KEY("id_fuente_financiamiento") REFERENCES "fuente_financiamiento"("id")
ON UPDATE CASCADE ON DELETE RESTRICT;

ALTER TABLE "programa"
ADD FOREIGN KEY("id_convenio") REFERENCES "convenio"("id")
ON UPDATE CASCADE ON DELETE RESTRICT;

ALTER TABLE "programa"
ADD FOREIGN KEY("id_programa_padre") REFERENCES "programa"("id")
ON UPDATE CASCADE ON DELETE SET NULL;

ALTER TABLE "proyecto"
ADD FOREIGN KEY("id_estado_proyecto") REFERENCES "estado_proyecto"("id")
ON UPDATE CASCADE ON DELETE RESTRICT;

ALTER TABLE "proyecto"
ADD FOREIGN KEY("id_programa") REFERENCES "programa"("id")
ON UPDATE CASCADE ON DELETE RESTRICT;

ALTER TABLE "partida_concreta"
ADD FOREIGN KEY("id_proyecto") REFERENCES "proyecto"("id")
ON UPDATE CASCADE ON DELETE RESTRICT;

ALTER TABLE "partida_concreta"
ADD FOREIGN KEY("id_partida") REFERENCES "partida"("id")
ON UPDATE NO ACTION ON DELETE NO ACTION;

ALTER TABLE "item"
ADD FOREIGN KEY("id_partida_concreta") REFERENCES "partida_concreta"("id")
ON UPDATE CASCADE ON DELETE RESTRICT;

ALTER TABLE "bitacora_modificacion_presupuestaria"
ADD FOREIGN KEY("id_proyecto") REFERENCES "proyecto"("id")
ON UPDATE CASCADE ON DELETE RESTRICT;

ALTER TABLE "detalle_modificacion_presupuestaria"
ADD FOREIGN KEY("id_bitacora_modificacion_presupuestaria") REFERENCES "bitacora_modificacion_presupuestaria"("id")
ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE "detalle_modificacion_presupuestaria"
ADD FOREIGN KEY("id_partida_concreta_origen") REFERENCES "partida_concreta"("id")
ON UPDATE CASCADE ON DELETE RESTRICT;

ALTER TABLE "detalle_modificacion_presupuestaria"
ADD FOREIGN KEY("id_partida_concreta_destino") REFERENCES "partida_concreta"("id")
ON UPDATE CASCADE ON DELETE RESTRICT;

ALTER TABLE "detalle_modificacion_presupuestaria"
ADD FOREIGN KEY("id_tipo_modificacion") REFERENCES "tipo_modificacion_presupuestaria"("id")
ON UPDATE CASCADE ON DELETE RESTRICT;

ALTER TABLE "paso_flujo"
ADD FOREIGN KEY("id_tipo_tramite") REFERENCES "tipo_tramite"("id")
ON UPDATE CASCADE ON DELETE RESTRICT;

ALTER TABLE "estado_paso_flujo"
ADD FOREIGN KEY("id_paso_flujo") REFERENCES "paso_flujo"("id")
ON UPDATE CASCADE ON DELETE RESTRICT;

ALTER TABLE "transicion_flujo"
ADD FOREIGN KEY("id_estado_origen") REFERENCES "estado_paso_flujo"("id")
ON UPDATE CASCADE ON DELETE RESTRICT;

ALTER TABLE "transicion_flujo"
ADD FOREIGN KEY("id_estado_destino") REFERENCES "estado_paso_flujo"("id")
ON UPDATE NO ACTION ON DELETE NO ACTION;

ALTER TABLE "rol_usuario"
ADD FOREIGN KEY("id_rol") REFERENCES "rol"("id")
ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE "rol_usuario"
ADD FOREIGN KEY("id_usuario") REFERENCES "usuario"("id")
ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE "tramite"
ADD FOREIGN KEY("id_proyecto") REFERENCES "proyecto"("id")
ON UPDATE CASCADE ON DELETE RESTRICT;

ALTER TABLE "tramite"
ADD FOREIGN KEY("id_tipo_tramite") REFERENCES "tipo_tramite"("id")
ON UPDATE CASCADE ON DELETE RESTRICT;

ALTER TABLE "tramite"
ADD FOREIGN KEY("id_estado_tramite") REFERENCES "estado_paso_flujo"("id")
ON UPDATE CASCADE ON DELETE RESTRICT;

ALTER TABLE "tramite"
ADD FOREIGN KEY("id_evidencia_archivo") REFERENCES "evidencia_archivo"("id")
ON UPDATE NO ACTION ON DELETE NO ACTION;

ALTER TABLE "tramite"
ADD FOREIGN KEY("id_usuario") REFERENCES "usuario"("id")
ON UPDATE NO ACTION ON DELETE NO ACTION;

ALTER TABLE "item_tramite"
ADD FOREIGN KEY("id_item") REFERENCES "item"("id")
ON UPDATE CASCADE ON DELETE RESTRICT;

ALTER TABLE "item_tramite"
ADD FOREIGN KEY("id_tramite") REFERENCES "tramite"("id")
ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE "cotizacion"
ADD FOREIGN KEY("id_tramite") REFERENCES "tramite"("id")
ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE "cotizacion"
ADD FOREIGN KEY("id_proveedor") REFERENCES "proveedor"("id")
ON UPDATE CASCADE ON DELETE RESTRICT;

ALTER TABLE "cotizacion"
ADD FOREIGN KEY("id_forma_pago") REFERENCES "forma_pago"("id")
ON UPDATE CASCADE ON DELETE SET NULL;

ALTER TABLE "detalle_cotizacion"
ADD FOREIGN KEY("id_cotizacion") REFERENCES "cotizacion"("id")
ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE "detalle_cotizacion"
ADD FOREIGN KEY("id_tramite_item") REFERENCES "item_tramite"("id")
ON UPDATE CASCADE ON DELETE RESTRICT;

ALTER TABLE "documento_contractual"
ADD FOREIGN KEY("id_tramite") REFERENCES "tramite"("id")
ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE "documento_contractual"
ADD FOREIGN KEY("id_tipo_documento_contractual") REFERENCES "tipo_documento_contractual"("id")
ON UPDATE NO ACTION ON DELETE NO ACTION;

ALTER TABLE "documento_contractual"
ADD FOREIGN KEY("id_proveedor") REFERENCES "proveedor"("id")
ON UPDATE NO ACTION ON DELETE NO ACTION;

ALTER TABLE "acta_recepcion_conformidad"
ADD FOREIGN KEY("id_tramite") REFERENCES "tramite"("id")
ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE "acta_recepcion_conformidad"
ADD FOREIGN KEY("id_usuario_responsable") REFERENCES "usuario"("id")
ON UPDATE CASCADE ON DELETE SET NULL;

ALTER TABLE "acta_recepcion_conformidad"
ADD FOREIGN KEY("id_tipo_acta") REFERENCES "tipo_acta_recepcion_conformidad"("id")
ON UPDATE NO ACTION ON DELETE NO ACTION;

ALTER TABLE "solicitud_pago"
ADD FOREIGN KEY("id_tramite") REFERENCES "tramite"("id")
ON UPDATE CASCADE ON DELETE RESTRICT;

ALTER TABLE "solicitud_pago"
ADD FOREIGN KEY("id_proveedor") REFERENCES "proveedor"("id")
ON UPDATE CASCADE ON DELETE RESTRICT;

ALTER TABLE "solicitud_pago"
ADD FOREIGN KEY("id_estado_solicitud_pago") REFERENCES "tipo_estado_solicitud_pago"("id")
ON UPDATE NO ACTION ON DELETE NO ACTION;

ALTER TABLE "historial_estado_tramite"
ADD FOREIGN KEY("id_tramite") REFERENCES "tramite"("id")
ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE "historial_estado_tramite"
ADD FOREIGN KEY("id_estado_anterior") REFERENCES "estado_paso_flujo"("id")
ON UPDATE CASCADE ON DELETE RESTRICT;

ALTER TABLE "historial_estado_tramite"
ADD FOREIGN KEY("id_estado_nuevo") REFERENCES "estado_paso_flujo"("id")
ON UPDATE CASCADE ON DELETE RESTRICT;

ALTER TABLE "historial_estado_tramite"
ADD FOREIGN KEY("id_usuario_responsable") REFERENCES "usuario"("id")
ON UPDATE CASCADE ON DELETE SET NULL;

ALTER TABLE "rol_estado_paso_flujo"
ADD FOREIGN KEY("id_estado_paso_flujo") REFERENCES "estado_paso_flujo"("id")
ON UPDATE NO ACTION ON DELETE NO ACTION;

ALTER TABLE "rol_estado_paso_flujo"
ADD FOREIGN KEY("id_rol") REFERENCES "rol"("id")
ON UPDATE NO ACTION ON DELETE NO ACTION;

ALTER TABLE "memorandum"
ADD FOREIGN KEY("id_solicitud_pago") REFERENCES "solicitud_pago"("id")
ON UPDATE NO ACTION ON DELETE NO ACTION;

ALTER TABLE "comprobante_c31"
ADD FOREIGN KEY("id_solicitud_pago") REFERENCES "solicitud_pago"("id")
ON UPDATE NO ACTION ON DELETE NO ACTION;

ALTER TABLE "cheque"
ADD FOREIGN KEY("id_solicitud_pago") REFERENCES "solicitud_pago"("id")
ON UPDATE NO ACTION ON DELETE NO ACTION;

ALTER TABLE "ejecucion_gasto"
ADD FOREIGN KEY("id_solicitud_pago") REFERENCES "solicitud_pago"("id")
ON UPDATE NO ACTION ON DELETE NO ACTION;

ALTER TABLE "item_proveedor_tramite"
ADD FOREIGN KEY("id_item_tramite") REFERENCES "item_tramite"("id")
ON UPDATE NO ACTION ON DELETE NO ACTION;

ALTER TABLE "item_proveedor_tramite"
ADD FOREIGN KEY("id_proveedor") REFERENCES "proveedor"("id")
ON UPDATE NO ACTION ON DELETE NO ACTION;

ALTER TABLE "proyecto_usuario"
ADD FOREIGN KEY("id_proyecto") REFERENCES "proyecto"("id")
ON UPDATE NO ACTION ON DELETE NO ACTION;

ALTER TABLE "proyecto_usuario"
ADD FOREIGN KEY("id_usuario") REFERENCES "usuario"("id")
ON UPDATE NO ACTION ON DELETE NO ACTION;
