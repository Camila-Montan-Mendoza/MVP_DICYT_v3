-- ─── RPC FUNCTION: obtener_timeline_tramite ──────────────────────────────
-- Ejecuta la consulta SQL pura recursiva (CTE + BFS) para obtener la cronología del trámite

CREATE OR REPLACE FUNCTION obtener_timeline_tramite(p_tramite_id INT)
RETURNS TABLE (
  tarea_id INT,
  tarea_nombre VARCHAR,
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
    t."id_estado_tramite" AS estado_actual_id,
    epf."id_paso_flujo" AS paso_actual_id,
    pf."orden" AS paso_actual_orden,
    pf."id_tipo_tramite",
    t."rechazado",
    (SELECT MAX("orden") FROM "paso_flujo" WHERE "id_tipo_tramite" = t."id_tipo_tramite") AS max_paso_orden
  FROM "tramite" t
  JOIN "estado_paso_flujo" epf ON t."id_estado_tramite" = epf."id"
  JOIN "paso_flujo" pf ON epf."id_paso_flujo" = pf."id"
  WHERE t."id" = p_tramite_id
),

-- 1b. Quién completó cada estado anterior y cuándo (filtrando transiciones reales id_estado_anterior <> id_estado_nuevo)
usuario_por_estado AS (
  SELECT DISTINCT ON (het."id_estado_anterior")
    het."id_estado_anterior"             AS estado_id,
    het."fecha_cambio"                   AS fecha_completado,
    u."username"                         AS username_responsable,
    (
      SELECT r."nombre"
      FROM "rol_usuario" ru
      JOIN "rol" r ON ru."id_rol" = r."id"
      WHERE ru."id_usuario" = u."id"
      ORDER BY ru."id_rol" ASC
      LIMIT 1
    ) AS rol_usuario_real
  FROM "historial_estado_tramite" het
  JOIN tramite_info ti ON het."id_tramite" = ti.tramite_id
  LEFT JOIN "usuario" u ON het."id_usuario_responsable" = u."id"
  WHERE het."id_estado_anterior" IS NOT NULL
    AND het."id_estado_anterior" <> het."id_estado_nuevo" -- Excluir registro inicial de creación (1->1)
  ORDER BY het."id_estado_anterior", het."fecha_cambio" DESC
),

-- 2. TAREAS PASADAS COMPLETADAS (obtenidas desde los estados anteriores finalizados)
tareas_pasadas AS (
  SELECT DISTINCT ON (epf."id")
    epf."id"                                                         AS tarea_id,
    epf."nombre"                                                     AS tarea_nombre,
    COALESCE(r."nombre", 'Sin rol asignado')::VARCHAR                AS rol_esperado,
    COALESCE(upe."username_responsable", 'Sistema')::VARCHAR         AS usuario_responsable,
    COALESCE(upe."rol_usuario_real", r."nombre", 'Sin rol asignado')::VARCHAR AS rol_responsable_real,
    upe."fecha_completado",
    'COMPLETADO'::text AS estado,
    1 AS seccion,
    upe."fecha_completado" AS orden_sort
  FROM usuario_por_estado upe
  JOIN "estado_paso_flujo" epf ON upe.estado_id = epf."id"
  JOIN tramite_info ti ON epf."id_paso_flujo" = ti.paso_actual_id
  LEFT JOIN "rol_estado_paso_flujo" repf ON epf."id" = repf."id_estado_paso_flujo"
  LEFT JOIN "rol" r ON repf."id_rol" = r."id"
  WHERE epf."id" <> ti.estado_actual_id
  ORDER BY epf."id", upe."fecha_completado" ASC
),

-- 3. TAREA ACTUAL EN CURSO
tarea_actual AS (
  SELECT 
    epf."id"                                    AS tarea_id,
    epf."nombre"                                AS tarea_nombre,
    COALESCE(r."nombre", 'Sin rol asignado')::VARCHAR AS rol_esperado,
    NULL::VARCHAR                               AS usuario_responsable,
    COALESCE(r."nombre", 'Sin rol asignado')::VARCHAR AS rol_responsable_real,
    NULL::timestamp(3)                          AS fecha_completado,
    CASE WHEN ti."rechazado" = true THEN 'RECHAZADO'::text ELSE 'EN_CURSO'::text END AS estado,
    2 AS seccion,
    NOW() AS orden_sort
  FROM "estado_paso_flujo" epf
  JOIN tramite_info ti ON epf."id" = ti.estado_actual_id
  LEFT JOIN "rol_estado_paso_flujo" repf ON epf."id" = repf."id_estado_paso_flujo"
  LEFT JOIN "rol" r ON repf."id_rol" = r."id"
),

-- 4. BFS: Ruta más corta hacia el siguiente paso o nodo final
busqueda_meta AS (
  SELECT 
    tf."id_estado_destino" AS nodo_id,
    pf_dest."orden"        AS paso_dest_orden,
    epf_dest."es_final"    AS es_final_dest,
    1                      AS depth,
    ARRAY[tf."id_estado_destino"] AS path,
    (pf_dest."orden" > ti.paso_actual_orden OR (ti.paso_actual_orden = ti.max_paso_orden AND epf_dest."es_final" = true)) AS es_meta
  FROM "transicion_flujo" tf
  JOIN tramite_info ti ON tf."id_estado_origen" = ti.estado_actual_id
  JOIN "estado_paso_flujo" epf_dest ON tf."id_estado_destino" = epf_dest."id"
  JOIN "paso_flujo" pf_dest ON epf_dest."id_paso_flujo" = pf_dest."id"
  WHERE tf."nombre_accion" NOT ILIKE '%rechaz%'
    AND tf."nombre_accion" NOT ILIKE '%observ%'
    AND tf."nombre_accion" NOT ILIKE '%subsan%'
  UNION ALL
  SELECT 
    tf."id_estado_destino",
    pf_dest."orden",
    epf_dest."es_final",
    bm.depth + 1,
    bm.path || tf."id_estado_destino",
    (pf_dest."orden" > ti.paso_actual_orden OR (ti.paso_actual_orden = ti.max_paso_orden AND epf_dest."es_final" = true))
  FROM "transicion_flujo" tf
  JOIN busqueda_meta bm ON tf."id_estado_origen" = bm.nodo_id
  JOIN "estado_paso_flujo" epf_dest ON tf."id_estado_destino" = epf_dest."id"
  JOIN "paso_flujo" pf_dest ON epf_dest."id_paso_flujo" = pf_dest."id"
  JOIN tramite_info ti ON true
  WHERE NOT bm.es_meta
    AND tf."nombre_accion" NOT ILIKE '%rechaz%'
    AND tf."nombre_accion" NOT ILIKE '%observ%'
    AND tf."nombre_accion" NOT ILIKE '%subsan%'
    AND NOT (tf."id_estado_destino" = ANY(bm.path))
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
    epf."id"                                    AS tarea_id,
    epf."nombre"                                AS tarea_nombre,
    COALESCE(r."nombre", 'Sin rol asignado')::VARCHAR AS rol_esperado,
    NULL::VARCHAR                               AS usuario_responsable,
    COALESCE(r."nombre", 'Sin rol asignado')::VARCHAR AS rol_responsable_real,
    NULL::timestamp(3)                          AS fecha_completado,
    'PENDIENTE'::text AS estado,
    3 AS seccion,
    to_timestamp(1700000000 + nro.orden_secuencia) AS orden_sort
  FROM nodos_ruta_optima nro
  JOIN "estado_paso_flujo" epf ON nro.tarea_id = epf."id"
  JOIN tramite_info ti ON epf."id_paso_flujo" = ti.paso_actual_id
  LEFT JOIN "rol_estado_paso_flujo" repf ON epf."id" = repf."id_estado_paso_flujo"
  LEFT JOIN "rol" r ON repf."id_rol" = r."id"
)

-- ─── CONSOLIDADO FINAL ───
SELECT tarea_id, tarea_nombre, rol_esperado, usuario_responsable, rol_responsable_real, fecha_completado, estado
FROM (
  SELECT * FROM tareas_pasadas
  UNION ALL
  SELECT * FROM tarea_actual
  UNION ALL
  SELECT * FROM tareas_futuras
) resultado_flujo
ORDER BY seccion ASC, orden_sort ASC;
$$;
