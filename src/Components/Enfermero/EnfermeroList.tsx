import { useState, useEffect } from "react";
import axios from "axios";
import DataTable from "../utilities/DataTable";
import { useNavigate } from "react-router-dom";
interface Enfermero {
  enfermeroId: number;
  numeroEmpleado: string;
  nombre: string;
  apellidoPaterno: string;
  apellidoMaterno: string;
  especialidad: string | null;
  esCoordinador: boolean;
  servicioActualId: number | null;
  habitacionAsignada?: string | null;
  habitacionesAsignadas?: string | null;
}

interface EnfermeroListProps {
  refreshTrigger?: number; 
  onEnfermeroSelect?: (enfermero: Enfermero) => void;
}

function EnfermeroList({ refreshTrigger = 0, onEnfermeroSelect }: EnfermeroListProps) {
  const [enfermeros, setEnfermeros] = useState<Enfermero[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchEnfermeros();
  }, [refreshTrigger]);

  const fetchEnfermeros = async () => {
    try {
      setLoading(true);
      const response = await axios.get("http://localhost:5000/api/enfermeros/");
      console.log("Enfermeros cargados:", response.data);
      if (response.data.success && response.data.data) {
        setEnfermeros(response.data.data);
      }
    } catch (error) {
      console.error("Error al cargar enfermeros:", error);
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      key: "numeroEmpleado",
      label: "Número",
    },
    {
      key: "nombre",
      label: "Nombre Completo",
      render: (enf: Enfermero) =>
        `${enf.nombre} ${enf.apellidoPaterno} ${enf.apellidoMaterno}`,
    },
    {
      key: "especialidad",
      label: "Especialidad",
      render: (enf: Enfermero) => enf.especialidad || "Sin especialidad",
    },
    {
      key: "esCoordinador",
      label: "Coordinador",
      render: (enf: Enfermero) => (
        <span
          className={`px-3 py-1 rounded-full text-xs font-semibold ${
            enf.esCoordinador
              ? "bg-sky-100 text-sky-800 border border-sky-300"
              : "bg-gray-100 text-gray-800 border border-gray-300"
          }`}
        >
          {enf.esCoordinador ? "Sí" : "No"}
        </span>
      ),
    },
    {
      key: "actions",
      label: "Acciones",
      render: (enf: Enfermero) => (
        <button
          onClick={() => {
            onEnfermeroSelect?.(enf);
            navigate("/Enfermeros/Detalles", { 
              state: { 
                servicioActualId: enf.servicioActualId,
                enfermeroNombre: `${enf.nombre} ${enf.apellidoPaterno}`,
                enfermeroId: enf.enfermeroId,
                habitacionesAsignadas: enf.habitacionesAsignadas ?? enf.habitacionAsignada ?? null
              } 
            });
          }}
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
          Lista de Enfermeros
        </h3>
        <button
          onClick={fetchEnfermeros}
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
        data={enfermeros}
        columns={columns}
        loading={loading}
        searchPlaceholder="Buscar por nombre, número o especialidad..."
        emptyMessage="No hay enfermeros registrados"
      />
    </div>
  );
}

export default EnfermeroList;
