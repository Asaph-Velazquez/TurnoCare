import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

interface Capacitacion {
  capacitacionId: number;
  titulo: string;
  descripcion: string;
  fechaImparticion: string;
  duracion: number;
  instructor: string;
  enfermeros: any[];
}

function ListarCapacitaciones() {
  const [capacitaciones, setCapacitaciones] = useState<Capacitacion[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [updatingAsistencia, setUpdatingAsistencia] = useState<{[key: string]: boolean}>({});
  const navigate = useNavigate();

  useEffect(() => {
    cargarCapacitaciones();
  }, []);

  const cargarCapacitaciones = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/capacitaciones");
      setCapacitaciones(response.data);
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };

  const handleToggleAsistencia = async (
    capacitacionId: number, 
    enfermeroId: number, 
    asistioActual: boolean
  ) => {
    const key = `${capacitacionId}-${enfermeroId}`;
    setUpdatingAsistencia(prev => ({ ...prev, [key]: true }));

    try {
      await axios.put(
        `http://localhost:5000/api/capacitaciones/asistencia/${capacitacionId}/${enfermeroId}`,
        { asistio: !asistioActual }
      );
      
      // Recargar capacitaciones
      await cargarCapacitaciones();
    } catch (error: any) {
      alert(error.response?.data?.error || "Error al actualizar asistencia");
    } finally {
      setUpdatingAsistencia(prev => ({ ...prev, [key]: false }));
    }
  };

  const capacitacionesFiltradas = capacitaciones
    .filter(cap => 
      cap.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cap.instructor.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      const fechaA = new Date(a.fechaImparticion).getTime();
      const fechaB = new Date(b.fechaImparticion).getTime();
      const ahora = new Date().getTime();

      // Si ambas son futuras, ordenar por fecha ascendente (más cercana primero)
      if (fechaA >= ahora && fechaB >= ahora) return fechaA - fechaB;
      // Si ambas son pasadas, ordenar por fecha descendente (más reciente primero)
      if (fechaA < ahora && fechaB < ahora) return fechaB - fechaA;
      // Si una es futura y otra pasada, la futura va primero
      return fechaA >= ahora ? -1 : 1;
    });

  if (loading) {
    return <div className="min-h-screen bg-auto-primary p-8">Cargando...</div>;
  }

  return (
    <div className="min-h-screen bg-auto-primary pt-20 pb-10">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-bold text-auto-primary">
            Todas las Capacitaciones
          </h1>
          <button
            onClick={() => navigate("/capacitaciones")}
            className="flex items-center gap-2 px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg font-semibold transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Regresar
          </button>
        </div>

        {/* Buscador */}
        <div className="mb-8">
          <input
            type="text"
            placeholder="Buscar por título o instructor"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full p-4 rounded-lg bg-auto-secondary text-auto-primary placeholder-auto-tertiary focus:outline-none focus:ring-2 focus:ring-auto-primary transition-all"
          />
        </div>

        {/* Lista de capacitaciones */}
        <div className="space-y-6">
          {capacitacionesFiltradas.map((capacitacion) => {
            const totalInscritos = capacitacion.enfermeros?.length || 0;
            return (
              <div key={capacitacion.capacitacionId} className="bg-auto-secondary p-6 rounded-lg shadow-lg">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-auto-primary mb-2">
                      {capacitacion.titulo}
                    </h3>
                    <p className="text-auto-tertiary mb-3">
                      {capacitacion.descripcion}
                    </p>
                    <div className="flex gap-6 text-sm text-auto-tertiary mb-4">
                      <span className="flex items-center gap-2">
                        📅 {new Date(capacitacion.fechaImparticion).toLocaleString('es-MX', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                      <span className="flex items-center gap-2">
                        ⏱️ {capacitacion.duracion} horas
                      </span>
                      <span className="flex items-center gap-2">
                        👨‍🏫 {capacitacion.instructor}
                      </span>
                    </div>
                    <div className="bg-auto-tertiary/30 p-4 rounded-lg">
                      <h4 className="font-semibold text-auto-primary mb-2">
                        Enfermeros Inscritos: {capacitacion.enfermeros?.length || 0}
                      </h4>
                      {capacitacion.enfermeros && capacitacion.enfermeros.length > 0 && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                          {capacitacion.enfermeros.map((inscripcion: any) => (
                            <div key={inscripcion.enfermero.enfermeroId} className="flex items-center gap-2 text-sm">
                              <span className="text-auto-tertiary">
                                {inscripcion.enfermero.nombre} {inscripcion.enfermero.apellidoPaterno}
                              </span>
                              {inscripcion.asistio && (
                                <span className="bg-green-500 text-white px-2 py-0.5 rounded-full text-xs">
                                  ✓ Asistió
                                </span>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Lista de enfermeros con botones de asistencia */}
                {capacitacion.enfermeros && capacitacion.enfermeros.length > 0 ? (
                  <div className="bg-auto-primary rounded-xl p-4 border border-auto">
                    <h4 className="font-bold text-auto-primary mb-3 flex items-center gap-2">
                      👥 Personal Inscrito ({totalInscritos})
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-60 overflow-y-auto">
                      {capacitacion.enfermeros.map((inscripcion: any, idx: number) => {
                        const key = `${capacitacion.capacitacionId}-${inscripcion.enfermero.enfermeroId}`;
                        const isUpdating = updatingAsistencia[key];
                        
                        return (
                          <div 
                            key={idx} 
                            className={`flex items-center justify-between p-3 rounded-lg border-2 transition-all ${
                              inscripcion.asistio 
                                ? 'bg-green-50 border-green-300 dark:bg-green-900/20 dark:border-green-700' 
                                : 'bg-gray-50 border-gray-300 dark:bg-gray-800/20 dark:border-gray-600'
                            }`}
                          >
                            <div className="flex items-center gap-2 flex-1">
                              <div className={`w-2 h-2 rounded-full ${inscripcion.asistio ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                              <span className="text-sm font-medium text-auto-primary">
                                {inscripcion.enfermero.nombre} {inscripcion.enfermero.apellidoPaterno}
                              </span>
                            </div>
                            
                            {/* Botón para marcar/desmarcar asistencia */}
                            <button
                              onClick={() => handleToggleAsistencia(
                                capacitacion.capacitacionId,
                                inscripcion.enfermero.enfermeroId,
                                inscripcion.asistio
                              )}
                              disabled={isUpdating}
                              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all duration-200 flex items-center gap-1 ${
                                inscripcion.asistio
                                  ? 'bg-green-600 hover:bg-green-700 text-white'
                                  : 'bg-gray-500 hover:bg-gray-600 text-white'
                              } disabled:opacity-50 disabled:cursor-not-allowed`}
                              title={inscripcion.asistio ? 'Clic para remover asistencia' : 'Clic para confirmar asistencia'}
                            >
                              {isUpdating ? (
                                <div className="animate-spin rounded-full h-3 w-3 border-2 border-white border-t-transparent"></div>
                              ) : (
                                <>
                                  {inscripcion.asistio ? (
                                    <>
                                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                      </svg>
                                      <span>Asistió</span>
                                    </>
                                  ) : (
                                    <>
                                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                      </svg>
                                      <span>Faltó</span>
                                    </>
                                  )}
                                </>
                              )}
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ) : (
                  <div className="bg-auto-primary rounded-xl p-6 border border-auto text-center">
                    <svg className="w-12 h-12 text-auto-tertiary mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    <p className="text-auto-tertiary">Sin personal inscrito</p>
                  </div>
                )}
              </div>
            );
          })}

          {capacitacionesFiltradas.length === 0 && (
            <div className="text-center py-12 text-auto-tertiary">
              No hay capacitaciones registradas
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ListarCapacitaciones;

