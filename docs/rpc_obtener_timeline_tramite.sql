-- ─── RPC FUNCTION: obtener_timeline_tramite ──────────────────────────────
-- Ejecuta la consulta SQL pura recursiva (CTE + BFS) para obtener la cronología del trámite según schema.sql

CREATE OR REPLACE FUNCTION obtener_timeline_tramite(p_tramite_id INT)
RETURNS TABLE (
  tarea_id INT,
  tarea_nombre VARCHAR,
  paso_flujo_id INT,
  rol_esperado VARCHAR,
  usuario_responsable VARCHAR,
  rol_responsable_real VARCHAR,
  fecha_completado TIMESTAMP(3),
  estado TEXT
) 
LANGUAGE sql
STABLE
AS $$
WITH RECURSIVE 
-- 1. Contexto del Trámite y del Paso Actual
tramite_info AS (
  SELECT 
    t."id" AS tramite_id,
    t."id_tarea_tramite" AS tarea_actual_id,
    tpf."id_paso_flujo" AS paso_actual_id,
    pf."orden" AS paso_actual_orden,
    pf."id_tipo_tramite",
    t."rechazado",
    (SELECT MAX("orden") FROM "paso_flujo" WHERE "id_tipo_tramite" = t."id_tipo_tramite") AS max_paso_orden
  FROM "tramite" t
  JOIN "tarea_paso_flujo" tpf ON t."id_tarea_tramite" = tpf."id"
  JOIN "paso_flujo" pf ON tpf."id_paso_flujo" = pf."id"
  WHERE t."id" = p_tramite_id
),

-- 1b. Quién completó cada tarea anterior y cuándo
usuario_por_tarea AS (
  SELECT DISTINCT ON (htt."id_tarea_anterior")
    htt."id_tarea_anterior"             AS tarea_id,
    htt."fecha_cambio"                  AS fecha_completado,
    u."username"                        AS username_responsable,
    (
      SELECT r."nombre"
      FROM "rol_usuario" ru
      JOIN "rol" r ON ru."id_rol" = r."id"
      WHERE ru."id_usuario" = u."id"
      ORDER BY ru."id_rol" ASC
      LIMIT 1
    ) AS rol_usuario_real
  FROM "historial_tarea_tramite" htt
  JOIN tramite_info ti ON htt."id_tramite" = ti.tramite_id
  LEFT JOIN "usuario" u ON htt."id_usuario_responsable" = u."id"
  WHERE htt."id_tarea_anterior" IS NOT NULL
    AND htt."id_tarea_anterior" <> htt."id_tarea_nuevo"
  ORDER BY htt."id_tarea_anterior", htt."fecha_cambio" DESC
),

-- 2. TAREAS PASADAS COMPLETADAS DE CUALQUIER PASO
tareas_pasadas AS (
  SELECT DISTINCT ON (tpf."id")
    tpf."id"                                                         AS tarea_id,
    tpf."nombre"                                                     AS tarea_nombre,
    tpf."id_paso_flujo"                                              AS paso_flujo_id,
    COALESCE(r."nombre", 'Sin rol asignado')::VARCHAR                AS rol_esperado,
    COALESCE(upt."username_responsable", 'Sistema')::VARCHAR         AS usuario_responsable,
    COALESCE(upt."rol_usuario_real", r."nombre", 'Sin rol asignado')::VARCHAR AS rol_responsable_real,
    upt."fecha_completado",
    'COMPLETADO'::text AS estado,
    1 AS seccion,
    upt."fecha_completado" AS orden_sort
  FROM usuario_por_tarea upt
  JOIN "tarea_paso_flujo" tpf ON upt.tarea_id = tpf."id"
  JOIN tramite_info ti ON true
  LEFT JOIN "rol_tarea_paso_flujo" rtpf ON tpf."id" = rtpf."id_tarea_paso_flujo"
  LEFT JOIN "rol" r ON rtpf."id_rol" = r."id"
  WHERE tpf."id" <> ti.tarea_actual_id
  ORDER BY tpf."id", upt."fecha_completado" ASC
),

-- 3. TAREA ACTUAL EN CURSO
tarea_actual AS (
  SELECT 
    tpf."id"                                    AS tarea_id,
    tpf."nombre"                                AS tarea_nombre,
    tpf."id_paso_flujo"                         AS paso_flujo_id,
    COALESCE(r."nombre", 'Sin rol asignado')::VARCHAR AS rol_esperado,
    NULL::VARCHAR                               AS usuario_responsable,
    COALESCE(r."nombre", 'Sin rol asignado')::VARCHAR AS rol_responsable_real,
    NULL::timestamp(3)                          AS fecha_completado,
    CASE WHEN ti."rechazado" = true THEN 'RECHAZADO'::text ELSE 'EN_CURSO'::text END AS estado,
    2 AS seccion,
    NOW() AS orden_sort
  FROM "tarea_paso_flujo" tpf
  JOIN tramite_info ti ON tpf."id" = ti.tarea_actual_id
  LEFT JOIN "rol_tarea_paso_flujo" rtpf ON tpf."id" = rtpf."id_tarea_paso_flujo"
  LEFT JOIN "rol" r ON rtpf."id_rol" = r."id"
),

-- 4. BFS: Ruta hacia el siguiente paso o nodo final
busqueda_meta AS (
  SELECT 
    tf."id_tarea_destino" AS nodo_id,
    pf_dest."orden"        AS paso_dest_orden,
    tpf_dest."es_final"    AS es_final_dest,
    1                      AS depth,
    ARRAY[tf."id_tarea_destino"] AS path,
    (pf_dest."orden" > ti.paso_actual_orden OR (ti.paso_actual_orden = ti.max_paso_orden AND tpf_dest."es_final" = true)) AS es_meta
  FROM "transicion_flujo" tf
  JOIN tramite_info ti ON tf."id_tarea_origen" = ti.tarea_actual_id
  JOIN "tarea_paso_flujo" tpf_dest ON tf."id_tarea_destino" = tpf_dest."id"
  JOIN "paso_flujo" pf_dest ON tpf_dest."id_paso_flujo" = pf_dest."id"
  WHERE tf."nombre_accion" NOT ILIKE '%rechaz%'
    AND tf."nombre_accion" NOT ILIKE '%observ%'
    AND tf."nombre_accion" NOT ILIKE '%subsan%'
  UNION ALL
  SELECT 
    tf."id_tarea_destino",
    pf_dest."orden",
    tpf_dest."es_final",
    bm.depth + 1,
    bm.path || tf."id_tarea_destino",
    (pf_dest."orden" > ti.paso_actual_orden OR (ti.paso_actual_orden = ti.max_paso_orden AND tpf_dest."es_final" = true))
  FROM "transicion_flujo" tf
  JOIN busqueda_meta bm ON tf."id_tarea_origen" = bm.nodo_id
  JOIN "tarea_paso_flujo" tpf_dest ON tf."id_tarea_destino" = tpf_dest."id"
  JOIN "paso_flujo" pf_dest ON tpf_dest."id_paso_flujo" = pf_dest."id"
  JOIN tramite_info ti ON true
  WHERE NOT bm.es_meta
    AND tf."nombre_accion" NOT ILIKE '%rechaz%'
    AND tf."nombre_accion" NOT ILIKE '%observ%'
    AND tf."nombre_accion" NOT ILIKE '%subsan%'
    AND NOT (tf."id_tarea_destino" = ANY(bm.path))
    AND bm.depth < 15
),
ruta_optima_meta AS (
  SELECT path FROM busqueda_meta WHERE es_meta = true ORDER BY depth ASC LIMIT 1
),
nodos_ruta_optima AS (
  SELECT elem AS tarea_id, idx AS orden_secuencia
  FROM ruta_optima_meta, UNNEST(path) WITH ORDINALITY AS u(elem, idx)
),

-- 5. TAREAS FUTURAS PENDIENTES
tareas_futuras AS (
  SELECT 
    tpf."id"                                    AS tarea_id,
    tpf."nombre"                                AS tarea_nombre,
    tpf."id_paso_flujo"                         AS paso_flujo_id,
    COALESCE(r."nombre", 'Sin rol asignado')::VARCHAR AS rol_esperado,
    NULL::VARCHAR                               AS usuario_responsable,
    COALESCE(r."nombre", 'Sin rol asignado')::VARCHAR AS rol_responsable_real,
    NULL::timestamp(3)                          AS fecha_completado,
    'PENDIENTE'::text AS estado,
    3 AS seccion,
    to_timestamp(1700000000 + nro.orden_secuencia) AS orden_sort
  FROM nodos_ruta_optima nro
  JOIN "tarea_paso_flujo" tpf ON nro.tarea_id = tpf."id"
  LEFT JOIN "rol_tarea_paso_flujo" rtpf ON tpf."id" = rtpf."id_tarea_paso_flujo"
  LEFT JOIN "rol" r ON rtpf."id_rol" = r."id"
)

-- ─── CONSOLIDADO FINAL ───
SELECT tarea_id, tarea_nombre, paso_flujo_id, rol_esperado, usuario_responsable, rol_responsable_real, fecha_completado, estado
FROM (
  SELECT * FROM tareas_pasadas
  UNION ALL
  SELECT * FROM tarea_actual
  UNION ALL
  SELECT * FROM tareas_futuras
) resultado_flujo
ORDER BY seccion ASC, orden_sort ASC;
$$;
