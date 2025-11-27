import { useState, useEffect } from "react";
import axios from "axios";
import FormLayout from "../utilities/Form/FormLayout";
import ConfirmDialog from "../utilities/ConfirmDialog";

interface Paciente {
  pacienteId: number;
  nombre: string;
  apellidop: string;
  apellidom: string;
  numeroExpediente: string;
}

interface MedicamentoAsignado {
  pacienteMedicamentoId: number;
  medicamentoId: number;
  cantidadAsignada: number;
  dosis?: string | null;
  frecuencia?: string | null;
  viaAdministracion?: string | null;
  medicamento: {
    nombre: string;
  };
}

interface InsumoAsignado {
  pacienteInsumoId: number;
  insumoId: number;
  cantidad: number;
  insumo: {
    nombre: string;
  };
}

interface EliminarAsignacionesProps {
  onPacienteSelect?: (pacienteId: string | null) => void;
}

function EliminarAsignaciones({ onPacienteSelect }: EliminarAsignacionesProps) {
  const [selectedPacienteId, setSelectedPacienteId] = useState("");
  const [pacientes, setPacientes] = useState<Paciente[]>([]);
  const [medicamentosAsignados, setMedicamentosAsignados] = useState<MedicamentoAsignado[]>([]);
  const [insumosAsignados, setInsumosAsignados] = useState<InsumoAsignado[]>([]);
  const [selectedMedicamentos, setSelectedMedicamentos] = useState<Set<number>>(new Set());
  const [selectedInsumos, setSelectedInsumos] = useState<Set<number>>(new Set());
  
  const [loading, setLoading] = useState(false);
  const [loadingPacientes, setLoadingPacientes] = useState(false);
  const [alert, setAlert] = useState<{type: string, message: string} | null>(null);
  
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredPacientes, setFilteredPacientes] = useState<Paciente[]>([]);
  
  const [activeTab, setActiveTab] = useState<'medicamentos' | 'insumos'>('medicamentos');
  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean;
    type: "medicamento" | "insumo" | null;
    id: number | null;
    nombre: string;
  }>({
    isOpen: false,
    type: null,
    id: null,
    nombre: "",
  });

  // Cargar pacientes
  useEffect(() => {
    const fetchPacientes = async () => {
      setLoadingPacientes(true);
      try {
        const response = await axios.get("http://localhost:5000/api/pacientes");
        const data = Array.isArray(response.data) ? response.data : response.data.data || [];
        setPacientes(data);
      } catch (error) {} finally {
        setLoadingPacientes(false);
      }
    };
    fetchPacientes();
  }, []);

  // Filtrar pacientes por búsqueda
  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredPacientes([]);
      return;
    }
    const term = searchTerm.toLowerCase();
    const filtered = pacientes.filter(p => 
      p.nombre.toLowerCase().includes(term) ||
      p.apellidop.toLowerCase().includes(term) ||
      p.apellidom.toLowerCase().includes(term) ||
      p.numeroExpediente.toLowerCase().includes(term)
    );
    setFilteredPacientes(filtered);
  }, [searchTerm, pacientes]);

  // Cargar asignaciones cuando cambia el paciente
  useEffect(() => {
    if (!selectedPacienteId) {
      setMedicamentosAsignados([]);
      setInsumosAsignados([]);
      setSelectedMedicamentos(new Set());
      setSelectedInsumos(new Set());
      return;
    }

    const fetchAsignaciones = async () => {
      try {
        // Cargar medicamentos asignados
        const medsRes = await axios.get(`http://localhost:5000/api/medicamentos/asignados/${selectedPacienteId}`);
        const meds = Array.isArray(medsRes.data?.data) ? medsRes.data.data : [];
        setMedicamentosAsignados(meds);
        
        // Cargar insumos asignados
        const insRes = await axios.get(`http://localhost:5000/api/insumos/asignados/${selectedPacienteId}`);
        const ins = Array.isArray(insRes.data?.data) ? insRes.data.data : [];
        setInsumosAsignados(ins);
      } catch (error) {setAlert({ type: "danger", message: "Error al cargar las asignaciones del paciente" });
      }
    };

    fetchAsignaciones();
  }, [selectedPacienteId]);

  // Seleccionar/deseleccionar medicamento
  const toggleMedicamento = (medicamentoId: number) => {
    const newSet = new Set(selectedMedicamentos);
    if (newSet.has(medicamentoId)) {
      newSet.delete(medicamentoId);
    } else {
      newSet.add(medicamentoId);
    }
    setSelectedMedicamentos(newSet);
  };

  // Seleccionar/deseleccionar insumo
  const toggleInsumo = (insumoId: number) => {
    const newSet = new Set(selectedInsumos);
    if (newSet.has(insumoId)) {
      newSet.delete(insumoId);
    } else {
      newSet.add(insumoId);
    }
    setSelectedInsumos(newSet);
  };

  // Mostrar confirmación para eliminación individual
  const confirmDeleteSingle = (
    type: "medicamento" | "insumo",
    id: number,
    nombre: string
  ) => {
    setConfirmDialog({ isOpen: true, type, id, nombre });
  };

  // Eliminar medicamento individual
  const handleDeleteMedicamento = async (medicamentoId: number) => {
    setLoading(true);
    try {
      await axios.delete(
        `http://localhost:5000/api/medicamentos/desasignar/${selectedPacienteId}/${medicamentoId}`
      );

      setMedicamentosAsignados(
        medicamentosAsignados.filter((m) => m.medicamentoId !== medicamentoId)
      );
      setSelectedMedicamentos(
        new Set([...selectedMedicamentos].filter((id) => id !== medicamentoId))
      );

      setAlert({
        type: "success",
        message: "Medicamento eliminado exitosamente",
      });
    } catch (error: any) {
      setAlert({
        type: "danger",
        message:
          error.response?.data?.error || "Error al eliminar medicamento",
      });
    } finally {
      setLoading(false);
      setConfirmDialog({ isOpen: false, type: null, id: null, nombre: "" });
    }
  };

  // Eliminar insumo individual
  const handleDeleteInsumo = async (insumoId: number) => {
    setLoading(true);
    try {
      await axios.delete(
        `http://localhost:5000/api/insumos/desasignar/${selectedPacienteId}/${insumoId}`
      );

      setInsumosAsignados(
        insumosAsignados.filter((i) => i.insumoId !== insumoId)
      );
      setSelectedInsumos(
        new Set([...selectedInsumos].filter((id) => id !== insumoId))
      );

      setAlert({ type: "success", message: "Insumo eliminado exitosamente" });
    } catch (error: any) {
      setAlert({
        type: "danger",
        message: error.response?.data?.error || "Error al eliminar insumo",
      });
    } finally {
      setLoading(false);
      setConfirmDialog({ isOpen: false, type: null, id: null, nombre: "" });
    }
  };

  const confirmDelete = async () => {
    if (!confirmDialog.id || !confirmDialog.type) return;

    if (confirmDialog.type === "medicamento") {
      await handleDeleteMedicamento(confirmDialog.id);
    } else {
      await handleDeleteInsumo(confirmDialog.id);
    }
  };

  const selectedPaciente = pacientes.find(p => p.pacienteId.toString() === selectedPacienteId);

  return (
    <div className="min-h-screen bg-auto-primary pt-20">
      <div className="bg-gradient-to-br from-sky-400/15 via-cyan-300/10 to-sky-400/15 w-full h-full absolute"></div>
      <div className="relative min-h-screen">
        <main className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10 py-10">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <FormLayout title="Eliminar Medicamentos e Insumos Asignados" onSubmit={(e) => e.preventDefault()} widthClass="max-w-4xl">
                <div className="grid grid-cols-1 gap-6">
                  {/* Selección de paciente */}
                  <div className="relative">
                    <label className="block text-sm font-medium text-auto-primary mb-2">
                      Paciente <span className="text-red-500">*</span>
                    </label>
                    <div className="relative mb-2">
                      <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder={loadingPacientes ? "Cargando pacientes..." : "🔍 Buscar por nombre, apellido o expediente..."}
                        disabled={loadingPacientes}
                        className="w-full px-4 py-2 bg-auto-tertiary border border-auto rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 text-auto-primary placeholder-auto-secondary disabled:opacity-50 text-sm"
                      />
                    </div>
                    <select
                      value={selectedPacienteId}
                      onChange={(e) => {
                        setSelectedPacienteId(e.target.value);
                        onPacienteSelect?.(e.target.value || null);
                      }}
                      required
                      className="w-full px-4 py-3 bg-auto-tertiary border border-auto rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500 text-auto-primary disabled:opacity-50"
                      disabled={loadingPacientes}
                      size={searchTerm ? Math.min(filteredPacientes.length + 1, 8) : 1}
                    >
                      <option value="">
                        {loadingPacientes 
                          ? "Cargando pacientes..." 
                          : searchTerm 
                            ? `${filteredPacientes.length} resultado(s) encontrado(s)`
                            : "Seleccionar paciente (usa la búsqueda para filtrar)"
                        }
                      </option>
                      {(searchTerm ? filteredPacientes : pacientes).map(p => (
                        <option key={p.pacienteId} value={p.pacienteId.toString()}>
                          {p.nombre} {p.apellidop} {p.apellidom} - Exp: {p.numeroExpediente}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Información del paciente seleccionado */}
                  {selectedPaciente && (
                    <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-xl p-4">
                      <h4 className="font-semibold text-blue-900 dark:text-blue-300 mb-2">👤 Paciente Seleccionado</h4>
                      <div className="text-sm text-blue-800 dark:text-blue-200">
                        <p><span className="font-medium">Nombre:</span> {selectedPaciente.nombre} {selectedPaciente.apellidop} {selectedPaciente.apellidom}</p>
                        <p><span className="font-medium">Expediente:</span> {selectedPaciente.numeroExpediente}</p>
                      </div>
                    </div>
                  )}

                  {/* Tabs para Medicamentos e Insumos */}
                  {selectedPacienteId && (
                    <>
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
                          {medicamentosAsignados.length === 0 ? (
                            <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 rounded-xl p-4 text-center">
                              <p className="text-yellow-800 dark:text-yellow-200">No hay medicamentos asignados a este paciente</p>
                            </div>
                          ) : (
                            <>
                              <div className="flex justify-between items-center">
                                <p className="text-sm text-auto-secondary">
                                  {selectedMedicamentos.size} de {medicamentosAsignados.length} seleccionado(s)
                                </p>
                                {selectedMedicamentos.size > 0 && (
                                  <button
                                    type="button"
                                    onClick={handleDeleteSelectedMedicamentos}
                                    disabled={loading}
                                    className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition text-sm disabled:opacity-50"
                                  >
                                    🗑️ Eliminar Seleccionados ({selectedMedicamentos.size})
                                  </button>
                                )}
                              </div>

                              {medicamentosAsignados.map(med => (
                                <div 
                                  key={med.medicamentoId} 
                                  className={`border rounded-xl p-4 transition-colors ${
                                    selectedMedicamentos.has(med.medicamentoId)
                                      ? 'bg-red-50 dark:bg-red-900/20 border-red-300 dark:border-red-700'
                                      : 'bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-700'
                                  }`}
                                >
                                  <div className="flex items-start justify-between">
                                    <div className="flex items-start gap-3 flex-1">
                                      <input
                                        type="checkbox"
                                        checked={selectedMedicamentos.has(med.medicamentoId)}
                                        onChange={() => toggleMedicamento(med.medicamentoId)}
                                        className="mt-1 w-5 h-5 text-red-500 rounded focus:ring-red-500"
                                      />
                                      <div className="flex-1">
                                        <h4 className="font-semibold text-purple-900 dark:text-purple-300 mb-2">
                                          {med.medicamento.nombre}
                                        </h4>
                                        <div className="grid grid-cols-2 gap-2 text-sm">
                                          <p className="text-purple-800 dark:text-purple-200">
                                            <span className="font-medium">Cantidad:</span> {med.cantidadAsignada}
                                          </p>
                                          <p className="text-purple-800 dark:text-purple-200">
                                            <span className="font-medium">Dosis:</span> {med.dosis || "No especificada"}
                                          </p>
                                          <p className="text-purple-800 dark:text-purple-200">
                                            <span className="font-medium">Frecuencia:</span> {med.frecuencia || "No especificada"}
                                          </p>
                                          <p className="text-purple-800 dark:text-purple-200">
                                            <span className="font-medium">Vía:</span> {med.viaAdministracion || "No especificada"}
                                          </p>
                                        </div>
                                      </div>
                                    </div>
                                    <button
                                      type="button"
                                      onClick={() => confirmDeleteSingle('medicamento', med.medicamentoId, med.medicamento.nombre)}
                                      disabled={loading}
                                      className="ml-3 px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600 transition text-sm disabled:opacity-50"
                                    >
                                      🗑️ Eliminar
                                    </button>
                                  </div>
                                </div>
                              ))}
                            </>
                          )}
                        </div>
                      )}

                      {/* Contenido de Insumos */}
                      {activeTab === 'insumos' && (
                        <div className="space-y-4">
                          {insumosAsignados.length === 0 ? (
                            <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 rounded-xl p-4 text-center">
                              <p className="text-yellow-800 dark:text-yellow-200">No hay insumos asignados a este paciente</p>
                            </div>
                          ) : (
                            <>
                              <div className="flex justify-between items-center">
                                <p className="text-sm text-auto-secondary">
                                  {selectedInsumos.size} de {insumosAsignados.length} seleccionado(s)
                                </p>
                                {selectedInsumos.size > 0 && (
                                  <button
                                    type="button"
                                    onClick={handleDeleteSelectedInsumos}
                                    disabled={loading}
                                    className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition text-sm disabled:opacity-50"
                                  >
                                    🗑️ Eliminar Seleccionados ({selectedInsumos.size})
                                  </button>
                                )}
                              </div>

                              {insumosAsignados.map(ins => (
                                <div 
                                  key={ins.insumoId} 
                                  className={`border rounded-xl p-4 transition-colors ${
                                    selectedInsumos.has(ins.insumoId)
                                      ? 'bg-red-50 dark:bg-red-900/20 border-red-300 dark:border-red-700'
                                      : 'bg-cyan-50 dark:bg-cyan-900/20 border-cyan-200 dark:border-cyan-700'
                                  }`}
                                >
                                  <div className="flex items-start justify-between">
                                    <div className="flex items-start gap-3 flex-1">
                                      <input
                                        type="checkbox"
                                        checked={selectedInsumos.has(ins.insumoId)}
                                        onChange={() => toggleInsumo(ins.insumoId)}
                                        className="mt-1 w-5 h-5 text-red-500 rounded focus:ring-red-500"
                                      />
                                      <div className="flex-1">
                                        <h4 className="font-semibold text-cyan-900 dark:text-cyan-300 mb-2">
                                          {ins.insumo.nombre}
                                        </h4>
                                        <p className="text-sm text-cyan-800 dark:text-cyan-200">
                                          <span className="font-medium">Cantidad:</span> {ins.cantidad}
                                        </p>
                                      </div>
                                    </div>
                                    <button
                                      type="button"
                                      onClick={() => confirmDeleteSingle('insumo', ins.insumoId, ins.insumo.nombre)}
                                      disabled={loading}
                                      className="ml-3 px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600 transition text-sm disabled:opacity-50"
                                    >
                                      🗑️ Eliminar
                                    </button>
                                  </div>
                                </div>
                              ))}
                            </>
                          )}
                        </div>
                      )}
                    </>
                  )}
                </div>

                {alert && (
                  <div className={`mt-4 p-4 rounded-xl ${
                    alert.type === 'success' 
                      ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 border border-green-300 dark:border-green-700' 
                      : 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200 border border-red-300 dark:border-red-700'
                  }`}>
                    {alert.message}
                  </div>
                )}
              </FormLayout>
            </div>

            <aside className="lg:col-span-1">
              <div className="bg-auto-secondary backdrop-blur-sm border border-auto rounded-3xl p-6 shadow-lg sticky top-24">
                <h3 className="text-lg font-semibold text-auto-primary mb-3">
                  <svg className="w-6 h-6 inline-block mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Información
                </h3>
                <div className="space-y-3 text-sm text-auto-secondary">
                  <p>
                    <span className="font-semibold">Eliminar Asignaciones:</span> Elimina medicamentos e insumos asignados a un paciente.
                  </p>
                  <p>
                    Puedes eliminar elementos individualmente o seleccionar varios para eliminar en lote.
                  </p>
                  <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-700">
                    <p className="font-semibold text-red-900 dark:text-red-300 mb-1">⚠️ Advertencia</p>
                    <p className="text-red-800 dark:text-red-200 text-xs">Esta acción no se puede deshacer</p>
                  </div>
                  {medicamentosAsignados.length > 0 && (
                    <div className="mt-4 p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-700">
                      <p className="font-semibold text-purple-900 dark:text-purple-300 mb-1">💊 Medicamentos: {medicamentosAsignados.length}</p>
                    </div>
                  )}
                  {insumosAsignados.length > 0 && (
                    <div className="mt-4 p-3 bg-cyan-50 dark:bg-cyan-900/20 rounded-lg border border-cyan-200 dark:border-cyan-700">
                      <p className="font-semibold text-cyan-900 dark:text-cyan-300 mb-1">🏥 Insumos: {insumosAsignados.length}</p>
                    </div>
                  )}
                </div>
              </div>
            </aside>
          </div>
        </main>
      </div>

      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        title={`¿Eliminar ${
          confirmDialog.type === "medicamento" ? "Medicamento" : "Insumo"
        }?`}
        message={`¿Estás seguro de que deseas eliminar "${confirmDialog.nombre}" de las asignaciones del paciente?`}
        details={
          selectedPaciente
            ? [
                {
                  label: "Paciente",
                  value: `${selectedPaciente.nombre} ${selectedPaciente.apellidop} ${selectedPaciente.apellidom}`,
                },
                {
                  label: "Expediente",
                  value: selectedPaciente.numeroExpediente,
                },
              ]
            : []
        }
        confirmLabel={`Eliminar ${
          confirmDialog.type === "medicamento" ? "Medicamento" : "Insumo"
        }`}
        cancelLabel="Cancelar"
        onConfirm={confirmDelete}
        onCancel={() =>
          setConfirmDialog({ isOpen: false, type: null, id: null, nombre: "" })
        }
        loading={loading}
        type="danger"
      />
    </div>
  );
}

export default EliminarAsignaciones;
