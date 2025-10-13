import { useNavigate } from "react-router-dom";
function Enfermero() {
  const navigate = useNavigate();
  const EnfermeroOptions = [
    {
      id: "RegistrarEnfermero",
      name: "Registrar Enfermero",
      description: "Registrar un nuevo enfermero en el sistema",
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
  ];
  const handleOptionClick = (optionId: string) => {
    console.log(`Navegando a: ${optionId}`);
    switch (optionId) {
      case "RegistrarEnfermero":
        navigate("/RegistrarEnfermero");
        break;
    }
  };
  return (
    <div className="min-h-screen bg-auto-primary pt-20">
      <div className="bg-gradient-to-br from-sky-400/15 via-cyan-300/10 to-sky-400/15 w-full h-full absolute"></div>
      <div className="relative min-h-screen">
          {/* Header */}
          <div className="bg-auto-secondary backdrop-blur-sm border-b border-auto shadow-lg">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-bold text-auto-primary">
                    Panel de Administración de Enfermeros
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
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  {/*Opciones de enfermeros*/}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {EnfermeroOptions.map((option) => (
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
              </div>
            </div>
          </main>
      </div>
    </div>
  );
}

export default Enfermero;
