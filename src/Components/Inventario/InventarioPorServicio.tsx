import { useState, useEffect } from "react";
import axios from "axios";

interface MedicamentoStats {
  medicamentoId: number;
  nombre: string;
  cantidadTotal: number;
  pacientesUsando: number;
  stockDisponible: number;
}

interface InsumoStats {
  insumoId: number;
  nombre: string;
  cantidadTotal: number;
  pacientesUsando: number;
  disponible: number;
}

interface ResumenServicio {
  servicioId: number;
  nombre: string;
  descripcion?: string;
  totalPacientes: number;
  totalMedicamentosUsados: number;
  totalInsumosUsados: number;
  medicamentosUnicos: number;
  insumosUnicos: number;
}

function InventarioPorServicio() {
  const [resumen, setResumen] = useState<ResumenServicio[]>([]);
  const [selectedServicio, setSelectedServicio] = useState<number | null>(null);
  const [medicamentosPorServicio, setMedicamentosPorServicio] = useState<any[]>([]);
  const [insumosPorServicio, setInsumosPorServicio] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'resumen' | 'medicamentos' | 'insumos'>('resumen');

  // Cargar resumen general
  useEffect(() => {
    fetchResumen();
  }, []);

  // Cargar detalles cuando se selecciona un servicio
  useEffect(() => {
    if (selectedServicio) {
      fetchMedicamentos(selectedServicio);
      fetchInsumos(selectedServicio);
    }
  }, [selectedServicio]);

  const fetchResumen = async () => {
    try {
      setLoading(true);
      const response = await axios.get("http://localhost:5000/api/estadisticas/resumen-inventario");
      setResumen(response.data.data || []);
    } catch (error) {} finally {
      setLoading(false);
    }
  };

  const fetchMedicamentos = async (servicioId: number) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/estadisticas/medicamentos-por-servicio/${servicioId}`);
      setMedicamentosPorServicio(response.data.data || []);
    } catch (error) {}
  };

  const fetchInsumos = async (servicioId: number) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/estadisticas/insumos-por-servicio/${servicioId}`);
      setInsumosPorServicio(response.data.data || []);
    } catch (error) {}
  };

  const servicioSeleccionado = resumen.find(s => s.servicioId === selectedServicio);
  const medicamentosData = medicamentosPorServicio.find(s => s.servicioId === selectedServicio);
  const insumosData = insumosPorServicio.find(s => s.servicioId === selectedServicio);

  return (
    <div className="min-h-screen bg-auto-primary pt-20">
      <div className="bg-gradient-to-br from-sky-400/15 via-cyan-300/10 to-sky-400/15 w-full h-full absolute"></div>
      
      <div className="relative min-h-screen">
        <main className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10 py-10">
          {/* Header */}
          <div className="bg-auto-secondary rounded-2xl shadow-xl p-6 md:p-8 border border-auto mb-6 backdrop-blur-sm">
            <div className="flex items-center gap-3 mb-2">
              <div className="bg-gradient-to-br from-sky-500 to-sky-600 p-3 rounded-xl shadow-lg">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <div>
                <h2 className="text-3xl font-bold text-auto-primary">Inventario por Servicio</h2>
                <p className="text-auto-secondary text-sm">Estado de medicamentos e insumos en cada servicio</p>
              </div>
            </div>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-16">
              <div className="text-center">
                <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-sky-500 mx-auto mb-4"></div>
                <p className="text-auto-secondary font-medium">Cargando estadísticas...</p>
              </div>
            </div>
          ) : (
            <>
              {/* Resumen de servicios */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {resumen.map(servicio => (
                  <div
                    key={servicio.servicioId}
                    onClick={() => {
                      setSelectedServicio(servicio.servicioId);
                      setActiveTab('resumen');
                    }}
                    className={`bg-auto-secondary backdrop-blur-sm border rounded-2xl p-6 cursor-pointer transition-all duration-300 hover:shadow-2xl hover:scale-105 ${
                      selectedServicio === servicio.servicioId
                        ? 'border-sky-500 ring-2 ring-sky-500/50'
                        : 'border-auto'
                    }`}
                  >
                    <h3 className="text-xl font-bold text-auto-primary mb-2">{servicio.nombre}</h3>
                    {servicio.descripcion && (
                      <p className="text-sm text-auto-secondary mb-3">{servicio.descripcion}</p>
                    )}
                    
                    <div className="space-y-2 mt-4">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-auto-secondary">👥 Pacientes:</span>
                        <span className="font-semibold text-auto-primary">{servicio.totalPacientes}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-auto-secondary">💊 Medicamentos:</span>
                        <span className="font-semibold text-purple-600 dark:text-purple-400">
                          {servicio.medicamentosUnicos} tipos ({servicio.totalMedicamentosUsados} unidades)
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-auto-secondary">🏥 Insumos:</span>
                        <span className="font-semibold text-cyan-600 dark:text-cyan-400">
                          {servicio.insumosUnicos} tipos ({servicio.totalInsumosUsados} unidades)
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Detalles del servicio seleccionado */}
              {selectedServicio && servicioSeleccionado && (
                <div className="bg-auto-secondary rounded-2xl shadow-xl p-6 md:p-8 border border-auto backdrop-blur-sm">
                  <h3 className="text-2xl font-bold text-auto-primary mb-6">
                    Detalles de {servicioSeleccionado.nombre}
                  </h3>

                  {/* Tabs */}
                  <div className="flex gap-2 border-b border-auto mb-6">
                    <button
                      onClick={() => setActiveTab('resumen')}
                      className={`px-6 py-3 font-medium transition-colors ${
                        activeTab === 'resumen'
                          ? 'border-b-2 border-sky-500 text-sky-600'
                          : 'text-auto-secondary hover:text-auto-primary'
                      }`}
                    >
                      📊 Resumen
                    </button>
                    <button
                      onClick={() => setActiveTab('medicamentos')}
                      className={`px-6 py-3 font-medium transition-colors ${
                        activeTab === 'medicamentos'
                          ? 'border-b-2 border-purple-500 text-purple-600'
                          : 'text-auto-secondary hover:text-auto-primary'
                      }`}
                    >
                      💊 Medicamentos ({medicamentosData?.medicamentos?.length || 0})
                    </button>
                    <button
                      onClick={() => setActiveTab('insumos')}
                      className={`px-6 py-3 font-medium transition-colors ${
                        activeTab === 'insumos'
                          ? 'border-b-2 border-cyan-500 text-cyan-600'
                          : 'text-auto-secondary hover:text-auto-primary'
                      }`}
                    >
                      🏥 Insumos ({insumosData?.insumos?.length || 0})
                    </button>
                  </div>

                  {/* Contenido según tab */}
                  {activeTab === 'resumen' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-xl p-4">
                        <div className="text-3xl mb-2">👥</div>
                        <div className="text-sm text-blue-800 dark:text-blue-200">Pacientes Activos</div>
                        <div className="text-2xl font-bold text-blue-900 dark:text-blue-100">{servicioSeleccionado.totalPacientes}</div>
                      </div>
                      <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-700 rounded-xl p-4">
                        <div className="text-3xl mb-2">💊</div>
                        <div className="text-sm text-purple-800 dark:text-purple-200">Medicamentos Usados</div>
                        <div className="text-2xl font-bold text-purple-900 dark:text-purple-100">{servicioSeleccionado.totalMedicamentosUsados}</div>
                      </div>
                      <div className="bg-cyan-50 dark:bg-cyan-900/20 border border-cyan-200 dark:border-cyan-700 rounded-xl p-4">
                        <div className="text-3xl mb-2">🏥</div>
                        <div className="text-sm text-cyan-800 dark:text-cyan-200">Insumos Usados</div>
                        <div className="text-2xl font-bold text-cyan-900 dark:text-cyan-100">{servicioSeleccionado.totalInsumosUsados}</div>
                      </div>
                      <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700 rounded-xl p-4">
                        <div className="text-3xl mb-2">📦</div>
                        <div className="text-sm text-green-800 dark:text-green-200">Tipos Diferentes</div>
                        <div className="text-2xl font-bold text-green-900 dark:text-green-100">
                          {servicioSeleccionado.medicamentosUnicos + servicioSeleccionado.insumosUnicos}
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === 'medicamentos' && medicamentosData && (
                    <div className="space-y-3">
                      {medicamentosData.medicamentos.length === 0 ? (
                        <div className="text-center py-8 text-auto-secondary">
                          No hay medicamentos en uso en este servicio
                        </div>
                      ) : (
                        medicamentosData.medicamentos.map((med: MedicamentoStats) => (
                          <div key={med.medicamentoId} className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-700 rounded-xl p-4">
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="font-semibold text-purple-900 dark:text-purple-300">{med.nombre}</h4>
                              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                med.stockDisponible > med.cantidadTotal 
                                  ? 'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-200'
                                  : 'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-200'
                              }`}>
                                {med.stockDisponible > med.cantidadTotal ? '✓ Stock suficiente' : '⚠️ Stock bajo'}
                              </span>
                            </div>
                            <div className="grid grid-cols-3 gap-4 text-sm">
                              <div>
                                <span className="text-purple-700 dark:text-purple-300">En uso:</span>
                                <span className="font-semibold text-purple-900 dark:text-purple-100 ml-2">{med.cantidadTotal}</span>
                              </div>
                              <div>
                                <span className="text-purple-700 dark:text-purple-300">Pacientes:</span>
                                <span className="font-semibold text-purple-900 dark:text-purple-100 ml-2">{med.pacientesUsando}</span>
                              </div>
                              <div>
                                <span className="text-purple-700 dark:text-purple-300">Stock:</span>
                                <span className="font-semibold text-purple-900 dark:text-purple-100 ml-2">{med.stockDisponible}</span>
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  )}

                  {activeTab === 'insumos' && insumosData && (
                    <div className="space-y-3">
                      {insumosData.insumos.length === 0 ? (
                        <div className="text-center py-8 text-auto-secondary">
                          No hay insumos en uso en este servicio
                        </div>
                      ) : (
                        insumosData.insumos.map((ins: InsumoStats) => (
                          <div key={ins.insumoId} className="bg-cyan-50 dark:bg-cyan-900/20 border border-cyan-200 dark:border-cyan-700 rounded-xl p-4">
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="font-semibold text-cyan-900 dark:text-cyan-300">{ins.nombre}</h4>
                              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                ins.disponible > ins.cantidadTotal 
                                  ? 'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-200'
                                  : 'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-200'
                              }`}>
                                {ins.disponible > ins.cantidadTotal ? '✓ Disponible' : '⚠️ Agotándose'}
                              </span>
                            </div>
                            <div className="grid grid-cols-3 gap-4 text-sm">
                              <div>
                                <span className="text-cyan-700 dark:text-cyan-300">En uso:</span>
                                <span className="font-semibold text-cyan-900 dark:text-cyan-100 ml-2">{ins.cantidadTotal}</span>
                              </div>
                              <div>
                                <span className="text-cyan-700 dark:text-cyan-300">Pacientes:</span>
                                <span className="font-semibold text-cyan-900 dark:text-cyan-100 ml-2">{ins.pacientesUsando}</span>
                              </div>
                              <div>
                                <span className="text-cyan-700 dark:text-cyan-300">Disponible:</span>
                                <span className="font-semibold text-cyan-900 dark:text-cyan-100 ml-2">{ins.disponible}</span>
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
}

export default InventarioPorServicio;
