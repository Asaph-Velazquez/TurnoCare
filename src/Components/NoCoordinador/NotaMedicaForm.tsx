import axios from "axios";
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import EnfermeroNav from "./EnfermeroNav";

interface Paciente {
  pacienteId: number;
  nombre: string;
  apellidop: string;
  apellidom: string;
  numeroExpediente: string;
  edad: number | null;
  numeroCama: string | null;
  numeroHabitacion: string | null;
  servicioId: number | null;
}

interface Servicio {
  servicioId: number;
  nombre: string;
}

interface Hospital {
  hospitalId: number;
  nombre: string;
}

interface Medicamento {
  medicamentoId: number;
  nombre: string;
  descripcion?: string;
  cantidadStock: number;
}

interface Insumo {
  insumoId: number;
  nombre: string;
  descripcion?: string;
  cantidadDisponible: number;
}

interface MedicamentoAsignado {
  id: number;
  nombre: string;
  dosis: string;
  frecuencia: string;
  cantidad: string;
}

interface InsumoAsignado {
  id: number;
  nombre: string;
  cantidad: string;
  notas: string;
}

function NotaMedicaForm() {
  const { pacienteId } = useParams<{ pacienteId: string }>();
  const navigate = useNavigate();
  
  const [paciente, setPaciente] = useState<Paciente | null>(null);
  const [servicio, setServicio] = useState<Servicio | null>(null);
  const [hospital, setHospital] = useState<Hospital | null>(null);
  const [enfermeroId, setEnfermeroId] = useState("");
  const [observaciones, setObservaciones] = useState("");
  const [nombreEnfermeroAlta, setNombreEnfermeroAlta] = useState("");
  const [nombreEnfermeroAsignado, setNombreEnfermeroAsignado] = useState("");
  
  const [medicamentosDisponibles, setMedicamentosDisponibles] = useState<Medicamento[]>([]);
  const [insumosDisponibles, setInsumosDisponibles] = useState<Insumo[]>([]);
  const [medicamentosAsignados, setMedicamentosAsignados] = useState<MedicamentoAsignado[]>([]);
  const [insumosAsignados, setInsumosAsignados] = useState<InsumoAsignado[]>([]);
  
  const [loadingPaciente, setLoadingPaciente] = useState(false);
  const [loadingMedicamentos, setLoadingMedicamentos] = useState(false);
  const [loadingInsumos, setLoadingInsumos] = useState(false);
  const [activeTab, setActiveTab] = useState<'medicamentos' | 'insumos'>('medicamentos');
  
  const [feedback, setFeedback] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const userRaw = localStorage.getItem("user");
    if (userRaw) {
      try {
        const user = JSON.parse(userRaw);
        // userid contiene el enfermeroId del backend
        setEnfermeroId(user.userid?.toString() || "");
        setNombreEnfermeroAlta(`${user.nombre || ""} ${user.apellidoPaterno || ""}`.trim());
        setNombreEnfermeroAsignado(`${user.nombre || ""} ${user.apellidoPaterno || ""}`.trim());
      } catch (err) {
        console.error("Error parsing user data:", err);
      }
    }
  }, []);

  // Cargar datos del paciente
  useEffect(() => {
    if (!pacienteId) return;

    const fetchPaciente = async () => {
      setLoadingPaciente(true);
      try {
        const response = await axios.get(`http://localhost:5000/api/pacientes/${pacienteId}`);
        const pacienteData = response.data.data || response.data;
        setPaciente(pacienteData);

        try {
          const [serviciosRes, hospitalesRes] = await Promise.all([
            axios.get("http://localhost:5000/api/servicios/listServices"),
            axios.get("http://localhost:5000/api/hospital")
          ]);

          const serviciosData = Array.isArray(serviciosRes.data) ? serviciosRes.data : serviciosRes.data.data || [];
          const hospitalesData = Array.isArray(hospitalesRes.data) ? hospitalesRes.data : hospitalesRes.data.data || [];

          if (pacienteData.servicioId) {
            const servicioEncontrado = serviciosData.find((s: any) => s.servicioId === pacienteData.servicioId);
            if (servicioEncontrado) {
              setServicio(servicioEncontrado);

              if (servicioEncontrado.hospitalId) {
                const hospitalEncontrado = hospitalesData.find((h: any) => h.hospitalId === servicioEncontrado.hospitalId);
                if (hospitalEncontrado) {
                  setHospital(hospitalEncontrado);
                }
              }
            }
          }
        } catch (error) {
          console.log("No se pudieron cargar servicios/hospitales, continuando sin ellos");
        }
      } catch (error) {
        console.error("Error cargando paciente:", error);
        setFeedback({ type: "error", message: "Error al cargar datos del paciente" });
      } finally {
        setLoadingPaciente(false);
      }
    };

    fetchPaciente();
  }, [pacienteId]);

  useEffect(() => {
    const fetchMedicamentos = async () => {
      setLoadingMedicamentos(true);
      try {
        const response = await axios.get("http://localhost:5000/api/medicamentos");
        const data = response.data.success ? response.data.data : response.data;
        setMedicamentosDisponibles(data || []);
      } catch (error) {
        console.error("Error cargando medicamentos:", error);
      } finally {
        setLoadingMedicamentos(false);
      }
    };
    fetchMedicamentos();
  }, []);

  useEffect(() => {
    const fetchInsumos = async () => {
      setLoadingInsumos(true);
      try {
        const response = await axios.get("http://localhost:5000/api/insumos");
        const data = response.data.success ? response.data.data : response.data;
        setInsumosDisponibles(data || []);
      } catch (error) {
        console.error("Error cargando insumos:", error);
      } finally {
        setLoadingInsumos(false);
      }
    };
    fetchInsumos();
  }, []);

  const handleAddMedicamento = (medicamento: Medicamento) => {
    if (medicamentosAsignados.some(m => m.id === medicamento.medicamentoId)) {
      setFeedback({ type: "error", message: "Este medicamento ya está en la lista" });
      return;
    }
    setMedicamentosAsignados([
      ...medicamentosAsignados,
      {
        id: medicamento.medicamentoId,
        nombre: medicamento.nombre,
        dosis: "",
        frecuencia: "",
        cantidad: "1"
      }
    ]);
  };

  const handleAddInsumo = (insumo: Insumo) => {
    if (insumosAsignados.some(i => i.id === insumo.insumoId)) {
      setFeedback({ type: "error", message: "Este insumo ya está en la lista" });
      return;
    }
    setInsumosAsignados([
      ...insumosAsignados,
      {
        id: insumo.insumoId,
        nombre: insumo.nombre,
        cantidad: "1",
        notas: ""
      }
    ]);
  };

  const handleUpdateMedicamento = (id: number, field: keyof MedicamentoAsignado, value: string) => {
    setMedicamentosAsignados(medicamentosAsignados.map(m =>
      m.id === id ? { ...m, [field]: value } : m
    ));
  };

  const handleUpdateInsumo = (id: number, field: keyof InsumoAsignado, value: string) => {
    setInsumosAsignados(insumosAsignados.map(i =>
      i.id === id ? { ...i, [field]: value } : i
    ));
  };

  const handleRemoveMedicamento = (id: number) => {
    setMedicamentosAsignados(medicamentosAsignados.filter(m => m.id !== id));
  };

  const handleRemoveInsumo = (id: number) => {
    setInsumosAsignados(insumosAsignados.filter(i => i.id !== id));
  };

  const isFormValid = () => {
    return paciente && enfermeroId && observaciones.trim();
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!isFormValid()) {
      setFeedback({
        type: "error",
        message: "Por favor completa todos los campos obligatorios.",
      });
      return;
    }

    setIsSubmitting(true);
    setFeedback(null);

    try {
      await axios.post("http://localhost:5000/api/notas-medicas", {
        pacienteId: paciente!.pacienteId,
        nombrePaciente: `${paciente!.nombre} ${paciente!.apellidop} ${paciente!.apellidom}`,
        enfermeroId,
        nombreEnfermeroAlta,
        nombreEnfermeroAsignado,
        servicio: servicio?.nombre || "",
        nombreHospital: hospital?.nombre || "",
        habitacion: paciente!.numeroHabitacion || "",
        cama: paciente!.numeroCama || "",
        observaciones,
        medicamentos: medicamentosAsignados.map((med) => ({
          nombre: med.nombre,
          dosis: med.dosis,
          frecuencia: med.frecuencia,
          cantidad: med.cantidad,
        })),
        insumos: insumosAsignados.map((ins) => ({
          nombre: ins.nombre,
          cantidad: ins.cantidad,
          notas: ins.notas,
        })),
      });
      setFeedback({
        type: "success",
        message: "Nota médica guardada correctamente.",
      });
      
      setObservaciones("");
      setMedicamentosAsignados([]);
      setInsumosAsignados([]);
      
      setTimeout(() => {
        navigate("/NoCoordinador/mis-pacientes");
      }, 2000);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Error desconocido";
      setFeedback({ type: "error", message });
    } finally {
      setIsSubmitting(false);
    }
  };

  const medicamentosLibres = medicamentosDisponibles.filter(
    m => !medicamentosAsignados.some(ma => ma.id === m.medicamentoId) && m.cantidadStock > 0
  );

  const insumosLibres = insumosDisponibles.filter(
    i => !insumosAsignados.some(ia => ia.id === i.insumoId) && i.cantidadDisponible > 0
  );

  if (loadingPaciente) {
    return (
      <div className="min-h-screen bg-auto-primary pt-20 flex items-center justify-center">
        <div className="text-auto-primary text-xl">Cargando datos del paciente...</div>
      </div>
    );
  }

  if (!paciente && pacienteId) {
    return (
      <div className="min-h-screen bg-auto-primary pt-20 flex items-center justify-center">
        <div className="text-red-500 text-xl">No se encontró el paciente</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-auto-primary">
      <EnfermeroNav />
      <div className="bg-gradient-to-br from-sky-400/15 via-cyan-300/10 to-sky-400/15 w-full h-full absolute"></div>
      <div className="relative min-h-screen pt-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="bg-auto-secondary backdrop-blur-sm border border-auto rounded-3xl shadow-2xl p-8 space-y-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-auto-primary">
                  Registro de Nota Médica
                </h1>
                <p className="text-auto-secondary mt-1">
                  Completa los datos clínicos del paciente
                </p>
              </div>
              <button
                onClick={() => navigate("/NoCoordinador/mis-pacientes")}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-sky-500 to-cyan-500 hover:from-sky-600 hover:to-cyan-600 text-white rounded-lg font-medium transition-all duration-200"
              >
                ← Regresar
              </button>
            </div>

            {/* Información del paciente (solo lectura) */}
            {paciente && (
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-xl p-6">
                <h3 className="font-semibold text-blue-900 dark:text-blue-300 mb-4 flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                  </svg>
                  Información del Paciente
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium text-blue-800 dark:text-blue-200">Nombre:</span>
                    <p className="text-blue-900 dark:text-blue-100">{paciente.nombre} {paciente.apellidop} {paciente.apellidom}</p>
                  </div>
                  <div>
                    <span className="font-medium text-blue-800 dark:text-blue-200">Expediente:</span>
                    <p className="text-blue-900 dark:text-blue-100">{paciente.numeroExpediente}</p>
                  </div>
                  <div>
                    <span className="font-medium text-blue-800 dark:text-blue-200">Edad:</span>
                    <p className="text-blue-900 dark:text-blue-100">{paciente.edad || "N/A"} años</p>
                  </div>
                  <div>
                    <span className="font-medium text-blue-800 dark:text-blue-200">Habitación:</span>
                    <p className="text-blue-900 dark:text-blue-100">{paciente.numeroHabitacion || "N/A"}</p>
                  </div>
                  <div>
                    <span className="font-medium text-blue-800 dark:text-blue-200">Cama:</span>
                    <p className="text-blue-900 dark:text-blue-100">{paciente.numeroCama || "N/A"}</p>
                  </div>
                  <div>
                    <span className="font-medium text-blue-800 dark:text-blue-200">Servicio:</span>
                    <p className="text-blue-900 dark:text-blue-100">{servicio?.nombre || "N/A"}</p>
                  </div>
                  <div className="md:col-span-2">
                    <span className="font-medium text-blue-800 dark:text-blue-200">Hospital:</span>
                    <p className="text-blue-900 dark:text-blue-100">{hospital?.nombre || "N/A"}</p>
                  </div>
                </div>
              </div>
            )}

            <form className="space-y-6" onSubmit={handleSubmit}>
              {/* Tabs para Medicamentos e Insumos */}
              <div className="flex gap-2 border-b border-auto">
                <button
                  type="button"
                  onClick={() => setActiveTab('medicamentos')}
                  className={`px-6 py-3 font-medium transition-colors ${
                    activeTab === 'medicamentos'
                      ? 'border-b-2 border-sky-500 text-sky-600'
                      : 'text-auto-secondary hover:text-auto-primary'
                  }`}
                >
                  💊 Medicamentos ({medicamentosAsignados.length})
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('insumos')}
                  className={`px-6 py-3 font-medium transition-colors ${
                    activeTab === 'insumos'
                      ? 'border-b-2 border-sky-500 text-sky-600'
                      : 'text-auto-secondary hover:text-auto-primary'
                  }`}
                >
                  🏥 Insumos ({insumosAsignados.length})
                </button>
              </div>

              {/* Contenido de Medicamentos */}
              {activeTab === 'medicamentos' && (
                <div className="space-y-4">
                  <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-700 rounded-xl p-4">
                    <h4 className="font-semibold text-purple-900 dark:text-purple-300 mb-3">Agregar Medicamento</h4>
                    <div className="max-h-60 overflow-y-auto space-y-2">
                      {loadingMedicamentos ? (
                        <p className="text-sm text-purple-700 dark:text-purple-300">Cargando medicamentos...</p>
                      ) : medicamentosLibres.length === 0 ? (
                        <p className="text-sm text-purple-700 dark:text-purple-300">No hay medicamentos disponibles en inventario</p>
                      ) : (
                        medicamentosLibres.map(med => (
                          <div key={med.medicamentoId} className="bg-white dark:bg-gray-800 rounded-lg p-3 flex items-center justify-between border border-transparent dark:border-gray-700">
                            <div className="flex-1">
                              <p className="font-medium text-purple-900 dark:text-purple-300">{med.nombre}</p>
                              <p className="text-xs text-purple-700 dark:text-purple-400">
                                Stock: {med.cantidadStock} unidades
                              </p>
                            </div>
                            <button
                              type="button"
                              onClick={() => handleAddMedicamento(med)}
                              className="ml-3 px-3 py-1 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition text-sm"
                            >
                              + Agregar
                            </button>
                          </div>
                        ))
                      )}
                    </div>
                  </div>

                  {/* Lista de medicamentos asignados */}
                  {medicamentosAsignados.length > 0 && (
                    <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700 rounded-xl p-4">
                      <h4 className="font-semibold text-green-900 dark:text-green-300 mb-3">Medicamentos Prescritos</h4>
                      <div className="space-y-3">
                        {medicamentosAsignados.map(item => (
                          <div key={item.id} className="bg-white dark:bg-gray-800 rounded-lg p-3 border border-green-300 dark:border-green-700">
                            <div className="flex items-center justify-between mb-2">
                              <p className="font-medium text-green-900 dark:text-green-300">{item.nombre}</p>
                              <button
                                type="button"
                                onClick={() => handleRemoveMedicamento(item.id)}
                                className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                              >
                                ✕
                              </button>
                            </div>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                              <div>
                                <label className="text-xs text-green-800 dark:text-green-200">Cantidad</label>
                                <input
                                  type="text"
                                  value={item.cantidad}
                                  onChange={(e) => handleUpdateMedicamento(item.id, 'cantidad', e.target.value)}
                                  placeholder="Ej: 2"
                                  className="w-full px-2 py-1 border border-green-300 dark:border-green-600 rounded text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                                />
                              </div>
                              <div>
                                <label className="text-xs text-green-800 dark:text-green-200">Dosis</label>
                                <input
                                  type="text"
                                  value={item.dosis || ''}
                                  onChange={(e) => handleUpdateMedicamento(item.id, 'dosis', e.target.value)}
                                  placeholder="Ej: 500mg"
                                  className="w-full px-2 py-1 border border-green-300 dark:border-green-600 rounded text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500"
                                />
                              </div>
                              <div className="md:col-span-2">
                                <label className="text-xs text-green-800 dark:text-green-200">Frecuencia</label>
                                <input
                                  type="text"
                                  value={item.frecuencia || ''}
                                  onChange={(e) => handleUpdateMedicamento(item.id, 'frecuencia', e.target.value)}
                                  placeholder="Ej: cada 8 horas"
                                  className="w-full px-2 py-1 border border-green-300 dark:border-green-600 rounded text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500"
                                />
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Contenido de Insumos */}
              {activeTab === 'insumos' && (
                <div className="space-y-4">
                  <div className="bg-cyan-50 dark:bg-cyan-900/20 border border-cyan-200 dark:border-cyan-700 rounded-xl p-4">
                    <h4 className="font-semibold text-cyan-900 dark:text-cyan-300 mb-3">Agregar Insumo</h4>
                    <div className="max-h-60 overflow-y-auto space-y-2">
                      {loadingInsumos ? (
                        <p className="text-sm text-cyan-700 dark:text-cyan-300">Cargando insumos...</p>
                      ) : insumosLibres.length === 0 ? (
                        <p className="text-sm text-cyan-700 dark:text-cyan-300">No hay insumos disponibles en inventario</p>
                      ) : (
                        insumosLibres.map(ins => (
                          <div key={ins.insumoId} className="bg-white dark:bg-gray-800 rounded-lg p-3 flex items-center justify-between border border-transparent dark:border-gray-700">
                            <div className="flex-1">
                              <p className="font-medium text-cyan-900 dark:text-cyan-300">{ins.nombre}</p>
                              <p className="text-xs text-cyan-700 dark:text-cyan-400">
                                Disponible: {ins.cantidadDisponible} unidades
                              </p>
                            </div>
                            <button
                              type="button"
                              onClick={() => handleAddInsumo(ins)}
                              className="ml-3 px-3 py-1 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 transition text-sm"
                            >
                              + Agregar
                            </button>
                          </div>
                        ))
                      )}
                    </div>
                  </div>

                  {/* Lista de insumos asignados */}
                  {insumosAsignados.length > 0 && (
                    <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700 rounded-xl p-4">
                      <h4 className="font-semibold text-green-900 dark:text-green-300 mb-3">Insumos Utilizados</h4>
                      <div className="space-y-3">
                        {insumosAsignados.map(item => (
                          <div key={item.id} className="bg-white dark:bg-gray-800 rounded-lg p-3 border border-green-300 dark:border-green-700">
                            <div className="flex items-center justify-between mb-2">
                              <p className="font-medium text-green-900 dark:text-green-300">{item.nombre}</p>
                              <button
                                type="button"
                                onClick={() => handleRemoveInsumo(item.id)}
                                className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 ml-3"
                              >
                                ✕
                              </button>
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                              <div>
                                <label className="text-xs text-green-800 dark:text-green-200">Cantidad</label>
                                <input
                                  type="text"
                                  value={item.cantidad}
                                  onChange={(e) => handleUpdateInsumo(item.id, 'cantidad', e.target.value)}
                                  placeholder="Ej: 5"
                                  className="w-full px-2 py-1 border border-green-300 dark:border-green-600 rounded text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                                />
                              </div>
                              <div>
                                <label className="text-xs text-green-800 dark:text-green-200">Notas</label>
                                <input
                                  type="text"
                                  value={item.notas || ''}
                                  onChange={(e) => handleUpdateInsumo(item.id, 'notas', e.target.value)}
                                  placeholder="Observaciones"
                                  className="w-full px-2 py-1 border border-green-300 dark:border-green-600 rounded text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500"
                                />
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              <div className="flex flex-col gap-2 text-sm font-semibold text-auto-tertiary">
                Observaciones clínicas
                <textarea
                  value={observaciones}
                  onChange={(e) => setObservaciones(e.target.value)}
                  rows={5}
                  placeholder="Describe síntomas, evolución y notas relevantes"
                  className="rounded-3xl border border-auto px-4 py-3 bg-auto-primary text-auto-primary focus:border-sky-500"
                />
              </div>

              {feedback && (
                <div
                  className={`rounded-2xl px-4 py-3 text-sm font-semibold ${
                    feedback.type === "success"
                      ? "bg-emerald-500/20 text-emerald-500"
                      : "bg-rose-500/10 text-rose-500"
                  }`}
                >
                  {feedback.message}
                </div>
              )}

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-3 rounded-2xl bg-gradient-to-r from-sky-500 to-cyan-500 text-white font-semibold shadow-xl disabled:opacity-50"
                >
                  Guardar nota
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default NotaMedicaForm;
