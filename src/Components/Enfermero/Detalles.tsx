import { useEffect, useState } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";

type Paciente = {
  pacienteId: number;
  nombre: string;
  apellidop: string;
  apellidom: string;
  numeroExpediente: string;
  edad?: number | null;
  numeroCama?: string | null;
  numeroHabitacion?: string | null;
  motivoConsulta?: string | null;
  fechaIngreso: string;
  servicioId?: number | null;
};

function Detalles() {
  const location = useLocation();
  const [pacientes, setPacientes] = useState<Paciente[]>([]);
  const [habitacionesAsignadas, setHabitacionesAsignadas] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [servicioId, setServicioId] = useState<number | null>(null);
  const [nombreServicio, setNombreServicio] = useState<string>("");
  const [enfermeroNombre, setEnfermeroNombre] = useState<string>("");

  // Carga datos de navegación o localStorage
  useEffect(() => {
    if (location.state?.servicioActualId) {
      setServicioId(location.state.servicioActualId);
      setEnfermeroNombre(location.state.enfermeroNombre || "");
      if (location.state.habitacionesAsignadas) {
        let habs = location.state.habitacionesAsignadas;
        if (typeof habs === 'string') {
          habs = habs.split(',').map((h: string) => h.trim()).filter(Boolean);
        }
        setHabitacionesAsignadas(habs);
      }
      if (location.state.servicioActualId) {
        axios.get("http://localhost:5000/api/servicios/listServices")
          .then(response => {
            const servicios = response.data.data || response.data;
            const servicio = servicios.find((s: any) => s.servicioId === location.state.servicioActualId);
            if (servicio) {
              setNombreServicio(servicio.nombre);
            }
          });
      }
      return;
    }
    const userStr = localStorage.getItem("user");
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        const currentServicioId = user.servicioActualId || null;
        const currentNombreServicio = user.servicio?.nombre || "";
        setServicioId(currentServicioId);
        setNombreServicio(currentNombreServicio);
        if (user.habitacionesAsignadas) {
          let habs = user.habitacionesAsignadas;
          if (typeof habs === 'string') {
            habs = habs.split(',').map((h: string) => h.trim()).filter(Boolean);
          }
          setHabitacionesAsignadas(habs);
        }
      } catch (e) {
        setError("Error al obtener información del usuario");
        setLoading(false);
      }
    } else {
      setError("No se encontró información del usuario");
      setLoading(false);
    }
  }, [location.state]);

  // Carga pacientes filtrados por servicio y habitaciones asignadas
  useEffect(() => {
    if (servicioId === null) {
      if (!error) {
        setError("El enfermero no tiene un servicio asignado");
      }
      setLoading(false);
      return;
    }
    const fetchPacientes = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await axios.get("http://localhost:5000/api/pacientes");
        const data = res.data?.data ?? res.data;
        const allPacientes: Paciente[] = Array.isArray(data) ? data : [];
        // Filtrar pacientes SOLO si hay habitaciones asignadas, si no, no mostrar ninguno
        let filtered: Paciente[] = [];
        if (habitacionesAsignadas.length > 0) {
          filtered = allPacientes.filter((p) => {
            const matchServicio = p.servicioId === servicioId;
            const matchHabitacion = p.numeroHabitacion && habitacionesAsignadas.includes(p.numeroHabitacion);
            return matchServicio && matchHabitacion;
          });
        }
        setPacientes(filtered);
      } catch (err: any) {
        setError("No se pudieron cargar los pacientes");
      } finally {
        setLoading(false);
      }
    };
    fetchPacientes();
  }, [servicioId, error]);

  if (loading) {
    return (
      <div className="min-h-screen bg-auto-primary pt-20 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-sky-500 mx-auto mb-4"></div>
          <p className="text-auto-secondary font-medium">Cargando pacientes...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-auto-primary pt-20">
        <div className="bg-gradient-to-br from-sky-400/15 via-cyan-300/10 to-sky-400/15 h-127 w-full absolute top-0 left-0"></div>
        <div className="relative min-h-screen flex items-center justify-center">
          <div className="max-w-md w-full mx-4">
            <div className="bg-auto-secondary backdrop-blur-sm border border-auto rounded-3xl shadow-2xl p-8">
              <div className="flex items-center justify-center mb-4">
                <svg className="w-16 h-16 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <h2 className="text-xl font-bold text-auto-primary text-center mb-2">
                {error}
              </h2>
              <p className="text-auto-secondary text-center text-sm mb-4">
                Verifica que el enfermero tenga un servicio asignado.
              </p>
              <div className="bg-blue-50 rounded-lg p-3 text-sm text-blue-800">
                <p className="font-semibold mb-1">💡 Solución:</p>
                <p>Asigna el enfermero a un servicio en la opción "Actualizar Enfermero".</p>
              </div>
              <button
                onClick={() => window.location.href = '/Enfermero'}
                className="mt-4 w-full bg-sky-500 hover:bg-sky-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
              >
                Volver a Enfermeros
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Agrupar pacientes por número de habitación
  const pacientesPorHabitacion: { [habitacion: string]: Paciente[] } = pacientes.reduce((acc, paciente) => {
    const habitacion = paciente.numeroHabitacion || 'Sin habitación';
    if (!acc[habitacion]) acc[habitacion] = [];
    acc[habitacion].push(paciente);
    return acc;
  }, {} as { [habitacion: string]: Paciente[] });

  return (
    <div className="min-h-screen bg-auto-primary pt-20 pb-10">
      <div className="bg-gradient-to-br from-sky-400/15 via-cyan-300/10 to-sky-400/15 h-127 w-full absolute top-0 left-0"></div>
      <div className="relative min-h-screen">
        <div className="bg-auto-secondary backdrop-blur-sm border-b border-auto shadow-lg">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-auto-primary">
                  {enfermeroNombre ? `Pacientes de ${enfermeroNombre}` : "Mis Pacientes Asignados"}
                </h1>
                <p className="text-auto-secondary mt-1">
                  {nombreServicio && <span className="font-semibold">{nombreServicio} - </span>}
                  {pacientes.length} {pacientes.length === 1 ? "paciente" : "pacientes"}
                </p>
              </div>
            </div>
          </div>
        </div>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-auto-secondary backdrop-blur-sm border border-auto rounded-3xl shadow-2xl p-6">
            {pacientes.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12">
                <svg className="w-16 h-16 text-auto-tertiary mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                </svg>
                <p className="text-auto-tertiary text-lg font-semibold mb-2">No hay pacientes asignados a este servicio</p>
                <div className="bg-sky-50 border border-sky-200 rounded-lg p-4 mb-4 max-w-md">
                  <p className="text-sm text-sky-800">
                    <span className="font-semibold">Servicio actual:</span> {servicioId ? `ID ${servicioId}` : 'Sin servicio'}
                  </p>
                </div>
                <div className="bg-blue-50 rounded-lg p-4 max-w-md">
                  <p className="text-sm text-blue-800 mb-3">
                    💡 <span className="font-semibold">Para asignar pacientes a este servicio:</span>
                  </p>
                  <ol className="text-sm text-blue-800 list-decimal list-inside space-y-2">
                    <li>Ve a <span className="font-semibold">"Asignar Paciente"</span> en el menú de Enfermeros</li>
                    <li>Selecciona un paciente de la lista</li>
                    <li>Selecciona el servicio correspondiente</li>
                    <li>Haz clic en "Asignar Paciente"</li>
                  </ol>
                  <p className="text-xs text-blue-700 mt-3 italic">
                    O usa la opción "Actualizar Paciente" para reasignar pacientes existentes.
                  </p>
                </div>
              </div>
            ) : (
              <div className="grid gap-8">
                {Object.entries(pacientesPorHabitacion).map(([habitacion, pacientesGrupo]) => (
                  <div key={habitacion} className="mb-6">
                    <h2 className="text-xl font-bold text-sky-700 mb-2">Habitación: {habitacion}</h2>
                    <div className="grid gap-4">
                      {pacientesGrupo.map((paciente) => (
                        <div
                          key={paciente.pacienteId}
                          className="bg-auto-secondary border border-auto rounded-xl p-4 hover:shadow-lg transition-shadow duration-200"
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h3 className="text-lg font-bold text-auto-primary">
                                {paciente.nombre} {paciente.apellidop} {paciente.apellidom}
                              </h3>
                              <div className="mt-2 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 text-sm">
                                <p className="text-auto-secondary">
                                  <span className="font-semibold">Expediente:</span> {paciente.numeroExpediente}
                                </p>
                                {paciente.edad && (
                                  <p className="text-auto-secondary">
                                    <span className="font-semibold">Edad:</span> {paciente.edad} años
                                  </p>
                                )}
                                {paciente.numeroCama && (
                                  <p className="text-auto-secondary">
                                    <span className="font-semibold">Cama:</span> {paciente.numeroCama}
                                  </p>
                                )}
                                <p className="text-auto-secondary">
                                  <span className="font-semibold">Ingreso:</span>{" "}
                                  {new Date(paciente.fechaIngreso).toLocaleDateString("es-MX")}
                                </p>
                              </div>
                              {paciente.motivoConsulta && (
                                <div className="mt-3 bg-auto-tertiary/20 rounded-lg p-3">
                                  <p className="text-sm text-auto-secondary">
                                    <span className="font-semibold">Motivo de consulta:</span> {paciente.motivoConsulta}
                                  </p>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
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
export default Detalles;