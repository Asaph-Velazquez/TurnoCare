import { useState, useEffect } from "react";
import axios from "axios";
import DataTable from "../utilities/DataTable";

interface Medicamento {
  medicamentoId: number;
  nombre: string;
  descripcion: string | null;
  cantidadStock: number;
  lote: string | null;
  fechaCaducidad: string | null;
  ubicacion: string | null;
  actualizadoEn: string;
}

interface MedicamentoListProps {
  refreshTrigger?: number;
  onMedicamentoSelect?: (med: Medicamento) => void;
}

function MedicamentoList({
  refreshTrigger = 0,
  onMedicamentoSelect,
}: MedicamentoListProps) {
  const [medicamentos, setMedicamentos] = useState<Medicamento[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMedicamentos();
  }, [refreshTrigger]);

  const fetchMedicamentos = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        "http://localhost:5000/api/medicamentos/"
      );
      if (response.data.success && response.data.data) {
        setMedicamentos(response.data.data);
      }
    } catch (error) {
      console.error("Error al cargar medicamentos:", error);
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    { key: "nombre", label: "Nombre" },
    {
      key: "descripcion",
      label: "Descripción",
      render: (m: Medicamento) => m.descripcion || "-",
    },
    {
      key: "cantidadStock",
      label: "Stock",
      render: (m: Medicamento) => `${m.cantidadStock} unidades`,
    },
    {
      key: "lote",
      label: "Lote",
      render: (m: Medicamento) => m.lote || "-",
    },
    {
      key: "fechaCaducidad",
      label: "Fecha de Caducidad",
      render: (m: Medicamento) =>
        m.fechaCaducidad
          ? new Date(m.fechaCaducidad).toLocaleDateString()
          : "-",
    },
    {
      key: "ubicacion",
      label: "Ubicación",
      render: (m: Medicamento) => m.ubicacion || "-",
    },
    {
      key: "actions",
      label: "Acciones",
      render: (m: Medicamento) => (
        <button
          onClick={() => onMedicamentoSelect?.(m)}
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
          Lista de Medicamentos
        </h3>
        <button
          onClick={fetchMedicamentos}
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
        data={medicamentos}
        columns={columns}
        loading={loading}
        searchPlaceholder="Buscar por nombre o vía..."
        emptyMessage="No hay medicamentos registrados"
      />
    </div>
  );
}

export default MedicamentoList;
