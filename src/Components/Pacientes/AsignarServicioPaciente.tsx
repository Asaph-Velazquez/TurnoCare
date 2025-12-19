import { useState, useEffect } from "react";
import axios from "axios";
import SelectField from "../utilities/Form/SelectField";

interface Paciente {
  pacienteId: number;
  nombre: string;
  apellidop: string;
  apellidom: string;
  numeroExpediente: string;
  servicioId?: number | null;
}

interface Servicio {
  servicioId: number;
  nombre: string;
  descripcion?: string;
}

interface Enfermero {
  enfermeroId: number;
  nombre: string;
  apellidoPaterno: string;
  apellidoMaterno: string;
  numeroEmpleado: string;
  servicioActualId?: number | null;
}

function AsignarServicioPaciente() {
  const [form, setForm] = useState({
    pacienteId: "",
    servicioId: "",
  });

  const [pacientes, setPacientes] = useState<Paciente[]>([]);
  const [servicios, setServicios] = useState<Servicio[]>([]);
  const [enfermeros, setEnfermeros] = useState<Enfermero[]>([]);
  const [loadingPacientes, setLoadingPacientes] = useState(false);
  const [loadingServicios, setLoadingServicios] = useState(false);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState<{type: string, message: string} | null>(null);
  
  /* Estado: búsqueda de pacientes */
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredPacientes, setFilteredPacientes] = useState<Paciente[]>([]);

  /* Carga inicial de datos */
  useEffect(() => {
    const fetchData = async () => {
      setLoadingPacientes(true);
      try {
        const response = await axios.get("http://localhost:5000/api/pacientes");
        const data = Array.isArray(response.data) ? response.data : response.data.data || [];
        setPacientes(data);
      } catch (error) {
        setAlert({
          type: "danger",
          message: "Error al cargar la lista de pacientes"
        });
      } finally {
        setLoadingPacientes(false);
      }

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

      try {
        const response = await axios.get("http://localhost:5000/api/enfermeros");
        const data = response.data.success ? response.data.data : response.data;
        setEnfermeros(data || []);
      } catch (error) {
      }
    };
    fetchData();
  }, []);

  /* Filtro de pacientes por búsqueda */
  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredPacientes([]);
      return;
    }
    const term = searchTerm.toLowerCase();
    const filtered = pacientes.filter(p => 
      p.nombre.toLowerCase().includes(term) ||
      p.apellidop.toLowerCase().includes(term) ||
      p.apellidom.toLowerCase().includes(term) ||
      p.numeroExpediente.toLowerCase().includes(term)
    );
    setFilteredPacientes(filtered);
  }, [searchTerm, pacientes]);


  /* Cambio en selects */
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((s) => ({ ...s, [name]: value }));
  };

  /* Cambio en búsqueda */
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  /* Envío del formulario */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAlert(null);
    if (!form.pacienteId) {
      setAlert({
        type: "danger",
        message: "Por favor selecciona un paciente"
      });
      return;
    }
    if (!form.servicioId) {
      setAlert({
        type: "danger",
        message: "Por favor selecciona un servicio"
      });
      return;
    }
    setLoading(true);
    try {
      const dataToSend = {
        servicioId: parseInt(form.servicioId)
      };
      await axios.put(
        `http://localhost:5000/api/pacientes/${form.pacienteId}`,
        dataToSend
      );
      setAlert({
        type: "success",
        message: "Paciente asignado al servicio exitosamente"
      });
      setForm({
        pacienteId: "",
        servicioId: "",
      });
      setSearchTerm("");
      const pacientesResponse = await axios.get("http://localhost:5000/api/pacientes");
      const pacientesData = Array.isArray(pacientesResponse.data) 
        ? pacientesResponse.data 
        : pacientesResponse.data.data || [];
      setPacientes(pacientesData);
    } catch (error: any) {
      let errorMessage = "Error al asignar paciente al servicio";
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

  const selectedPaciente = pacientes.find(p => p.pacienteId.toString() === form.pacienteId);
  const selectedServicio = servicios.find(s => s.servicioId.toString() === form.servicioId);
  const enfermerosEnServicio = enfermeros.filter(e => 
    e.servicioActualId?.toString() === form.servicioId
  );

  return (
    <div className="min-h-screen bg-auto-primary pt-20 pb-10">
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-sky-400/10 via-transparent to-cyan-400/10"></div>
        <div className="absolute top-1/4 right-0 w-96 h-96 bg-sky-300/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 left-0 w-96 h-96 bg-cyan-300/20 rounded-full blur-3xl"></div>
      </div>

      <div className="relative min-h-screen">
        <main className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10 py-10">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
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
                    <h2 className="text-3xl font-bold text-auto-primary">Asignar Paciente a Servicio</h2>
                    <p className="text-auto-secondary text-sm">Gestiona la asignación de pacientes</p>
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
                  <div className="grid grid-cols-1 gap-6">
                    {/* Bloque: Selección y búsqueda de paciente */}
                    <div className="relative search-container">
                      <label className="block text-sm font-semibold text-auto-primary mb-3 flex items-center gap-2">
                        <span className="text-xl">👤</span>
                        <span>Paciente <span className="text-red-500">*</span></span>
                      </label>
                      <div className="relative mb-3">
                        <input
                          type="text"
                          value={searchTerm}
                          onChange={handleSearchChange}
                          placeholder={loadingPacientes ? "Cargando pacientes..." : "Buscar por nombre, apellido o expediente..."}
                          disabled={loadingPacientes}
                          className="block w-full pl-12 pr-4 py-4 border-2 border-auto rounded-xl bg-auto-primary text-auto-primary placeholder-auto-secondary/70 focus:border-sky-500 focus:outline-none focus:ring-4 focus:ring-sky-500/20 transition-all duration-200 shadow-sm disabled:opacity-50"
                        />
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-auto-secondary">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                          </svg>
                        </div>
                      </div>
                      <select
                        name="pacienteId"
                        value={form.pacienteId}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 bg-auto-primary border-2 border-auto rounded-xl focus:border-sky-500 focus:outline-none focus:ring-4 focus:ring-sky-500/20 text-auto-primary disabled:opacity-50 transition-all duration-200"
                        disabled={loadingPacientes}
                        size={searchTerm ? Math.min(filteredPacientes.length + 1, 8) : 1}
                      >
                        <option value="">
                          {loadingPacientes 
                            ? "Cargando pacientes..." 
                            : searchTerm 
                              ? `${filteredPacientes.length} resultado(s) encontrado(s)`
                              : "Seleccionar paciente (usa la búsqueda para filtrar)"
                          }
                        </option>
                        {(searchTerm ? filteredPacientes : pacientes).map(p => (
                          <option key={p.pacienteId} value={p.pacienteId.toString()}>
                            {p.nombre} {p.apellidop} {p.apellidom} - Exp: {p.numeroExpediente}
                            {p.servicioId ? ' (Ya asignado)' : ''}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Bloque: Información del paciente seleccionado */}
                    {selectedPaciente && (
                      <div className="bg-blue-100 border-2 border-blue-300 rounded-xl p-4 dark:bg-blue-900/40 dark:border-blue-700">
                        <h4 className="font-semibold text-blue-900 mb-2 dark:text-blue-200">Información del Paciente</h4>
                        <div className="text-sm text-blue-800 dark:text-blue-300">
                          <p><span className="font-medium">Nombre:</span> {selectedPaciente.nombre} {selectedPaciente.apellidop} {selectedPaciente.apellidom}</p>
                          <p><span className="font-medium">Expediente:</span> {selectedPaciente.numeroExpediente}</p>
                          {selectedPaciente.servicioId && (
                            <p className="text-orange-600 mt-2 dark:text-orange-400">
                              ⚠️ Este paciente ya está asignado a un servicio. La asignación será actualizada.
                            </p>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Bloque: Selección de servicio */}
                    <SelectField
                      label="Servicio"
                      name="servicioId"
                      value={form.servicioId} 
                      onChange={handleChange}
                      required
                      options={[
                        { value: "", label: loadingServicios ? "Cargando servicios..." : "Seleccionar servicio" },
                        ...servicios.map(s => ({
                          value: s.servicioId.toString(),
                          label: `${s.nombre}${s.descripcion ? ` - ${s.descripcion}` : ''}`
                        }))
                      ]}
                    />

                    {/* Bloque: Enfermeros en el servicio seleccionado */}
                    {selectedServicio && enfermerosEnServicio.length > 0 && (
                      <div className="bg-green-100 border-2 border-green-300 rounded-xl p-4 dark:bg-green-900/40 dark:border-green-700">
                        <h4 className="font-semibold text-green-900 mb-2 dark:text-green-200">
                          👨‍⚕️ Enfermeros en este servicio ({enfermerosEnServicio.length})
                        </h4>
                        <div className="space-y-2 max-h-40 overflow-y-auto">
                          {enfermerosEnServicio.map(enf => (
                            <div key={enf.enfermeroId} className="text-sm text-green-800 bg-white rounded-lg p-2 flex items-center gap-2 dark:bg-green-950/30 dark:text-green-300">
                              <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              <span className="font-medium">{enf.nombre} {enf.apellidoPaterno} {enf.apellidoMaterno}</span>
                              <span className="text-xs text-gray-500 ml-auto dark:text-gray-400">#{enf.numeroEmpleado}</span>
                            </div>
                          ))}
                        </div>
                        <p className="text-xs text-green-700 mt-2 dark:text-green-400">
                          Estos enfermeros podrán atender al paciente asignado a este servicio.
                        </p>
                      </div>
                    )}

                    {selectedServicio && enfermerosEnServicio.length === 0 && (
                      <div className="bg-yellow-100 border-2 border-yellow-300 rounded-xl p-4 dark:bg-yellow-900/40 dark:border-yellow-700">
                        <h4 className="font-semibold text-yellow-900 mb-1 dark:text-yellow-200">⚠️ Sin enfermeros asignados</h4>
                        <p className="text-sm text-yellow-800 dark:text-yellow-300">
                          Este servicio no tiene enfermeros asignados actualmente. Considera asignar enfermeros a este servicio primero.
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="mt-6">
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full px-6 py-3 bg-gradient-to-r from-sky-500 to-cyan-500 text-white font-semibold rounded-xl hover:from-sky-600 hover:to-cyan-600 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed transition-all duration-200 shadow-lg"
                    >
                      {loading ? "Asignando..." : "Asignar Paciente"}
                    </button>
                  </div>
                </form>
              </div>
            </div>

            <aside className="lg:col-span-1">
              <div className="bg-auto-secondary rounded-2xl shadow-xl p-6 border border-auto backdrop-blur-sm sticky top-24">
                <h3 className="text-lg font-semibold text-auto-primary mb-3">
                  <svg className="w-6 h-6 inline-block mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Información
                </h3>
                <div className="space-y-3 text-sm text-auto-secondary">
                  <p>
                    <span className="font-semibold">Asignación de Pacientes:</span> Los pacientes se asignan a servicios de enfermería.
                  </p>
                  <p>
                    Los enfermeros asignados al mismo servicio y al mismo numero de habitacion podrán ver y atender a estos pacientes.
                  </p>
                  {form.servicioId && enfermerosEnServicio.length > 0 && (
                    <div className="mt-4 p-3 bg-green-100 rounded-lg border-2 border-green-300 dark:bg-green-900/40 dark:border-green-700">
                      <p className="font-semibold text-green-900 mb-1 dark:text-green-200">✅ Enfermeros disponibles:</p>
                      <p className="text-green-800 text-xs dark:text-green-300">
                        {enfermerosEnServicio.length} enfermero{enfermerosEnServicio.length !== 1 ? 's' : ''} podrá{enfermerosEnServicio.length !== 1 ? 'n' : ''} atender a este paciente.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </aside>
          </div>
        </main>
      </div>
    </div>
  );
}

export default AsignarServicioPaciente;

