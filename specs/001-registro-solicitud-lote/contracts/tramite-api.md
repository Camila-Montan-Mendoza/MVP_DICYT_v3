# API Contracts: Registro y Auto-Distribución de Solicitud de Adquisición por Tipo

**Feature**: `001-registro-solicitud-lote`  
**Date**: 2026-07-23  

---

## 1. Automatic Classification Contract (Client Helper)

### `classifyItemName(nombre: string): 'MATERIAL' | 'ACTIVO' | 'SERVICIO'`

#### Example Usage
```typescript
classifyItemName("Reactivo químico de laboratorio"); // returns "MATERIAL"
classifyItemName("Laptop Lenovo ThinkPad i7");       // returns "ACTIVO"
classifyItemName("Servicio de reparación de red");   // returns "SERVICIO"
```

---

## 2. Budget Line Lookup Service (Client / Server Action Contract)

### `POST /api/tramite/lookup-partida`

#### Request Body
```json
{
  "descripcion": "Microscopio binocular de laboratorio",
  "categoria": "ACTIVO"
}
```

#### Response (200 OK - Match Found)
```json
{
  "matched": true,
  "codigoPartida": "43110",
  "nombrePartida": "Equipo de Oficina y Computación / Laboratorio",
  "estado": "ASIGNADA"
}
```

#### Response (200 OK - No Match Found)
```json
{
  "matched": false,
  "codigoPartida": null,
  "nombrePartida": null,
  "estado": "Pendiente de asignación"
}
```

---

## 3. Submit Grouped Trámites (Server Action / Endpoint)

### `POST /api/tramite/submit-grupo`

#### Request Body
```json
{
  "proyectoId": 12,
  "grupoId": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "tramites": [
    {
      "tipoTramiteId": 1,
      "justificacion": "Estamos comprando estos materiales para experimentos de laboratorio",
      "items": [
        {
          "nombre": "Reactivo A",
          "categoria": "MATERIAL",
          "cantidad": 5,
          "unidadMedida": "Frasco 500ml",
          "precioReferencia": 150.00,
          "especificacionTecnica": {
            "pureza": "99.9%",
            "marcaSugerida": "Merck"
          },
          "codigoPartida": "39700",
          "estadoPartida": "ASIGNADA"
        }
      ],
      "archivosIds": ["uuid-file-1", "uuid-file-2"]
    }
  ]
}
```

#### Response (201 Created)
```json
{
  "success": true,
  "grupoId": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "tramitesGenerados": [
    {
      "tramiteId": 101,
      "codigoCorrelativo": "SOL-2026-0089",
      "tipo": "Compra menor de material",
      "estado": "Enviado a Revisión"
    }
  ]
}
```
