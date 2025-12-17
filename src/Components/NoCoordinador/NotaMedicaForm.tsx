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
}

function NotaMedicaForm() {
  const { pacienteId } = useParams<{ pacienteId: string }>();
  const navigate = useNavigate();
  
  const [paciente, setPaciente] = useState<Paciente | null>(null);
  const [servicio, setServicio] = useState<Servicio | null>(null);
  const [hospital, setHospital] = useState<Hospital | null>(null);
  const [enfermeroId, setEnfermeroId] = useState("");
  const [observaciones, setObservaciones] = useState("");
  const [observacionesAnteriores, setObservacionesAnteriores] = useState<Array<{fecha: string, texto: string, enfermero: string}>>([]);
  const [nombreEnfermeroAlta, setNombreEnfermeroAlta] = useState("");
  const [nombreEnfermeroAsignado, setNombreEnfermeroAsignado] = useState("");
  
  const [medicamentosDisponibles, setMedicamentosDisponibles] = useState<Medicamento[]>([]);
  const [insumosDisponibles, setInsumosDisponibles] = useState<Insumo[]>([]);
  const [medicamentosAsignados, setMedicamentosAsignados] = useState<MedicamentoAsignado[]>([]);
  const [insumosAsignados, setInsumosAsignados] = useState<InsumoAsignado[]>([]);
  
  const [loadingPaciente, setLoadingPaciente] = useState(false);
  const [loadingMedicamentos, setLoadingMedicamentos] = useState(false);
  const [loadingInsumos, setLoadingInsumos] = useState(false);
  const [activeAction, setActiveAction] = useState<'agregar' | 'actualizar' | 'eliminar' | null>(null);
  const [activeTab, setActiveTab] = useState<'medicamentos' | 'insumos'>('medicamentos');
  
  const [feedback, setFeedback] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [lastCreatedNoteId, setLastCreatedNoteId] = useState<number | null>(null);

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
        }

        // Cargar observaciones anteriores del paciente
        try {
          const notasRes = await axios.get(`http://localhost:5000/api/notas-medicas/paciente/${pacienteId}`);
          const notasData = notasRes.data.success ? notasRes.data.data : notasRes.data;
          if (Array.isArray(notasData) && notasData.length > 0) {
            // Ordenar por fecha más reciente
            const notasOrdenadas = notasData.sort((a: any, b: any) => 
              new Date(b.fechaHora).getTime() - new Date(a.fechaHora).getTime()
            );
            const historial = notasOrdenadas.map((nota: any) => ({
              fecha: new Date(nota.fechaHora).toLocaleString('es-MX', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              }),
              texto: nota.observaciones || 'Sin observaciones',
              enfermero: nota.enfermero ? `${nota.enfermero.nombre} ${nota.enfermero.apellidoPaterno}` : 'Desconocido'
            }));
            setObservacionesAnteriores(historial);
          }
        } catch (error) {
        }
      } catch (error) {
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
        cantidad: "1"
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
      const response = await axios.post("http://localhost:5000/api/notas-medicas", {
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
          cantidad: ins.cantidad
        })),
      });
      
      if (response.data?.data?.registroId) {
        setLastCreatedNoteId(response.data.data.registroId);
      }
      
      setFeedback({
        type: "success",
        message: "Nota médica guardada correctamente.",
      });
      
      setObservaciones("");
      setMedicamentosAsignados([]);
      setInsumosAsignados([]);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Error desconocido";
      setFeedback({ type: "error", message });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleExportPDF = async () => {
    if (!lastCreatedNoteId) {
      setFeedback({
        type: "error",
        message: "No hay nota médica guardada para exportar. Por favor guarda la nota primero.",
      });
      return;
    }

    try {
      const response = await axios.get(
        `http://localhost:5000/api/notas-medicas/pdf/${lastCreatedNoteId}`,
        { responseType: 'blob' }
      );
      
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `nota_medica_${paciente?.numeroExpediente}_${new Date().toISOString().split('T')[0]}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      setFeedback({
        type: "success",
        message: "PDF exportado correctamente.",
      });
      
      setTimeout(() => {
        navigate("/NoCoordinador/mis-pacientes");
      }, 2000);
    } catch (error) {
      setFeedback({
        type: "error",
        message: "Error al exportar el PDF. Por favor intenta de nuevo.",
      });
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
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

          {/* Grid de 2 columnas: Formulario principal + Historial */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Columna principal: Formulario (2/3) */}
            <div className="lg:col-span-2">
              <div className="bg-auto-secondary backdrop-blur-sm border border-auto rounded-3xl shadow-2xl p-8 space-y-8">
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
              {/* Panel de Opciones: Agregar, Actualizar, Eliminar */}
              <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border-2 border-purple-200 dark:border-purple-700 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-purple-900 dark:text-purple-300 mb-4">
                  🔧 Gestión de Medicamentos e Insumos
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <button
                    type="button"
                    onClick={() => setActiveAction(activeAction === 'agregar' ? null : 'agregar')}
                    className={`px-6 py-4 rounded-lg font-semibold transition-all duration-200 ${
                      activeAction === 'agregar'
                        ? 'bg-green-500 text-white shadow-lg scale-105'
                        : 'bg-white dark:bg-gray-800 text-green-700 dark:text-green-400 border-2 border-green-300 dark:border-green-600 hover:bg-green-50 dark:hover:bg-green-900/20'
                    }`}
                  >
                    ➕ Agregar
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveAction(activeAction === 'actualizar' ? null : 'actualizar')}
                    className={`px-6 py-4 rounded-lg font-semibold transition-all duration-200 ${
                      activeAction === 'actualizar'
                        ? 'bg-blue-500 text-white shadow-lg scale-105'
                        : 'bg-white dark:bg-gray-800 text-blue-700 dark:text-blue-400 border-2 border-blue-300 dark:border-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20'
                    }`}
                  >
                    ✏️ Actualizar
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveAction(activeAction === 'eliminar' ? null : 'eliminar')}
                    className={`px-6 py-4 rounded-lg font-semibold transition-all duration-200 ${
                      activeAction === 'eliminar'
                        ? 'bg-red-500 text-white shadow-lg scale-105'
                        : 'bg-white dark:bg-gray-800 text-red-700 dark:text-red-400 border-2 border-red-300 dark:border-red-600 hover:bg-red-50 dark:hover:bg-red-900/20'
                    }`}
                  >
                    🗑️ Eliminar
                  </button>
                </div>
              </div>

              {/* Contenido desplegable según la acción seleccionada */}
              {activeAction && (
                <div className="bg-auto-secondary border-2 border-auto rounded-xl p-6 space-y-4 animate-fade-in">
                  {/* Tabs para Medicamentos e Insumos */}
                  <div className="flex gap-2 border-b border-auto pb-2">
                    <button
                      type="button"
                      onClick={() => setActiveTab('medicamentos')}
                      className={`px-6 py-3 font-medium transition-all duration-200 rounded-t-lg ${
                        activeTab === 'medicamentos'
                          ? 'bg-purple-500 text-white border-b-2 border-purple-700'
                          : 'text-auto-secondary hover:text-auto-primary hover:bg-auto/50'
                      }`}
                    >
                      💊 Medicamentos ({medicamentosAsignados.length})
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveTab('insumos')}
                      className={`px-6 py-3 font-medium transition-all duration-200 rounded-t-lg ${
                        activeTab === 'insumos'
                          ? 'bg-cyan-500 text-white border-b-2 border-cyan-700'
                          : 'text-auto-secondary hover:text-auto-primary hover:bg-auto/50'
                      }`}
                    >
                      🏥 Insumos ({insumosAsignados.length})
                    </button>
                  </div>

                  {/* AGREGAR - Contenido de Medicamentos */}
                  {activeAction === 'agregar' && activeTab === 'medicamentos' && (
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
                    </div>
                  )}

                  {/* AGREGAR - Contenido de Insumos */}
                  {activeAction === 'agregar' && activeTab === 'insumos' && (
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
                    </div>
                  )}

                  {/* ACTUALIZAR - Contenido de Medicamentos */}
                  {activeAction === 'actualizar' && activeTab === 'medicamentos' && (
                    <div className="space-y-4">
                      {medicamentosAsignados.length > 0 ? (
                        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700 rounded-xl p-4">
                          <div className="flex items-center justify-between mb-3">
                            <h4 className="font-semibold text-green-900 dark:text-green-300">
                              Medicamentos Prescritos ({medicamentosAsignados.length})
                            </h4>
                            <span className="text-xs text-green-700 dark:text-green-400 bg-green-100 dark:bg-green-900/40 px-2 py-1 rounded">
                              💊 {medicamentosAsignados.length} {medicamentosAsignados.length === 1 ? 'medicamento' : 'medicamentos'}
                            </span>
                          </div>
                          <div className="space-y-3">
                            {medicamentosAsignados.map(item => (
                              <div key={item.id} className="bg-white dark:bg-gray-800 rounded-lg p-4 border-2 border-green-300 dark:border-green-700 hover:shadow-md transition-shadow">
                                <div className="flex items-center gap-2 mb-3">
                                  <span className="bg-green-500 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold">
                                    💊
                                  </span>
                                  <p className="font-bold text-green-900 dark:text-green-300">{item.nombre}</p>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                  <div>
                                    <label className="text-xs font-semibold text-green-800 dark:text-green-200 mb-1 block">Cantidad *</label>
                                    <input
                                      type="number"
                                      min="1"
                                      value={item.cantidad}
                                      onChange={(e) => handleUpdateMedicamento(item.id, 'cantidad', e.target.value)}
                                      placeholder="Ej: 2"
                                      className="w-full px-3 py-2 border-2 border-green-300 dark:border-green-600 rounded-lg text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:border-green-500 focus:ring-2 focus:ring-green-500/20"
                                    />
                                  </div>
                                  <div>
                                    <label className="text-xs font-semibold text-green-800 dark:text-green-200 mb-1 block">Dosis</label>
                                    <input
                                      type="text"
                                      value={item.dosis || ''}
                                      onChange={(e) => handleUpdateMedicamento(item.id, 'dosis', e.target.value)}
                                      placeholder="Ej: 500mg"
                                      className="w-full px-3 py-2 border-2 border-green-300 dark:border-green-600 rounded-lg text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:border-green-500 focus:ring-2 focus:ring-green-500/20"
                                    />
                                  </div>
                                  <div>
                                    <label className="text-xs font-semibold text-green-800 dark:text-green-200 mb-1 block">Frecuencia</label>
                                    <input
                                      type="text"
                                      value={item.frecuencia || ''}
                                      onChange={(e) => handleUpdateMedicamento(item.id, 'frecuencia', e.target.value)}
                                      placeholder="Ej: cada 8 horas"
                                      className="w-full px-3 py-2 border-2 border-green-300 dark:border-green-600 rounded-lg text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:border-green-500 focus:ring-2 focus:ring-green-500/20"
                                    />
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      ) : (
                        <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700 rounded-xl p-6 text-center">
                          <p className="text-amber-700 dark:text-amber-300">No hay medicamentos asignados para actualizar</p>
                          <p className="text-sm text-amber-600 dark:text-amber-400 mt-2">Primero agrega medicamentos desde la opción "Agregar"</p>
                        </div>
                      )}
                    </div>
                  )}

                  {/* ACTUALIZAR - Contenido de Insumos */}
                  {activeAction === 'actualizar' && activeTab === 'insumos' && (
                    <div className="space-y-4">
                      {insumosAsignados.length > 0 ? (
                        <div className="bg-cyan-50 dark:bg-cyan-900/20 border border-cyan-200 dark:border-cyan-700 rounded-xl p-4">
                          <div className="flex items-center justify-between mb-3">
                            <h4 className="font-semibold text-cyan-900 dark:text-cyan-300">
                              Insumos Utilizados ({insumosAsignados.length})
                            </h4>
                            <span className="text-xs text-cyan-700 dark:text-cyan-400 bg-cyan-100 dark:bg-cyan-900/40 px-2 py-1 rounded">
                              🏥 {insumosAsignados.length} {insumosAsignados.length === 1 ? 'insumo' : 'insumos'}
                            </span>
                          </div>
                          <div className="space-y-3">
                            {insumosAsignados.map(item => (
                              <div key={item.id} className="bg-white dark:bg-gray-800 rounded-lg p-4 border-2 border-cyan-300 dark:border-cyan-700 hover:shadow-md transition-shadow">
                                <div className="flex items-center gap-2 mb-3">
                                  <span className="bg-cyan-500 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold">
                                    🏥
                                  </span>
                                  <p className="font-bold text-cyan-900 dark:text-cyan-300">{item.nombre}</p>
                                </div>
                                <div>
                                  <label className="text-xs font-semibold text-cyan-800 dark:text-cyan-200 mb-1 block">Cantidad *</label>
                                  <input
                                    type="number"
                                    min="1"
                                    value={item.cantidad}
                                    onChange={(e) => handleUpdateInsumo(item.id, 'cantidad', e.target.value)}
                                    placeholder="Ej: 5"
                                    className="w-full px-3 py-2 border-2 border-cyan-300 dark:border-cyan-600 rounded-lg text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20"
                                  />
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      ) : (
                        <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700 rounded-xl p-6 text-center">
                          <p className="text-amber-700 dark:text-amber-300">No hay insumos asignados para actualizar</p>
                          <p className="text-sm text-amber-600 dark:text-amber-400 mt-2">Primero agrega insumos desde la opción "Agregar"</p>
                        </div>
                      )}
                    </div>
                  )}

                  {/* ELIMINAR - Contenido de Medicamentos */}
                  {activeAction === 'eliminar' && activeTab === 'medicamentos' && (
                    <div className="space-y-4">
                      {medicamentosAsignados.length > 0 ? (
                        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-xl p-4">
                          <div className="flex items-center justify-between mb-3">
                            <h4 className="font-semibold text-red-900 dark:text-red-300">
                              Eliminar Medicamentos ({medicamentosAsignados.length})
                            </h4>
                            <span className="text-xs text-red-700 dark:text-red-400 bg-red-100 dark:bg-red-900/40 px-2 py-1 rounded">
                              💊 {medicamentosAsignados.length} {medicamentosAsignados.length === 1 ? 'medicamento' : 'medicamentos'}
                            </span>
                          </div>
                          <div className="space-y-3">
                            {medicamentosAsignados.map(item => (
                              <div key={item.id} className="bg-white dark:bg-gray-800 rounded-lg p-4 border-2 border-red-300 dark:border-red-700 hover:shadow-md transition-shadow">
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-2">
                                    <span className="bg-red-500 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold">
                                      💊
                                    </span>
                                    <div>
                                      <p className="font-bold text-red-900 dark:text-red-300">{item.nombre}</p>
                                      <p className="text-xs text-gray-600 dark:text-gray-400">
                                        Cantidad: {item.cantidad} | Dosis: {item.dosis || 'N/A'} | Frecuencia: {item.frecuencia || 'N/A'}
                                      </p>
                                    </div>
                                  </div>
                                  <button
                                    type="button"
                                    onClick={() => handleRemoveMedicamento(item.id)}
                                    className="flex items-center gap-1 px-3 py-1.5 bg-red-500 hover:bg-red-600 text-white rounded-lg text-xs font-semibold transition-colors shadow-sm"
                                    title="Eliminar medicamento"
                                  >
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                                      <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                                    </svg>
                                    Eliminar
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      ) : (
                        <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700 rounded-xl p-6 text-center">
                          <p className="text-amber-700 dark:text-amber-300">No hay medicamentos asignados para eliminar</p>
                          <p className="text-sm text-amber-600 dark:text-amber-400 mt-2">Primero agrega medicamentos desde la opción "Agregar"</p>
                        </div>
                      )}
                    </div>
                  )}

                  {/* ELIMINAR - Contenido de Insumos */}
                  {activeAction === 'eliminar' && activeTab === 'insumos' && (
                    <div className="space-y-4">
                      {insumosAsignados.length > 0 ? (
                        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-xl p-4">
                          <div className="flex items-center justify-between mb-3">
                            <h4 className="font-semibold text-red-900 dark:text-red-300">
                              Eliminar Insumos ({insumosAsignados.length})
                            </h4>
                            <span className="text-xs text-red-700 dark:text-red-400 bg-red-100 dark:bg-red-900/40 px-2 py-1 rounded">
                              🏥 {insumosAsignados.length} {insumosAsignados.length === 1 ? 'insumo' : 'insumos'}
                            </span>
                          </div>
                          <div className="space-y-3">
                            {insumosAsignados.map(item => (
                              <div key={item.id} className="bg-white dark:bg-gray-800 rounded-lg p-4 border-2 border-red-300 dark:border-red-700 hover:shadow-md transition-shadow">
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-2">
                                    <span className="bg-red-500 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold">
                                      🏥
                                    </span>
                                    <div>
                                      <p className="font-bold text-red-900 dark:text-red-300">{item.nombre}</p>
                                      <p className="text-xs text-gray-600 dark:text-gray-400">
                                        Cantidad: {item.cantidad}
                                      </p>
                                    </div>
                                  </div>
                                  <button
                                    type="button"
                                    onClick={() => handleRemoveInsumo(item.id)}
                                    className="flex items-center gap-1 px-3 py-1.5 bg-red-500 hover:bg-red-600 text-white rounded-lg text-xs font-semibold transition-colors shadow-sm"
                                    title="Eliminar insumo"
                                  >
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                                      <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                                    </svg>
                                    Eliminar
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      ) : (
                        <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700 rounded-xl p-6 text-center">
                          <p className="text-amber-700 dark:text-amber-300">No hay insumos asignados para eliminar</p>
                          <p className="text-sm text-amber-600 dark:text-amber-400 mt-2">Primero agrega insumos desde la opción "Agregar"</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* Campo para Nuevas Observaciones */}
              <div className="space-y-2">
                <h3 className="text-lg font-semibold text-auto-primary flex items-center gap-2">
                  📋 Nueva Observación Clínica
                </h3>
                <div className="bg-gradient-to-br from-sky-50 to-cyan-50 dark:from-sky-900/20 dark:to-cyan-900/20 border-2 border-sky-300 dark:border-sky-700 rounded-xl p-5">
                  <textarea
                    value={observaciones}
                    onChange={(e) => setObservaciones(e.target.value)}
                    rows={6}
                    placeholder="Escribe aquí las nuevas observaciones clínicas del paciente...\n\nEjemplo:\n- Síntomas actuales\n- Evolución del tratamiento\n- Signos vitales relevantes\n- Indicaciones especiales"
                    className="w-full rounded-lg border-2 border-sky-200 dark:border-sky-600 px-4 py-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 transition-all resize-none"
                  />
                  <p className="text-xs text-sky-700 dark:text-sky-400 mt-2 flex items-center gap-1">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
                    </svg>
                    Esta observación se agregará al historial médico del paciente
                  </p>
                </div>
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

              <div className="flex justify-end gap-3">
                {lastCreatedNoteId && (
                  <button
                    type="button"
                    onClick={handleExportPDF}
                    className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-red-500 to-pink-500 text-white font-semibold shadow-xl hover:from-red-600 hover:to-pink-600 transition-all"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                    </svg>
                    Exportar PDF
                  </button>
                )}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-3 rounded-2xl bg-gradient-to-r from-sky-500 to-cyan-500 text-white font-semibold shadow-xl disabled:opacity-50 hover:from-sky-600 hover:to-cyan-600 transition-all"
                >
                  {isSubmitting ? 'Guardando...' : 'Guardar nota'}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Columna lateral: Historial de Observaciones (1/3) */}
        <div className="lg:col-span-1">
          <div className="bg-auto-secondary backdrop-blur-sm border border-auto rounded-3xl shadow-2xl p-6 sticky top-24">
            <div className="flex items-center gap-2 mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-amber-600 dark:text-amber-400">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h3 className="text-xl font-bold text-auto-primary">
                Historial Médico
              </h3>
            </div>

            {observacionesAnteriores.length > 0 ? (
              <div className="space-y-4">
                <p className="text-sm text-auto-secondary">
                  {observacionesAnteriores.length} {observacionesAnteriores.length === 1 ? 'observación registrada' : 'observaciones registradas'}
                </p>
                <div className="max-h-[calc(100vh-12rem)] overflow-y-auto space-y-3 pr-2">
                  {observacionesAnteriores.map((obs, idx) => (
                    <div key={idx} className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 border border-amber-200 dark:border-amber-700 rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between mb-2 gap-2">
                        <span className="text-xs font-medium text-amber-700 dark:text-amber-400 bg-amber-100 dark:bg-amber-900/40 px-2 py-1 rounded flex-shrink-0">
                          {obs.fecha}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 text-xs text-amber-600 dark:text-amber-400 mb-2">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                        </svg>
                        {obs.enfermero}
                      </div>
                      <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap leading-relaxed">
                        {obs.texto}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-16 h-16 mx-auto text-auto-tertiary mb-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                </svg>
                <p className="text-auto-secondary text-sm">
                  No hay observaciones previas
                </p>
                <p className="text-auto-tertiary text-xs mt-2">
                  Esta será la primera nota médica del paciente
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
    </div>
    </div>
  );
}

export default NotaMedicaForm;

