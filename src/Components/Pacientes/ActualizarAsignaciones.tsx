import { useState, useEffect } from "react";
import axios from "axios";
import FormLayout from "../utilities/Form/FormLayout";

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

function ActualizarAsignaciones() {
  const [selectedPacienteId, setSelectedPacienteId] = useState("");
  const [pacientes, setPacientes] = useState<Paciente[]>([]);
  const [medicamentosAsignados, setMedicamentosAsignados] = useState<MedicamentoAsignado[]>([]);
  const [insumosAsignados, setInsumosAsignados] = useState<InsumoAsignado[]>([]);
  const [editingMedicamentos, setEditingMedicamentos] = useState<{[key: number]: MedicamentoAsignado}>({});
  const [editingInsumos, setEditingInsumos] = useState<{[key: number]: InsumoAsignado}>({});
  
  const [loading, setLoading] = useState(false);
  const [loadingPacientes, setLoadingPacientes] = useState(false);
  const [alert, setAlert] = useState<{type: string, message: string} | null>(null);
  
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredPacientes, setFilteredPacientes] = useState<Paciente[]>([]);
  
  const [activeTab, setActiveTab] = useState<'medicamentos' | 'insumos'>('medicamentos');

  // Cargar pacientes
  useEffect(() => {
    const fetchPacientes = async () => {
      setLoadingPacientes(true);
      try {
        const response = await axios.get("http://localhost:5000/api/pacientes");
        const data = Array.isArray(response.data) ? response.data : response.data.data || [];
        setPacientes(data);
      } catch (error) {
        console.error("Error al cargar pacientes:", error);
      } finally {
        setLoadingPacientes(false);
      }
    };
    fetchPacientes();
  }, []);

  // Filtro de pacientes
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

  // Cargar medicamentos e insumos asignados cuando cambia el paciente
  useEffect(() => {
    if (!selectedPacienteId) {
      setMedicamentosAsignados([]);
      setInsumosAsignados([]);
      setEditingMedicamentos({});
      setEditingInsumos({});
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
      } catch (error) {
        console.error("Error al cargar asignaciones:", error);
        setAlert({ type: "danger", message: "Error al cargar las asignaciones del paciente" });
      }
    };

    fetchAsignaciones();
  }, [selectedPacienteId]);

  // Iniciar edición de medicamento
  const handleEditMedicamento = (med: MedicamentoAsignado) => {
    setEditingMedicamentos({
      ...editingMedicamentos,
      [med.medicamentoId]: { ...med }
    });
  };

  // Iniciar edición de insumo
  const handleEditInsumo = (ins: InsumoAsignado) => {
    setEditingInsumos({
      ...editingInsumos,
      [ins.insumoId]: { ...ins }
    });
  };

  // Cancelar edición
  const handleCancelEdit = (type: 'medicamento' | 'insumo', id: number) => {
    if (type === 'medicamento') {
      const newEditing = { ...editingMedicamentos };
      delete newEditing[id];
      setEditingMedicamentos(newEditing);
    } else {
      const newEditing = { ...editingInsumos };
      delete newEditing[id];
      setEditingInsumos(newEditing);
    }
  };

  // Guardar cambios de medicamento
  const handleSaveMedicamento = async (medicamentoId: number) => {
    const editedMed = editingMedicamentos[medicamentoId];
    if (!editedMed) return;

    setLoading(true);
    try {
      await axios.post("http://localhost:5000/api/medicamentos/asignar", {
        pacienteId: parseInt(selectedPacienteId),
        reemplazar: false,
        medicamentos: [{
          medicamentoId: editedMed.medicamentoId,
          cantidad: editedMed.cantidadAsignada,
          dosis: editedMed.dosis?.trim() || null,
          frecuencia: editedMed.frecuencia?.trim() || null,
          viaAdministracion: editedMed.viaAdministracion?.trim() || null,
        }]
      });

      // Recargar medicamentos asignados desde el servidor
      const medsRes = await axios.get(`http://localhost:5000/api/medicamentos/asignados/${selectedPacienteId}`);
      const meds = Array.isArray(medsRes.data?.data) ? medsRes.data.data : [];
      setMedicamentosAsignados(meds);

      // Limpiar estado de edición
      handleCancelEdit('medicamento', medicamentoId);

      setAlert({ type: "success", message: "Medicamento actualizado exitosamente" });
    } catch (error: any) {
      setAlert({ 
        type: "danger", 
        message: error.response?.data?.error || "Error al actualizar medicamento" 
      });
    } finally {
      setLoading(false);
    }
  };

  // Guardar cambios de insumo
  const handleSaveInsumo = async (insumoId: number) => {
    const editedIns = editingInsumos[insumoId];
    if (!editedIns) return;

    setLoading(true);
    try {
      await axios.post("http://localhost:5000/api/insumos/asignar", {
        pacienteId: parseInt(selectedPacienteId),
        reemplazar: false,
        insumos: [{
          insumoId: editedIns.insumoId,
          cantidad: editedIns.cantidad,
        }]
      });

      // Recargar insumos asignados desde el servidor
      const insRes = await axios.get(`http://localhost:5000/api/insumos/asignados/${selectedPacienteId}`);
      const ins = Array.isArray(insRes.data?.data) ? insRes.data.data : [];
      setInsumosAsignados(ins);

      // Limpiar estado de edición
      handleCancelEdit('insumo', insumoId);

      setAlert({ type: "success", message: "Insumo actualizado exitosamente" });
    } catch (error: any) {
      setAlert({ 
        type: "danger", 
        message: error.response?.data?.error || "Error al actualizar insumo" 
      });
    } finally {
      setLoading(false);
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
              <FormLayout title="Actualizar Medicamentos e Insumos Asignados" onSubmit={(e) => e.preventDefault()} widthClass="max-w-4xl">
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
                      onChange={(e) => setSelectedPacienteId(e.target.value)}
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
                            medicamentosAsignados.map(med => {
                              const isEditing = !!editingMedicamentos[med.medicamentoId];
                              const editData = editingMedicamentos[med.medicamentoId] || med;

                              return (
                                <div key={med.medicamentoId} className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-700 rounded-xl p-4">
                                  <div className="flex items-center justify-between mb-3">
                                    <h4 className="font-semibold text-purple-900 dark:text-purple-300">{med.medicamento.nombre}</h4>
                                    {!isEditing && (
                                      <button
                                        type="button"
                                        onClick={() => handleEditMedicamento(med)}
                                        className="px-3 py-1 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition text-sm"
                                      >
                                        ✏️ Editar
                                      </button>
                                    )}
                                  </div>

                                  <div className="grid grid-cols-2 gap-3">
                                    <div>
                                      <label className="text-xs text-purple-800 dark:text-purple-200">Cantidad</label>
                                      <input
                                        type="number"
                                        min="1"
                                        value={editData.cantidadAsignada}
                                        onChange={(e) => {
                                          if (isEditing) {
                                            setEditingMedicamentos({
                                              ...editingMedicamentos,
                                              [med.medicamentoId]: {
                                                ...editData,
                                                cantidadAsignada: parseInt(e.target.value) || 1
                                              }
                                            });
                                          }
                                        }}
                                        disabled={!isEditing}
                                        className="w-full px-2 py-1 border border-purple-300 dark:border-purple-600 rounded text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 disabled:opacity-60"
                                      />
                                    </div>
                                    <div>
                                      <label className="text-xs text-purple-800 dark:text-purple-200">Dosis</label>
                                      <input
                                        type="text"
                                        value={editData.dosis || ''}
                                        onChange={(e) => {
                                          if (isEditing) {
                                            setEditingMedicamentos({
                                              ...editingMedicamentos,
                                              [med.medicamentoId]: {
                                                ...editData,
                                                dosis: e.target.value
                                              }
                                            });
                                          }
                                        }}
                                        disabled={!isEditing}
                                        placeholder="ej: 500mg"
                                        className="w-full px-2 py-1 border border-purple-300 dark:border-purple-600 rounded text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 disabled:opacity-60 placeholder-gray-400 dark:placeholder-gray-500"
                                      />
                                    </div>
                                    <div>
                                      <label className="text-xs text-purple-800 dark:text-purple-200">Frecuencia</label>
                                      <input
                                        type="text"
                                        value={editData.frecuencia || ''}
                                        onChange={(e) => {
                                          if (isEditing) {
                                            setEditingMedicamentos({
                                              ...editingMedicamentos,
                                              [med.medicamentoId]: {
                                                ...editData,
                                                frecuencia: e.target.value
                                              }
                                            });
                                          }
                                        }}
                                        disabled={!isEditing}
                                        placeholder="ej: cada 8 horas"
                                        className="w-full px-2 py-1 border border-purple-300 dark:border-purple-600 rounded text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 disabled:opacity-60 placeholder-gray-400 dark:placeholder-gray-500"
                                      />
                                    </div>
                                    <div>
                                      <label className="text-xs text-purple-800 dark:text-purple-200">Vía de Administración</label>
                                      <input
                                        type="text"
                                        value={editData.viaAdministracion || ''}
                                        onChange={(e) => {
                                          if (isEditing) {
                                            setEditingMedicamentos({
                                              ...editingMedicamentos,
                                              [med.medicamentoId]: {
                                                ...editData,
                                                viaAdministracion: e.target.value
                                              }
                                            });
                                          }
                                        }}
                                        disabled={!isEditing}
                                        placeholder="ej: oral, IV"
                                        className="w-full px-2 py-1 border border-purple-300 dark:border-purple-600 rounded text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 disabled:opacity-60 placeholder-gray-400 dark:placeholder-gray-500"
                                      />
                                    </div>
                                  </div>

                                  {isEditing && (
                                    <div className="flex gap-2 mt-3">
                                      <button
                                        type="button"
                                        onClick={() => handleSaveMedicamento(med.medicamentoId)}
                                        disabled={loading}
                                        className="flex-1 px-3 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition text-sm disabled:opacity-50"
                                      >
                                        ✓ Guardar
                                      </button>
                                      <button
                                        type="button"
                                        onClick={() => handleCancelEdit('medicamento', med.medicamentoId)}
                                        disabled={loading}
                                        className="flex-1 px-3 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition text-sm disabled:opacity-50"
                                      >
                                        ✕ Cancelar
                                      </button>
                                    </div>
                                  )}
                                </div>
                              );
                            })
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
                            insumosAsignados.map(ins => {
                              const isEditing = !!editingInsumos[ins.insumoId];
                              const editData = editingInsumos[ins.insumoId] || ins;

                              return (
                                <div key={ins.insumoId} className="bg-cyan-50 dark:bg-cyan-900/20 border border-cyan-200 dark:border-cyan-700 rounded-xl p-4">
                                  <div className="flex items-center justify-between mb-3">
                                    <h4 className="font-semibold text-cyan-900 dark:text-cyan-300">{ins.insumo.nombre}</h4>
                                    {!isEditing && (
                                      <button
                                        type="button"
                                        onClick={() => handleEditInsumo(ins)}
                                        className="px-3 py-1 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 transition text-sm"
                                      >
                                        ✏️ Editar
                                      </button>
                                    )}
                                  </div>

                                  <div>
                                    <label className="text-xs text-cyan-800 dark:text-cyan-200">Cantidad</label>
                                    <input
                                      type="number"
                                      min="1"
                                      value={editData.cantidad}
                                      onChange={(e) => {
                                        if (isEditing) {
                                          setEditingInsumos({
                                            ...editingInsumos,
                                            [ins.insumoId]: {
                                              ...editData,
                                              cantidad: parseInt(e.target.value) || 1
                                            }
                                          });
                                        }
                                      }}
                                      disabled={!isEditing}
                                      className="w-full px-2 py-1 border border-cyan-300 dark:border-cyan-600 rounded text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 disabled:opacity-60"
                                    />
                                  </div>

                                  {isEditing && (
                                    <div className="flex gap-2 mt-3">
                                      <button
                                        type="button"
                                        onClick={() => handleSaveInsumo(ins.insumoId)}
                                        disabled={loading}
                                        className="flex-1 px-3 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition text-sm disabled:opacity-50"
                                      >
                                        ✓ Guardar
                                      </button>
                                      <button
                                        type="button"
                                        onClick={() => handleCancelEdit('insumo', ins.insumoId)}
                                        disabled={loading}
                                        className="flex-1 px-3 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition text-sm disabled:opacity-50"
                                      >
                                        ✕ Cancelar
                                      </button>
                                    </div>
                                  )}
                                </div>
                              );
                            })
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
                    <span className="font-semibold">Actualizar Asignaciones:</span> Modifica las cantidades y detalles de medicamentos e insumos ya asignados.
                  </p>
                  <p>
                    Haz clic en "Editar" para modificar un elemento, luego guarda los cambios o cancela.
                  </p>
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
    </div>
  );
}

export default ActualizarAsignaciones;
