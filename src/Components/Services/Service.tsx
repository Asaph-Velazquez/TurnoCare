import { useNavigate } from "react-router-dom";
import React from "react";
import ListarServicios from "./ListarServicios";
const Service: React.FC = () => {
  const navigate = useNavigate();

  const ServiceOptions = [
    {
      id: "RegistrarServicio",
      name: "Registrar Servicio",
      description: "Agregar un nuevo servicio al sistema",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-8 h-8 text-auto-primary">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 2c1.657 0 3 1.343 3 3v2h2a2 2 0 012 2v6a6 6 0 11-12 0V9a2 2 0 012-2h2V5c0-1.657 1.343-3 3-3zM8 11h8" />
        </svg>
      ),
    },
    
    {
      id: "ActualizarServicio",
      name: "Actualizar Servicio",
      description: "Modificar información de un servicio existente",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-8 h-8 text-auto-primary">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 7h16M6 7v10a3 3 0 003 3h6a3 3 0 003-3V7M9 7v-2a3 3 0 016 0v2" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 13h8M8 17h5" />
        </svg>
      ),
    },
    {
      id: "EliminarServicio",
      name: "Eliminar Servicio",
      description: "Eliminar un servicio del sistema",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-8 h-8 text-auto-primary">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 7h18M10 11v6M14 11v6M9 7l1-3h4l1 3" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 11h8" />
        </svg>
      ),
    },
  ];

  const handleOptionClick = (optionId: string) => {
    switch (optionId) {
      case "RegistrarServicio":
        navigate("/RegistrarServicio");
        break;
      case "EliminarServicio":
        navigate("/EliminarServicio");
        break;
      case "ActualizarServicio":
        navigate("/ActualizarServicio");
        break;
      case "ListarServicios":
        navigate("/ListarServicios");
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
                <h1 className="text-3xl font-bold text-auto-primary">Panel de Servicios</h1>
                <p className="text-auto-secondary mt-1">Sistema TurnoCare - Gestión de Servicios</p>
              </div>
            </div>
          </div>
        </div>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-auto-secondary backdrop-blur-sm border border-auto rounded-3xl shadow-2xl p-6 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {ServiceOptions.map((option) => (
                <div
                  key={option.id}
                  onClick={() => handleOptionClick(String(option.id))}
                  className="bg-auto-secondary backdrop-blur-sm border border-auto rounded-3xl p-6 cursor-pointer transition-all duration-300 hover:shadow-2xl hover:scale-105 hover:border-opacity-80 group"
                >
                  <div className="flex items-center justify-center mb-4">
                    <div className="w-16 h-16 bg-gradient-to-r from-sky-500 to-cyan-500 rounded-full flex items-center justify-center text-white group-hover:scale-110 transition-transform duration-300">
                      {option.icon}
                    </div>
                  </div>
                  <h2 className="text-lg font-semibold text-auto-primary text-center">{option.name}</h2>
                  <p className="text-sm text-auto-secondary text-center">{option.description}</p>
                  <span className="text-sm font-medium text-auto-tertiary group-hover:text-auto-secondary transition-colors duration-300 block text-center mt-3">
                    Clic para acceder →
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-8">
            <ListarServicios />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Service;
