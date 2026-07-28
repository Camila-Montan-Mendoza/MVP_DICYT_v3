# Contracts: API de Trámites y Segregación de Compras

**Feature**: `001-segregacion-tramites-lote`  
**Date**: 2026-07-27

## Endpoints

### 1. `POST /api/requisitions/submit-single`

Envia un único trámite validado al flujo de aprobación.

#### Request Body

```json
{
  "id": "tramite-mat-001",
  "categoria": "MATERIAL",
  "justificacion": "Materiales para laboratorio de química",
  "archivosRespaldo": [{ "nombre": "proforma_cotizacion.pdf", "path": "uploads/proforma_01.pdf" }],
  "items": [
    {
      "id": "item-1",
      "nombre": "Reactivo A",
      "categoria": "MATERIAL",
      "cantidad": 10,
      "unidad": "Frasco",
      "precioUnitario": 150.0,
      "precioReferencial": 1500.0,
      "partidaPresupuestaria": "34110",
      "documentotecnicoPath": "uploads/et_reactivo_a.pdf"
    }
  ]
}
```

#### Response (200 OK)

```json
{
  "success": true,
  "id": "tramite-mat-001",
  "codigoSeguimiento": "TR-2026-0104",
  "estado": "ENVIADO",
  "fechaEnvio": "2026-07-27T10:30:00Z"
}
```

---

### 2. `POST /api/requisitions/submit-batch`

Procesa múltiples trámites en lote de forma resiliente (non-blocking).

#### Request Body

```json
{
  "tramites": [
    {/* Objeto TramiteSolicitud 1 */},
    {/* Objeto TramiteSolicitud 2 */},
    {/* Objeto TramiteSolicitud 3 */}
  ]
}
```

#### Response (200 OK - Resilient Result)

```json
{
  "tramitesExitosos": [
    { "id": "tramite-mat-001", "codigoSeguimiento": "TR-2026-0104", "categoria": "MATERIAL" },
    { "id": "tramite-srv-003", "codigoSeguimiento": "TR-2026-0105", "categoria": "SERVICIO" }
  ],
  "tramitesFallidos": [
    {
      "id": "tramite-af-002",
      "categoria": "ACTIVO_FIJO",
      "errores": [
        "Falta ingresar el Nombre del Custodio",
        "Falta adjuntar archivo de respaldo (proforma/cotización)"
      ]
    }
  ]
}
```

---

### 3. `GET /api/external/budget-lines/lookup?description={query}`

Consulta el servicio externo para sugerir la partida presupuestaria.

#### Response (200 OK - Encontrado)

```json
{
  "found": true,
  "partidaCode": "39100",
  "partidaNombre": "Materiales y Suministros Varios"
}
```

#### Response (200 OK - No encontrado / Fallo de servicio)

```json
{
  "found": false,
  "partidaCode": "Pendiente de asignación",
  "partidaNombre": "Asignación por Responsable de Presupuestos"
}
```
