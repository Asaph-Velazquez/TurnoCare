import { useState, useEffect } from "react";
import axios from "axios";
import ConfirmDialog from "../utilities/ConfirmDialog";

interface Capacitacion {
  capacitacionId: number;
  titulo: string;
  descripcion: string;
  fechaImparticion: string;
  duracion: number;
  instructor: string;
}

interface InscripcionCapacitacion {
  capacitacion: Capacitacion;
  asistio: boolean;
  fechaInscripcion: string;
}

function MisCapacitaciones() {
  const [capacitacionesDisponibles, setCapacitacionesDisponibles] = useState<Capacitacion[]>([]);
  const [misCapacitaciones, setMisCapacitaciones] = useState<InscripcionCapacitacion[]>([]);
  const [alert, setAlert] = useState<{type: string, message: string} | null>(null);
  const [loading, setLoading] = useState(true);
  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean;
    capacitacion: InscripcionCapacitacion | null;
  }>({
    isOpen: false,
    capacitacion: null,
  });
  
  // Obtener el enfermeroId del usuario logueado
  const getUserData = () => {
    const userStr = localStorage.getItem("user");
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        return user.enfermeroId || user.userid;
      } catch (e) {
        return localStorage.getItem("userID");
      }
    }
    return localStorage.getItem("userID");
  };

  const enfermeroId = getUserData();

  useEffect(() => {
    if (!enfermeroId) {
      setAlert({ 
        type: "danger", 
        message: "Error: No se pudo obtener tu ID de enfermero. Por favor inicia sesión nuevamente." 
      });
      setLoading(false);
      return;
    }
    cargarCapacitaciones();
    cargarMisCapacitaciones();
  }, []);

  const cargarCapacitaciones = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/capacitaciones");
      setCapacitacionesDisponibles(response.data);
      setLoading(false);
    } catch (error) {
      setAlert({ type: "danger", message: "Error al cargar capacitaciones disponibles" });
      setLoading(false);
    }
  };

  const cargarMisCapacitaciones = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/capacitaciones/enfermero/${enfermeroId}`);
      setMisCapacitaciones(response.data);
    } catch (error) {
    }
  };

  const inscribirse = async (capacitacionId: number) => {
    if (!enfermeroId) {
      setAlert({ type: "danger", message: "Error: No se encontró tu ID de enfermero" });
      return;
    }

    try {
      
      await axios.post("http://localhost:5000/api/capacitaciones/inscribir", {
        enfermeroId: parseInt(enfermeroId),
        capacitacionId: parseInt(capacitacionId)
      });
      
      setAlert({ type: "success", message: "¡Inscripción exitosa!" });
      await cargarMisCapacitaciones();
      setTimeout(() => setAlert(null), 3000);
    } catch (error: any) {
      setAlert({
        type: "danger",
        message: error.response?.data?.error || "Error al inscribirse en la capacitación"
      });
      setTimeout(() => setAlert(null), 5000);
    }
  };

  const handleCancelClick = (inscripcion: InscripcionCapacitacion) => {
    setConfirmDialog({
      isOpen: true,
      capacitacion: inscripcion,
    });
  };

  const handleConfirmCancel = async () => {
    if (!confirmDialog.capacitacion) return;

    try {
      await axios.delete(`http://localhost:5000/api/capacitaciones/inscripcion/${enfermeroId}/${confirmDialog.capacitacion.capacitacion.capacitacionId}`);
      setAlert({ type: "success", message: "Inscripción cancelada exitosamente" });
      await cargarMisCapacitaciones();
      setTimeout(() => setAlert(null), 3000);
    } catch (error: any) {
      setAlert({ 
        type: "danger", 
        message: error.response?.data?.error || "Error al cancelar inscripción" 
      });
      setTimeout(() => setAlert(null), 5000);
    } finally {
      setConfirmDialog({ isOpen: false, capacitacion: null });
    }
  };

  const cancelarInscripcion = async (capacitacionId: number) => {
    if (!confirm("¿Estás seguro de cancelar tu inscripción?")) return;
    
    try {
      await axios.delete(`http://localhost:5000/api/capacitaciones/inscripcion/${enfermeroId}/${capacitacionId}`);
      setAlert({ type: "success", message: "Inscripción cancelada exitosamente" });
      await cargarMisCapacitaciones();
      setTimeout(() => setAlert(null), 3000);
    } catch (error: any) {
      setAlert({ 
        type: "danger", 
        message: error.response?.data?.error || "Error al cancelar inscripción" 
      });
      setTimeout(() => setAlert(null), 5000);
    }
  };

  const estaInscrito = (capacitacionId: number) => {
    return misCapacitaciones.some(c => c.capacitacion.capacitacionId === capacitacionId);
  };

  const formatearFecha = (fecha: string) => {
    return new Date(fecha).toLocaleString('es-MX', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Función para verificar si una capacitación ya pasó
  const yasPasado = (fecha: string) => {
    return new Date(fecha) < new Date();
  };

  // Ordenar capacitaciones: primero las próximas, luego las pasadas
  const capacitacionesOrdenadas = [...capacitacionesDisponibles]
    .filter(c => !estaInscrito(c.capacitacionId))
    .sort((a, b) => {
      const fechaA = new Date(a.fechaImparticion).getTime();
      const fechaB = new Date(b.fechaImparticion).getTime();
      const ahora = new Date().getTime();

      // Si ambas son futuras, ordenar por fecha ascendente (más cercana primero)
      if (fechaA >= ahora && fechaB >= ahora) {
        return fechaA - fechaB;
      }
      // Si ambas son pasadas, ordenar por fecha descendente (más reciente primero)
      if (fechaA < ahora && fechaB < ahora) {
        return fechaB - fechaA;
      }
      // Si una es futura y otra pasada, la futura va primero
      return fechaA >= ahora ? -1 : 1;
    });

  const misCapacitacionesOrdenadas = [...misCapacitaciones].sort((a, b) => {
    const fechaA = new Date(a.capacitacion.fechaImparticion).getTime();
    const fechaB = new Date(b.capacitacion.fechaImparticion).getTime();
    const ahora = new Date().getTime();

    if (fechaA >= ahora && fechaB >= ahora) {
      return fechaA - fechaB;
    }
    if (fechaA < ahora && fechaB < ahora) {
      return fechaB - fechaA;
    }
    return fechaA >= ahora ? -1 : 1;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-auto-primary pt-20 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-sky-500 mx-auto mb-4"></div>
          <p className="text-auto-secondary font-medium">Cargando capacitaciones...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-auto-primary pt-20 pb-10">
      {/* Fondo decorativo - igual que Home e Inventario */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-sky-400/10 via-transparent to-cyan-400/10"></div>
        <div className="absolute top-1/4 right-0 w-96 h-96 bg-sky-300/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 left-0 w-96 h-96 bg-cyan-300/20 rounded-full blur-3xl"></div>
      </div>

      <div className="relative min-h-screen">
        <main className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10 py-10">
          {/* Header Card - mismo estilo que Inventario */}
          <div className="bg-auto-secondary rounded-2xl shadow-xl p-6 md:p-8 border border-auto mb-6 backdrop-blur-sm">
            <div className="flex items-center gap-3 mb-2">
              <div className="bg-gradient-to-br from-sky-500 to-cyan-500 p-3 rounded-xl shadow-lg">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                  />
                </svg>
              </div>
              <div>
                <h2 className="text-3xl font-bold text-auto-primary">Mis Capacitaciones</h2>
                <p className="text-auto-secondary text-sm">Inscríbete en capacitaciones y mejora tus habilidades</p>
              </div>
            </div>
          </div>

          {/* Alertas */}
          {alert && (
            <div className={`mb-6 p-4 rounded-xl ${
              alert.type === 'success' 
                ? 'bg-green-100 border border-green-400 text-green-700' 
                : 'bg-red-100 border border-red-400 text-red-700'
            }`}>
              {alert.message}
            </div>
          )}

          {/* Sección Mis Capacitaciones Inscritas */}
          <div className="mb-8">
            <div className="bg-auto-secondary rounded-2xl shadow-xl p-6 md:p-8 border border-auto backdrop-blur-sm mb-6">
              <div className="flex items-center gap-2 mb-4">
                <div className="bg-gradient-to-br from-green-500 to-emerald-600 p-3 rounded-xl shadow-lg">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-auto-primary">
                  Capacitaciones Inscritas ({misCapacitaciones.length})
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {misCapacitacionesOrdenadas.map((inscripcion) => (
                  <div 
                    key={inscripcion.capacitacion.capacitacionId} 
                    className={`group relative bg-gradient-to-br rounded-2xl p-6 border-2 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 ${
                      yasPasado(inscripcion.capacitacion.fechaImparticion)
                        ? 'from-gray-50 to-gray-100 dark:from-gray-800/30 dark:to-gray-900/30 border-gray-300 dark:border-gray-600 opacity-75'
                        : 'from-green-50 to-emerald-50 dark:from-green-900/30 dark:to-emerald-900/30 border-green-200 dark:border-green-700 hover:border-green-400 dark:hover:border-green-500'
                    }`}
                  >
                    {/* Badge de estado */}
                    <div className={`absolute -top-3 -right-3 px-4 py-1 rounded-full text-xs font-bold shadow-lg flex items-center gap-1 ${
                      yasPasado(inscripcion.capacitacion.fechaImparticion)
                        ? 'bg-gradient-to-r from-gray-400 to-gray-500 text-white'
                        : 'bg-gradient-to-r from-green-500 to-emerald-600 text-white'
                    }`}>
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      {yasPasado(inscripcion.capacitacion.fechaImparticion) ? 'Completada' : 'Inscrito'}
                    </div>

                    {/* Icono principal */}
                    <div className="mb-4 flex justify-center">
                      <div className={`w-20 h-20 rounded-2xl flex items-center justify-center shadow-lg transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 ${
                        yasPasado(inscripcion.capacitacion.fechaImparticion)
                          ? 'bg-gradient-to-br from-gray-400 to-gray-500'
                          : 'bg-gradient-to-br from-green-500 to-emerald-600'
                      }`}>
                        <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          {yasPasado(inscripcion.capacitacion.fechaImparticion) ? (
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          ) : (
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          )}
                        </svg>
                      </div>
                    </div>

                    {/* Título */}
                    <h4 className="text-xl font-bold mb-3 text-center line-clamp-2 min-h-[3.5rem]">
                      {inscripcion.capacitacion.titulo}
                    </h4>

                    {/* Fecha de inscripción */}
                    <div className="bg-white/60 dark:bg-gray-800/60 rounded-lg p-2 mb-3 text-center backdrop-blur-sm">
                      <p className="text-xs text-green-700 dark:text-green-300 font-semibold">
                        📅 Inscrito el {new Date(inscripcion.fechaInscripcion).toLocaleDateString('es-MX', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric'
                        })}
                      </p>
                    </div>

                    {/* Descripción */}
                    <p className="text-sm text-green-700 dark:text-green-300 mb-4 text-center line-clamp-2 min-h-[2.5rem]">
                      {inscripcion.capacitacion.descripcion || "Sin descripción"}
                    </p>

                    {/* Detalles en cards */}
                    <div className="space-y-2 mb-4">
                      <div className="bg-white/60 dark:bg-gray-800/60 rounded-xl p-3 flex items-center gap-2 backdrop-blur-sm">
                        <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-2 rounded-lg">
                          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </div>
                        <div className="flex-1">
                          <p className="text-xs text-gray-500 dark:text-gray-400 font-semibold">Fecha de Capacitación</p>
                          <p className="text-sm font-bold text-gray-800 dark:text-gray-200">
                            {new Date(inscripcion.capacitacion.fechaImparticion).toLocaleDateString('es-MX', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric'
                            })}
                          </p>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div className="bg-white/60 dark:bg-gray-800/60 rounded-xl p-3 backdrop-blur-sm">
                          <div className="flex items-center gap-1 mb-1">
                            <svg className="w-3 h-3 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                            </svg>
                            <p className="text-xs text-gray-500 dark:text-gray-400 font-semibold">Duración</p>
                          </div>
                          <p className="text-sm font-bold text-purple-700 dark:text-purple-400">
                            {inscripcion.capacitacion.duracion}h
                          </p>
                        </div>

                        <div className="bg-white/60 dark:bg-gray-800/60 rounded-xl p-3 backdrop-blur-sm">
                          <div className="flex items-center gap-1 mb-1">
                            <svg className="w-3 h-3 text-orange-600" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" />
                            </svg>
                            <p className="text-xs text-gray-500 dark:text-gray-400 font-semibold">Instructor</p>
                          </div>
                          <p className="text-xs font-bold text-orange-700 dark:text-orange-400 truncate" title={inscripcion.capacitacion.instructor || "Por definir"}>
                            {inscripcion.capacitacion.instructor || "Por definir"}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Badge de asistencia */}
                    {inscripcion.asistio && (
                      <div className="mb-3 bg-gradient-to-r from-green-100 to-emerald-100 dark:from-green-900/50 dark:to-emerald-900/50 border-2 border-green-400 dark:border-green-600 rounded-xl p-3 flex items-center justify-center gap-2">
                        <svg className="w-5 h-5 text-green-700 dark:text-green-300" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <span className="text-green-800 dark:text-green-200 font-bold text-sm">✓ Asistencia Confirmada</span>
                      </div>
                    )}

                    {/* Botón de cancelar */}
                    <button
                      onClick={() => handleCancelClick(inscripcion)}
                      className="w-full bg-gradient-to-r from-red-500 via-red-600 to-red-700 hover:from-red-600 hover:via-red-700 hover:to-red-800 text-white font-bold py-3 px-4 rounded-xl transition-all duration-300 shadow-lg hover:shadow-2xl transform hover:scale-105 flex items-center justify-center gap-2"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                      Cancelar Inscripción
                    </button>

                    {/* Efecto de brillo en hover */}
                    <div className="absolute inset-0 bg-gradient-to-tr from-green-400/0 via-emerald-400/0 to-green-400/0 group-hover:from-green-400/10 group-hover:via-emerald-400/10 group-hover:to-green-400/10 rounded-2xl transition-all duration-300 pointer-events-none"></div>
                  </div>
                ))}

                {misCapacitaciones.length === 0 && (
                  <div className="col-span-full text-center py-12">
                    <svg className="w-16 h-16 text-auto-tertiary mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                    <h3 className="text-xl font-semibold text-auto-primary mb-2">No tienes capacitaciones inscritas</h3>
                    <p className="text-auto-secondary">Explora las capacitaciones disponibles y comienza a aprender</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sección Capacitaciones Disponibles */}
          <div>
            <div className="bg-auto-secondary rounded-2xl shadow-xl p-6 md:p-8 border border-auto backdrop-blur-sm">
              <div className="flex items-center gap-2 mb-6">
                <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-3 rounded-xl shadow-lg">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-auto-primary">
                  Capacitaciones Disponibles
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {capacitacionesOrdenadas.map((capacitacion) => (
                    <div 
                      key={capacitacion.capacitacionId} 
                      className={`group relative bg-gradient-to-br rounded-2xl p-6 border-2 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 ${
                        yasPasado(capacitacion.fechaImparticion)
                          ? 'from-gray-50 to-gray-100 dark:from-gray-800/30 dark:to-gray-900/30 border-gray-300 dark:border-gray-600 opacity-75'
                          : 'from-sky-50 to-cyan-50 dark:from-sky-900/30 dark:to-cyan-900/30 border-sky-200 dark:border-sky-700 hover:border-sky-400 dark:hover:border-sky-500'
                      }`}
                    >
                      {/* Badge decorativo superior */}
                      <div className={`absolute -top-3 -right-3 px-4 py-1 rounded-full text-xs font-bold shadow-lg transform transition-transform duration-300 ${
                        yasPasado(capacitacion.fechaImparticion)
                          ? 'bg-gradient-to-r from-gray-400 to-gray-500 text-white rotate-12 group-hover:rotate-0'
                          : 'bg-gradient-to-r from-amber-400 to-orange-500 text-white rotate-12 group-hover:rotate-0'
                      }`}>
                        {yasPasado(capacitacion.fechaImparticion) ? '📅 Pasada' : '✨ Nueva'}
                      </div>

                      {/* Icono principal */}
                      <div className="mb-4 flex justify-center">
                        <div className={`w-20 h-20 rounded-2xl flex items-center justify-center shadow-lg transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 ${
                          yasPasado(capacitacion.fechaImparticion)
                            ? 'bg-gradient-to-br from-gray-400 to-gray-500'
                            : 'bg-gradient-to-br from-sky-500 to-cyan-600'
                        }`}>
                          <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                          </svg>
                        </div>
                      </div>

                      {/* Título */}
                      <h4 className={`text-xl font-bold mb-3 text-center line-clamp-2 min-h-[3.5rem] ${
                        yasPasado(capacitacion.fechaImparticion)
                          ? 'text-gray-700 dark:text-gray-300'
                          : 'text-sky-900 dark:text-sky-100'
                      }`}>
                        {capacitacion.titulo}
                      </h4>

                      {/* Descripción */}
                      <p className="text-sm text-sky-700 dark:text-sky-300 mb-4 text-center line-clamp-2 min-h-[2.5rem]">
                        {capacitacion.descripcion || "Amplía tus conocimientos con esta capacitación"}
                      </p>

                      {/* Detalles en cards */}
                      <div className="space-y-2 mb-5">
                        <div className="bg-white/60 dark:bg-gray-800/60 rounded-xl p-3 flex items-center gap-2 backdrop-blur-sm">
                          <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-2 rounded-lg">
                            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                          </div>
                          <div className="flex-1">
                            <p className="text-xs text-gray-500 dark:text-gray-400 font-semibold">Fecha</p>
                            <p className="text-sm font-bold text-gray-800 dark:text-gray-200">
                              {new Date(capacitacion.fechaImparticion).toLocaleDateString('es-MX', {
                                day: 'numeric',
                                month: 'short',
                                year: 'numeric'
                              })}
                            </p>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                          <div className="bg-white/60 dark:bg-gray-800/60 rounded-xl p-3 backdrop-blur-sm">
                            <div className="flex items-center gap-1 mb-1">
                              <svg className="w-3 h-3 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                              </svg>
                              <p className="text-xs text-gray-500 dark:text-gray-400 font-semibold">Duración</p>
                            </div>
                            <p className="text-sm font-bold text-purple-700 dark:text-purple-400">
                              {capacitacion.duracion}h
                            </p>
                          </div>

                          <div className="bg-white/60 dark:bg-gray-800/60 rounded-xl p-3 backdrop-blur-sm">
                            <div className="flex items-center gap-1 mb-1">
                              <svg className="w-3 h-3 text-orange-600" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" />
                              </svg>
                              <p className="text-xs text-gray-500 dark:text-gray-400 font-semibold">Instructor</p>
                            </div>
                            <p className="text-xs font-bold text-orange-700 dark:text-orange-400 truncate" title={capacitacion.instructor || "Por asignar"}>
                              {capacitacion.instructor || "Por asignar"}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Botón de acción */}
                      <button
                        onClick={() => inscribirse(capacitacion.capacitacionId)}
                        disabled={yasPasado(capacitacion.fechaImparticion)}
                        className={`w-full font-bold py-3 px-4 rounded-xl transition-all duration-300 shadow-lg flex items-center justify-center gap-2 ${
                          yasPasado(capacitacion.fechaImparticion)
                            ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
                            : 'bg-gradient-to-r from-sky-500 via-cyan-500 to-blue-600 hover:from-sky-600 hover:via-cyan-600 hover:to-blue-700 text-white hover:shadow-2xl transform hover:scale-105'
                        }`}
                      >
                        {yasPasado(capacitacion.fechaImparticion) ? (
                          <>
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            Capacitación Finalizada
                          </>
                        ) : (
                          <>
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                            </svg>
                            ¡Inscribirme Ahora!
                          </>
                        )}
                      </button>

                      {/* Efecto de brillo en hover */}
                      <div className="absolute inset-0 bg-gradient-to-tr from-sky-400/0 via-cyan-400/0 to-blue-400/0 group-hover:from-sky-400/10 group-hover:via-cyan-400/10 group-hover:to-blue-400/10 rounded-2xl transition-all duration-300 pointer-events-none"></div>
                    </div>
                  ))}

                {capacitacionesDisponibles.filter(c => !estaInscrito(c.capacitacionId)).length === 0 && (
                  <div className="col-span-full text-center py-12">
                    <div className="inline-block p-6 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-2xl border-2 border-green-200 dark:border-green-700">
                      <svg className="w-20 h-20 text-green-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <h3 className="text-2xl font-bold text-green-800 dark:text-green-200 mb-2">
                        {misCapacitaciones.length > 0 
                          ? "¡Felicitaciones! 🎉" 
                          : "No hay capacitaciones disponibles"}
                      </h3>
                      <p className="text-green-600 dark:text-green-400">
                        {misCapacitaciones.length > 0 
                          ? "Ya estás inscrito en todas las capacitaciones disponibles" 
                          : "Pronto habrá nuevas oportunidades de aprendizaje"}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Diálogo de confirmación */}
      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        title="¿Cancelar Inscripción?"
        message={`¿Estás seguro de que deseas cancelar tu inscripción a "${confirmDialog.capacitacion?.capacitacion.titulo}"?`}
        details={
          confirmDialog.capacitacion
            ? [
                {
                  label: "Capacitación",
                  value: confirmDialog.capacitacion.capacitacion.titulo,
                },
                {
                  label: "Fecha",
                  value: new Date(confirmDialog.capacitacion.capacitacion.fechaImparticion).toLocaleDateString('es-MX', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric'
                  }),
                },
                {
                  label: "Instructor",
                  value: confirmDialog.capacitacion.capacitacion.instructor || "No asignado",
                },
                {
                  label: "Duración",
                  value: `${confirmDialog.capacitacion.capacitacion.duracion} horas`,
                },
              ]
            : []
        }
        confirmLabel="Sí, Cancelar Inscripción"
        cancelLabel="No, Mantener Inscripción"
        onConfirm={handleConfirmCancel}
        onCancel={() => setConfirmDialog({ isOpen: false, capacitacion: null })}
        type="danger"
      />
    </div>
  );
}

export default MisCapacitaciones;

