import { useEffect, useState, useMemo } from "react";
import axios from "axios";
import FormLayout from "../utilities/Form/FormLayout";
import TextField from "../utilities/Form/TextField";
import SelectField from "../utilities/Form/SelectField";
import SubmitButton from "../utilities/Form/SubmitButton";

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
  const [medicamentos, setMedicamentos] = useState<Medicamento[]>([]);
  const [medicamentoSeleccionado, setMedicamentoSeleccionado] = useState<string>("");
  const [medicamentoSeleccionadoId, setMedicamentoSeleccionadoId] = useState<number|null>(null);
  const [dosis, setDosis] = useState("");
  const [frecuencia, setFrecuencia] = useState("");
  const [medicamentosAsignados, setMedicamentosAsignados] = useState<MedicamentoAsignado[]>([]);
  // INSUMOS HOOKS Y LOGICA
  const [insumos, setInsumos] = useState<Insumo[]>([]);
  const [insumoSeleccionado, setInsumoSeleccionado] = useState<string>("");
  const [insumoSeleccionadoId, setInsumoSeleccionadoId] = useState<number|null>(null);
  const [cantidadInsumo, setCantidadInsumo] = useState("");
  const [insumosAsignados, setInsumosAsignados] = useState<InsumoAsignado[]>([]);

  // Cargar medicamentos disponibles
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




  // Agregar medicamento asignado
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

  // Eliminar medicamento asignado
  const handleEliminarAsignado = (id: number) => {
    setMedicamentosAsignados((prev: MedicamentoAsignado[]) => prev.filter((m) => m.medicamentoId !== id));
  };

  // Cargar insumos disponibles
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

  // Agregar insumo asignado
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

  // Eliminar insumo asignado
  const handleEliminarInsumo = (id: number) => {
    setInsumosAsignados((prev: InsumoAsignado[]) => prev.filter((i) => i.insumoId !== id));
  };
  const [form, setForm] = useState<PacienteFormState>(emptyForm);
  const [servicios, setServicios] = useState<ServicioResumen[]>([]);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState<AlertState>(null);

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

  const servicioOptions = useMemo(
    () => servicios.map((servicio: ServicioResumen) => ({ value: String(servicio.servicioId), label: servicio.nombre })),
    [servicios]
  );

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target;
    setForm((prev: PacienteFormState) => ({ ...prev, [name]: value }));
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => handleChange(event);
  const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => handleChange(event);
  const handleTextareaChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => handleChange(event);

  const resetForm = () => setForm(emptyForm);

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
      
      console.log("✅ Paciente registrado con ID:", pacienteId);
      
      // Si hay medicamentos asignados, asociarlos usando el endpoint de asignación
      if (pacienteId && medicamentosAsignados.length > 0) {
        console.log("📋 Asignando medicamentos:", medicamentosAsignados);
        try {
          await axios.post("http://localhost:5000/api/medicamentos/asignar", {
            pacienteId,
            medicamentos: medicamentosAsignados.map((m: MedicamentoAsignado) => ({
              medicamentoId: m.medicamentoId,
              cantidad: 1, // Por defecto 1, puedes agregar un campo si lo necesitas
            }))
          });
          console.log("✅ Medicamentos asignados correctamente");
        } catch (medError: any) {
          console.error("❌ Error al asignar medicamentos:", medError.response?.data || medError.message);
        }
      }
      
      // Si hay insumos asignados, asociarlos usando el endpoint de asignación
      if (pacienteId && insumosAsignados.length > 0) {
        console.log("📦 Asignando insumos:", insumosAsignados);
        try {
          await axios.post("http://localhost:5000/api/insumos/asignar", {
            pacienteId,
            insumos: insumosAsignados.map((i: InsumoAsignado) => ({
              insumoId: i.insumoId,
              cantidad: Number(i.cantidad),
            }))
          });
          console.log("✅ Insumos asignados correctamente");
        } catch (insError: any) {
          console.error("❌ Error al asignar insumos:", insError.response?.data || insError.message);
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
      console.error("❌ Error al registrar paciente:", error);
      const message = error.response?.data?.error || error.message || "Error al registrar paciente";
      setAlert({ type: "danger", message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-auto-primary pt-20">
      <div className="bg-gradient-to-br from-sky-400/15 via-cyan-300/10 to-sky-400/15 w-full h-full absolute"></div>
      <div className="relative min-h-screen">
        <main className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10 py-10">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <FormLayout title="Registrar Paciente" onSubmit={handleSubmit} widthClass="max-w-4xl">
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
                    <label className="block text-sm font-medium text-auto-primary mb-2">Fecha de Ingreso</label>
                    <input
                      id="Fecha de Ingreso"
                      name="fechaIngreso"
                      type="datetime-local"
                      value={form.fechaIngreso}
                      onChange={handleInputChange}
                      className="w-full pl-4 pr-4 py-3 border rounded-xl bg-auto-tertiary/60 text-auto-primary"
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
                  <label className="block text-sm font-medium text-auto-primary mb-2">Motivo de Consulta</label>
                  <textarea
                    name="motivoConsulta"
                    value={form.motivoConsulta}
                    onChange={handleTextareaChange}
                    placeholder="Descripción breve del motivo de ingreso"
                    className="w-full pl-4 pr-4 py-3 border rounded-xl bg-auto-tertiary/60 text-auto-primary min-h-[100px]"
                  />
                </div>

                <div className="mt-6">
                  <SubmitButton label={loading ? "Registrando..." : "Registrar"} />
                </div>

                {alert && (
                  <div
                    className={`mt-4 p-4 rounded-xl ${
                      alert.type === "success"
                        ? "bg-green-100 text-green-800 border border-green-300"
                        : "bg-red-100 text-red-800 border border-red-300"
                    }`}
                  >
                    {alert.message}
                  </div>
                )}
              </FormLayout>
            </div>

            <aside className="lg:col-span-1 flex flex-col gap-6">
              {/* Tarjeta medicamentos */}
              <div className="bg-auto-secondary backdrop-blur-sm border border-auto rounded-3xl p-6 shadow-lg">
                <h3 className="text-lg font-semibold text-auto-primary mb-3">Asignar Medicamentos</h3>
                <p className="text-auto-secondary text-sm mb-4">Selecciona un medicamento, especifica dosis y frecuencia, y agrégalo a la lista.</p>
                <div className="mb-4">
                  <div className="flex flex-wrap gap-3 mb-2 items-end bg-auto-tertiary/40 rounded-2xl p-4 border border-auto-tertiary shadow-sm">
                    <div className="flex-1 min-w-[140px]">
                      <label className="block text-xs font-semibold text-auto-primary mb-1">Medicamento</label>
                      <input
                        className="w-full border-2 border-auto-tertiary focus:border-sky-500 rounded-xl bg-auto-tertiary/80 text-auto-primary px-2 py-2 transition-colors outline-none"
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
                        className="w-full border-2 border-auto-tertiary focus:border-sky-500 rounded-xl bg-auto-tertiary/80 text-auto-primary px-2 py-2 transition-colors outline-none"
                        placeholder="Dosis"
                        value={dosis}
                        onChange={e => setDosis(e.target.value)}
                      />
                    </div>
                    <div className="min-w-[110px]">
                      <label className="block text-xs font-semibold text-auto-primary mb-1">Frecuencia</label>
                      <input
                        type="text"
                        className="w-full border-2 border-auto-tertiary focus:border-sky-500 rounded-xl bg-auto-tertiary/80 text-auto-primary px-2 py-2 transition-colors outline-none"
                        placeholder="Frecuencia"
                        value={frecuencia}
                        onChange={e => setFrecuencia(e.target.value)}
                      />
                    </div>
                    <div className="flex items-end">
                      <button
                        type="button"
                        className={`bg-sky-600 hover:bg-sky-700 text-white px-4 py-2 rounded-xl text-sm font-semibold shadow-md transition-colors ${(!medicamentoSeleccionado || !dosis || !frecuencia) ? 'opacity-60 cursor-not-allowed' : ''}`}
                        onClick={handleAgregarMedicamento}
                        disabled={!medicamentoSeleccionado || !dosis || !frecuencia}
                      >
                        Agregar
                      </button>
                    </div>
                  </div>
                </div>
                <div className="max-h-60 overflow-y-auto divide-y divide-auto-tertiary">
                  {medicamentosAsignados.length === 0 ? (
                    <div className="text-auto-tertiary text-sm py-4">No hay medicamentos asignados.</div>
                  ) : (
                    medicamentosAsignados.map((m: MedicamentoAsignado) => (
                      <div key={m.medicamentoId} className="flex items-center py-2">
                        <span className="flex-1">
                          <span className="font-medium text-auto-primary">{m.nombre}</span>
                          <span className="ml-2 text-xs text-auto-secondary">Dosis: {m.dosis}</span>
                          <span className="ml-2 text-xs text-auto-secondary">Cada: {m.frecuencia}</span>
                        </span>
                        <button
                          type="button"
                          className="ml-2 text-red-600 hover:text-red-800 text-xs font-bold"
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
              <div className="bg-auto-secondary backdrop-blur-sm border border-auto rounded-3xl p-6 shadow-lg">
                <h3 className="text-lg font-semibold text-auto-primary mb-3">Asignar Insumos</h3>
                <p className="text-auto-secondary text-sm mb-4">Selecciona un insumo, especifica la cantidad y agrégalo a la lista.</p>
                <div className="mb-4">
                  <div className="flex flex-wrap gap-3 mb-2 items-end bg-auto-tertiary/40 rounded-2xl p-4 border border-auto-tertiary shadow-sm">
                    <div className="flex-1 min-w-[140px]">
                      <label className="block text-xs font-semibold text-auto-primary mb-1">Insumo</label>
                      <input
                        className="w-full border-2 border-auto-tertiary focus:border-sky-500 rounded-xl bg-auto-tertiary/80 text-auto-primary px-2 py-2 transition-colors outline-none"
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
                        className="w-full border-2 border-auto-tertiary focus:border-sky-500 rounded-xl bg-auto-tertiary/80 text-auto-primary px-2 py-2 transition-colors outline-none"
                        placeholder="Cantidad"
                        value={cantidadInsumo}
                        onChange={e => setCantidadInsumo(e.target.value)}
                      />
                    </div>
                    <div className="flex items-end">
                      <button
                        type="button"
                        className={`bg-sky-600 hover:bg-sky-700 text-white px-4 py-2 rounded-xl text-sm font-semibold shadow-md transition-colors ${(!insumoSeleccionado || !cantidadInsumo) ? 'opacity-60 cursor-not-allowed' : ''}`}
                        onClick={handleAgregarInsumo}
                        disabled={!insumoSeleccionado || !cantidadInsumo}
                      >
                        Agregar
                      </button>
                    </div>
                  </div>
                </div>
                <div className="max-h-60 overflow-y-auto divide-y divide-auto-tertiary">
                  {insumosAsignados.length === 0 ? (
                    <div className="text-auto-tertiary text-sm py-4">No hay insumos asignados.</div>
                  ) : (
                    insumosAsignados.map((i: InsumoAsignado) => (
                      <div key={i.insumoId} className="flex items-center py-2">
                        <span className="flex-1">
                          <span className="font-medium text-auto-primary">{i.nombre}</span>
                          <span className="ml-2 text-xs text-auto-secondary">Cantidad: {i.cantidad}</span>
                        </span>
                        <button
                          type="button"
                          className="ml-2 text-red-600 hover:text-red-800 text-xs font-bold"
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