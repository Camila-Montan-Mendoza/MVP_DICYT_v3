import { useState, useEffect, useMemo, useCallback } from "react";
import { TramiteAdjudicacion, AsignacionProveedorItem } from "@/types/adjudicacion";
import { obtenerCuadroComparativoTramite } from "@/services/adjudicacionService";

export function useAdjudicacionTramite(tramiteId: number) {
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [tramite, setTramite] = useState<TramiteAdjudicacion | null>(null);
  const [selectedItemId, setSelectedItemId] = useState<number | null>(null);
  const [searchFilter, setSearchFilter] = useState<string>("");

  // Mapa de asignaciones de adjudicación: Key = idItemTramite, Value = AsignacionProveedorItem[]
  const [asignacionesMap, setAsignacionesMap] = useState<Map<number, AsignacionProveedorItem[]>>(
    new Map()
  );

  // Cargar datos reales de Supabase
  const cargarDatos = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await obtenerCuadroComparativoTramite(tramiteId);
      if (!data) {
        setError("No se encontró el trámite o no tiene datos de cotización.");
        setLoading(false);
        return;
      }

      setTramite(data);

      // Seleccionar automáticamente el primer ítem si existe
      if (data.item_tramite && data.item_tramite.length > 0) {
        setSelectedItemId(data.item_tramite[0].id);
      }

      // Reconstruir mapa de asignaciones iniciales desde DB (item_proveedor_tramite)
      const initialMap = new Map<number, AsignacionProveedorItem[]>();

      data.item_tramite.forEach((item) => {
        const adjs = data.item_proveedor_tramite.filter((a) => a.id_item_tramite === item.id);
        if (adjs.length > 0) {
          const asignaciones: AsignacionProveedorItem[] = adjs.map((a) => {
            const cot = data.cotizacion.find((c) => c.id_proveedor === a.id_proveedor);
            return {
              idProveedor: a.id_proveedor,
              nombreProveedor: cot?.proveedor?.nombre || `Proveedor ${a.id_proveedor}`,
              cantidadAdjudicada: a.cantidad_proveida,
              precioUnitario: a.precio,
            };
          });
          initialMap.set(item.id, asignaciones);
        } else {
          initialMap.set(item.id, []);
        }
      });

      setAsignacionesMap(initialMap);
    } catch (err: any) {
      console.error("Error al cargar adjudicación:", err);
      setError("Ocurrió un error al cargar la información del trámite.");
    } finally {
      setLoading(false);
    }
  }, [tramiteId]);

  useEffect(() => {
    if (tramiteId) {
      cargarDatos();
    }
  }, [tramiteId, cargarDatos]);

  // Ítem activo seleccionado
  const activeItem = useMemo(() => {
    if (!tramite || !selectedItemId) return null;
    return tramite.item_tramite.find((i) => i.id === selectedItemId) || null;
  }, [tramite, selectedItemId]);

  // Cotizaciones asociadas al ítem activo
  const cotizacionesActiveItem = useMemo(() => {
    if (!tramite || !selectedItemId) return [];
    return tramite.cotizacion
      .map((cot) => {
        const detalle = cot.detalle_cotizacion.find((d) => d.id_tramite_item === selectedItemId);
        return {
          cotizacionId: cot.id,
          proveedor: cot.proveedor,
          tiempoEntregaDias: cot.tiempo_entrega_dias,
          validezOfertaDias: cot.validez_oferta_dias,
          detalle: detalle || null,
        };
      })
      .filter((c) => c.detalle !== null);
  }, [tramite, selectedItemId]);

  // Determinar si una oferta es la de "Ahorro Máximo" (menor precio unitario dentro del techo referencial y con stock)
  const idProveedorAhorroMaximo = useMemo(() => {
    if (!activeItem || cotizacionesActiveItem.length === 0) return null;

    const ofertasValidas = cotizacionesActiveItem.filter((c) => {
      if (!c.detalle) return false;
      const tieneStock = c.detalle.cantidad_existencias > 0;
      const dentroDePrecio = c.detalle.precio <= activeItem.precio;
      return tieneStock && dentroDePrecio;
    });

    if (ofertasValidas.length === 0) return null;

    ofertasValidas.sort((a, b) => (a.detalle?.precio || 0) - (b.detalle?.precio || 0));
    return ofertasValidas[0].proveedor?.id || null;
  }, [activeItem, cotizacionesActiveItem]);

  // Adjudicación simple a un proveedor para un ítem determinado
  const adjudicarProveedorSimple = useCallback(
    (
      idItemTramite: number,
      idProveedor: number,
      nombreProveedor: string,
      precioUnitario: number,
      cantidad: number
    ) => {
      setAsignacionesMap((prevMap) => {
        const newMap = new Map(prevMap);
        newMap.set(idItemTramite, [
          {
            idProveedor,
            nombreProveedor,
            cantidadAdjudicada: cantidad,
            precioUnitario,
          },
        ]);
        return newMap;
      });
    },
    []
  );

  // Adjudicación dividida entre múltiples proveedores
  const adjudicarDividido = useCallback(
    (idItemTramite: number, asignaciones: AsignacionProveedorItem[]) => {
      setAsignacionesMap((prevMap) => {
        const newMap = new Map(prevMap);
        newMap.set(idItemTramite, asignaciones);
        return newMap;
      });
    },
    []
  );

  // Remover adjudicación de un ítem
  const desmarcarAdjudicacionItem = useCallback((idItemTramite: number) => {
    setAsignacionesMap((prevMap) => {
      const newMap = new Map(prevMap);
      newMap.set(idItemTramite, []);
      return newMap;
    });
  }, []);

  // Cálculos consolidados en tiempo real
  const calculos = useMemo(() => {
    if (!tramite) {
      return {
        montoTotalSolicitado: 0,
        montoTotalAdjudicado: 0,
        montoLiberado: 0,
        itemsTotalCount: 0,
        itemsAdjudicadosCount: 0,
        itemsSinStockCount: 0,
      };
    }

    let montoTotalSolicitado = 0;
    let montoTotalAdjudicado = 0;
    let itemsAdjudicadosCount = 0;
    let itemsSinStockCount = 0;

    tramite.item_tramite.forEach((item) => {
      montoTotalSolicitado += item.cantidad_solicitada * item.precio;

      const adjs = asignacionesMap.get(item.id) || [];
      const totalCantAdjudicada = adjs.reduce((acc, a) => acc + a.cantidadAdjudicada, 0);

      if (totalCantAdjudicada > 0) {
        itemsAdjudicadosCount++;
        adjs.forEach((a) => {
          montoTotalAdjudicado += a.cantidadAdjudicada * a.precioUnitario;
        });
      }

      // Verificar si ningún proveedor tiene stock para este ítem
      const cotizacionesItem = tramite.cotizacion.map((c) =>
        c.detalle_cotizacion.find((d) => d.id_tramite_item === item.id)
      );
      const algunStock = cotizacionesItem.some((d) => d && d.cantidad_existencias > 0);
      if (!algunStock && cotizacionesItem.length > 0) {
        itemsSinStockCount++;
      }
    });

    const montoLiberado = Math.max(0, montoTotalSolicitado - montoTotalAdjudicado);

    return {
      montoTotalSolicitado,
      montoTotalAdjudicado,
      montoLiberado,
      itemsTotalCount: tramite.item_tramite.length,
      itemsAdjudicadosCount,
      itemsSinStockCount,
    };
  }, [tramite, asignacionesMap]);

  return {
    loading,
    error,
    tramite,
    selectedItemId,
    setSelectedItemId,
    activeItem,
    cotizacionesActiveItem,
    idProveedorAhorroMaximo,
    searchFilter,
    setSearchFilter,
    asignacionesMap,
    adjudicarProveedorSimple,
    adjudicarDividido,
    desmarcarAdjudicacionItem,
    calculos,
    refetch: cargarDatos,
  };
}
