import { Link, useNavigate } from "react-router-dom";
import { useAuthListener } from "../../hooks/useAuthListener";

function EnfermeroNav() {
  const navigate = useNavigate();
  const { isLoggedIn } = useAuthListener();

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    localStorage.removeItem("esCoordinador");
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("userID");
    localStorage.removeItem("numeroEmpleado");
    localStorage.removeItem("nombre");
    window.dispatchEvent(new Event('authChanged'));
    navigate("/");
  };

  if (!isLoggedIn) {
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
                href="/NoCoordinador/mis-turnos"
                className="text-auto-secondary hover:text-sky-600 transition-colors"
              >
                Mis Turnos
              </a>
              <a
                href="/NoCoordinador/mis-pacientes"
                className="text-auto-secondary hover:text-sky-600 transition-colors"
              >
                Mis Pacientes
              </a>
              <a
                href="/nocoordinador/inventario"
                className="text-auto-secondary hover:text-sky-600 transition-colors"
              >
                Inventario
              </a>
              <a
                href="/NoCoordinador/mis-capacitaciones"
                className="text-auto-secondary hover:text-sky-600 transition-colors"
              >
                Capacitaciones
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

      {/* Menu Mobile */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-auto">
        <div className="w-full max-w-7xl mx-auto px-6 py-3 flex justify-between items-center">
          <Link
            to="/NoCoordinador/home"
            className="flex flex-col items-center gap-1 text-center"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 12l2-2m0 0l2 2m-2-2v8m6-8l2-2m0 0l2 2m-2-2v8m6-8l2-2m0 0l2 2m-2-2v8"
              />
            </svg>
            <span className="text-xs text-auto-secondary">Inicio</span>
          </Link>

          <Link
            to="/NoCoordinador/mis-turnos"
            className="flex flex-col items-center gap-1 text-center"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span className="text-xs text-auto-secondary">Mis Turnos</span>
          </Link>

          <Link
            to="/NoCoordinador/mis-capacitaciones"
            className="flex flex-col items-center gap-1 text-center"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
            <span className="text-xs text-auto-secondary">Mis Capacitaciones</span>
          </Link>

          <button
            onClick={handleLogout}
            className="flex flex-col items-center gap-1 text-center"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
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
            <span className="text-xs text-auto-secondary">Cerrar Sesión</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default EnfermeroNav;

