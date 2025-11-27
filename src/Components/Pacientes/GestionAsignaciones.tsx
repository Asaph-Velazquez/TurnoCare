import { useState, useEffect } from "react";
import axios from "axios";
import AsignarMedicamentosInsumos from "./AsignarMedicamentosInsumos";
import ActualizarAsignaciones from "./ActualizarAsignaciones";
import EliminarAsignaciones from "./EliminarAsignaciones";

interface ObservacionMedica {
  registroId: number;
  fechaHora: string;
  observaciones: string;
  enfermero: {
    nombre: string;
    apellidoPaterno: string;
    apellidoMaterno: string;
  };
}

function GestionAsignaciones() {
  const [mainView, setMainView] = useState<'asignar' | 'actualizar' | 'eliminar'>('asignar');
  const [selectedPacienteId, setSelectedPacienteId] = useState<string | null>(null);
  const [observacionesAnteriores, setObservacionesAnteriores] = useState<ObservacionMedica[]>([]);

  // Cargar observaciones del paciente seleccionado
  useEffect(() => {
    if (!selectedPacienteId) {
      setObservacionesAnteriores([]);
      return;
    }

    const fetchObservaciones = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/notas-medicas/paciente/${selectedPacienteId}`);
        let obs: ObservacionMedica[] = [];
        
        if (response.data?.success && Array.isArray(response.data.data)) {
          obs = response.data.data;
        } else if (Array.isArray(response.data)) {
          obs = response.data;
        }
        
        setObservacionesAnteriores(obs);
      } catch (error) {
        console.log("No se pudieron cargar observaciones anteriores");
        setObservacionesAnteriores([]);
      }
    };

    fetchObservaciones();
  }, [selectedPacienteId]);

  return (
    <div className="min-h-screen bg-auto-primary">
      {/* Navegación de pestañas */}
      <div className="sticky top-20 z-50 bg-auto-primary/95 backdrop-blur-lg border-b border-auto py-4">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10">
          <div className="flex justify-center">
            <div className="bg-auto-secondary backdrop-blur-sm border border-auto rounded-2xl p-2 shadow-2xl inline-flex gap-2">
              <button
                onClick={() => setMainView('asignar')}
                className={`px-6 py-3 rounded-xl font-semibold transition-all ${
                  mainView === 'asignar'
                    ? 'bg-gradient-to-r from-sky-500 to-cyan-500 text-white shadow-lg scale-105'
                    : 'text-auto-primary hover:bg-sky-100 dark:hover:bg-sky-900/20'
                }`}
              >
                ➕ Asignar
              </button>
              <button
                onClick={() => setMainView('actualizar')}
                className={`px-6 py-3 rounded-xl font-semibold transition-all ${
                  mainView === 'actualizar'
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg scale-105'
                    : 'text-auto-primary hover:bg-purple-100 dark:hover:bg-purple-900/20'
                }`}
              >
                ✏️ Actualizar
              </button>
              <button
                onClick={() => setMainView('eliminar')}
                className={`px-6 py-3 rounded-xl font-semibold transition-all ${
                  mainView === 'eliminar'
                    ? 'bg-gradient-to-r from-red-500 to-pink-500 text-white shadow-lg scale-105'
                    : 'text-auto-primary hover:bg-red-100 dark:hover:bg-red-900/20'
                }`}
              >
                🗑️ Eliminar
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Contenido dinámico según vista */}
      <div className="transition-all duration-300">
        {mainView === 'asignar' && <AsignarMedicamentosInsumos onPacienteSelect={setSelectedPacienteId} />}
        {mainView === 'actualizar' && <ActualizarAsignaciones onPacienteSelect={setSelectedPacienteId} />}
        {mainView === 'eliminar' && <EliminarAsignaciones onPacienteSelect={setSelectedPacienteId} />}
      </div>

      {/* Historial de Observaciones - Sección inferior */}
      {selectedPacienteId && (
        <div className="bg-gradient-to-br from-amber-400/10 via-yellow-300/5 to-amber-400/10 border-t-2 border-amber-300/30 dark:border-amber-700/30">
          <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10 py-8">
            <div className="bg-auto-secondary backdrop-blur-sm border-2 border-amber-300 dark:border-amber-700 rounded-3xl p-8 shadow-2xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-gradient-to-br from-amber-500 to-yellow-600 rounded-xl shadow-lg">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-7 h-7 text-white">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-auto-primary">
                     Historial Médico del Paciente
                  </h2>
                  {observacionesAnteriores.length > 0 && (
                    <p className="text-sm text-auto-secondary mt-1">
                      {observacionesAnteriores.length} {observacionesAnteriores.length === 1 ? 'observación registrada' : 'observaciones registradas'}
                    </p>
                  )}
                </div>
              </div>

              {observacionesAnteriores.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {observacionesAnteriores.map((obs, idx) => (
                    <div key={obs.registroId} className="group bg-gradient-to-br from-amber-50 to-yellow-50 dark:from-amber-900/20 dark:to-yellow-900/20 border-2 border-amber-200 dark:border-amber-700 rounded-2xl p-5 shadow-md hover:shadow-xl hover:scale-[1.02] transition-all duration-300">
                      <div className="flex items-start justify-between mb-3">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-amber-500 to-yellow-500 text-white text-sm font-bold rounded-lg shadow-md">
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                          </svg>
                          #{observacionesAnteriores.length - idx}
                        </span>
                        <span className="text-xs font-medium text-amber-700 dark:text-amber-400 bg-amber-100 dark:bg-amber-900/30 px-2 py-1 rounded-lg">
                          {new Date(obs.fechaHora).toLocaleString('es-MX', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </span>
                      </div>
                      <div className="bg-white/50 dark:bg-gray-800/50 rounded-xl p-4 mb-3 min-h-[120px]">
                        <p className="text-sm text-amber-900 dark:text-amber-100 leading-relaxed whitespace-pre-wrap">
                          {obs.observaciones}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 pt-3 border-t-2 border-amber-200 dark:border-amber-700">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-amber-600 dark:text-amber-400">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                        </svg>
                        <p className="text-xs font-semibold text-amber-700 dark:text-amber-400">
                          <span className="font-medium">Enfermero:</span> {obs.enfermero.nombre} {obs.enfermero.apellidoPaterno}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-16">
                  <div className="inline-block p-6 bg-gradient-to-br from-amber-100 to-yellow-100 dark:from-amber-900/30 dark:to-yellow-900/30 rounded-full mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-16 h-16 text-amber-500">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-auto-primary mb-2">
                    Sin observaciones previas
                  </h3>
                  <p className="text-auto-secondary">
                    Este paciente no tiene historial médico registrado
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default GestionAsignaciones;
