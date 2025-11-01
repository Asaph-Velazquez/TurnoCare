import { useState } from "react";
import AsignarMedicamentosInsumos from "./AsignarMedicamentosInsumos";
import ActualizarAsignaciones from "./ActualizarAsignaciones";
import EliminarAsignaciones from "./EliminarAsignaciones";

function GestionAsignaciones() {
  const [mainView, setMainView] = useState<'asignar' | 'actualizar' | 'eliminar'>('asignar');

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
        {mainView === 'asignar' && <AsignarMedicamentosInsumos />}
        {mainView === 'actualizar' && <ActualizarAsignaciones />}
        {mainView === 'eliminar' && <EliminarAsignaciones />}
      </div>
    </div>
  );
}

export default GestionAsignaciones;
