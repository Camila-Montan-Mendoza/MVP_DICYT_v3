# Quickstart Guide: Dashboard Principal Adaptativo de Seguimiento de Gastos

## Guía de Verificación y Validación Rápida

### Prerrequisitos
1. Servidor de desarrollo Next.js en ejecución (`npm run dev`).
2. Datos seed poblados en la base de datos Supabase ejecutando `docs/00_run_all_seeds.sql`.

---

### Escenario 1: Verificación de Visión Programa (Coordinador - Iván Fuentes)
1. Acceder a la ruta `/seguimiento-gastos` con el usuario autenticado `ivan.fuentes` (`id_usuario: 8`).
2. **Resultado Esperado**:
   - Se despliega la pestaña "Visión Programa" activada por defecto.
   - Muestra el resumen consolidado del **Programa de Fortalecimiento ASDI** (`PROG-ASDI-FORT`) y del **Subprograma Agrometeorológico** (`SUBP-AGRO`).
   - Muestra las 5 tarjetas con los montos calculados (Vigente, Preventivo, Comprometido, Gastado, Disponible).

---

### Escenario 2: Verificación de Visión Proyectos (Investigador - Dr. Daniel Pérez)
1. Acceder a la ruta `/seguimiento-gastos` con el usuario autenticado `daniel.perez` (`id_usuario: 1`).
2. **Resultado Esperado**:
   - Se despliega la lista visual de sus Proyectos asignados:
     - *IA para la Agricultura de Precisión*
     - *Estudio Agroecológico de Variedades de Trigo*
   - Cada tarjeta de proyecto despliega su barra de avance en porcentaje y el desglose de sus partidas concretas (34200, 39500, 43120).

---

### Escenario 3: Verificación del Conmutador de Ámbito Multirrol
1. Con un usuario que tenga asignaciones tanto en `programa_usuario` como en `proyecto_usuario` (ej. `daniel.perez` o `ivan.fuentes`), ingresar a `/seguimiento-gastos`.
2. Hacer clic en la pestaña del conmutador **"Mis Proyectos"**.
3. **Resultado Esperado**:
   - La vista alterna instantáneamente al listado de proyectos sin recargar la página (< 200 ms).
   - Los gráficos de barras y donut se recalculan automáticamente según el ámbito seleccionado.
