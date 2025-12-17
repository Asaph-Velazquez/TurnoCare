import { useState, useEffect } from "react";
import axios from "axios";
import SelectField from "../utilities/Form/SelectField";

interface Enfermero {
  enfermeroId: number;
  nombre: string;
  apellidoPaterno: string;
  apellidoMaterno: string;
  numeroEmpleado: string;
  especialidad?: string;
  turnoAsignadoId?: number;
  turno?: {
    turnoId: number;
    nombre: string;
    horaInicio: string;
    horaFin: string;
  };
}

interface Turno {
  turnoId: number;
  nombre: string;
  horaInicio: string;
  horaFin: string;
  enfermeros?: Enfermero[];
}

function AsignarHorarioEnfermero() {
  const [form, setForm] = useState({
    turnoId: "",
    enfermeroId: "",
  });

  const [turnos, setTurnos] = useState<Turno[]>([]);
  const [enfermeros, setEnfermeros] = useState<Enfermero[]>([]);
  const [selectedTurno, setSelectedTurno] = useState<Turno | null>(null);
  const [loadingTurnos, setLoadingTurnos] = useState(false);
  const [loadingEnfermeros, setLoadingEnfermeros] = useState(false);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState<{type: string, message: string} | null>(null);

  // Helper functions - Formato 24 horas
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

  // Cargar turnos
  useEffect(() => {
    const fetchTurnos = async () => {
      setLoadingTurnos(true);
      try {
        const response = await axios.get("http://localhost:5000/api/turnos");
        const data = response.data.success ? response.data.data : response.data;
        setTurnos(data || []);
      } catch (error) {setAlert({
          type: "danger",
          message: "Error al cargar la lista de turnos"
        });
      } finally {
        setLoadingTurnos(false);
      }
    };
    fetchTurnos();
  }, []);

  // Cargar enfermeros
  useEffect(() => {
    const fetchEnfermeros = async () => {
      setLoadingEnfermeros(true);
      try {
        const response = await axios.get("http://localhost:5000/api/enfermeros");
        const data = response.data.success ? response.data.data : response.data;
        setEnfermeros(data || []);
      } catch (error) {setAlert({
          type: "danger",
          message: "Error al cargar la lista de enfermeros"
        });
      } finally {
        setLoadingEnfermeros(false);
      }
    };
    fetchEnfermeros();
  }, []);

  // Actualizar turno seleccionado
  useEffect(() => {
    if (form.turnoId) {
      const turno = turnos.find(t => t.turnoId === parseInt(form.turnoId));
      setSelectedTurno(turno || null);
      // Si el turno tiene enfermeros asignados, tomar el primero (para edición)
      if (turno?.enfermeros && turno.enfermeros.length > 0) {
        setForm(prev => ({ ...prev, enfermeroId: turno.enfermeros![0].enfermeroId.toString() }));
      }
    } else {
      setSelectedTurno(null);
    }
  }, [form.turnoId, turnos]);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((s) => ({ ...s, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAlert(null);
    setLoading(true);

    try {
      // Actualizar el enfermero con el turno asignado
      const dataToSend = {
        turnoAsignadoId: parseInt(form.turnoId),
      };

      await axios.put(`http://localhost:5000/api/enfermeros/${form.enfermeroId}`, dataToSend);
      
      setAlert({
        type: "success",
        message: "Enfermero asignado exitosamente al turno"
      });

      // Recargar turnos
      const response = await axios.get("http://localhost:5000/api/turnos");
      const data = response.data.success ? response.data.data : response.data;
      setTurnos(data || []);

      setForm({
        turnoId: "",
        enfermeroId: "",
      });
      setSelectedTurno(null);
    } catch (error: any) {let errorMessage = "Error al asignar enfermero al turno";
      if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      setAlert({
        type: "danger",
        message: errorMessage
      });
    } finally {
      setLoading(false);
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
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Formulario */}
            <div className="lg:col-span-2">
              <div className="bg-auto-secondary rounded-2xl shadow-xl p-6 md:p-8 border border-auto backdrop-blur-sm">
                <div className="flex items-center gap-3 mb-2">
                  <div className="bg-gradient-to-br from-sky-500 to-sky-600 p-3 rounded-xl shadow-lg">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="1.5"
                      stroke="currentColor"
                      className="w-6 h-6 text-white"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M18 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0ZM3 19.235v-.11a6.375 6.375 0 0 1 12.75 0v.109A12.318 12.318 0 0 1 9.374 21c-2.331 0-4.512-.645-6.374-1.766Z"
                      />
                    </svg>
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold text-auto-primary">Asignar Personal a Turno</h2>
                    <p className="text-auto-secondary text-sm">Asigna enfermeros y personal médico a los turnos laborales</p>
                  </div>
                </div>

                <div className="h-px bg-gradient-to-r from-transparent via-auto-tertiary to-transparent my-6"></div>

                {/* Alertas */}
                {alert && (
                  <div
                    className={`mb-6 p-4 rounded-xl shadow-lg backdrop-blur-sm ${
                      alert.type === "success"
                        ? "bg-green-100 text-green-800 border-2 border-green-300 dark:bg-green-900/40 dark:text-green-200 dark:border-green-700"
                        : "bg-red-100 text-red-800 border-2 border-red-300 dark:bg-red-900/40 dark:text-red-200 dark:border-red-700"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      {alert.type === "success" ? (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                        </svg>
                      )}
                      <span className="font-medium">{alert.message}</span>
                    </div>
                  </div>
                )}

                {/* Formulario */}
                <form onSubmit={handleSubmit}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <SelectField 
                      label="🗓️ Seleccionar Turno Laboral" 
                      name="turnoId" 
                      value={form.turnoId} 
                      onChange={handleChange}
                      required
                      options={[
                        { value: "", label: loadingTurnos ? "Cargando turnos..." : "Seleccionar turno" },
                        ...turnos.map(t => {
                          const tipo = getTipoTurno(t.horaInicio);
                          const icono = tipo === 'Matutino' ? '☀️' : tipo === 'Vespertino' ? '🌆' : '🌙';
                          return {
                            value: t.turnoId.toString(),
                            label: `${icono} ${t.nombre} - ${tipo} (${formatHora(t.horaInicio)} - ${formatHora(t.horaFin)})`
                          };
                        })
                      ]}
                    />
                    <SelectField 
                      label="👨‍⚕️ Seleccionar Personal" 
                      name="enfermeroId" 
                      value={form.enfermeroId} 
                      onChange={handleChange}
                      required
                      options={[
                        { value: "", label: loadingEnfermeros ? "Cargando personal..." : "Seleccionar enfermero" },
                        ...enfermeros.map(e => ({
                          value: e.enfermeroId.toString(),
                          label: `${e.nombre} ${e.apellidoPaterno} - #${e.numeroEmpleado}${e.especialidad ? ` - ${e.especialidad}` : ''}`
                        }))
                      ]}
                    />
                  </div>

                  <div className="mt-6">
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full px-6 py-3 bg-gradient-to-r from-sky-500 to-cyan-500 text-white font-semibold rounded-xl hover:from-sky-600 hover:to-cyan-600 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed transition-all duration-200 shadow-lg"
                    >
                      {loading ? "Asignando personal..." : "✓ Asignar Personal al Turno"}
                    </button>
                  </div>
                </form>
              </div>
            </div>

            {/* Panel de información del turno */}
            <div className="lg:col-span-1">
              <div className="bg-auto-secondary rounded-2xl shadow-xl p-6 md:p-8 border border-auto backdrop-blur-sm sticky top-24">
                <h2 className="text-xl font-bold text-auto-primary mb-4">
                  📋 Información del Turno
                </h2>
                {selectedTurno ? (
                  <div className="space-y-4">
                    <div className="bg-auto-primary rounded-lg p-4 border border-auto">
                      <p className="text-sm text-auto-tertiary mb-1">� Nombre del Turno</p>
                      <p className="text-lg font-semibold text-auto-primary">
                        {selectedTurno.nombre}
                      </p>
                    </div>
                    <div className="bg-auto-primary rounded-lg p-4 border border-auto">
                      <p className="text-sm text-auto-tertiary mb-1">⏰ Tipo de Turno</p>
                      <p className="text-lg font-semibold text-auto-primary capitalize">
                        {getTipoTurno(selectedTurno.horaInicio) === "Matutino" && "☀️ Matutino"}
                        {getTipoTurno(selectedTurno.horaInicio) === "Vespertino" && "🌆 Vespertino"}
                        {getTipoTurno(selectedTurno.horaInicio) === "Nocturno" && "🌙 Nocturno"}
                      </p>
                    </div>
                    <div className="bg-auto-primary rounded-lg p-4 border border-auto">
                      <p className="text-sm text-auto-tertiary mb-1">🕐 Horario</p>
                      <p className="text-lg font-semibold text-auto-primary">
                        {formatHora(selectedTurno.horaInicio)} - {formatHora(selectedTurno.horaFin)}
                      </p>
                    </div>
                    <div className="bg-auto-primary rounded-lg p-4 border border-auto">
                      <p className="text-sm text-auto-tertiary mb-1">👨‍⚕️ Personal Asignado</p>
                      {selectedTurno.enfermeros && selectedTurno.enfermeros.length > 0 ? (
                        <div className="space-y-2">
                          {selectedTurno.enfermeros.map((enf, idx) => (
                            <p key={idx} className="text-sm font-medium text-auto-primary">
                              • {enf.nombre} {enf.apellidoPaterno} (#{enf.numeroEmpleado})
                            </p>
                          ))}
                        </div>
                      ) : (
                        <p className="text-lg font-semibold text-auto-primary">Sin asignar</p>
                      )}
                    </div>
                    <div className="pt-4 border-t border-auto">
                      <div className="flex items-center">
                        <div className={`w-3 h-3 rounded-full mr-2 ${selectedTurno.enfermeros && selectedTurno.enfermeros.length > 0 ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
                        <p className="text-sm text-auto-secondary">
                          {selectedTurno.enfermeros && selectedTurno.enfermeros.length > 0 ? '✓ Turno cubierto' : '⚠️ Turno sin cubrir'}
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-16 h-16 mx-auto text-auto-tertiary mb-4"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                      />
                    </svg>
                    <p className="text-auto-secondary">
                      Selecciona un turno laboral para ver sus detalles
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default AsignarHorarioEnfermero;

