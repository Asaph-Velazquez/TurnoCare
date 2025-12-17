import { useNavigate } from "react-router-dom";

function Capacitaciones() {
  const navigate = useNavigate();

  const capacitacionesOptions = [
    {
      id: "RegistrarCapacitacion",
      name: "Registrar Capacitación",
      description: "Crear una nueva capacitación para enfermeros",
      icon: (
        <svg
          className="w-8 h-8 text-auto-primary"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 6v6m0 0v6m0-6h6m-6 0H6"
          />
        </svg>
      ),
    },
    {
      id: "ListarCapacitaciones",
      name: "Listar Capacitaciones",
      description: "Ver todas las capacitaciones registradas",
      icon: (
        <svg
          className="w-8 h-8 text-auto-primary"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
          />
        </svg>
      ),
    },
    {
      id: "ActualizarCapacitacion",
      name: "Actualizar Capacitación",
      description: "Modificar información de capacitaciones existentes",
      icon: (
        <svg
          className="w-8 h-8 text-auto-primary"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
          />
        </svg>
      ),
    },
    {
      id: "EliminarCapacitacion",
      name: "Eliminar Capacitación",
      description: "Eliminar capacitaciones del sistema",
      icon: (
        <svg
          className="w-8 h-8 text-auto-primary"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
          />
        </svg>
      ),
    },
  ];

  const handleOptionClick = (optionId: string) => {
    switch (optionId) {
      case "RegistrarCapacitacion":
        navigate("/capacitaciones/registrar");
        break;
      case "ListarCapacitaciones":
        navigate("/capacitaciones/listar");
        break;
      case "ActualizarCapacitacion":
        navigate("/capacitaciones/actualizar");
        break;
      case "EliminarCapacitacion":
        navigate("/capacitaciones/eliminar");
        break;
    }
  };

  return (
    <div className="min-h-screen bg-auto-primary pt-20">
      {/* Fondo decorativo */}
      <div className="bg-gradient-to-br from-sky-400/15 via-cyan-300/10 to-sky-400/15 h-185 w-full absolute top-0 left-0"></div>
      <div className="relative min-h-screen">
        {/* Header */}
        <div className="bg-auto-secondary backdrop-blur-sm border-b border-auto shadow-lg">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-auto-primary">
                  Panel de Gestión de Capacitaciones
                </h1>
                <p className="text-auto-secondary mt-1">
                  Sistema TurnoCare - Gestión Hospitalaria
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-auto-secondary backdrop-blur-sm border border-auto rounded-3xl shadow-2xl p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {capacitacionesOptions.map((option) => (
                <div
                  key={option.id}
                  onClick={() => handleOptionClick(option.id)}
                  className="bg-auto-secondary backdrop-blur-sm border border-auto rounded-3xl p-6 cursor-pointer transition-all duration-300 hover:shadow-2xl hover:scale-105 hover:border-opacity-80 group"
                >
                  <div className="flex items-center justify-center mb-4">
                    <div className="w-16 h-16 bg-gradient-to-r from-sky-500 to-cyan-500 rounded-full flex items-center justify-center text-white group-hover:scale-110 transition-transform duration-300">
                      {option.icon}
                    </div>
                  </div>
                  <h2 className="text-lg font-semibold text-auto-primary text-center">
                    {option.name}
                  </h2>
                  <p className="text-sm text-auto-secondary text-center">
                    {option.description}
                  </p>
                  <span className="text-sm font-medium text-auto-tertiary group-hover:text-auto-secondary transition-colors duration-300 block text-center mt-3">
                    Clic para acceder →
                  </span>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default Capacitaciones;

