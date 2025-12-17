import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import PanelSelectionModal from "./PanelSelectionModal";

function Login() {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showPanelModal, setShowPanelModal] = useState(false);

  const nombreInfo = useRef<HTMLInputElement>(null);
  const apellidoPaternoInfo = useRef<HTMLInputElement>(null);
  const apellidoMaternoInfo = useRef<HTMLInputElement>(null);
  const NumEmpleadoInfo = useRef<HTMLInputElement>(null);

  const [alert, setAlert] = useState<{type: string, message: string}|null>(null);

  const LoginRequest  = async () => {
    const numeroEmpleado = NumEmpleadoInfo.current?.value || '';
    const nombre = nombreInfo.current?.value || '';
    const apellidoPaterno = apellidoPaternoInfo.current?.value || '';
    const apellidoMaterno = apellidoMaternoInfo.current?.value || '';
    
    if (!numeroEmpleado || !nombre || !apellidoPaterno || !apellidoMaterno) {
      setAlert({
        type: "danger",
        message: "Por favor completa todos los campos"
      });
      return null;
    }

    const FormData = {
      numeroEmpleado,
      nombre,
      apellidoPaterno,
      apellidoMaterno
    }

    try{
      const response = await axios.post("http://localhost:5000/api/enfermeros/login", FormData);
      return response.data;
    }catch(error: any){
      if (error.response) {
        const errorMessage = error.response.data.error || "Error desconocido";
        setAlert({
          type: "danger",
          message: errorMessage
        });
      } else {
        setAlert({
          type: "danger",
          message: "No se pudo conectar al servidor"
        });
      }
      return null;
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setAlert(null);
    
    const userData = await LoginRequest();
    
    if (userData && userData.success) {
      setIsLoggedIn(true);
      try {
        if (userData.user && typeof userData.user === 'object') {
          localStorage.setItem("isLoggedIn", "true");
          localStorage.setItem("user", JSON.stringify(userData.user));
          localStorage.setItem("userID", String(userData.user.userid || ""));
          localStorage.setItem("numeroEmpleado", String(userData.user.numeroEmpleado || ""));
          localStorage.setItem("nombre", String(userData.user.nombre || ""));
          localStorage.setItem("token", userData.token || "");
          try {
            const isCoord = !!userData.user.esCoordinador;
            localStorage.setItem("esCoordinador", String(isCoord));
          } catch (e) {
            localStorage.setItem("esCoordinador", "false");
          }
        }
      } catch (err) {}
      
      setAlert({
        type: "success",
        message: userData.message || "Login exitoso"
      });
      setTimeout(() => {
        try {
          const isCoord = userData.user && !!userData.user.esCoordinador;
          window.dispatchEvent(new Event('authChanged'));
          if (isCoord) {
            // Mostrar modal de selección de panel para coordinadores
            setShowPanelModal(true);
          } else {
            navigate("/NoCoordinador/home");
          }
        } catch (e) {
          navigate("/NoCoordinador/home");
        }
      }, 800);
    }
  }

  return (
    <div className="min-h-screen bg-auto-primary flex items-center justify-center p-4 pt-25">
      {/* Modal de selección de panel */}
      <PanelSelectionModal 
        isOpen={showPanelModal} 
        onClose={() => setShowPanelModal(false)}
        onSelectPanel={(panel) => {
          if (panel === 'admin') {
            navigate("/AdminHome");
          } else {
            navigate("/NoCoordinador/home");
          }
        }}
      />
      
      {/* Fondo decorativo */}
      <div className="absolute inset-0 bg-gradient-to-br from-sky-400/20 via-cyan-300/10 to-blue-500/20 "></div>
      <div className="relative bg-auto-secondary backdrop-blur-sm border border-auto rounded-3xl shadow-2xl max-w-md w-full p-8 mx-4">
        {/* Header con icono */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-sky-500 to-cyan-500 rounded-full mb-4">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <h2 className="text-3xl font-bold text-auto-primary mb-2">
            Bienvenido
          </h2>
          <p className="text-auto-secondary text-sm">
            Inicia sesión para acceder a tu cuenta
          </p>
        </div>

        <form className="space-y-6" onSubmit={handleSubmit}>
          {/* Campo Número de Empleado */}
          <div className="space-y-2">
            <label
              htmlFor="NumEmpleado"
              className="block text-sm font-semibold text-auto-primary"
            >
              Número de Empleado
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-auto-tertiary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V4a2 2 0 114 0v2m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" />
                </svg>
              </div>
              <input
                type="text"
                id="NumEmpleado"
                className="block w-full pl-10 pr-3 py-3 border border-auto rounded-xl bg-auto-tertiary/50 text-auto-primary placeholder:text-auto-tertiary focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:bg-auto-tertiary/70 transition-all duration-200"
                placeholder="ENF001"
                ref={NumEmpleadoInfo}
              />
            </div>
          </div>

          {/* Campo Nombre */}
          <div className="space-y-2">
            <label
              htmlFor="nombre"
              className="block text-sm font-semibold text-auto-primary"
            >
              Nombre
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-auto-tertiary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <input
                type="text"
                id="nombre"
                className="block w-full pl-10 pr-3 py-3 border border-auto rounded-xl bg-auto-tertiary/50 text-auto-primary placeholder:text-auto-tertiary focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:bg-auto-tertiary/70 transition-all duration-200"
                placeholder="Ana"
                ref={nombreInfo}
              />
            </div>
          </div>

          {/* Campo Apellido Paterno */}
          <div className="space-y-2">
            <label
              htmlFor="apellidoPaterno"
              className="block text-sm font-semibold text-auto-primary"
            >
              Apellido Paterno
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-auto-tertiary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <input
                type="text"
                id="apellidoPaterno"
                className="block w-full pl-10 pr-3 py-3 border border-auto rounded-xl bg-auto-tertiary/50 text-auto-primary placeholder:text-auto-tertiary focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:bg-auto-tertiary/70 transition-all duration-200"
                placeholder="García"
                ref={apellidoPaternoInfo}
              />
            </div>
          </div>

          {/* Campo Apellido Materno */}
          <div className="space-y-2">
            <label
              htmlFor="apellidoMaterno"
              className="block text-sm font-semibold text-auto-primary"
            >
              Apellido Materno
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-auto-tertiary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <input
                type="text"
                id="apellidoMaterno"
                className="block w-full pl-10 pr-3 py-3 border border-auto rounded-xl bg-auto-tertiary/50 text-auto-primary placeholder:text-auto-tertiary focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:bg-auto-tertiary/70 transition-all duration-200"
                placeholder="Martínez"
                ref={apellidoMaternoInfo}
              />
            </div>
          </div>

          {/* Botón de envío */}
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-sky-500 to-cyan-500 hover:from-sky-600 hover:to-cyan-600 text-white font-semibold py-3 px-4 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-sky-500/50"
          >
            Iniciar Sesión
          </button>
          <br />
          {alert && (
              <div className={`alert alert-${alert.type} text-center`} role="alert">
                {alert.message}
              </div>
          )}
        </form>
      </div>
    </div>
  );
}

export default Login;

