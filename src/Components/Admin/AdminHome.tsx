import { useNavigate, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

function AdminHome() {
  const [enfermerosCount, setEnfermerosCount] = useState<number | null>(null);
  const [serviciosCount, setServiciosCount] = useState<number | null>(null);
  const [turnosCount, setTurnosCount] = useState<number | null>(null);
  const [pacientesCount, setPacientesCount] = useState<number | null>(null);
  const [currentTime, setCurrentTime] = useState<Date>(new Date());
  const [turnosData, setTurnosData] = useState<any[]>([]);
  const [activeTurno, setActiveTurno] = useState<any | null>(null);
  const [timeRemaining, setTimeRemaining] = useState<string>("");
  const navigate = useNavigate();

  useEffect(() => {
    // Obtener información del usuario para el temporizador
    let numeroEmpleado = "";
    try {
      const raw = localStorage.getItem("user");
      if (raw && raw !== "undefined" && raw !== "null") {
        const parsed = JSON.parse(raw);
        numeroEmpleado = parsed?.numeroEmpleado || localStorage.getItem("numeroEmpleado") || "";
      } else {
        numeroEmpleado = localStorage.getItem("numeroEmpleado") || "";
      }
    } catch (err) {
      numeroEmpleado = localStorage.getItem("numeroEmpleado") || "";
    }

    axios.get("http://localhost:5000/api/enfermeros")
      .then(res => {
        const enfermeros = Array.isArray(res.data.data) ? res.data.data : Array.isArray(res.data) ? res.data : [];
        setEnfermerosCount(enfermeros.length);
        
        // Obtener el turno específico del enfermero logueado
        const enfermeroActual = enfermeros.find((e: any) => e.numeroEmpleado === numeroEmpleado);
        
        if (enfermeroActual && enfermeroActual.turnoAsignadoId) {
          // Obtener el turno específico del enfermero
          axios
            .get(`http://localhost:5000/api/turnos/${enfermeroActual.turnoAsignadoId}`)
            .then((turnoRes) => {
              const turnoData = turnoRes.data.data || turnoRes.data;
              setTurnosData([turnoData]);
            })
            .catch(() => {
              setTurnosData([]);
            });
        } else {
          setTurnosData([]);
        }
      })
      .catch(() => {
        setEnfermerosCount(0);
        setTurnosData([]);
      });
      
    axios.get("http://localhost:5000/api/servicios/listServices")
      .then(res => {
        if (res.data && Array.isArray(res.data.data)) {
          setServiciosCount(res.data.data.length);
        } else if (Array.isArray(res.data)) {
          setServiciosCount(res.data.length);
        } else {
          setServiciosCount(0);
        }
      })
      .catch(() => setServiciosCount(0));
    axios.get("http://localhost:5000/api/turnos")
      .then(res => {
        if (res.data && Array.isArray(res.data.data)) {
          setTurnosCount(res.data.data.length);
        } else if (Array.isArray(res.data)) {
          setTurnosCount(res.data.length);
        } else {
          setTurnosCount(0);
        }
      })
      .catch(() => {
        setTurnosCount(0);
      });
    axios.get("http://localhost:5000/api/pacientes")
      .then(res => {
        if (res.data && Array.isArray(res.data.data)) {
          setPacientesCount(res.data.data.length);
        } else if (Array.isArray(res.data)) {
          setPacientesCount(res.data.length);
        } else {
          setPacientesCount(0);
        }
      })
      .catch(() => setPacientesCount(0));
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Detectar turno activo y calcular tiempo restante
  useEffect(() => {
    try {
      const now = new Date();
      const currentTimeOnly = now.getHours() * 3600 + now.getMinutes() * 60 + now.getSeconds();
      
      let foundActiveTurno = null;
      let timeUntilStart = "";
      
      for (const turno of turnosData) {
        if (turno.horaInicio && turno.horaFin) {
          const inicio = new Date(turno.horaInicio);
          const fin = new Date(turno.horaFin);
          
          // Extraer horas de UTC y convertir a segundos del día
          let inicioSeconds = inicio.getUTCHours() * 3600 + inicio.getUTCMinutes() * 60 + inicio.getUTCSeconds();
          let finSeconds = fin.getUTCHours() * 3600 + fin.getUTCMinutes() * 60 + fin.getUTCSeconds();
          
          let isInTurno = false;
          let remainingSeconds = 0;
          
          // Caso especial: turno cruza la medianoche (ej: 16:00 a 00:00)
          if (finSeconds < inicioSeconds) {
            // Si la hora actual es después del inicio O antes del fin
            if (currentTimeOnly >= inicioSeconds || currentTimeOnly < finSeconds) {
              isInTurno = true;
              // Calcular tiempo restante
              if (currentTimeOnly >= inicioSeconds) {
                // Estamos en el mismo día, calcular hasta medianoche + hasta fin
                remainingSeconds = (86400 - currentTimeOnly) + finSeconds;
              } else {
                // Ya pasamos medianoche, calcular hasta fin
                remainingSeconds = finSeconds - currentTimeOnly;
              }
            } else {
              // No está en turno, calcular tiempo hasta que inicie
              const secondsUntilStart = inicioSeconds - currentTimeOnly;
              const hours = Math.floor(secondsUntilStart / 3600);
              const minutes = Math.floor((secondsUntilStart % 3600) / 60);
              const seconds = secondsUntilStart % 60;
              timeUntilStart = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
            }
          } else {
            // Turno normal dentro del mismo día
            if (currentTimeOnly >= inicioSeconds && currentTimeOnly < finSeconds) {
              isInTurno = true;
              remainingSeconds = finSeconds - currentTimeOnly;
            } else {
              // No está en turno, calcular tiempo hasta que inicie
              let secondsUntilStart;
              if (currentTimeOnly < inicioSeconds) {
                // El turno es hoy más tarde
                secondsUntilStart = inicioSeconds - currentTimeOnly;
              } else {
                // El turno es mañana
                secondsUntilStart = (86400 - currentTimeOnly) + inicioSeconds;
              }
              const hours = Math.floor(secondsUntilStart / 3600);
              const minutes = Math.floor((secondsUntilStart % 3600) / 60);
              const seconds = secondsUntilStart % 60;
              timeUntilStart = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
            }
          }
          
          if (isInTurno) {
            foundActiveTurno = turno;
            
            const hours = Math.floor(remainingSeconds / 3600);
            const minutes = Math.floor((remainingSeconds % 3600) / 60);
            const seconds = remainingSeconds % 60;
            
            setTimeRemaining(`${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`);
            break;
          }
        }
      }
      
      setActiveTurno(foundActiveTurno);
      
      if (!foundActiveTurno) {
        setTimeRemaining(timeUntilStart);
      }
    } catch (err) {
      setActiveTurno(null);
      setTimeRemaining("");
    }
  }, [turnosData, currentTime]);

  let userInfo = {
    nombre: "Usuario",
    apellidoPaterno: "",
    numeroEmpleado: "",
    especialidad: "Sin especialidad",
  };

  try {
    const raw = localStorage.getItem("user");
    if (raw && raw !== "undefined" && raw !== "null") {
      try {
        const parsed = JSON.parse(raw);
        if (parsed && typeof parsed === 'object') {
          userInfo = {
            nombre: parsed.nombre || localStorage.getItem("nombre") || "Usuario",
            apellidoPaterno: parsed.apellidoPaterno || localStorage.getItem("apellidoPaterno") || "",
            numeroEmpleado: parsed.numeroEmpleado || localStorage.getItem("numeroEmpleado") || "",
            especialidad: parsed.especialidad || localStorage.getItem("especialidad") || "Sin especialidad",
          };
        }
      } catch (parseError) {
        userInfo = {
          nombre: localStorage.getItem("nombre") || "Usuario",
          apellidoPaterno: localStorage.getItem("apellidoPaterno") || "",
          numeroEmpleado: localStorage.getItem("numeroEmpleado") || "",
          especialidad: localStorage.getItem("especialidad") || "Sin especialidad",
        };
      }
    } else {
      userInfo = {
        nombre: localStorage.getItem("nombre") || "Usuario",
        apellidoPaterno: localStorage.getItem("apellidoPaterno") || "",
        numeroEmpleado: localStorage.getItem("numeroEmpleado") || "",
        especialidad: localStorage.getItem("especialidad") || "Sin especialidad",
      };
    }
  } catch (err) {
    userInfo = {
      nombre: localStorage.getItem("nombre") || "Usuario",
      apellidoPaterno: localStorage.getItem("apellidoPaterno") || "",
      numeroEmpleado: localStorage.getItem("numeroEmpleado") || "",
      especialidad: localStorage.getItem("especialidad") || "Sin especialidad",
    };
  }

  const adminOptions = [
    {
      id: "enfermeros",
      title: "Gestionar Enfermeros",
      description: "Administrar registro, asignaciones y datos de enfermeros",
      icon: (
        <svg
          className="w-8 h-8"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z"
          />
        </svg>
      ),
    },
    {
      id: "hospital",
      title: "Gestionar Hospital",
      description:
        "Configurar información general del hospital y departamentos",
      icon: (
        <svg
          className="w-8 h-8"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
          />
        </svg>
      ),
    },
    {
      id: "servicios",
      title: "Gestionar Servicios",
      description: "Administrar servicios médicos, turnos y asignaciones",
      icon: (
        <svg
          className="w-8 h-8"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
          />
        </svg>
      ),
    },
    {
      id: "pacientes",
      title: "Gestionar Pacientes",
      description: "Ver y administrar la información de los pacientes",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="size-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z"
          />
        </svg>
      ),
    },
    {
      id: "inventario",
      title: "Gestionar Inventario",
      description: "Administrar el inventario de suministros médicos",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="size-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="m7.875 14.25 1.214 1.942a2.25 2.25 0 0 0 1.908 1.058h2.006c.776 0 1.497-.4 1.908-1.058l1.214-1.942M2.41 9h4.636a2.25 2.25 0 0 1 1.872 1.002l.164.246a2.25 2.25 0 0 0 1.872 1.002h2.092a2.25 2.25 0 0 0 1.872-1.002l.164-.246A2.25 2.25 0 0 1 16.954 9h4.636M2.41 9a2.25 2.25 0 0 0-.16.832V12a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 12V9.832c0-.287-.055-.57-.16-.832M2.41 9a2.25 2.25 0 0 1 .382-.632l3.285-3.832a2.25 2.25 0 0 1 1.708-.786h8.43c.657 0 1.281.287 1.709.786l3.284 3.832c.163.19.291.404.382.632M4.5 20.25h15A2.25 2.25 0 0 0 21.75 18v-2.625c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125V18a2.25 2.25 0 0 0 2.25 2.25Z"
          />
        </svg>
      ),
    },
    {
      id: "turnos",
      title: "Gestionar Turnos",
      description: "Administrar turnos y asignaciones de enfermeros",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="size-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
          />
        </svg>
      ),
    },
    {
      id: "capacitaciones",
      title: "Gestionar Capacitaciones",
      description: "Crear y administrar capacitaciones para enfermeros",
      icon: (
        <svg
          className="w-8 h-8"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
          />
        </svg>
      ),
    },
  ];

  const handleOptionClick = (optionId: string) => {
    switch (optionId) {
      case "enfermeros":
        navigate("/Enfermero");
        break;
      case "hospital":
        navigate("/Hospital");
        break;
      case "servicios":
        navigate("/Servicios");
        break;
      case "pacientes":
        navigate("/pacientes");
        break;
      case "inventario":
        navigate("/Inventario");
        break;
      case "turnos":
        navigate("/turnos");
        break;
      case "capacitaciones":
        navigate("/capacitaciones");
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
                  Panel de Administración
                </h1>
                <p className="text-auto-secondary mt-1">
                  Sistema TurnoCare - Gestión Hospitalaria
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-auto-tertiary">Bienvenido/a</p>
                <p className="font-semibold text-auto-primary">
                  {userInfo.nombre} {userInfo.apellidoPaterno}
                </p>
                <p className="text-xs text-auto-tertiary">
                  ID: {userInfo.numeroEmpleado} | {userInfo.especialidad}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Welcome Card */}
          <div className="bg-auto-secondary backdrop-blur-sm border border-auto rounded-3xl shadow-2xl p-6 mb-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-gradient-to-r from-sky-500 to-cyan-500 rounded-full flex items-center justify-center">
                    <svg
                      className="w-6 h-6 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                </div>
                <div className="ml-4">
                  <h2 className="text-xl font-semibold text-auto-primary">
                    ¡Sesión iniciada correctamente!
                  </h2>
                  <p className="text-auto-secondary">
                    Selecciona una opción para comenzar a administrar el sistema
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                {/* Indicador de Turno Activo */}
                <div className={`flex items-center gap-2 px-4 py-2 rounded-xl shadow-md ${activeTurno ? 'bg-gradient-to-r from-green-500 to-emerald-500' : 'bg-gradient-to-r from-red-500 to-rose-500'}`}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                    className="w-6 h-6 text-white"
                  >
                    {activeTurno ? (
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                      />
                    ) : (
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                      />
                    )}
                  </svg>
                  <div>
                    <div className="text-sm font-bold text-white">
                      {activeTurno ? "Turno Activo" : "Fuera de turno"}
                    </div>
                    {timeRemaining && (
                      <div className="text-lg font-bold tabular-nums text-white">
                        {timeRemaining}
                      </div>
                    )}
                    {!activeTurno && !timeRemaining && (
                      <div className="text-xs text-white/90">
                        Sin turno asignado
                      </div>
                    )}
                  </div>
                </div>

                {/* Reloj */}
                <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-sky-500 to-cyan-500 rounded-xl shadow-md">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                    className="w-6 h-6 text-white"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                    />
                  </svg>
                  <div>
                    <div className="text-lg font-bold tabular-nums text-white">
                      {currentTime.toLocaleTimeString('es-MX', { 
                        hour: '2-digit', 
                        minute: '2-digit', 
                        second: '2-digit',
                        hour12: false 
                      })}
                    </div>
                    <div className="text-xs text-white/90">
                      {currentTime.toLocaleDateString('es-MX', { 
                        weekday: 'long', 
                        day: 'numeric', 
                        month: 'short'
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Admin Options Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {adminOptions.map((option) => (
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
                <h3 className="text-xl font-bold text-auto-primary text-center mb-2">
                  {option.title}
                </h3>
                <p className="text-auto-secondary text-center text-sm leading-relaxed">
                  {option.description}
                </p>
                <div className="mt-4 flex justify-center">
                  <span className="text-sm font-medium text-auto-tertiary group-hover:text-auto-secondary transition-colors duration-300">
                    Clic para acceder →
                  </span>
                </div>
              </div>
            ))}
          </div>
          <br />
          {/* Quick Stats */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Total Enfermeros */}
            <div className="bg-auto-secondary backdrop-blur-sm border border-auto rounded-xl p-6 shadow-lg">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-gradient-to-r from-sky-500 to-cyan-500 rounded-full flex items-center justify-center">
                    <svg
                      className="w-5 h-5 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                      />
                    </svg>
                  </div>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-auto-tertiary">
                    Total Enfermeros
                  </p>
                  <p className="text-2xl font-semibold text-auto-primary">
                    {enfermerosCount !== null ? enfermerosCount : "--"}
                  </p>
                </div>
              </div>
            </div>

            {/* Total Pacientes */}
            <div className="bg-auto-secondary backdrop-blur-sm border border-auto rounded-xl p-6 shadow-lg">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-gradient-to-r from-sky-500 to-cyan-500 rounded-full flex items-center justify-center">
                    <svg
                      className="w-5 h-5 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0zm2 8a6 6 0 0112 0v1H5v-1a6 6 0 014-5.659"/>
                      </svg>
                  </div>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-auto-tertiary">
                    Total Pacientes
                  </p>
                  <p className="text-2xl font-semibold text-auto-primary">
                    {pacientesCount !== null ? pacientesCount : "--"}
                  </p>
                </div>
              </div>
            </div>

            {/* Servicios Activos */}
            <div className="bg-auto-secondary backdrop-blur-sm border border-auto rounded-xl p-6 shadow-lg">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-gradient-to-r from-sky-500 to-cyan-500 rounded-full flex items-center justify-center">
                    <svg
                      className="w-6 h-6 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
                      />
                    </svg>
                  </div>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-auto-tertiary">
                    Servicios Activos
                  </p>
                  <p className="text-2xl font-semibold text-auto-primary">
                    {serviciosCount !== null ? serviciosCount : "--"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminHome;

