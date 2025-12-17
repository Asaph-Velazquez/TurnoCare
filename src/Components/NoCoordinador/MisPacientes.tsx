import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

interface Paciente {
  pacienteId: number;
  nombre: string;
  apellidop: string;
  apellidom: string;
  numeroExpediente: string;
  edad: number | null;
  numeroCama: string | null;
  numeroHabitacion: string | null;
  fechaIngreso: string;
  motivoConsulta: string | null;
  servicioId: number | null;
}

interface EnfermeroData {
  servicioActualId: number | null;
  habitacionAsignada: string | null;
  habitacionesAsignadas: string | null;
}

function MisPacientes() {
  const [pacientes, setPacientes] = useState<Paciente[]>([]);
  const [pacientesFiltrados, setPacientesFiltrados] = useState<Paciente[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [enfermeroData, setEnfermeroData] = useState<EnfermeroData | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEnfermeroData = async () => {
      const userRaw = localStorage.getItem("user");
      if (!userRaw) {
        setError("No se encontró información del usuario. Por favor, inicia sesión nuevamente.");
        return;
      }

      try {
        const user = JSON.parse(userRaw);
        const userId = user.userid;

        // Si no tiene habitacionesAsignadas en localStorage, obtener datos actualizados del servidor
        if (!user.habitacionesAsignadas && userId) {
          console.log("Obteniendo datos actualizados del servidor...");
          try {
            const response = await axios.get(`http://localhost:5000/api/enfermeros`);
            const enfermeros = response.data.data || response.data || [];
            const enfermeroActual = enfermeros.find((e: any) => e.enfermeroId === userId);
            
            if (enfermeroActual) {
              // Actualizar localStorage con los datos más recientes
              const updatedUser = {
                ...user,
                servicioActualId: enfermeroActual.servicioActualId,
                habitacionAsignada: enfermeroActual.habitacionAsignada,
                habitacionesAsignadas: enfermeroActual.habitacionesAsignadas
              };
              localStorage.setItem("user", JSON.stringify(updatedUser));
              console.log("Datos actualizados desde el servidor:", {
                servicioActualId: enfermeroActual.servicioActualId,
                habitacionesAsignadas: enfermeroActual.habitacionesAsignadas
              });
              
              setEnfermeroData({
                servicioActualId: enfermeroActual.servicioActualId || null,
                habitacionAsignada: enfermeroActual.habitacionAsignada || null,
                habitacionesAsignadas: enfermeroActual.habitacionesAsignadas || null,
              });
              return;
            }
          } catch (err) {
            console.error("Error al obtener datos actualizados:", err);
          }
        }

        // Usar datos del localStorage
        const enfData = {
          servicioActualId: user.servicioActualId || null,
          habitacionAsignada: user.habitacionAsignada || null,
          habitacionesAsignadas: user.habitacionesAsignadas || null,
        };
        
        console.log("Datos del enfermero desde localStorage:", enfData);
        
        if (!enfData.servicioActualId) {
          console.warn("⚠️ No tienes un servicio asignado");
        }
        if (!enfData.habitacionesAsignadas && !enfData.habitacionAsignada) {
          console.warn("⚠️ No tienes habitaciones asignadas");
        }
        
        setEnfermeroData(enfData);
      } catch (err) {
        console.error("Error al procesar datos del usuario:", err);
        setError("Error al obtener datos del usuario");
      }
    };

    fetchEnfermeroData();
  }, []);

  useEffect(() => {
    const fetchPacientes = async () => {
      try {
        setLoading(true);
        const response = await axios.get("http://localhost:5000/api/pacientes");
        const data = response.data.data || response.data || [];
        setPacientes(Array.isArray(data) ? data : []);
        setLoading(false);
      } catch (err) {
        setError("Error al cargar los pacientes");
        setLoading(false);
        setPacientes([]);
      }
    };

    fetchPacientes();
  }, []);

  useEffect(() => {
    if (!enfermeroData) {
      setPacientesFiltrados([]);
      return;
    }

    console.log("Enfermero data:", enfermeroData);
    console.log("Total pacientes:", pacientes.length);

    let filtrados = pacientes.filter((paciente) => {
      if (!enfermeroData.servicioActualId) {
        return false;
      }

      if (!paciente.servicioId || !paciente.numeroHabitacion) {
        return false;
      }

      const matchServicio = enfermeroData.servicioActualId === paciente.servicioId;

      let habitaciones = enfermeroData.habitacionesAsignadas || enfermeroData.habitacionAsignada || "";
      const habitacionesArr = habitaciones.split(",").map((h: string) => h.trim()).filter(Boolean);
      const matchHabitacion = habitacionesArr.includes(paciente.numeroHabitacion);

      console.log(`Paciente ${paciente.nombre}:`, {
        servicioId: paciente.servicioId,
        numeroHabitacion: paciente.numeroHabitacion,
        matchServicio,
        matchHabitacion,
        habitacionesEnfermero: habitacionesArr
      });

      return matchServicio && matchHabitacion;
    });

    console.log("Pacientes filtrados:", filtrados.length);

    if (searchTerm.trim()) {
      filtrados = filtrados.filter(
        (p) =>
          p.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.apellidop.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.apellidom.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.numeroExpediente.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setPacientesFiltrados(filtrados);
  }, [pacientes, enfermeroData, searchTerm]);

  const handleVerDetalles = (pacienteId: number) => {
    navigate(`/pacientes/detalles/${pacienteId}`, { state: { fromNursePanel: true } });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-auto-primary pt-20 flex items-center justify-center">
        <div className="text-auto-primary text-xl">Cargando pacientes...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-auto-primary pt-20">
      <div className="bg-gradient-to-br from-sky-400/15 via-cyan-300/10 to-sky-400/15 w-full h-full absolute"></div>
      <div className="relative min-h-screen">
        {/* Header */}
        <div className="bg-auto-secondary backdrop-blur-sm border-b border-auto shadow-lg">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-auto-primary">
                  Mis Pacientes Asignados
                </h1>
                <p className="text-auto-secondary mt-1">
                  Pacientes bajo tu cuidado en este momento
                </p>
              </div>
              <button
                onClick={() => navigate(-1)}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-sky-500 to-cyan-500 hover:from-sky-600 hover:to-cyan-600 text-white rounded-lg font-medium transition-all duration-200 shadow-md hover:shadow-lg"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 19l-7-7m0 0l7-7m-7 7h18"
                  />
                </svg>
                Regresar
              </button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Search Bar */}
          <div className="mb-6">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg
                  className="h-5 w-5 text-auto-tertiary"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-3 border border-auto rounded-xl bg-auto-secondary text-auto-primary placeholder:text-auto-tertiary focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500/20 transition-all duration-200"
                placeholder="Buscar por nombre, apellidos o número de expediente..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {/* Stats */}
          <div className="mb-6 bg-auto-secondary backdrop-blur-sm border border-auto rounded-xl p-4 shadow-md">
            <div className="flex items-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-sky-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
              <span className="text-lg font-semibold text-auto-primary">
                Total de pacientes asignados:{" "}
                <span className="text-sky-600">{pacientesFiltrados.length}</span>
              </span>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-xl">
              {error}
            </div>
          )}

          {/* No patients message */}
          {!loading && pacientesFiltrados.length === 0 && (
            <div className="bg-auto-secondary backdrop-blur-sm border border-auto rounded-xl p-8 text-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-16 w-16 mx-auto text-auto-tertiary mb-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                />
              </svg>
              <h3 className="text-xl font-semibold text-auto-primary mb-2">
                No tienes pacientes asignados
              </h3>
              <p className="text-auto-secondary mb-4">
                {searchTerm
                  ? "No se encontraron pacientes con ese criterio de búsqueda"
                  : "Actualmente no tienes pacientes asignados en tu servicio y habitación"}
              </p>
              {!searchTerm && enfermeroData && (
                <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg text-left max-w-md mx-auto">
                  <p className="text-sm font-semibold text-blue-900 dark:text-blue-100 mb-2">
                    📋 Información de tu asignación:
                  </p>
                  <div className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
                    <p>
                      • Servicio:{" "}
                      <span className="font-semibold">
                        {enfermeroData.servicioActualId || "No asignado"}
                      </span>
                    </p>
                    <p>
                      • Habitación(es):{" "}
                      <span className="font-semibold">
                        {enfermeroData.habitacionesAsignadas || 
                         enfermeroData.habitacionAsignada || 
                         "No asignada"}
                      </span>
                    </p>
                    <p className="mt-2 text-xs italic">
                      {!enfermeroData.servicioActualId || 
                       (!enfermeroData.habitacionesAsignadas && !enfermeroData.habitacionAsignada)
                        ? "⚠️ Contacta al coordinador para que te asigne un servicio y habitación"
                        : `Total de pacientes en el sistema: ${pacientes.length}`}
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Patients List */}
          {pacientesFiltrados.length > 0 && (
            <div className="grid grid-cols-1 gap-4">
              {pacientesFiltrados.map((paciente) => (
                <div
                  key={paciente.pacienteId}
                  className="bg-auto-secondary backdrop-blur-sm border border-auto rounded-xl p-6 shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer hover:scale-[1.01]"
                  onClick={() => handleVerDetalles(paciente.pacienteId)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-12 h-12 bg-gradient-to-r from-sky-500 to-cyan-500 rounded-full flex items-center justify-center">
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
                              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                            />
                          </svg>
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-auto-primary">
                            {paciente.nombre} {paciente.apellidop}{" "}
                            {paciente.apellidom}
                          </h3>
                          <p className="text-sm text-auto-tertiary">
                            Expediente: {paciente.numeroExpediente}
                          </p>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div>
                          <p className="text-xs text-auto-tertiary">Edad</p>
                          <p className="font-semibold text-auto-primary">
                            {paciente.edad || "N/A"} años
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-auto-tertiary">Cama</p>
                          <p className="font-semibold text-auto-primary">
                            {paciente.numeroCama || "N/A"}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-auto-tertiary">Habitación</p>
                          <p className="font-semibold text-auto-primary">
                            {paciente.numeroHabitacion || "N/A"}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-auto-tertiary">
                            Fecha de Ingreso
                          </p>
                          <p className="font-semibold text-auto-primary">
                            {new Date(paciente.fechaIngreso).toLocaleDateString(
                              "es-MX"
                            )}
                          </p>
                        </div>
                      </div>

                      {paciente.motivoConsulta && (
                        <div className="mt-3">
                          <p className="text-xs text-auto-tertiary">
                            Motivo de Consulta
                          </p>
                          <p className="text-sm text-auto-secondary">
                            {paciente.motivoConsulta}
                          </p>
                        </div>
                      )}
                    </div>

                    <div className="ml-4 flex gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/NoCoordinador/NotaMedicaForm/${paciente.pacienteId}`);
                        }}
                        className="p-2 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white rounded-lg transition-all duration-200 shadow-md hover:shadow-lg"
                        title="Registrar nota médica"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          className="h-5 w-5"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z"
                          />
                        </svg>
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleVerDetalles(paciente.pacienteId);
                        }}
                        className="p-2 bg-sky-500 hover:bg-sky-600 text-white rounded-lg transition-colors duration-200"
                        title="Ver detalles"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default MisPacientes;
