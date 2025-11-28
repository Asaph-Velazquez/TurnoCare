interface PanelSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectPanel: (panel: 'admin' | 'enfermero') => void;
}

function PanelSelectionModal({ isOpen, onClose, onSelectPanel }: PanelSelectionModalProps) {
  if (!isOpen) return null;

  console.log('Modal renderizado - isOpen:', isOpen);

  const handlePanelSelect = (panel: 'admin' | 'enfermero') => {
    console.log('Panel seleccionado:', panel);
    onSelectPanel(panel);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
      ></div>

      {/* Modal */}
      <div className="relative bg-white dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-600 rounded-3xl shadow-2xl max-w-2xl w-full p-8 z-10" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full mb-4 shadow-lg">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <h2 className="text-3xl font-bold text-auto-primary mb-2">
            Selecciona tu Panel
          </h2>
          <p className="text-auto-secondary">
            Como coordinador, puedes acceder a diferentes áreas del sistema
          </p>
        </div>

        {/* Opciones de Panel */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Panel de Administración */}
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              handlePanelSelect('admin');
            }}
            className="group relative bg-gradient-to-br from-sky-50 to-cyan-50 dark:from-sky-900/20 dark:to-cyan-900/20 border-2 border-sky-300 dark:border-sky-700 rounded-2xl p-6 hover:shadow-2xl hover:scale-105 transition-all duration-300 text-left"
          >
            <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
              <svg className="w-6 h-6 text-sky-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </div>
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-gradient-to-br from-sky-500 to-cyan-500 rounded-xl shadow-lg">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-sky-900 dark:text-sky-300 mb-1">
                  Panel de Administración
                </h3>
                <p className="text-xs text-sky-700 dark:text-sky-400 font-medium">
                  Gestión completa del sistema
                </p>
              </div>
            </div>
            <ul className="space-y-2 text-sm text-sky-800 dark:text-sky-300">
              <li className="flex items-center gap-2">
                <svg className="w-4 h-4 text-sky-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Gestión de enfermeros
              </li>
              <li className="flex items-center gap-2">
                <svg className="w-4 h-4 text-sky-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Gestión de pacientes
              </li>
              <li className="flex items-center gap-2">
                <svg className="w-4 h-4 text-sky-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Inventario y recursos
              </li>
              <li className="flex items-center gap-2">
                <svg className="w-4 h-4 text-sky-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Reportes y estadísticas
              </li>
            </ul>
          </button>

          {/* Panel de Enfermero */}
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              handlePanelSelect('enfermero');
            }}
            className="group relative bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border-2 border-purple-300 dark:border-purple-700 rounded-2xl p-6 hover:shadow-2xl hover:scale-105 transition-all duration-300 text-left"
          >
            <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
              <svg className="w-6 h-6 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </div>
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl shadow-lg">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-purple-900 dark:text-purple-300 mb-1">
                  Panel de Enfermero
                </h3>
                <p className="text-xs text-purple-700 dark:text-purple-400 font-medium">
                  Atención directa al paciente
                </p>
              </div>
            </div>
            <ul className="space-y-2 text-sm text-purple-800 dark:text-purple-300">
              <li className="flex items-center gap-2">
                <svg className="w-4 h-4 text-purple-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Mis pacientes asignados
              </li>
              <li className="flex items-center gap-2">
                <svg className="w-4 h-4 text-purple-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Notas médicas
              </li>
              <li className="flex items-center gap-2">
                <svg className="w-4 h-4 text-purple-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Turnos y horarios
              </li>
              <li className="flex items-center gap-2">
                <svg className="w-4 h-4 text-purple-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Inventario disponible
              </li>
            </ul>
          </button>
        </div>

        {/* Footer */}
        <div className="text-center">
          <p className="text-sm text-auto-secondary">
            Puedes cambiar de panel en cualquier momento desde el menú de navegación
          </p>
        </div>
      </div>
    </div>
  );
}

export default PanelSelectionModal;
