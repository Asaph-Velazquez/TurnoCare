import { useState, useEffect } from "react";
import axios from "axios";
import DataTable from "../utilities/DataTable";

interface Insumo {
  insumoId: number;
  nombre: string;
  descripcion: string | null;
  categoria: string | null;
  cantidadDisponible: number;
  unidadMedida: string | null;
  ubicacion: string | null;
  responsableId: number | null;
  actualizadoEn: string | null;
}

interface InsumoListProps {
  refreshTrigger?: number;
  onInsumoSelect?: (insumo: Insumo) => void;
}

function InsumoList({ refreshTrigger = 0, onInsumoSelect }: InsumoListProps) {
  const [insumos, setInsumos] = useState<Insumo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchInsumos();
  }, [refreshTrigger]);

  const fetchInsumos = async () => {
    try {
      setLoading(true);
      const response = await axios.get("http://localhost:5000/api/insumos/");if (response.data.success && response.data.data) {
        setInsumos(response.data.data);
      }
    } catch (error) {} finally {
      setLoading(false);
    }
  };

  const columns = [
    { key: "nombre", label: "Nombre" },
    {
      key: "categoria",
      label: "Categoría",
      render: (ins: Insumo) => ins.categoria || "Sin categoría",
    },
    {
      key: "cantidadDisponible",
      label: "Cantidad",
      render: (ins: Insumo) =>
        `${ins.cantidadDisponible ?? 0} ${ins.unidadMedida || ""}`.trim(),
    },
    {
      key: "ubicacion",
      label: "Ubicación",
      render: (ins: Insumo) => ins.ubicacion || "Sin ubicación",
    },
    {
      key: "actualizadoEn",
      label: "Actualizado",
      render: (ins: Insumo) =>
        ins.actualizadoEn
          ? new Date(ins.actualizadoEn).toLocaleString()
          : "Sin registro",
    },
    {
      key: "actions",
      label: "Acciones",
      render: (ins: Insumo) => (
        <button
          onClick={() => onInsumoSelect?.(ins)}
          className="text-sky-600 hover:text-sky-800 font-medium text-sm transition-colors duration-200"
        >
          Ver detalles →
        </button>
      ),
    },
  ];

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-2xl font-bold text-auto-primary">
          Lista de Insumos
        </h3>
        <button
          onClick={fetchInsumos}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 bg-sky-500 hover:bg-sky-600 text-white rounded-xl font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <svg
            className={`w-4 h-4 ${loading ? "animate-spin" : ""}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
            />
          </svg>
          Actualizar
        </button>
      </div>

      <DataTable
        data={insumos}
        columns={columns}
        loading={loading}
        searchPlaceholder="Buscar por nombre, categoría o ubicación..."
        emptyMessage="No hay insumos registrados"
      />
    </div>
  );
}

export default InsumoList;

