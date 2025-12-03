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
  turnoAsignadoId?: number | null;
  turno?: {
    turnoId: number;
    nombre: string;
    horaInicio: string;
    horaFin: string;
  } | null;
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
      
      console.log('Respuesta completa:', response.data);
      
      // Manejar diferentes formatos de respuesta
      let data = [];
      if (response.data.success && Array.isArray(response.data.data)) {
        data = response.data.data;
      } else if (Array.isArray(response.data)) {
        data = response.data;
      }
      
      console.log('Enfermeros parseados:', data);
      setEnfermeros(data);
    } catch (error) {
      console.error('Error al cargar enfermeros:', error);
      setEnfermeros([]);
    } finally {
      setLoading(false);
    }
  };

  const formatHora = (hora: string) => {
    const date = new Date(hora);
    const hours = date.getUTCHours().toString().padStart(2, '0');
    const minutes = date.getUTCMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  };

  const getTipoTurno = (horaInicio: string) => {
    const date = new Date(horaInicio);
    const hours = date.getUTCHours();
    if (hours >= 6 && hours < 14) return 'Matutino';
    if (hours >= 14 && hours < 22) return 'Vespertino';
    return 'Nocturno';
  };

  const columns = [
    {
      key: "habitacionesAsignadas",
      label: "Habitaciones",
      render: (enf: Enfermero) => {
        const habitaciones = enf.habitacionesAsignadas || enf.habitacionAsignada || "-";
        const display = habitaciones.length > 12 ? habitaciones.slice(0, 12) + "..." : habitaciones;
        return (
          <span
            title={habitaciones}
            className="block max-w-[90px] truncate text-xs text-gray-700 dark:text-white"
            style={{ maxWidth: 90 }}
          >
            {display}
          </span>
        );
      }
    },
    {
      key: "numeroEmpleado",
      label: "Número",
      render: (enf: Enfermero) => (
        <span className="font-mono text-auto-primary dark:text-white">{enf.numeroEmpleado}</span>
      )
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
      key: "turno",
      label: "Turno Asignado",
      render: (enf: Enfermero) => {
        if (!enf.turno) {
          return <span className="text-gray-400 italic text-xs">Sin turno</span>;
        }
        const tipo = getTipoTurno(enf.turno.horaInicio);
        const icono = tipo === 'Matutino' ? '☀️' : tipo === 'Vespertino' ? '🌆' : '🌙';
        const colorClass = tipo === 'Matutino' 
          ? 'bg-yellow-100 text-yellow-800 border-yellow-300' 
          : tipo === 'Vespertino'
          ? 'bg-orange-100 text-orange-800 border-orange-300'
          : 'bg-blue-100 text-blue-800 border-blue-300';
        
        return (
          <div className="flex flex-col gap-1">
            <span className={`px-2 py-0.5 rounded-full text-xs font-semibold border ${colorClass} inline-block w-fit`}>
              {icono} {tipo}
            </span>
            <span className="text-xs text-gray-600 dark:text-gray-400">
              {formatHora(enf.turno.horaInicio)} - {formatHora(enf.turno.horaFin)}
            </span>
          </div>
        );
      },
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
      <div className="mb-2 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
        <h3 className="text-xl font-bold text-auto-primary">
          Lista de Enfermeros
        </h3>
        <button
          onClick={fetchEnfermeros}
          disabled={loading}
          className="flex items-center gap-2 px-5 py-2 bg-sky-500 hover:bg-sky-600 text-white rounded-xl font-medium text-base transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          style={{ height: 44 }}
        >
          <svg
            className={`w-5 h-5 ${loading ? "animate-spin" : ""}`}
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
        searchPlaceholder="Buscar por nombre, número, especialidad o habitación..."
        emptyMessage="No hay enfermeros registrados"
      />
    </div>
  );
}

export default EnfermeroList;
