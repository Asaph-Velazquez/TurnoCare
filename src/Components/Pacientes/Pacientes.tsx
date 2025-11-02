  import { useNavigate } from "react-router-dom";
import PacientesList, { type Paciente } from "./PacientesList";

function Pacientes() {
  const navigate = useNavigate();
  
  // Opciones del menú de pacientes
  const PacienteOptions = [
    {
      id: "RegistrarPaciente",
      name: "Registrar Paciente",
      description: "Registrar un nuevo paciente en el sistema",
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
            strokeWidth={2}
            d="M18 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0ZM3 19.235v-.11a6.375 6.375 0 0 1 12.75 0v.109A12.318 12.318 0 0 1 9.374 21c-2.331 0-4.512-.645-6.374-1.766Z"
          />
        </svg>
      ),
    },
    {
      id: "EliminarPaciente",
      name: "Eliminar Paciente",
      description: "Eliminar un paciente existente del sistema",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="1.5"
          stroke="currentColor"
          className="size-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M22 10.5h-6m-2.25-4.125a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0ZM4 19.235v-.11a6.375 6.375 0 0 1 12.75 0v.109A12.318 12.318 0 0 1 10.374 21c-2.331 0-4.512-.645-6.374-1.766Z"
          />
        </svg>
      ),
    },
    {
      id: "ActualizarPaciente",
      name: "Actualizar Paciente",
      description: "Actualizar la información de un paciente existente",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="1.5"
          stroke="currentColor"
          className="size-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
          />
        </svg>
      ),
    },
        {
      id: "AsignarServicioPaciente",
      name: "Asignar Servicio de Enfermería",
      description: "Asignar un paciente a un servicio de enfermería",
      icon: (
        <svg
          className="w-8 h-8"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
          />
        </svg>
      ),
    },
    {
      id: "AsignarMedicamentosInsumos",
      name: "Administrar Tratamientos",
      description: "Asignar medicamentos e insumos a pacientes",
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
            d="M9.75 3.104v5.714a2.25 2.25 0 0 1-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 0 1 4.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0 1 12 16a9.065 9.065 0 0 1-6.23-.693L5 15.3m14.8 0 .94.342m-16.52-.34-.94.342m0 0a9.068 9.068 0 0 0-.445 1.682m16.93 0a9.068 9.068 0 0 0-.445-1.682M1.5 18.75h21"
          />
        </svg>
      ),
    }
  ];

  // Manejar navegación según opción seleccionada
  const handleOptionClick = (optionId: string) => {
    switch (optionId) {
      case "RegistrarPaciente":
        navigate("/pacientes/registrar");
        break;
      case "AsignarMedicamentosInsumos":
        navigate("/pacientes/gestionar-asignaciones");
        break;
      case "EliminarPaciente":
        navigate("/pacientes/eliminar");
        break;
      case "ActualizarPaciente":
        navigate("/pacientes/actualizar");
        break;
      case "AsignarServicioPaciente":
        navigate("/AsignarServicioPaciente");
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
                  Panel de Administración de Pacientes
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
          <div className="bg-auto-secondary backdrop-blur-sm border border-auto rounded-3xl shadow-2xl p-6 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {PacienteOptions.map((option) => (
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

          {/* Lista de pacientes */}
          <div className="mt-8">
            <PacientesList
            onPacienteSelect={(paciente: Paciente) => {
              navigate(`/pacientes/detalles/${paciente.pacienteId}`);            
            }}
            />
          </div>
        </main>
      </div>
    </div>
  );
}

export default Pacientes;