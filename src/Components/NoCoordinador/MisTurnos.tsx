import { useState, useEffect } from "react";
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
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <div>
                <h2 className="text-3xl font-bold text-auto-primary">Mi Turno</h2>
                <p className="text-auto-secondary text-sm">Visualiza tu turno asignado</p>
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
              <div className="text-center py-12">
                <p className="text-red-500">{error}</p>
                <button
                  onClick={fetchTurno}
                  className="mt-4 px-6 py-2 bg-sky-500 text-white rounded-lg hover:bg-sky-600 transition-colors"
                >
                  Reintentar
                </button>
              </div>
            ) : !turno ? (
              <div className="text-center py-12">
                <p className="text-auto-secondary">No tienes un turno asignado</p>
              </div>
            ) : (
              <div className="max-w-full">
                <div
                  key={turno.turnoId}
                  className="bg-auto-primary rounded-xl p-8 border border-auto hover:shadow-xl transition-all duration-200"
                >
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                    {/* Sección del título */}
                    <div className="flex items-center gap-4">
                      <div className="bg-gradient-to-br from-sky-500 to-cyan-500 p-4 rounded-xl shadow-lg">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-8 w-8 text-white"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                      </div>
                      <div>
                        <h3 className="text-2xl md:text-3xl font-bold text-auto-primary">{turno.nombre}</h3>
                        <p className="text-auto-secondary text-sm mt-1">Tu turno asignado</p>
                      </div>
                    </div>

                    {/* Sección de horarios */}
                    <div className="flex flex-col sm:flex-row gap-4 md:gap-6">
                      <div className="bg-auto-secondary rounded-lg p-4 flex items-center gap-3 min-w-[200px]">
                        <div className="bg-emerald-500/10 p-2 rounded-lg">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-6 w-6 text-emerald-500"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M13 7l5 5m0 0l-5 5m5-5H6"
                            />
                          </svg>
                        </div>
                        <div>
                          <p className="text-auto-secondary text-xs font-semibold uppercase tracking-wide">Inicio</p>
                          <p className="text-auto-primary font-bold text-lg">
                            {formatTime(turno.horaInicio)}
                          </p>
                        </div>
                      </div>

                      <div className="bg-auto-secondary rounded-lg p-4 flex items-center gap-3 min-w-[200px]">
                        <div className="bg-red-500/10 p-2 rounded-lg">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-6 w-6 text-red-500"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M11 17l-5-5m0 0l5-5m-5 5h12"
                            />
                          </svg>
                        </div>
                        <div>
                          <p className="text-auto-secondary text-xs font-semibold uppercase tracking-wide">Fin</p>
                          <p className="text-auto-primary font-bold text-lg">
                            {formatTime(turno.horaFin)}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Sección del ID */}
                    <div className="bg-auto-secondary rounded-lg p-4 min-w-[120px]">
                      <p className="text-auto-secondary text-xs font-semibold uppercase tracking-wide mb-1">ID del Turno</p>
                      <p className="font-mono text-auto-primary font-bold text-xl">
                        #{turno.turnoId}
                      </p>
                    </div>
                  </div>
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
