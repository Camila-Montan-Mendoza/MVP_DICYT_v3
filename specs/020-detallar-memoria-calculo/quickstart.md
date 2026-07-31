# Quickstart & Manual Testing Guide: Detallar Memoria de Cálculo

## 1. Prerequisites
- Dev server running on `http://localhost:3000` (or `npm run dev`)
- Browser navigation to `/proyectos/1`

## 2. Test Scenarios

### Scenario A: View Project Detail & Memoria de Cálculo (Image 2 View Mode)
1. Open `http://localhost:3000/proyectos/1`
2. Verify Header with "Detalles del Proyecto" and top right button "Trámites del Proyecto"
3. Verify Info Card with Dr. Ricardo Villarroel, Presupuesto Total: 100.000,00 Bs., Program, Fuente, Dates.
4. Verify Table with columns (ID, Nombre de Partida, Monto Bs.) and Total Consolidado row.

### Scenario B: Edit Memoria de Cálculo (Image 1 Interactive Mode)
1. If status is "Memoria de cálculo pendiente", click "Detallar memoria de cálculo" or toggle edit mode.
2. Search bar with filter icon: Type "Equipamiento" or "101" to filter partidas.
3. Edit partida amounts:
   - Partida 101: 35.000,00 Bs.
   - Partida 205: 10.000,00 Bs.
   - Partida 301: 25.000,00 Bs.
   - Partida 405: 15.000,00 Bs.
   - Partida 512: 15.000,00 Bs.
4. Verify Total Partidas recalculates in real-time to 100.000,00 Bs.
5. If total exceeds 100.000,00 Bs., verify banner displays warning excess and disables "Enviar a revisión".
6. Click "Enviar a revisión":
   - Badge changes to "En revisión de memoria de cálculo".
   - Page switches to Read-Only mode.
