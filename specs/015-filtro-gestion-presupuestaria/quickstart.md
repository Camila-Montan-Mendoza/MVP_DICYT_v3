# Quickstart: Validación del Filtro de Gestión Presupuestaria

## Escenario de Prueba

1. Acceder al módulo de **Seguimiento de Gastos** (`/seguimiento-gastos`).
2. En la cabecera, verificar que se muestre el selector de **Gestión:** con la opción por defecto `2026`.
3. Cambiar la gestión a `2025` y verificar que:
   - El Presupuesto Vigente Total se recalcule.
   - Las cifras del gráfico Donut y del desglose de partidas se actualicen para el año 2025.
4. Seleccionar `Histórico Global` y verificar que:
   - El monto vigente sea la suma acumulada de las gestiones 2025 y 2026.
5. Conmutar entre la vista de **Programa** y **Proyectos** y verificar que la selección de Gestión se mantenga intacta.
