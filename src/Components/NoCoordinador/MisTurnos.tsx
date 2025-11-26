import { useState, useEffect } from "react";
import axios from "axios";

type Turno = {
  turnoId: number;
  nombre: string;
  horaInicio: string;
  horaFin: string;
};

function MisTurnos() {
  const [turnos, setTurnos] = useState<Turno[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchTurnos();
  }, []);

  const fetchTurnos = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get("http://localhost:5000/api/turnos");
      const data = response.data.success ? response.data.data : response.data;
      setTurnos(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error cargando turnos:", err);
      setError("Error al cargar los turnos");
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (timeString: string) => {
    try {
      const date = new Date(timeString);
      return date.toLocaleTimeString("es-MX", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      });
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
                <h2 className="text-3xl font-bold text-auto-primary">Mis Turnos</h2>
                <p className="text-auto-secondary text-sm">Visualiza los turnos disponibles</p>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="bg-auto-secondary rounded-2xl shadow-xl p-6 md:p-8 border border-auto backdrop-blur-sm">
            {loading ? (
              <div className="flex items-center justify-center py-16">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-sky-500 mx-auto mb-4"></div>
                  <p className="text-auto-secondary font-medium">Cargando turnos...</p>
                </div>
              </div>
            ) : error ? (
              <div className="text-center py-12">
                <p className="text-red-500">{error}</p>
                <button
                  onClick={fetchTurnos}
                  className="mt-4 px-6 py-2 bg-sky-500 text-white rounded-lg hover:bg-sky-600 transition-colors"
                >
                  Reintentar
                </button>
              </div>
            ) : turnos.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-auto-secondary">No hay turnos disponibles</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {turnos.map((turno) => (
                  <div
                    key={turno.turnoId}
                    className="bg-auto-primary rounded-xl p-6 border border-auto hover:shadow-xl transition-all duration-200 hover:-translate-y-1"
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <div className="bg-gradient-to-br from-sky-500 to-cyan-500 p-3 rounded-lg">
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
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-auto-primary">{turno.nombre}</h3>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-auto-secondary">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 text-emerald-500"
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
                        <span className="font-semibold">Inicio:</span>
                        <span className="text-auto-primary font-medium">
                          {formatTime(turno.horaInicio)}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 text-auto-secondary">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 text-red-500"
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
                        <span className="font-semibold">Fin:</span>
                        <span className="text-auto-primary font-medium">
                          {formatTime(turno.horaFin)}
                        </span>
                      </div>
                    </div>

                    <div className="mt-4 pt-4 border-t border-auto">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-auto-secondary">Turno ID:</span>
                        <span className="font-mono text-auto-primary font-semibold">
                          #{turno.turnoId}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

export default MisTurnos;
