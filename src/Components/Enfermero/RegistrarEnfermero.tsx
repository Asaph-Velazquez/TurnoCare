import { useState, useEffect } from "react";
import axios from "axios";
import TextField from "../utilities/Form/TextField";
import SelectField from "../utilities/Form/SelectField";
import SearchableSelectField from "../utilities/Form/SearchableSelectField";

interface Servicio {
  servicioId: number;
  nombre: string;
  descripcion?: string;
}

interface Turno {
  turnoId: number;
  nombre: string;
  horaInicio: string;
  horaFin: string;
}

function RegistrarEnfermero() {
  const [form, setForm] = useState({
    numeroEmpleado: "",
    nombre: "",
    apellidoPaterno: "",
    apellidoMaterno: "",
    especialidad: "",
    esCoordinador: "false",
    servicioActualId: "",
    habitacionesAsignadas: "",
    turno: "",
  });

  const [servicios, setServicios] = useState<Servicio[]>([]);
  const [turnos, setTurnos] = useState<Turno[]>([]);
  const [loadingServicios, setLoadingServicios] = useState(false);
  const [loadingTurnos, setLoadingTurnos] = useState(false);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState<{type: string, message: string} | null>(null);

  useEffect(() => {
    const fetchServicios = async () => {
      setLoadingServicios(true);
      try {
        const response = await axios.get("http://localhost:5000/api/servicios/listServices");
        const data = response.data.success ? response.data.data : response.data;
        setServicios(data || []);
      } catch (error) {
        setAlert({
          type: "danger",
          message: "Error al cargar la lista de servicios"
        });
      } finally {
        setLoadingServicios(false);
      }
    };

    const fetchTurnos = async () => {
      setLoadingTurnos(true);
      try {
        const response = await axios.get("http://localhost:5000/api/turnos");
        const data = response.data?.data || response.data || [];
        setTurnos(Array.isArray(data) ? data : []);
      } catch (error) {
        setAlert({
          type: "danger",
          message: "Error al cargar la lista de turnos"
        });
      } finally {
        setLoadingTurnos(false);
      }
    };

    fetchServicios();
    fetchTurnos();
  }, []);

  const formatHora = (horaISO: string): string => {
    try {
      const fecha = new Date(horaISO);
      return fecha.toLocaleTimeString('es-MX', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: false 
      });
    } catch {
      return horaISO;
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((s) => ({ ...s, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAlert(null);
    setLoading(true);

    try {
      const dataToSend = {
        ...form,
        esCoordinador: form.esCoordinador === "true",
        servicioActualId: form.servicioActualId ? parseInt(form.servicioActualId) : null,
        habitacionesAsignadas: form.habitacionesAsignadas,
        turno: form.turno,
      };

      await axios.post("http://localhost:5000/api/enfermeros/", dataToSend);
      
      setAlert({
        type: "success",
        message: "Enfermero registrado exitosamente"
      });

      setForm({
        numeroEmpleado: "",
        nombre: "",
        apellidoPaterno: "",
        apellidoMaterno: "",
        especialidad: "",
        esCoordinador: "false",
        servicioActualId: "",
        habitacionesAsignadas: "",
        turno: "",
      });
    } catch (error: any) {
      let errorMessage = "Error al registrar enfermero";
      if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      setAlert({
        type: "danger",
        message: errorMessage
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-auto-primary pt-20 pb-10">
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-sky-400/10 via-transparent to-cyan-400/10"></div>
        <div className="absolute top-1/4 right-0 w-96 h-96 bg-sky-300/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 left-0 w-96 h-96 bg-cyan-300/20 rounded-full blur-3xl"></div>
      </div>

      <div className="relative min-h-screen">
        <main className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10 py-10">
          <div className="bg-auto-secondary rounded-2xl shadow-xl p-6 md:p-8 border border-auto backdrop-blur-sm">
            <div className="flex items-center gap-3 mb-2">
              <div className="bg-gradient-to-br from-sky-500 to-sky-600 p-3 rounded-xl shadow-lg">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="w-6 h-6 text-white"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M18 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0ZM3 19.235v-.11a6.375 6.375 0 0 1 12.75 0v.109A12.318 12.318 0 0 1 9.374 21c-2.331 0-4.512-.645-6.374-1.766Z"
                  />
                </svg>
              </div>
              <div>
                <h2 className="text-3xl font-bold text-auto-primary">Registrar Enfermero</h2>
                <p className="text-auto-secondary text-sm">Añade personal al sistema</p>
              </div>
            </div>

            <div className="h-px bg-gradient-to-r from-transparent via-auto-tertiary to-transparent my-6"></div>

            {/* Alertas */}
            {alert && (
              <div
                className={`mb-6 p-4 rounded-xl shadow-lg backdrop-blur-sm ${
                  alert.type === "success"
                    ? "bg-green-100 text-green-800 border-2 border-green-300 dark:bg-green-900/40 dark:text-green-200 dark:border-green-700"
                    : "bg-red-100 text-red-800 border-2 border-red-300 dark:bg-red-900/40 dark:text-red-200 dark:border-red-700"
                }`}
              >
                <div className="flex items-center gap-2">
                  {alert.type === "success" ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  )}
                  <span className="font-medium">{alert.message}</span>
                </div>
              </div>
            )}

            {/* Formulario */}
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <TextField label="Número de Empleado" name="numeroEmpleado" value={form.numeroEmpleado} onChange={handleChange as any} required />
                <TextField label="Nombre" name="nombre" value={form.nombre} onChange={handleChange as any} required />
                <TextField label="Apellido Paterno" name="apellidoPaterno" value={form.apellidoPaterno} onChange={handleChange as any} required />
                <TextField label="Apellido Materno" name="apellidoMaterno" value={form.apellidoMaterno} onChange={handleChange as any} required />
                <TextField label="Especialidad" name="especialidad" value={form.especialidad} onChange={handleChange as any} />
                <SelectField label="Es Coordinador" name="esCoordinador" value={form.esCoordinador} onChange={handleChange as any} options={[{ value: "true", label: "Sí" }, { value: "false", label: "No" }]} />
                <TextField label="Habitación(es) Asignada(s)" name="habitacionesAsignadas" value={form.habitacionesAsignadas} onChange={handleChange as any} placeholder="Ej: 101, 102, 103" required />
                <SearchableSelectField 
                  label="Turno Laboral"
                  name="turno"
                  value={form.turno}
                  onChange={(value) => setForm((s) => ({ ...s, turno: value }))}
                  required
                  placeholder="Buscar por horario o tipo..."
                  emptyMessage={loadingTurnos ? "Cargando turnos..." : "No hay turnos disponibles"}
                  options={turnos.map(t => ({
                    value: t.turnoId.toString(),
                    label: `${t.nombre} (${formatHora(t.horaInicio)} - ${formatHora(t.horaFin)})`,
                    searchText: `${t.nombre} ${formatHora(t.horaInicio)} ${formatHora(t.horaFin)}`
                  }))}
                />
                <SelectField 
                  label="Servicio Asignado" 
                  name="servicioActualId" 
                  value={form.servicioActualId} 
                  onChange={handleChange as any}
                  options={[
                    { value: "", label: loadingServicios ? "Cargando servicios..." : "Sin asignar" },
                    ...servicios.map(s => ({
                      value: s.servicioId.toString(),
                      label: `${s.nombre}${s.descripcion ? ` - ${s.descripcion}` : ''}`
                    }))
                  ]}
                />
              </div>

              <div className="mt-6">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full px-6 py-3 bg-gradient-to-r from-sky-500 to-cyan-500 text-white font-semibold rounded-xl hover:from-sky-600 hover:to-cyan-600 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed transition-all duration-200 shadow-lg"
                >
                  {loading ? "Registrando..." : "Registrar Enfermero"}
                </button>
              </div>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
}

export default RegistrarEnfermero;

