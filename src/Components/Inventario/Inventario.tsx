import { useNavigate } from "react-router-dom";

function Inventario() {
  const navigate = useNavigate();

  const options = [
    {
      id: "Medicamentos",
      title: "Gestionar Medicamentos",
      description: "Control de stock, dosis y administración",
      route: "/Medicamento",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#ffffff"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <path d="M12 11v4"></path>
          <path d="M14 13h-4"></path>
          <path d="M16 6V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"></path>
          <path d="M18 6v14"></path>
          <path d="M6 6v14"></path>
          <rect width="20" height="14" x="2" y="6" rx="2"></rect>
        </svg>
      ),
    },
    {
      id: "Insumos",
      title: "Gestionar Insumos",
      description: "Inventario de suministros y materiales",
      route: "/Insumos",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#ffffff"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <path d="M10 10.01h.01"></path>
          <path d="M10 14.01h.01"></path>
          <path d="M14 10.01h.01"></path>
          <path d="M14 14.01h.01"></path>
          <path d="M18 6v11.5"></path>
          <path d="M6 6v12"></path>
          <rect x="2" y="6" width="20" height="12" rx="2"></rect>
        </svg>
      ),
    },
    {
      id: "InventarioServicios",
      title: "Inventario por Servicio",
      description: "Estado de medicamentos e insumos en cada servicio",
      route: "/inventario/servicios",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#ffffff"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <path d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
        </svg>
      ),
    },
  ];

  const handleClick = (route: string) => {
    navigate(route);
  };

  return (
    <div className="min-h-screen bg-auto-primary pt-20">
      <div className="bg-gradient-to-br from-sky-400/15 via-cyan-300/10 to-sky-400/15 h-full w-full absolute top-0 left-0"></div>
      <div className="relative min-h-screen">
        <div className="bg-auto-secondary backdrop-blur-sm border-b border-auto shadow-lg">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <h1 className="text-3xl font-bold text-auto-primary">
              Inventario General
            </h1>
            <p className="text-auto-secondary mt-1">
              Accesos rápidos a módulos de inventario
            </p>
          </div>
        </div>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {options.map((option) => (
              <div
                key={option.id}
                onClick={() => handleClick(option.route)}
                className="bg-auto-secondary backdrop-blur-sm border border-auto rounded-3xl p-6 cursor-pointer transition-all duration-300 hover:shadow-2xl hover:scale-105 hover:border-opacity-80 group"
              >
                <div className="flex items-center justify-center mb-4">
                  <div className="w-16 h-16 bg-gradient-to-r from-sky-500 to-cyan-500 rounded-full flex items-center justify-center text-white group-hover:scale-110 transition-transform duration-300">
                    {option.icon}
                  </div>
                </div>
                <h2 className="text-xl font-semibold text-auto-primary text-center">
                  {option.title}
                </h2>
                <p className="text-sm text-auto-secondary text-center mt-2">
                  {option.description}
                </p>
                <span className="text-sm font-medium text-auto-tertiary group-hover:text-auto-secondary transition-colors duration-300 block text-center mt-3">
                  Ir al módulo →
                </span>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}

export default Inventario;

