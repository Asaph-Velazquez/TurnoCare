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

interface Medicamento {
  medicamentoId: number;
  nombre: string;
  descripcion?: string;
  cantidadStock: number;
  lote?: string;
  fechaCaducidad?: string;
  ubicacion?: string;
}

interface Insumo {
  insumoId: number;
  nombre: string;
  descripcion?: string;
  cantidadDisponible: number;
  categoria?: string;
  ubicacion?: string;
}

interface ItemAsignado {
  id: number;
  cantidad: number;
  dosis?: string;
  frecuencia?: string;
  viaAdministracion?: string;
}

interface AsignarMedicamentosInsumosProps {
  onPacienteSelect?: (pacienteId: string | null) => void;
}

function AsignarMedicamentosInsumos({ onPacienteSelect }: AsignarMedicamentosInsumosProps) {
  const [selectedPacienteId, setSelectedPacienteId] = useState("");
  const [pacientes, setPacientes] = useState<Paciente[]>([]);
  const [medicamentos, setMedicamentos] = useState<Medicamento[]>([]);
  const [insumos, setInsumos] = useState<Insumo[]>([]);
  
  const [medicamentosAsignados, setMedicamentosAsignados] = useState<ItemAsignado[]>([]);
  const [insumosAsignados, setInsumosAsignados] = useState<ItemAsignado[]>([]);
  
  const [loading, setLoading] = useState(false);
  const [loadingPacientes, setLoadingPacientes] = useState(false);
  const [loadingMedicamentos, setLoadingMedicamentos] = useState(false);
  const [loadingInsumos, setLoadingInsumos] = useState(false);
  const [alert, setAlert] = useState<{type: string, message: string} | null>(null);
  
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredPacientes, setFilteredPacientes] = useState<Paciente[]>([]);
  
  const [activeTab, setActiveTab] = useState<'medicamentos' | 'insumos'>('medicamentos');

  // Cargar datos iniciales
  useEffect(() => {
    const fetchData = async () => {
      setLoadingPacientes(true);
      try {
        const response = await axios.get("http://localhost:5000/api/pacientes");
        const data = Array.isArray(response.data) ? response.data : response.data.data || [];
        setPacientes(data);
      } catch (error) {} finally {
        setLoadingPacientes(false);
      }

      setLoadingMedicamentos(true);
      try {
        const response = await axios.get("http://localhost:5000/api/medicamentos");
        const data = response.data.success ? response.data.data : response.data;
        setMedicamentos(data || []);
      } catch (error) {} finally {
        setLoadingMedicamentos(false);
      }

      setLoadingInsumos(true);
      try {
        const response = await axios.get("http://localhost:5000/api/insumos");
        const data = response.data.success ? response.data.data : response.data;
        setInsumos(data || []);
      } catch (error) {} finally {
        setLoadingInsumos(false);
      }
    };
    fetchData();
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

  // Agregar medicamento a la lista
  const handleAddMedicamento = (medicamentoId: number) => {
    if (medicamentosAsignados.some(m => m.id === medicamentoId)) {
      setAlert({ type: "danger", message: "Este medicamento ya está en la lista" });
      return;
    }
    setMedicamentosAsignados([
      ...medicamentosAsignados, 
      { id: medicamentoId, cantidad: 1, dosis: "", frecuencia: "", viaAdministracion: "" }
    ]);
  };

  // Agregar insumo a la lista
  const handleAddInsumo = (insumoId: number) => {
    if (insumosAsignados.some(i => i.id === insumoId)) {
      setAlert({ type: "danger", message: "Este insumo ya está en la lista" });
      return;
    }
    setInsumosAsignados([
      ...insumosAsignados, 
      { id: insumoId, cantidad: 1 }
    ]);
  };

  // Actualizar detalles de medicamento
  const handleUpdateMedicamento = (medicamentoId: number, field: string, value: any) => {
    setMedicamentosAsignados(medicamentosAsignados.map(m => 
      m.id === medicamentoId ? { ...m, [field]: value } : m
    ));
  };

  /* Actualizar cantidad de insumo asignado */
  const handleUpdateInsumo = (insumoId: number, cantidad: number) => {
    setInsumosAsignados(insumosAsignados.map(i => 
      i.id === insumoId ? { ...i, cantidad } : i
    ));
  };

  // Eliminar medicamento de la lista
  const handleRemoveMedicamento = (medicamentoId: number) => {
    setMedicamentosAsignados(medicamentosAsignados.filter(m => m.id !== medicamentoId));
  };

  // Eliminar insumo de la lista
  const handleRemoveInsumo = (insumoId: number) => {
    setInsumosAsignados(insumosAsignados.filter(i => i.id !== insumoId));
  };

  // Enviar formulario de asignación
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAlert(null);

    if (!selectedPacienteId) {
      setAlert({ type: "danger", message: "Por favor selecciona un paciente" });
      return;
    }

    if (medicamentosAsignados.length === 0 && insumosAsignados.length === 0) {
      setAlert({ type: "danger", message: "Por favor agrega al menos un medicamento o insumo" });
      return;
    }

    setLoading(true);
    try {
      // Asignar medicamentos si existen
      if (medicamentosAsignados.length > 0) {
        const medicamentosPayload = {
          pacienteId: parseInt(selectedPacienteId),
          reemplazar: false,
          medicamentos: medicamentosAsignados.map(m => ({
            medicamentoId: m.id,
            cantidad: m.cantidad,
            dosis: m.dosis?.trim() || null,
            frecuencia: m.frecuencia?.trim() || null,
            viaAdministracion: m.viaAdministracion?.trim() || null,
          }))
        };
        await axios.post("http://localhost:5000/api/medicamentos/asignar", medicamentosPayload);
      }

      // Asignar insumos si existen
      if (insumosAsignados.length > 0) {
        const insumosPayload = {
          pacienteId: parseInt(selectedPacienteId),
          reemplazar: false,
          insumos: insumosAsignados.map(i => ({
            insumoId: i.id,
            cantidad: i.cantidad,
          }))
        };
        await axios.post("http://localhost:5000/api/insumos/asignar", insumosPayload);
      }

      setAlert({
        type: "success",
        message: "Medicamentos e insumos asignados exitosamente"
      });
      
      // Limpiar formulario
      setMedicamentosAsignados([]);
      setInsumosAsignados([]);
      setSelectedPacienteId("");
      setSearchTerm("");
    } catch (error: any) {
      let errorMessage = "Error al asignar medicamentos/insumos";
      if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
      }
      setAlert({ type: "danger", message: errorMessage });
    } finally {
      setLoading(false);
    }
  };

  // Filtros de medicamentos e insumos disponibles
  const selectedPaciente = pacientes.find(p => p.pacienteId.toString() === selectedPacienteId);
  const medicamentosDisponibles = medicamentos.filter(m => 
    !medicamentosAsignados.some(ma => ma.id === m.medicamentoId) && m.cantidadStock > 0
  );
  const insumosDisponibles = insumos.filter(i => 
    !insumosAsignados.some(ia => ia.id === i.insumoId) && i.cantidadDisponible > 0
  );

  return (
    <div className="min-h-screen bg-auto-primary pt-20">
      <div className="bg-gradient-to-br from-sky-400/15 via-cyan-300/10 to-sky-400/15 w-full h-full absolute"></div>
      <div className="relative min-h-screen">
        <main className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10 py-10">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <FormLayout title="Asignar Medicamentos e Insumos" onSubmit={handleSubmit} widthClass="max-w-4xl">
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
                          <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-700 rounded-xl p-4">
                            <h4 className="font-semibold text-purple-900 dark:text-purple-300 mb-3">Agregar Medicamento</h4>
                            <div className="max-h-60 overflow-y-auto space-y-2">
                              {loadingMedicamentos ? (
                                <p className="text-sm text-purple-700 dark:text-purple-300">Cargando medicamentos...</p>
                              ) : medicamentosDisponibles.length === 0 ? (
                                <p className="text-sm text-purple-700 dark:text-purple-300">No hay medicamentos disponibles en inventario</p>
                              ) : (
                                medicamentosDisponibles.map(med => (
                                  <div key={med.medicamentoId} className="bg-white dark:bg-gray-800 rounded-lg p-3 flex items-center justify-between border border-transparent dark:border-gray-700">
                                    <div className="flex-1">
                                      <p className="font-medium text-purple-900 dark:text-purple-300">{med.nombre}</p>
                                      <p className="text-xs text-purple-700 dark:text-purple-400">
                                        Stock: {med.cantidadStock} unidades
                                        {med.lote && ` • Lote: ${med.lote}`}
                                        {med.ubicacion && ` • ${med.ubicacion}`}
                                      </p>
                                    </div>
                                    <button
                                      type="button"
                                      onClick={() => handleAddMedicamento(med.medicamentoId)}
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
                              <h4 className="font-semibold text-green-900 dark:text-green-300 mb-3">Medicamentos a Asignar</h4>
                              <div className="space-y-3">
                                {medicamentosAsignados.map(item => {
                                  const med = medicamentos.find(m => m.medicamentoId === item.id);
                                  if (!med) return null;
                                  return (
                                    <div key={item.id} className="bg-white dark:bg-gray-800 rounded-lg p-3 border border-green-300 dark:border-green-700">
                                      <div className="flex items-center justify-between mb-2">
                                        <p className="font-medium text-green-900 dark:text-green-300">{med.nombre}</p>
                                        <button
                                          type="button"
                                          onClick={() => handleRemoveMedicamento(item.id)}
                                          className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                                        >
                                        <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        strokeWidth="1.5"
                                        stroke="currentColor"
                                        className="w-8 h-8 text-auto-primary"
                                        >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M12 4.5v15m7.5-7.5h-15"
                                        />
                                        </svg>
                                        </button>
                                      </div>
                                      <div className="grid grid-cols-2 gap-2">
                                        <div>
                                          <label className="text-xs text-green-800 dark:text-green-200">Cantidad</label>
                                          <input
                                            type="number"
                                            min="1"
                                            max={med.cantidadStock}
                                            value={item.cantidad}
                                            onChange={(e) => handleUpdateMedicamento(item.id, 'cantidad', parseInt(e.target.value) || 1)}
                                            className="w-full px-2 py-1 border border-green-300 dark:border-green-600 rounded text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                                          />
                                        </div>
                                        <div>
                                          <label className="text-xs text-green-800 dark:text-green-200">Dosis</label>
                                          <input
                                            type="text"
                                            value={item.dosis || ''}
                                            onChange={(e) => handleUpdateMedicamento(item.id, 'dosis', e.target.value)}
                                            placeholder="ej: 500mg"
                                            className="w-full px-2 py-1 border border-green-300 dark:border-green-600 rounded text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500"
                                          />
                                        </div>
                                        <div>
                                          <label className="text-xs text-green-800 dark:text-green-200">Frecuencia</label>
                                          <input
                                            type="text"
                                            value={item.frecuencia || ''}
                                            onChange={(e) => handleUpdateMedicamento(item.id, 'frecuencia', e.target.value)}
                                            placeholder="ej: cada 8 horas"
                                            className="w-full px-2 py-1 border border-green-300 dark:border-green-600 rounded text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500"
                                          />
                                        </div>
                                        <div>
                                          <label className="text-xs text-green-800 dark:text-green-200">Vía</label>
                                          <input
                                            type="text"
                                            value={item.viaAdministracion || ''}
                                            onChange={(e) => handleUpdateMedicamento(item.id, 'viaAdministracion', e.target.value)}
                                            placeholder="ej: oral, IV"
                                            className="w-full px-2 py-1 border border-green-300 dark:border-green-600 rounded text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500"
                                          />
                                        </div>
                                      </div>
                                    </div>
                                  );
                                })}
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
                              ) : insumosDisponibles.length === 0 ? (
                                <p className="text-sm text-cyan-700 dark:text-cyan-300">No hay insumos disponibles en inventario</p>
                              ) : (
                                insumosDisponibles.map(ins => (
                                  <div key={ins.insumoId} className="bg-white dark:bg-gray-800 rounded-lg p-3 flex items-center justify-between border border-transparent dark:border-gray-700">
                                    <div className="flex-1">
                                      <p className="font-medium text-cyan-900 dark:text-cyan-300">{ins.nombre}</p>
                                      <p className="text-xs text-cyan-700 dark:text-cyan-400">
                                        Disponible: {ins.cantidadDisponible} unidades
                                        {ins.categoria && ` • ${ins.categoria}`}
                                        {ins.ubicacion && ` • ${ins.ubicacion}`}
                                      </p>
                                    </div>
                                    <button
                                      type="button"
                                      onClick={() => handleAddInsumo(ins.insumoId)}
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
                              <h4 className="font-semibold text-green-900 dark:text-green-300 mb-3">Insumos a Asignar</h4>
                              <div className="space-y-3">
                                {insumosAsignados.map(item => {
                                  const ins = insumos.find(i => i.insumoId === item.id);
                                  if (!ins) return null;
                                  return (
                                    <div key={item.id} className="bg-white dark:bg-gray-800 rounded-lg p-3 border border-green-300 dark:border-green-700 flex items-center justify-between">
                                      <div className="flex-1">
                                        <p className="font-medium text-green-900 dark:text-green-300">{ins.nombre}</p>
                                        <div className="mt-2">
                                          <label className="text-xs text-green-800 dark:text-green-200">Cantidad</label>
                                          <input
                                            type="number"
                                            min="1"
                                            max={ins.cantidadDisponible}
                                            value={item.cantidad}
                                            onChange={(e) => handleUpdateInsumo(item.id, parseInt(e.target.value) || 1)}
                                            className="w-24 px-2 py-1 border border-green-300 dark:border-green-600 rounded text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                                          />
                                        </div>
                                      </div>
                                      <button
                                        type="button"
                                        onClick={() => handleRemoveInsumo(item.id)}
                                        className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 ml-3"
                                      >
                                        ✕
                                      </button>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </>
                  )}
                </div>

                <div className="mt-6">
                  <button
                    type="submit"
                    disabled={loading || !selectedPacienteId || (medicamentosAsignados.length === 0 && insumosAsignados.length === 0)}
                    className="w-full px-6 py-3 bg-gradient-to-r from-sky-500 to-cyan-500 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? "Asignando..." : "Asignar Medicamentos e Insumos"}
                  </button>
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
                    <span className="font-semibold">Asignación de Recursos:</span> Asigna medicamentos e insumos del inventario a pacientes.
                  </p>
                  <p>
                    Puedes especificar la cantidad, dosis, frecuencia y vía de administración para cada medicamento.
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

export default AsignarMedicamentosInsumos;
