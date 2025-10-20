import { useNavigate } from "react-router-dom";
import HospitalList from "./HospitalList";
function Hospital() {
  const navigate = useNavigate();

  const HospitalOptions = [
    {
      id: "RegistrarHospital",
      name: "Registrar Hospital",
      description: "Registrar un nuevo hospital en el sistema",
      icon: (
        <svg
          width="48"
          height="48"
          viewBox="0 0 48 48"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M16 20H20V23H16V20Z" fill="currentColor" />
          <path d="M20 25H16V28H20V25Z" fill="currentColor" />
          <path d="M16 30H20V33H16V30Z" fill="currentColor" />
          <path d="M26 20H22V23H26V20Z" fill="currentColor" />
          <path d="M22 25H26V28H22V25Z" fill="currentColor" />
          <path d="M26 30H22V33H26V30Z" fill="currentColor" />
          <path d="M28 20H32V23H28V20Z" fill="currentColor" />
          <path d="M32 25H28V28H32V25Z" fill="currentColor" />
          <path d="M28 30H32V33H28V30Z" fill="currentColor" />
          <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M31 6C31 4.89543 30.1046 4 29 4H19C17.8954 4 17 4.89543 17 6L10 6V8H12V42H9C8.44772 42 8 42.4477 8 43C8 43.5523 8.44772 44 9 44H39C39.5523 44 40 43.5523 40 43C40 42.4477 39.5523 42 39 42H36V8H38V6H31ZM29 18C30.1046 18 31 17.1046 31 16V11H34V42H31V38H32V36H16V38H17V42H14V11H17V16C17 17.1046 17.8954 18 19 18H29ZM23 42H25V38H23V42ZM34 8V9H31V8H34ZM14 9H17V8H14V9ZM20 10H23V7H25V10H28V12H25V15H23V12H20V10Z"
            fill="currentColor"
          />
        </svg>
      ),
    },
    {
      id: "EliminarHospital",
      name: "Eliminar Hospital",
      description: "Eliminar un hospital existente del sistema",
      icon: (
        <svg
          width="48"
          height="48"
          viewBox="0 0 48 48"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M14 24V32H22V24H14ZM20 30V26H16V30H20Z"
            fill="currentColor"
          />
          <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M19 6C16.3933 6 14.1749 7.66227 13.3469 9.98462H6V12.4662L10 15.4969V40H7C6.44772 40 6 40.4477 6 41C6 41.5523 6.44772 42 7 42H10V42.0154H38V42H41C41.5523 42 42 41.5523 42 41C42 40.4477 41.5523 40 41 40H38V15.5321L42.5 12.5014V9.98462H24.6531C23.8251 7.66227 21.6067 6 19 6ZM24.6586 14C24.8797 13.3744 25 12.7013 25 12L25 11.9846H39.687L36.6946 14H24.6586ZM23.4722 16C22.3736 17.2275 20.777 18 19 18C17.223 18 15.6264 17.2275 14.5278 16H12V40H24V24H34V40H36V16H23.4722ZM13 12C13 12.7013 13.1203 13.3744 13.3414 14H11.3361L8.67616 11.9846H13L13 12ZM20 11V9H18V11H16V13H18V15H20V13H22V11H20ZM32 26V40H26V26H32Z"
            fill="currentColor"
          />
        </svg>
      ),
    },
    {
      id: "ActualizarHospital",
      name: "Actualizar Hospital",
      description: "Actualizar la información de un hospital existente",
      icon: (
        <svg
          width="48"
          height="48"
          viewBox="0 0 48 48"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M31 30H34V28H31V30Z" fill="currentColor" />
          <path d="M34 34H31V32H34V34Z" fill="currentColor" />
          <path d="M31 38H34V36H31V38Z" fill="currentColor" />
          <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M17 4L33 10V24H37C37.5523 24 38 24.4477 38 25V42H39C39.5523 42 40 42.4477 40 43C40 43.5523 39.5523 44 39 44H9C8.44772 44 8 43.5523 8 43C8 42.4477 8.44772 42 9 42H10V21C10 20.4477 10.4477 20 11 20H13L13 13H15L15 20H17V4ZM36 42H34V40H31V42H29V26H36V42ZM17 22H12V42H17V22ZM22 13H20V15H22V13ZM24 13H26V15H24V13ZM30 13H28V15H30V13ZM20 17H22V19H20V17ZM26 17H24V19H26V17ZM28 17H30V19H28V17ZM22 21H20V23H22V21ZM24 21H26V23H24V21ZM30 21H28V23H30V21ZM20 25H22V27H20V25ZM26 25H24V27H26V25ZM22 29H20V31H22V29ZM24 29H26V31H24V29ZM20 33H22V35H20V33ZM26 33H24V35H26V33ZM22 37H20V39H22V37ZM24 37H26V39H24V37Z"
            fill="currentColor"
          />
        </svg>
      ),
    },
  ];

  const handleOptionClick = (optionId: string) => {
    console.log(`Navegando a: ${optionId}`);
    switch (optionId) {
      case "RegistrarHospital":
        navigate("/RegistrarHospital");
        break;
      case "EliminarHospital":
        navigate("/EliminarHospital");
        break;
      case "ActualizarHospital":
        navigate("/ActualizarHospital");
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
                  Panel de Administración de Hospitales
                </h1>
                <p className="text-auto-secondary mt-1">
                  Sistema TurnoCare - Gestión Hospitalaria
                </p>
              </div>
            </div>
          </div>
        </div>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-auto-secondary backdrop-blur-sm border border-auto rounded-3xl shadow-2xl p-6 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {HospitalOptions.map((option) => (
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
            <HospitalList />
          </div>
        </main>
      </div>
    </div>
  );
}
export default Hospital;
