import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import FormLayout from "../utilities/Form/FormLayout";
import TextField from "../utilities/Form/TextField";
import SelectField from "../utilities/Form/SelectField";
import SubmitButton from "../utilities/Form/SubmitButton";

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
  const [form, setForm] = useState<PacienteFormState>(emptyForm);
  const [servicios, setServicios] = useState<ServicioResumen[]>([]);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState<AlertState>(null);

  useEffect(() => {
    const fetchServicios = async () => {
      try {
        const resp = await axios.get("http://localhost:5000/api/servicios/");
        if (Array.isArray(resp.data?.data)) {
          setServicios(resp.data.data as ServicioResumen[]);
        }
      } catch (err) {
        console.warn("No se pudieron cargar servicios:", err);
      }
    };

    fetchServicios();
  }, []);

  const servicioOptions = useMemo(
    () => servicios.map((servicio) => ({ value: String(servicio.servicioId), label: servicio.nombre })),
    [servicios]
  );

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
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

      const response = await axios.post("http://localhost:5000/api/pacientes/", payload);
      console.log("✅ Paciente registrado:", response.data);

      setAlert({
        type: "success",
        message: "Paciente registrado exitosamente",
      });

      resetForm();
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
                    <input
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

            <aside className="lg:col-span-1">
              <div className="bg-auto-secondary backdrop-blur-sm border border-auto rounded-3xl p-6 shadow-lg">
                <h3 className="text-lg font-semibold text-auto-primary mb-3">Lista / Búsqueda</h3>
                <p className="text-auto-secondary text-sm">Aquí puedes agregar una lista de pacientes o una barra de búsqueda para consultarlos rápidamente.</p>
                <div className="mt-4">
                  <input className="w-full pl-4 pr-4 py-3 border rounded-xl bg-auto-tertiary/60 text-auto-primary" placeholder="Buscar por nombre o expediente" />
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