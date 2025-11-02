import { useEffect, useState, useMemo } from "react";
import axios from "axios";
import TextField from "../utilities/Form/TextField";
import SelectField from "../utilities/Form/SelectField";

type Insumo = {
  insumoId: number;
  nombre: string;
};

type InsumoAsignado = {
  insumoId: number;
  nombre: string;
  cantidad: string;
};

type Medicamento = {
  medicamentoId: number;
  nombre: string;
};

type MedicamentoAsignado = {
  medicamentoId: number;
  nombre: string;
  dosis: string;
  frecuencia: string;
};

type PacienteFormState = {
  numeroExpediente: string;
  nombre: string;
  apellidop: string;
  apellidom: string;
  edad: string;
  numeroCama: string;
  numeroHabitacion: string;
  fechaIngreso: string;
  motivoConsulta: string;
  servicioId: string;
};

type ServicioResumen = {
  servicioId: number;
  nombre: string;
};

type AlertState = { type: "success" | "danger"; message: string } | null;

const emptyForm: PacienteFormState = {
  numeroExpediente: "",
  nombre: "",
  apellidop: "",
  apellidom: "",
  edad: "",
  numeroCama: "",
  numeroHabitacion: "",
  fechaIngreso: "",
  motivoConsulta: "",
  servicioId: "",
};

function RegistrarPacientes() {
  // Estado para medicamentos
  const [medicamentos, setMedicamentos] = useState<Medicamento[]>([]);
  const [medicamentoSeleccionado, setMedicamentoSeleccionado] = useState<string>("");
  const [medicamentoSeleccionadoId, setMedicamentoSeleccionadoId] = useState<number|null>(null);
  const [dosis, setDosis] = useState("");
  const [frecuencia, setFrecuencia] = useState("");
  const [medicamentosAsignados, setMedicamentosAsignados] = useState<MedicamentoAsignado[]>([]);
  
  // Estado para insumos
  const [insumos, setInsumos] = useState<Insumo[]>([]);
  const [insumoSeleccionado, setInsumoSeleccionado] = useState<string>("");
  const [insumoSeleccionadoId, setInsumoSeleccionadoId] = useState<number|null>(null);
  const [cantidadInsumo, setCantidadInsumo] = useState("");
  const [insumosAsignados, setInsumosAsignados] = useState<InsumoAsignado[]>([]);

  // Cargar medicamentos
  useEffect(() => {
    const fetchMedicamentos = async () => {
      try {
        const resp = await axios.get("http://localhost:5000/api/medicamentos/");
        if (Array.isArray(resp.data?.data)) {
          setMedicamentos(resp.data.data);
        }
      } catch (err) {
        // Silenciar error
      }
    };
    fetchMedicamentos();
  }, []);

  // Agregar medicamento a la lista
  const handleAgregarMedicamento = () => {
    if (!medicamentoSeleccionadoId || !dosis || !frecuencia) return;
    const med = medicamentos.find((m: Medicamento) => m.medicamentoId === medicamentoSeleccionadoId);
    if (!med) return;
    setMedicamentosAsignados((prev: MedicamentoAsignado[]) => [
      ...prev,
      { medicamentoId: med.medicamentoId, nombre: med.nombre, dosis, frecuencia },
    ]);
    setMedicamentoSeleccionado("");
    setMedicamentoSeleccionadoId(null);
    setDosis("");
    setFrecuencia("");
  };

  // Eliminar medicamento de la lista
  const handleEliminarAsignado = (id: number) => {
    setMedicamentosAsignados((prev: MedicamentoAsignado[]) => prev.filter((m) => m.medicamentoId !== id));
  };

  // Cargar insumos
  useEffect(() => {
    const fetchInsumos = async () => {
      try {
        const resp = await axios.get("http://localhost:5000/api/insumos/");
        if (Array.isArray(resp.data?.data)) {
          setInsumos(resp.data.data);
        }
      } catch (err) {
        // Silenciar error
      }
    };
    fetchInsumos();
  }, []);

  // Agregar insumo a la lista
  const handleAgregarInsumo = () => {
    if (!insumoSeleccionadoId || !cantidadInsumo) return;
    const ins = insumos.find((i: Insumo) => i.insumoId === insumoSeleccionadoId);
    if (!ins) return;
    setInsumosAsignados((prev: InsumoAsignado[]) => [
      ...prev,
      { insumoId: ins.insumoId, nombre: ins.nombre, cantidad: cantidadInsumo },
    ]);
    setInsumoSeleccionado("");
    setInsumoSeleccionadoId(null);
    setCantidadInsumo("");
  };

  // Eliminar insumo de la lista
  const handleEliminarInsumo = (id: number) => {
    setInsumosAsignados((prev: InsumoAsignado[]) => prev.filter((i) => i.insumoId !== id));
  };
  
  // Estado del formulario
  const [form, setForm] = useState<PacienteFormState>(emptyForm);
  const [servicios, setServicios] = useState<ServicioResumen[]>([]);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState<AlertState>(null);

  // Cargar servicios disponibles
  useEffect(() => {
    const fetchServicios = async () => {
      try {
        const resp = await axios.get("http://localhost:5000/api/servicios/listServices");
        if (Array.isArray(resp.data?.data)) {
          setServicios(resp.data.data as ServicioResumen[]);
        } else if (Array.isArray(resp.data)) {
          setServicios(resp.data as ServicioResumen[]);
        }
      } catch (err) {
        console.warn("No se pudieron cargar servicios:", err);
      }
    };

    fetchServicios();
  }, []);

  // Opciones de servicios para el select
  const servicioOptions = useMemo(
    () => servicios.map((servicio: ServicioResumen) => ({ value: String(servicio.servicioId), label: servicio.nombre })),
    [servicios]
  );

  // Manejadores de cambio en formulario
  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target;
    setForm((prev: PacienteFormState) => ({ ...prev, [name]: value }));
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => handleChange(event);
  const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => handleChange(event);
  const handleTextareaChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => handleChange(event);

  const resetForm = () => setForm(emptyForm);

  // Enviar formulario
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setAlert(null);
    setLoading(true);

    try {
      const payload = {
        numeroExpediente: form.numeroExpediente.trim(),
        nombre: form.nombre.trim(),
        apellidop: form.apellidop.trim(),
        apellidom: form.apellidom.trim(),
        edad: form.edad ? Number.parseInt(form.edad, 10) : null,
        numeroCama: form.numeroCama.trim() || null,
        numeroHabitacion: form.numeroHabitacion.trim() || null,
        fechaIngreso: form.fechaIngreso ? new Date(form.fechaIngreso).toISOString() : undefined,
        motivoConsulta: form.motivoConsulta.trim() || null,
        servicioId: form.servicioId ? Number.parseInt(form.servicioId, 10) : null,
      };

      // Registrar paciente
      const response = await axios.post("http://localhost:5000/api/pacientes/", payload);
      const pacienteId = response.data?.data?.pacienteId;
      
      // Asignar medicamentos si existen
      if (pacienteId && medicamentosAsignados.length > 0) {
        try {
          await axios.post("http://localhost:5000/api/medicamentos/asignar", {
            pacienteId,
            medicamentos: medicamentosAsignados.map((m: MedicamentoAsignado) => ({
              medicamentoId: m.medicamentoId,
              cantidad: 1,
              dosis: m.dosis || null,
              frecuencia: m.frecuencia || null,
              viaAdministracion: null,
            }))
          });
        } catch (medError: any) {
          console.error("Error al asignar medicamentos:", medError.response?.data || medError.message);
        }
      }
      
      // Asignar insumos si existen
      if (pacienteId && insumosAsignados.length > 0) {
        try {
          await axios.post("http://localhost:5000/api/insumos/asignar", {
            pacienteId,
            insumos: insumosAsignados.map((i: InsumoAsignado) => ({
              insumoId: i.insumoId,
              cantidad: Number(i.cantidad),
            }))
          });
        } catch (insError: any) {
          console.error("Error al asignar insumos:", insError.response?.data || insError.message);
        }
      }

      setAlert({
        type: "success",
        message: "Paciente registrado exitosamente",
      });

      resetForm();
      setMedicamentosAsignados([]);
      setInsumosAsignados([]);
    } catch (error: any) {
      console.error("Error al registrar paciente:", error);
      const message = error.response?.data?.error || error.message || "Error al registrar paciente";
      setAlert({ type: "danger", message });
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
                    <h2 className="text-3xl font-bold text-auto-primary">Registrar Paciente</h2>
                    <p className="text-auto-secondary text-sm">Ingresa los datos del nuevo paciente</p>
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
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <TextField
                      label="Número de Expediente"
                      name="numeroExpediente"
                      value={form.numeroExpediente}
                      onChange={handleInputChange}
                      required
                    />
                    <TextField label="Nombre" name="nombre" value={form.nombre} onChange={handleInputChange} required />
                    <TextField
                      label="Apellido paterno"
                      name="apellidop"
                      value={form.apellidop}
                      onChange={handleInputChange}
                      required
                    />
                    <TextField
                      label="Apellido materno"
                      name="apellidom"
                      value={form.apellidom}
                      onChange={handleInputChange}
                      required
                    />
                    <TextField label="Edad" name="edad" type="number" value={form.edad} onChange={handleInputChange} />
                    <TextField label="Número de Cama" name="numeroCama" value={form.numeroCama} onChange={handleInputChange} />
                    <TextField
                      label="Número de Habitación"
                      name="numeroHabitacion"
                      value={form.numeroHabitacion}
                      onChange={handleInputChange}
                    />
                    <div>
                      <label className="block text-sm font-semibold text-auto-primary mb-2">Fecha de Ingreso</label>
                      <input
                        id="Fecha de Ingreso"
                        name="fechaIngreso"
                        type="datetime-local"
                        value={form.fechaIngreso}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border-2 border-auto rounded-xl bg-auto-primary text-auto-primary focus:border-sky-500 focus:outline-none focus:ring-4 focus:ring-sky-500/20 transition-all duration-200"
                      />
                    </div>
                    <div>
                      <SelectField
                        label="Servicio"
                        name="servicioId"
                        value={form.servicioId}
                        onChange={handleSelectChange}
                        options={[{ value: "", label: "Sin asignar" }, ...servicioOptions]}
                      />
                    </div>
                  </div>

                  <div className="mt-6">
                    <label className="block text-sm font-semibold text-auto-primary mb-2">Motivo de Consulta</label>
                    <textarea
                      name="motivoConsulta"
                      value={form.motivoConsulta}
                      onChange={handleTextareaChange}
                      placeholder="Descripción breve del motivo de ingreso"
                      className="w-full px-4 py-3 border-2 border-auto rounded-xl bg-auto-primary text-auto-primary placeholder-auto-secondary/70 focus:border-sky-500 focus:outline-none focus:ring-4 focus:ring-sky-500/20 transition-all duration-200 min-h-[100px] resize-y"
                    />
                  </div>

                  <div className="mt-6">
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full px-6 py-3 bg-gradient-to-r from-sky-500 to-cyan-500 text-white font-semibold rounded-xl hover:from-sky-600 hover:to-cyan-600 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed transition-all duration-200 shadow-lg"
                    >
                      {loading ? "Registrando..." : "Registrar Paciente"}
                    </button>
                  </div>
                </form>
              </div>
            </div>

            <aside className="lg:col-span-1 flex flex-col gap-6">
              {/* Tarjeta medicamentos */}
              <div className="bg-auto-secondary rounded-2xl shadow-xl p-6 border border-auto backdrop-blur-sm">
                <h3 className="text-lg font-semibold text-auto-primary mb-2">💊 Asignar Medicamentos</h3>
                <p className="text-auto-secondary text-sm mb-4">Selecciona un medicamento, especifica dosis y frecuencia, y agrégalo a la lista.</p>
                <div className="mb-4">
                  <div className="flex flex-wrap gap-3 mb-2 items-end bg-auto-primary rounded-xl p-4 border-2 border-auto shadow-sm">
                    <div className="flex-1 min-w-[140px]">
                      <label className="block text-xs font-semibold text-auto-primary mb-1">Medicamento</label>
                      <input
                        className="w-full border-2 border-auto focus:border-sky-500 rounded-lg bg-auto-secondary text-auto-primary px-3 py-2 transition-colors outline-none focus:ring-2 focus:ring-sky-500/20"
                        list="medicamentos-list"
                        placeholder="Selecciona medicamento"
                        value={medicamentoSeleccionado}
                        onChange={e => {
                          setMedicamentoSeleccionado(e.target.value);
                          const found = medicamentos.find((m: Medicamento) => m.nombre.toLowerCase() === e.target.value.toLowerCase());
                          setMedicamentoSeleccionadoId(found ? found.medicamentoId : null);
                        }}
                        autoComplete="off"
                      />
                      <datalist id="medicamentos-list">
                        {medicamentos.map((m: Medicamento) => (
                          <option key={m.medicamentoId} value={m.nombre} />
                        ))}
                      </datalist>
                    </div>
                    <div className="min-w-[90px]">
                      <label className="block text-xs font-semibold text-auto-primary mb-1">Dosis</label>
                      <input
                        type="text"
                        className="w-full border-2 border-auto focus:border-sky-500 rounded-lg bg-auto-secondary text-auto-primary px-3 py-2 transition-colors outline-none focus:ring-2 focus:ring-sky-500/20"
                        placeholder="Dosis"
                        value={dosis}
                        onChange={e => setDosis(e.target.value)}
                      />
                    </div>
                    <div className="min-w-[110px]">
                      <label className="block text-xs font-semibold text-auto-primary mb-1">Frecuencia</label>
                      <input
                        type="text"
                        className="w-full border-2 border-auto focus:border-sky-500 rounded-lg bg-auto-secondary text-auto-primary px-3 py-2 transition-colors outline-none focus:ring-2 focus:ring-sky-500/20"
                        placeholder="Frecuencia"
                        value={frecuencia}
                        onChange={e => setFrecuencia(e.target.value)}
                      />
                    </div>
                    <div className="flex items-end">
                      <button
                        type="button"
                        className={`bg-gradient-to-r from-sky-500 to-cyan-500 hover:from-sky-600 hover:to-cyan-600 text-white px-4 py-2 rounded-lg text-sm font-semibold shadow-md transition-all ${(!medicamentoSeleccionado || !dosis || !frecuencia) ? 'opacity-60 cursor-not-allowed' : ''}`}
                        onClick={handleAgregarMedicamento}
                        disabled={!medicamentoSeleccionado || !dosis || !frecuencia}
                      >
                        Agregar
                      </button>
                    </div>
                  </div>
                </div>
                <div className="max-h-60 overflow-y-auto divide-y divide-auto">
                  {medicamentosAsignados.length === 0 ? (
                    <div className="text-auto-secondary text-sm py-4 text-center italic">No hay medicamentos asignados.</div>
                  ) : (
                    medicamentosAsignados.map((m: MedicamentoAsignado) => (
                      <div key={m.medicamentoId} className="flex items-center py-3 hover:bg-auto-primary/50 px-2 rounded-lg transition-colors">
                        <span className="flex-1">
                          <span className="font-semibold text-auto-primary block">{m.nombre}</span>
                          <span className="text-xs text-auto-secondary">💉 Dosis: {m.dosis} • ⏰ Cada: {m.frecuencia}</span>
                        </span>
                        <button
                          type="button"
                          className="ml-2 bg-red-100 hover:bg-red-200 text-red-700 px-3 py-1 rounded-lg text-xs font-bold transition-colors dark:bg-red-900/40 dark:hover:bg-red-900/60 dark:text-red-200"
                          onClick={() => handleEliminarAsignado(m.medicamentoId)}
                        >
                          Quitar
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>
              {/* Tarjeta insumos */}
              <div className="bg-auto-secondary rounded-2xl shadow-xl p-6 border border-auto backdrop-blur-sm">
                <h3 className="text-lg font-semibold text-auto-primary mb-2">🏥 Asignar Insumos</h3>
                <p className="text-auto-secondary text-sm mb-4">Selecciona un insumo, especifica la cantidad y agrégalo a la lista.</p>
                <div className="mb-4">
                  <div className="flex flex-wrap gap-3 mb-2 items-end bg-auto-primary rounded-xl p-4 border-2 border-auto shadow-sm">
                    <div className="flex-1 min-w-[140px]">
                      <label className="block text-xs font-semibold text-auto-primary mb-1">Insumo</label>
                      <input
                        className="w-full border-2 border-auto focus:border-sky-500 rounded-lg bg-auto-secondary text-auto-primary px-3 py-2 transition-colors outline-none focus:ring-2 focus:ring-sky-500/20"
                        list="insumos-list"
                        placeholder="Selecciona insumo"
                        value={insumoSeleccionado}
                        onChange={e => {
                          setInsumoSeleccionado(e.target.value);
                          const found = insumos.find((i: Insumo) => i.nombre.toLowerCase() === e.target.value.toLowerCase());
                          setInsumoSeleccionadoId(found ? found.insumoId : null);
                        }}
                        autoComplete="off"
                      />
                      <datalist id="insumos-list">
                        {insumos.map((i: Insumo) => (
                          <option key={i.insumoId} value={i.nombre} />
                        ))}
                      </datalist>
                    </div>
                    <div className="min-w-[90px]">
                      <label className="block text-xs font-semibold text-auto-primary mb-1">Cantidad</label>
                      <input
                        type="number"
                        min="1"
                        className="w-full border-2 border-auto focus:border-sky-500 rounded-lg bg-auto-secondary text-auto-primary px-3 py-2 transition-colors outline-none focus:ring-2 focus:ring-sky-500/20"
                        placeholder="Cantidad"
                        value={cantidadInsumo}
                        onChange={e => setCantidadInsumo(e.target.value)}
                      />
                    </div>
                    <div className="flex items-end">
                      <button
                        type="button"
                        className={`bg-gradient-to-r from-sky-500 to-cyan-500 hover:from-sky-600 hover:to-cyan-600 text-white px-4 py-2 rounded-lg text-sm font-semibold shadow-md transition-all ${(!insumoSeleccionado || !cantidadInsumo) ? 'opacity-60 cursor-not-allowed' : ''}`}
                        onClick={handleAgregarInsumo}
                        disabled={!insumoSeleccionado || !cantidadInsumo}
                      >
                        Agregar
                      </button>
                    </div>
                  </div>
                </div>
                <div className="max-h-60 overflow-y-auto divide-y divide-auto">
                  {insumosAsignados.length === 0 ? (
                    <div className="text-auto-secondary text-sm py-4 text-center italic">No hay insumos asignados.</div>
                  ) : (
                    insumosAsignados.map((i: InsumoAsignado) => (
                      <div key={i.insumoId} className="flex items-center py-3 hover:bg-auto-primary/50 px-2 rounded-lg transition-colors">
                        <span className="flex-1">
                          <span className="font-semibold text-auto-primary block">{i.nombre}</span>
                          <span className="text-xs text-auto-secondary">📦 Cantidad: {i.cantidad}</span>
                        </span>
                        <button
                          type="button"
                          className="ml-2 bg-red-100 hover:bg-red-200 text-red-700 px-3 py-1 rounded-lg text-xs font-bold transition-colors dark:bg-red-900/40 dark:hover:bg-red-900/60 dark:text-red-200"
                          onClick={() => handleEliminarInsumo(i.insumoId)}
                        >
                          Quitar
                        </button>
                      </div>
                    ))
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

export default RegistrarPacientes;