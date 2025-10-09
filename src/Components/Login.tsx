import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Login() {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const nombreInfo = useRef<HTMLInputElement>(null);
  const apellidoPaternoInfo = useRef<HTMLInputElement>(null);
  const apellidoMaternoInfo = useRef<HTMLInputElement>(null);
  const NumEmpleadoInfo = useRef<HTMLInputElement>(null);

  //alert para mostrar mensajes de error o éxito
  const [alert, setAlert] = useState<{type: string, message: string}|null>(null);

  const LoginRequest  = async () => {
    const numeroEmpleado = NumEmpleadoInfo.current?.value || '';
    const nombre = nombreInfo.current?.value || '';
    const apellidoPaterno = apellidoPaternoInfo.current?.value || '';
    const apellidoMaterno = apellidoMaternoInfo.current?.value || '';
    
    // Validación frontend
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
    console.log("Enviando datos:", FormData);

    try{
      const response = await axios.post("http://localhost:5000/login", FormData);
      console.log("Respuesta del servidor:", response.data);
      return response.data;
    }catch(error: any){
      console.error("❌ ERROR DE LOGIN:", error);
      
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
    
    // Limpiar alertas previas
    setAlert(null);
    
    const userData = await LoginRequest();
    
    if (userData && userData.success) {
      console.log("✅ Login exitoso", userData);
      setIsLoggedIn(true);
      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("userID", userData.user.userid);
      localStorage.setItem("numeroEmpleado", userData.user.numeroEmpleado);
      localStorage.setItem("nombre", userData.user.nombre);
      localStorage.setItem("apellidoPaterno", userData.user.apellidoPaterno);
      localStorage.setItem("apellidoMaterno", userData.user.apellidoMaterno);
      localStorage.setItem("especialidad", userData.user.especialidad);
      localStorage.setItem("esCoordinador", userData.user.esCoordinador);
      
      setAlert({
        type: "success",
        message: userData.message || "Login exitoso"
      });
      
      // Delay para mostrar el mensaje de éxito
      setTimeout(() => {
        navigate("/AdminHome");
      }, 1000);
    } else {
      console.log("❌ Login fallido");
    }
  }

  return (
    <div className="min-h-screen bg-auto-primary flex items-center justify-center p-4 pt-25">
      {/* Fondo decorativo */}
      <div className="absolute inset-0 bg-gradient-to-br from-sky-400/20 via-cyan-300/10 to-blue-500/20"></div>
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
