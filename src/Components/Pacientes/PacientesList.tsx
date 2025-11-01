import { useEffect, useState } from "react";
import axios from "axios";
import DataTable from "../utilities/DataTable";

export type Paciente = {
  pacienteId: number;
  numeroExpediente: string;
  nombre: string;
  apellidop: string;
  apellidom: string;
  edad?: number | null;
  numeroCama?: string | null;
  numeroHabitacion?: string | null;
  fechaIngreso?: string | null;
  motivoConsulta?: string | null;
  servicioId?: number | null;
};

interface PacientesListProps {
  refreshTrigger?: number;
  onPacienteSelect?: (paciente: Paciente) => void;
}

function PacientesList({ refreshTrigger = 0, onPacienteSelect }: PacientesListProps) {
  const [pacientes, setPacientes] = useState<Paciente[]>([]);
  const [loading, setLoading] = useState(true);

  // Cargar lista de pacientes
  const fetchPacientes = async () => {
    try {
      setLoading(true);
      const response = await axios.get("http://localhost:5000/api/pacientes/");
      const data = Array.isArray(response.data?.data) ? (response.data.data as Paciente[]) : [];
      setPacientes(data);
    } catch (error) {
      console.error("Error al cargar pacientes:", error);
    } finally {
      setLoading(false);
    }
  };

  // Recargar al cambiar refreshTrigger
  useEffect(() => {
    fetchPacientes();
  }, [refreshTrigger]);

  // Formatear fecha de ingreso
  const formatFechaIngreso = (value?: string | null) => {
    if (!value) return "-";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "-";
    return new Intl.DateTimeFormat("es-MX", { dateStyle: "short", timeStyle: "short" }).format(date);
  };

  // Definición de columnas de la tabla
  const columns = [
    {
      key: "numeroExpediente",
      label: "Expediente",
    },
    {
      key: "nombreCompleto",
      label: "Nombre completo",
      render: (paciente: Paciente) => `${paciente.nombre} ${paciente.apellidop} ${paciente.apellidom}`.trim(),
    },
    {
      key: "edad",
      label: "Edad",
      render: (paciente: Paciente) => (paciente.edad ?? "-").toString(),
    },
    {
      key: "fechaIngreso",
      label: "Fecha de ingreso",
      render: (paciente: Paciente) => formatFechaIngreso(paciente.fechaIngreso),
    },
    {
      key: "numeroHabitacion",
      label: "Habitación",
      render: (paciente: Paciente) => paciente.numeroHabitacion || "-",
    },
    {
      key: "numeroCama",
      label: "Cama",
      render: (paciente: Paciente) => paciente.numeroCama || "-",
    },
    {
      key: "motivoConsulta",
      label: "Motivo consulta",
      render: (paciente: Paciente) => paciente.motivoConsulta || "-",
    },
    {
      key: "actions",
      label: "Acciones",
      render: (paciente: Paciente) => (
        <button
          onClick={() => onPacienteSelect?.(paciente)}
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
        <h3 className="text-2xl font-bold text-auto-primary">Lista de Pacientes</h3>
        <button
          onClick={fetchPacientes}
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
        data={pacientes}
        columns={columns}
        loading={loading}
        searchPlaceholder="Buscar por nombre, expediente o habitación..."
        emptyMessage="No hay pacientes registrados"
      />
    </div>
  );
}

export default PacientesList;