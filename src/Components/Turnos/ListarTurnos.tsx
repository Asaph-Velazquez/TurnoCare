import { useEffect, useState } from "react";
import axios from "axios";
import DataTable from "../utilities/DataTable";

interface Enfermero {
  enfermeroId: number;
  nombre: string;
  apellidoPaterno: string;
  apellidoMaterno: string;
  numeroEmpleado: string;
}

interface Turno {
  turnoId: number;
  nombre: string;
  horaInicio: string;
  horaFin: string;
  enfermeros?: Enfermero[];
}

function ListarTurnos() {
  const [turnos, setTurnos] = useState<Turno[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTurnos();
  }, []);

  const fetchTurnos = async () => {
    try {
      setLoading(true);
      console.log("Fetching turnos from API...");
      const res = await axios.get("http://localhost:5000/api/turnos");
      console.log("Respuesta completa:", res);
      console.log("Respuesta de turnos:", res.data);
      console.log("Tipo de res.data:", typeof res.data);
      console.log("¿Es array res.data?:", Array.isArray(res.data));
      console.log("¿Tiene propiedad data?:", res.data?.data);
      
      let data: Turno[] = [];
      
      if (Array.isArray(res.data)) {
        data = res.data;
        console.log("Usando res.data directamente");
      } else if (res.data?.success && Array.isArray(res.data.data)) {
        data = res.data.data;
        console.log("Usando res.data.data");
      } else {
        console.log("Formato de respuesta no reconocido");
      }
      
      console.log("Turnos procesados:", data);
      console.log("Cantidad de turnos:", data.length);
      setTurnos(data);
    } catch (err: any) {
      console.error("Error al obtener turnos:", err);
      console.error("Error completo:", {
        message: err.message,
        response: err.response,
        status: err.response?.status,
        data: err.response?.data
      });
      setTurnos([]);
    } finally {
      setLoading(false);
    }
  };

  // Función para formatear hora en formato 24 horas (13:00, 14:30, etc.)
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

  // Función para obtener el tipo de turno basado en el nombre
  const getTipoTurno = (nombre: string): { tipo: string; icono: string; color: string } => {
    const nombreLower = nombre.toLowerCase();
    if (nombreLower.includes('matutino')) {
      return { 
        tipo: 'Matutino', 
        icono: '☀️',
        color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-200'
      };
    } else if (nombreLower.includes('vespertino')) {
      return { 
        tipo: 'Vespertino', 
        icono: '🌆',
        color: 'bg-orange-100 text-orange-800 dark:bg-orange-900/40 dark:text-orange-200'
      };
    } else if (nombreLower.includes('nocturno')) {
      return { 
        tipo: 'Nocturno', 
        icono: '🌙',
        color: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/40 dark:text-indigo-200'
      };
    }
    return { 
      tipo: nombre, 
      icono: '⏰',
      color: 'bg-gray-100 text-gray-800 dark:bg-gray-900/40 dark:text-gray-200'
    };
  };

  const columns = [
    { 
      key: "nombre", 
      label: "Turno",
      render: (t: Turno) => {
        const { tipo, icono, color } = getTipoTurno(t.nombre);
        return (
          <span className={`inline-block px-3 py-1 rounded-lg text-xs font-semibold ${color}`}>
            {icono} {tipo}
          </span>
        );
      }
    },
    {
      key: "horario",
      label: "Horario",
      render: (t: Turno) => (
        <div className="font-medium text-auto-primary">
          <span className="text-sky-600 dark:text-sky-400">🕐 {formatHora(t.horaInicio)}</span>
          {' → '}
          <span className="text-cyan-600 dark:text-cyan-400">{formatHora(t.horaFin)}</span>
        </div>
      ),
    },
    {
      key: "enfermeros",
      label: "Enfermeros Asignados",
      render: (t: Turno) => {
        if (!t.enfermeros || t.enfermeros.length === 0) {
          return <span className="text-auto-tertiary italic">Sin asignar</span>;
        }
        if (t.enfermeros.length === 1) {
          const enf = t.enfermeros[0];
          return (
            <div>
              <div className="font-medium text-auto-primary">
                {enf.nombre} {enf.apellidoPaterno} {enf.apellidoMaterno}
              </div>
              <div className="text-xs text-auto-secondary">
                #{enf.numeroEmpleado}
              </div>
            </div>
          );
        }
        return (
          <div className="text-auto-primary">
            <span className="font-semibold">{t.enfermeros.length}</span> enfermeros asignados
          </div>
        );
      },
    },
  ];

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-2xl font-bold text-auto-primary">Lista de Turnos</h3>
        <button 
          onClick={fetchTurnos} 
          disabled={loading} 
          className="flex items-center gap-2 px-4 py-2 bg-sky-500 hover:bg-sky-600 text-white rounded-xl font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
        >
          <svg className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Actualizar
        </button>
      </div>

      <DataTable 
        data={turnos} 
        columns={columns} 
        loading={loading} 
        searchPlaceholder="Buscar por nombre de turno..." 
        emptyMessage="No hay turnos registrados. ¡Crea el primer turno!" 
      />
    </div>
  );
}

export default ListarTurnos;
