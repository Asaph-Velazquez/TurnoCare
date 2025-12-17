import { useNavigate } from "react-router-dom";
import TurnosList from "./TurnosList";

function Turnos() {
  const navigate = useNavigate();
  
  // Opciones del menú de turnos laborales
  const TurnosOptions = [
    {
      id: "RegistrarTurno",
      name: "Crear Turno Laboral",
      description: "Registrar un nuevo turno de trabajo en el hospital",
      icon: (
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
            d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
          />
        </svg>
      ),
    },
    {
      id: "ActualizarTurno",
      name: "Modificar Turno",
      description: "Actualizar horarios y configuración de turnos",
      icon: (
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
            d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
          />
        </svg>
      ),
    },
    {
      id: "EliminarTurno",
      name: "Cancelar Turno",
      description: "Eliminar o cancelar turnos laborales programados",
      icon: (
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
            d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
          />
        </svg>
      ),
    }
  ];

  // Manejar navegación según opción seleccionada
  const handleOptionClick = (optionId: string) => {
    switch (optionId) {
      case "RegistrarTurno":
        navigate("/turnos/registrar");
        break;
      case "EliminarTurno":
        navigate("/turnos/eliminar");
        break;
      case "ActualizarTurno":
        navigate("/turnos/actualizar");
        break;
    }
  };

  return (
    <div className="min-h-screen bg-auto-primary pt-20">
      {/* Fondo decorativo */}
      <div className="bg-gradient-to-br from-sky-400/15 via-cyan-300/10 to-sky-400/15 h-127 w-full absolute top-0 left-0"></div>
      <div className="relative min-h-screen">
        {/* Header */}
        <div className="bg-auto-secondary backdrop-blur-sm border-b border-auto shadow-lg">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-auto-primary">
                  Gestión de Turnos Laborales
                </h1>
                <p className="text-auto-secondary mt-1">
                  Sistema TurnoCare - Control de Turnos de Personal Hospitalario
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-auto-secondary backdrop-blur-sm border border-auto rounded-3xl shadow-2xl p-6 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {TurnosOptions.map((option) => (
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

          {/* Lista de turnos */}
          <div className="mt-8">
            <TurnosList />
          </div>
        </main>
      </div>
    </div>
  );
}

export default Turnos;

