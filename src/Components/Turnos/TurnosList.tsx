import { useState, useEffect } from "react";
import axios from "axios";
import DataTable from "../utilities/DataTable";

export interface Enfermero {
  enfermeroId: number;
  nombre: string;
  apellidoPaterno?: string;
  apellidoMaterno?: string;
  apellidos?: string;
  numeroEmpleado: string;
  telefono?: string;
  email?: string;
  especialidad?: string;
}

export interface Turno {
  turnoId: number;
  nombre: string;
  horaInicio: string;
  horaFin: string;
  enfermeros?: Enfermero[];
}

function TurnosList() {
  const [turnos, setTurnos] = useState<Turno[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTurnos = async () => {
    try {
      setLoading(true);
      const response = await axios.get("http://localhost:5000/api/turnos");
      
      const data = response.data?.data || response.data || [];
      setTurnos(Array.isArray(data) ? data : []);
    } catch (error) {
      setTurnos([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTurnos();
  }, []);

  const formatHora = (horaISO: string): string => {
    try {
      const fecha = new Date(horaISO);
      const hours = fecha.getUTCHours().toString().padStart(2, '0');
      const minutes = fecha.getUTCMinutes().toString().padStart(2, '0');
      return `${hours}:${minutes}`;
    } catch {
      return horaISO;
    }
  };

  const getTipoTurno = (nombre: string): { tipo: string; icono: string; color: string } => {
    const nombreLower = nombre.toLowerCase();
    if (nombreLower.includes('matutino')) {
      return { 
        tipo: 'Matutino', 
        icono: '☀️',
        color: 'bg-yellow-100 text-yellow-800 border-yellow-300'
      };
    } else if (nombreLower.includes('vespertino')) {
      return { 
        tipo: 'Vespertino', 
        icono: '🌆',
        color: 'bg-orange-100 text-orange-800 border-orange-300'
      };
    } else if (nombreLower.includes('nocturno')) {
      return { 
        tipo: 'Nocturno', 
        icono: '🌙',
        color: 'bg-indigo-100 text-indigo-800 border-indigo-300'
      };
    }
    return { 
      tipo: nombre, 
      icono: '⏰',
      color: 'bg-gray-100 text-gray-800 border-gray-300'
    };
  };

  const columns = [
    {
      key: "nombre",
      label: "Tipo de Turno",
      render: (turno: Turno) => {
        const { tipo, icono, color } = getTipoTurno(turno.nombre);
        return (
          <span className={`px-3 py-1 rounded-full text-sm font-medium border ${color}`}>
            {icono} {tipo}
          </span>
        );
      },
    },
    {
      key: "horario",
      label: "Horario",
      render: (turno: Turno) => (
        <div className="text-sm font-medium">
          <span className="text-sky-600">🕐 {formatHora(turno.horaInicio)}</span>
          {' → '}
          <span className="text-cyan-600">{formatHora(turno.horaFin)}</span>
        </div>
      ),
    },
    {
      key: "enfermeros",
      label: "Enfermeros Asignados",
      render: (turno: Turno) => {
        if (!turno.enfermeros || turno.enfermeros.length === 0) {
          return <span className="text-auto-secondary italic text-sm">Sin asignar</span>;
        }
        if (turno.enfermeros.length === 1) {
          const enf = turno.enfermeros[0];
          return (
            <div className="text-sm">
              <div className="font-medium text-auto-primary">
                {enf.nombre} {enf.apellidos || `${enf.apellidoPaterno || ''} ${enf.apellidoMaterno || ''}`}
              </div>
              <div className="text-auto-secondary text-xs">
                # {enf.numeroEmpleado}
              </div>
            </div>
          );
        }
        return (
          <div className="text-sm text-auto-primary">
            <span className="font-semibold">{turno.enfermeros.length}</span> enfermeros asignados
          </div>
        );
      },
    },
  ];

  return (
    <div className="bg-auto-secondary backdrop-blur-sm border border-auto rounded-3xl shadow-2xl p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <div className="w-12 h-12 bg-gradient-to-r from-sky-500 to-cyan-500 rounded-full flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6 text-white"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0ZM3.75 12h.007v.008H3.75V12Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm-.375 5.25h.007v.008H3.75v-.008Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
              />
            </svg>
          </div>
          <div className="ml-4">
            <h3 className="text-xl font-semibold text-auto-primary">Turnos Laborales Programados</h3>
            <p className="text-auto-secondary text-sm">
              Total de turnos de trabajo: {turnos.length}
            </p>
          </div>
        </div>
        <button
          onClick={fetchTurnos}
          disabled={loading}
          className="px-4 py-2 bg-gradient-to-r from-sky-500 to-cyan-500 text-white rounded-xl hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className={`w-5 h-5 ${loading ? "animate-spin" : ""}`}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99"
            />
          </svg>
          Refrescar
        </button>
      </div>

      <DataTable
        data={turnos}
        columns={columns}
        loading={loading}
        emptyMessage="No hay turnos laborales programados"
      />
    </div>
  );
}

export default TurnosList;
