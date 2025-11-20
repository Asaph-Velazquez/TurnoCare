import { useNavigate } from "react-router-dom";
import MedicamentoList from "./MedicamentoList";

function Medicamento() {
  const navigate = useNavigate();

  const options = [
    {
      id: "RegistrarMedicamento",
      name: "Registrar Medicamento",
      description: "Registrar un nuevo medicamento en el sistema",
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
            d="M12 4.5v15m7.5-7.5h-15"
          />
        </svg>
      ),
    },
    {
      id: "ActualizarMedicamento",
      name: "Actualizar Medicamento",
      description: "Modificar dosis, frecuencia o vía",
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
            d="M16.862 4.487l1.688-1.688a1.875 1.875 0 112.652 2.652L10.583 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M19.5 7.125L16.875 4.5"
          />
        </svg>
      ),
    },
    {
      id: "EliminarMedicamento",
      name: "Eliminar Medicamento",
      description: "Dar de baja medicamentos obsoletos",
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
            d="M6 7.5l1.5 12.75A1.125 1.125 0 008.624 21h6.752a1.125 1.125 0 001.124-.75L18 7.5"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9.75 9.75l.75 9m3.75-9l-.75 9M4.5 7.5h15M9 4.5h6a.75.75 0 01.75.75V6h-7.5V5.25A.75.75 0 019 4.5z"
          />
        </svg>
      ),
    },
  ];

  const handleOptionClick = (optionId: string) => {
    switch (optionId) {
      case "RegistrarMedicamento":
        navigate("/RegistrarMedicamento");
        break;
      case "ActualizarMedicamento":
        navigate("/ActualizarMedicamento");
        break;
      case "EliminarMedicamento":
        navigate("/EliminarMedicamento");
        break;
      default:
        break;
    }
  };

  return (
    <div className="min-h-screen bg-auto-primary pt-20">
      <div className="bg-gradient-to-br from-sky-400/15 via-cyan-300/10 to-sky-400/15 h-127 w-full absolute top-0 left-0"></div>
      <div className="relative min-h-screen">
        <div className="bg-auto-secondary backdrop-blur-sm border-b border-auto shadow-lg">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-auto-primary">
                  Panel de Medicamentos
                </h1>
                <p className="text-auto-secondary mt-1">
                  Sistema TurnoCare - Gestión de Medicación
                </p>
              </div>
            </div>
          </div>
        </div>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-auto-secondary backdrop-blur-sm border border-auto rounded-3xl shadow-2xl p-6 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {options.map((option) => (
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

          <div className="mt-8">
            <MedicamentoList />
          </div>
        </main>
      </div>
    </div>
  );
}

export default Medicamento;
