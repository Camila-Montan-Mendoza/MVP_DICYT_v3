# Quickstart: Validación de la Traza de Trámites Estilo Jira

## Escenario de Prueba

1. Acceder al módulo de **Traza de Trámites por Partida** desde la barra lateral navegable de `<SigefiShell>`.
2. Verificar la carga de las partidas reales registradas en la base de datos Supabase.
3. Hacer clic en cualquier fila de la lista de partidas.
4. Comprobar que:
   - Se abra el **Panel Lateral Desplegable por la Derecha** (estilo Jira).
   - Se muestre la lista cronológica de trámites asociados con sus estados (Preventivo, Comprometido, Pagado, Revertido).
   - Si un trámite tiene estado "Revertido", exhiba la insignia distintiva de reintegro de saldo.
5. Cerrar el panel lateral mediante la cruz `(X)` o seleccionando otra partida.
