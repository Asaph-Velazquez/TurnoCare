import { useNavigate } from "react-router-dom";
import { useAuthListener } from "../../hooks/useAuthListener";

function EnfermeroNav() {
  const navigate = useNavigate();
  const { isCoordinator, isLoggedIn } = useAuthListener();

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    localStorage.removeItem("esCoordinador");
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("userID");
    localStorage.removeItem("numeroEmpleado");
    localStorage.removeItem("nombre");
    // Dispatch custom event to notify other components
    window.dispatchEvent(new Event('authChanged'));
    navigate("/");
  };

  // Only render if logged in as non-coordinator
  if (!isLoggedIn || isCoordinator) {
    return null;
  }

  return (
    <div>
      <nav
        className="fixed top-0 w-full z-50 backdrop-blur-md border-b border-auto"
        style={{ backgroundColor: "var(--nav-bg)" }}
      >
        <div className="w-full max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-r from-sky-500 to-cyan-500 rounded-xl flex items-center justify-center">
                <a href="/NoCoordinador/home">
                  <svg
                    className="w-7 h-7 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                    />
                  </svg>
                </a>
              </div>
              <a href="/NoCoordinador/home">
                <span className="text-2xl font-bold bg-gradient-to-r from-sky-600 to-cyan-600 bg-clip-text text-transparent">
                  Turno Care
                </span>
              </a>
            </div>

            {/* Menu Desktop */}
            <div className="hidden md:flex items-center space-x-8">
              <a
                href="/NoCoordinador/home"
                className="text-auto-secondary hover:text-sky-600 transition-colors"
              >
                Inicio
              </a>
              <a
                href=""
                className="text-auto-secondary hover:text-sky-600 transition-colors"
              >
                Mis Turnos
              </a>
              <a
                href=""
                className="text-auto-secondary hover:text-sky-600 transition-colors"
              >
                Mis Pacientes
              </a>
              <a
                href=""
                className="text-auto-secondary hover:text-sky-600 transition-colors"
              >
                Inventario
              </a>

              {/* Botón de Cerrar Sesión */}
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium transition-colors duration-200 shadow-md hover:shadow-lg"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                  />
                </svg>
                Cerrar Sesión
              </button>
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
}

export default EnfermeroNav;
