import React, { useState } from "react";
import FormService from "./FormService";
import { ServiceFields } from "./serviceFields";
import { useNavigate } from "react-router-dom";


const Service: React.FC = () => {
  const [selectedOption, setSelectedOption] = useState<keyof typeof ServiceFields | null>(null);
  const navigate = useNavigate();

  const ServiceOptions = [
    {
      id: "RegistrarServicio",
      name: "Registrar Servicio",
      description: "Agregar un nuevo servicio al sistema",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-8 h-8 text-auto-primary"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
        </svg>
      ),
    },
    {
      id: "ListarServicios",
      name: "Listar Servicios",
      description: "Ver todos los servicios registrados",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-8 h-8 text-auto-primary"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 7h18M3 12h18M3 17h18" />
        </svg>
      ),
    },
    {
      id: "ActualizarServicio",
      name: "Actualizar Servicio",
      description: "Modificar información de un servicio existente",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-8 h-8 text-auto-primary"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M16.862 3.487a2.25 2.25 0 1 1 3.182 3.182L7.5 19.213H4.5v-3l12.362-12.726z"
          />
        </svg>
      ),
    },
    {
      id: "EliminarServicio",
      name: "Eliminar Servicio",
      description: "Eliminar un servicio del sistema",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-8 h-8 text-auto-primary"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      ),
    },
  ];

  // Si hay una opción seleccionada, renderiza FormService
  if (selectedOption) {
    return (
      <FormService
        action={selectedOption}
        fields={ServiceFields[selectedOption]}
        onBack={() => setSelectedOption(null)} 
      />
    );
  }

  return (
    <div className="min-h-screen bg-auto-primary pt-20 relative">
      {/* Fondo decorativo */}
      <div className="bg-gradient-to-br from-sky-400/15 via-cyan-300/10 to-sky-400/15 h-127 w-full absolute top-0 left-0"></div>

      {/* Header */}
      <div className="bg-auto-secondary backdrop-blur-sm border-b border-auto shadow-lg relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-3xl font-bold text-auto-primary">Panel de Servicios</h1>
          <p className="text-auto-secondary mt-1">
            Sistema TurnoCare - Gestión de Servicios
          </p>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        <div className="bg-auto-secondary backdrop-blur-sm border border-auto rounded-3xl shadow-2xl p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {ServiceOptions.map((option) => (
              <div
                key={option.id}
                onClick={() => setSelectedOption(option.id as keyof typeof ServiceFields)}
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

        {/* Aquí puedes agregar un listado de servicios si quieres */}
        {/* <div className="mt-8"><ServiceList /></div> */}
      </main>
    </div>
  );
};

export default Service;
