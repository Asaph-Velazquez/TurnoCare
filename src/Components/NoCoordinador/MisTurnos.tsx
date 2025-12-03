import { useEffect, useState } from "react";
import axios from "axios";

type Turno = {
  turnoId: number;
  nombre: string;
  horaInicio: string;
  horaFin: string;
};

function MisTurnos() {
  const [turno, setTurno] = useState<Turno | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchTurno();
  }, []);

  const fetchTurno = async () => {
    setLoading(true);
    setError(null);
    try {
      // Obtener el enfermeroId del localStorage
      const userRaw = localStorage.getItem("user");
      if (!userRaw) {
        setError("No se encontró información del usuario");
        setLoading(false);
        return;
      }

      const user = JSON.parse(userRaw);
      const enfermeroId = user.userid;

      if (!enfermeroId) {
        setError("No se encontró el ID del enfermero");
        setLoading(false);
        return;
      }

      // Obtener el turno asignado al enfermero
      const response = await axios.get(
        `http://localhost:5000/api/turnos/enfermero/${enfermeroId}`
      );
      const data = response.data.success ? response.data.data : response.data;
      setTurno(data);
    } catch (err: any) {
      console.error("Error cargando turno:", err);
      if (err.response?.status === 404) {
        setError("No tienes un turno asignado");
      } else {
        setError("Error al cargar el turno");
      }
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (timeString: string) => {
    try {
      const date = new Date(timeString);
      // Obtener las horas y minutos en UTC para evitar problemas de zona horaria
      const hours = date.getUTCHours();
      const minutes = date.getUTCMinutes();
      
      // Formatear a AM/PM
      const period = hours >= 12 ? 'p.m.' : 'a.m.';
      const displayHours = hours % 12 || 12;
      const displayMinutes = minutes.toString().padStart(2, '0');
      
      return `${displayHours.toString().padStart(2, '0')}:${displayMinutes} ${period}`;
    } catch {
      return timeString;
    }
  };

  return (
    <div className="min-h-screen bg-auto-primary pt-20 pb-10">
      {/* Fondo decorativo */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-sky-400/10 via-transparent to-cyan-400/10"></div>
        <div className="absolute top-1/4 right-0 w-96 h-96 bg-sky-300/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 left-0 w-96 h-96 bg-cyan-300/20 rounded-full blur-3xl"></div>
      </div>

      <div className="relative min-h-screen">
        <main className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10 py-10">
          {/* Header */}
          <div className="bg-auto-secondary rounded-2xl shadow-xl p-6 md:p-8 border border-auto mb-6 backdrop-blur-sm">
            <div className="flex items-center gap-3 mb-2">
              <div className="bg-gradient-to-br from-sky-500 to-cyan-500 p-3 rounded-xl shadow-lg">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h2 className="text-3xl font-bold text-auto-primary">Mi Turno Asignado</h2>
                <p className="text-auto-secondary text-sm">Consulta tu horario y turno actual</p>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="bg-auto-secondary rounded-2xl shadow-xl p-6 md:p-8 border border-auto backdrop-blur-sm">
            {loading ? (
              <div className="flex items-center justify-center py-16">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-sky-500 mx-auto mb-4"></div>
                  <p className="text-auto-secondary font-medium">Cargando turno...</p>
                </div>
              </div>
            ) : error ? (
              <div className="bg-red-100 border-2 border-red-300 text-red-800 rounded-xl p-4">
                {error}
              </div>
            ) : !turno ? (
              <div className="text-center py-12">
                <svg className="w-16 h-16 text-auto-tertiary mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h3 className="text-xl font-semibold text-auto-primary mb-2">No tienes un turno asignado</h3>
                <p className="text-auto-secondary">Consulta con tu coordinador para asignarte un turno</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-1 bg-auto-primary rounded-xl p-4 border border-auto">
                  <p className="text-xs text-auto-tertiary mb-1">Turno</p>
                  <p className="text-lg font-bold text-auto-primary">{turno.nombre}</p>
                </div>
                <div className="bg-auto-primary rounded-xl p-4 border border-auto">
                  <p className="text-xs text-auto-tertiary mb-1">Hora de inicio</p>
                  <p className="text-lg font-bold text-auto-primary">{formatTime(turno.horaInicio)}</p>
                </div>
                <div className="bg-auto-primary rounded-xl p-4 border border-auto">
                  <p className="text-xs text-auto-tertiary mb-1">Hora de fin</p>
                  <p className="text-lg font-bold text-auto-primary">{formatTime(turno.horaFin)}</p>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

export default MisTurnos;
