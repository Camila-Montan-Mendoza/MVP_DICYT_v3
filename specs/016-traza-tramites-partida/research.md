# Phase 0: Research - Traza de Trámites por Partida Concreta

## 1. Patrón de Interfaz Tipo Jira (Split View / Drawer Lateral)

### Decision
Implementar un diseño de dos paneles:
- **Panel Principal (Izquierda / Centro)**: Lista limpia de partidas presupuestarias con sus códigos, descripciones y saldos ejecutados/disponibles.
- **Panel Lateral Desplegable (Derecha)**: Panel tipo Drawer (`w-[450px]` o `w-full lg:w-[500px]`) que se desliza por la derecha cuando el usuario selecciona una partida o un trámite en particular.

### Rationale
- Brinda la experiencia fluida de herramientas como Jira o GitHub Pull Requests.
- Permite comparar rápidamente la partida seleccionada con el historial de trámites sin perder la ubicación en la tabla principal.

---

## 2. Consulta Real a Supabase (Sin Datos Mockeados)

### Decision
Realizar una consulta relacional vía `createClient()` de Supabase a las tablas:
```sql
SELECT 
  pc.id,
  pc.presupuesto,
  p.codigo AS codigo_partida,
  p.nombre AS nombre_partida,
  it.id AS item_tramite_id,
  it.monto_total,
  it.estado_item,
  t.id AS tramite_id,
  t.codigo AS codigo_tramite,
  t.justificacion,
  t.fecha_creacion
FROM partida_concreta pc
JOIN partida p ON pc.id_partida = p.id
LEFT JOIN item_tramite it ON it.id_partida_concreta = pc.id
LEFT JOIN tramite t ON it.id_tramite = t.id;
```

### Rationale
- Garantiza que la información reflejada corresponda al 100% con los datos de producción en Supabase.
- Cumple estrictamente con la directiva del usuario de no utilizar datos simulados o mockeados.
