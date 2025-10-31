import { useState, useEffect } from "react";
import axios from "axios";
import FormLayout from "../utilities/Form/FormLayout";
import SelectField from "../utilities/Form/SelectField";
import SubmitButton from "../utilities/Form/SubmitButton";

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

function AsignarPaciente() {
  const [form, setForm] = useState({
    pacienteId: "",
    servicioId: "",
  });

  const [pacientes, setPacientes] = useState<Paciente[]>([]);
  const [servicios, setServicios] = useState<Servicio[]>([]);
  const [enfermeros, setEnfermeros] = useState<Enfermero[]>([]);
  const [loadingPacientes, setLoadingPacientes] = useState(false);
  const [loadingServicios, setLoadingServicios] = useState(false);
  const [loadingEnfermeros, setLoadingEnfermeros] = useState(false);
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

      setLoadingEnfermeros(true);
      try {
        const response = await axios.get("http://localhost:5000/api/enfermeros");
        const data = response.data.success ? response.data.data : response.data;
        setEnfermeros(data || []);
      } catch (error) {
      } finally {
        setLoadingEnfermeros(false);
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

  /* Render principal */
  return (
    <div className="min-h-screen bg-auto-primary pt-20">
      <div className="bg-gradient-to-br from-sky-400/15 via-cyan-300/10 to-sky-400/15 w-full h-full absolute"></div>
      <div className="relative min-h-screen">
        <main className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10 py-10">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <FormLayout title="Asignar Paciente a Servicio" onSubmit={handleSubmit} widthClass="max-w-4xl">
                <div className="grid grid-cols-1 gap-6">
                  /* Bloque: Selección y búsqueda de paciente */
                  <div className="relative search-container">
                    <label className="block text-sm font-medium text-auto-primary mb-2">
                      Paciente <span className="text-red-500">*</span>
                    </label>
                    <div className="relative mb-2">
                      <input
                        type="text"
                        value={searchTerm}
                        onChange={handleSearchChange}
                        placeholder={loadingPacientes ? "Cargando pacientes..." : "🔍 Buscar por nombre, apellido o expediente..."}
                        disabled={loadingPacientes}
                        className="w-full px-4 py-2 bg-auto-tertiary border border-auto rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 text-auto-primary placeholder-auto-secondary disabled:opacity-50 text-sm"
                      />
                    </div>
                    <select
                      name="pacienteId"
                      value={form.pacienteId}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 bg-auto-tertiary border border-auto rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500 text-auto-primary disabled:opacity-50"
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
                  /* Bloque: Información del paciente seleccionado */
                  {selectedPaciente && (
                    <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                      <h4 className="font-semibold text-blue-900 mb-2">Información del Paciente</h4>
                      <div className="text-sm text-blue-800">
                        <p><span className="font-medium">Nombre:</span> {selectedPaciente.nombre} {selectedPaciente.apellidop} {selectedPaciente.apellidom}</p>
                        <p><span className="font-medium">Expediente:</span> {selectedPaciente.numeroExpediente}</p>
                        {selectedPaciente.servicioId && (
                          <p className="text-orange-600 mt-2">
                            ⚠️ Este paciente ya está asignado a un servicio. La asignación será actualizada.
                          </p>
                        )}
                      </div>
                    </div>
                  )}
                  /* Bloque: Selección de servicio */
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
                  /* Bloque: Enfermeros en el servicio seleccionado */
                  {selectedServicio && enfermerosEnServicio.length > 0 && (
                    <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                      <h4 className="font-semibold text-green-900 mb-2">
                        👨‍⚕️ Enfermeros en este servicio ({enfermerosEnServicio.length})
                      </h4>
                      <div className="space-y-2 max-h-40 overflow-y-auto">
                        {enfermerosEnServicio.map(enf => (
                          <div key={enf.enfermeroId} className="text-sm text-green-800 bg-white rounded-lg p-2 flex items-center gap-2">
                            <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span className="font-medium">{enf.nombre} {enf.apellidoPaterno} {enf.apellidoMaterno}</span>
                            <span className="text-xs text-gray-500 ml-auto">#{enf.numeroEmpleado}</span>
                          </div>
                        ))}
                      </div>
                      <p className="text-xs text-green-700 mt-2">
                        Estos enfermeros podrán atender al paciente asignado a este servicio.
                      </p>
                    </div>
                  )}
                  {selectedServicio && enfermerosEnServicio.length === 0 && (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
                      <h4 className="font-semibold text-yellow-900 mb-1">⚠️ Sin enfermeros asignados</h4>
                      <p className="text-sm text-yellow-800">
                        Este servicio no tiene enfermeros asignados actualmente. Considera asignar enfermeros a este servicio primero.
                      </p>
                    </div>
                  )}
                </div>
                <div className="mt-6">
                  <SubmitButton label={loading ? "Asignando..." : "Asignar Paciente"} />
                </div>
                {alert && (
                  <div className={`mt-4 p-4 rounded-xl ${alert.type === 'success' ? 'bg-green-100 text-green-800 border border-green-300' : 'bg-red-100 text-red-800 border border-red-300'}`}>
                    {alert.message}
                  </div>
                )}
              </FormLayout>
            </div>
            <aside className="lg:col-span-1">
              <div className="bg-auto-secondary backdrop-blur-sm border border-auto rounded-3xl p-6 shadow-lg sticky top-24">
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
                    Los enfermeros asignados al mismo servicio podrán ver y atender a estos pacientes.
                  </p>
                  <div className="mt-4 p-3 bg-sky-50 rounded-lg border border-sky-200">
                    <p className="font-semibold text-sky-900 mb-1">🔄 Relación Enfermero-Paciente:</p>
                    <p className="text-sky-800 text-xs">
                      Al asignar un paciente a un servicio, todos los enfermeros de ese servicio tendrán acceso para atenderlo.
                    </p>
                  </div>
                  <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <p className="font-semibold text-blue-900 mb-1">💡 Nota:</p>
                    <p className="text-blue-800 text-xs">
                      Un paciente solo puede estar asignado a un servicio a la vez. Si reasignas un paciente, se actualizará su servicio actual.
                    </p>
                  </div>
                  {form.servicioId && enfermerosEnServicio.length > 0 && (
                    <div className="mt-4 p-3 bg-green-50 rounded-lg border border-green-200">
                      <p className="font-semibold text-green-900 mb-1">✅ Enfermeros disponibles:</p>
                      <p className="text-green-800 text-xs">
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

export default AsignarPaciente;
