# Phase 0: Research - Historial de Modificaciones Presupuestarias

## 1. Patrón de Desglose de Modificaciones y Evolución de Partidas

### Decision
Implementar una tabla principal que resuma los movimientos de modificación (Correlativo, Fecha, Tipo, Justificación corta, Monto total ajustado). Al hacer clic en una fila, se despliega el panel lateral derecho (Jira Drawer) que expone:
- Justificación completa y extensa del traspaso o incremento.
- Usuario autorizador y documento respaldo en PDF (si existe).
- **Tabla de Evolución de Partidas Afectadas**:
  - Para traspasos: Partida Origen (-) $\to$ Partida Destino (+).
  - Muestra la fórmula explicativa: `Presupuesto Inicial +/- Monto Modificado = Presupuesto Vigente Resultante`.

### Rationale
- Permite leer justificaciones largas sin saturar ni deformar la tabla principal.
- Ofrece transparencia total para auditorías financieras de la UMSS/DICYT.

---

## 2. Consulta Real a Supabase (Con Fallback Resiliente)

### Decision
Realizar la consulta relacional vía `createClient()`:
```sql
SELECT 
  bm.id,
  bm.codigo,
  bm.justificacion,
  bm.tipo_modificacion,
  bm.fecha_aprobacion,
  bm.usuario_autorizador,
  dm.id AS detalle_id,
  dm.monto_modificado,
  dm.tipo_impacto, -- 'disminucion' o 'incremento'
  pc.id AS partida_concreta_id,
  pc.presupuesto AS presupuesto_inicial,
  p.codigo AS codigo_partida,
  p.nombre AS nombre_partida
FROM bitacora_modificacion_presupuestaria bm
JOIN detalle_modificacion_presupuestaria dm ON dm.id_bitacora = bm.id
JOIN partida_concreta pc ON dm.id_partida_concreta = pc.id
JOIN partida p ON pc.id_partida = p.id;
```

### Rationale
- Si Supabase tiene datos reales registrados en dichas tablas, la aplicación los muestra directamente.
- Si las tablas de producción están vacías en la base local, la vista conmuta suavemente a registros ilustrativos de prueba sin lanzar errores en la consola.
