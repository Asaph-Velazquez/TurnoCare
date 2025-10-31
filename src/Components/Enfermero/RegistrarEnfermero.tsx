import { useState, useEffect } from "react";
import axios from "axios";
import FormLayout from "../utilities/Form/FormLayout";
import TextField from "../utilities/Form/TextField";
import SelectField from "../utilities/Form/SelectField";
import SubmitButton from "../utilities/Form/SubmitButton";

interface Servicio {
  servicioId: number;
  nombre: string;
  descripcion?: string;
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
  const [loadingServicios, setLoadingServicios] = useState(false);
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
        console.error("❌ Error al cargar servicios:", error);
        setAlert({
          type: "danger",
          message: "Error al cargar la lista de servicios"
        });
      } finally {
        setLoadingServicios(false);
      }
    };
    fetchServicios();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((s) => ({ ...s, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAlert(null);
    setLoading(true);

    try {
      // Preparar datos para enviar
      const dataToSend = {
        ...form,
        esCoordinador: form.esCoordinador === "true",
        servicioActualId: form.servicioActualId ? parseInt(form.servicioActualId) : null,
        habitacionesAsignadas: form.habitacionesAsignadas,
        turno: form.turno,
      };

      const response = await axios.post("http://localhost:5000/api/enfermeros/", dataToSend);
      console.log("✅ Enfermero registrado:", response.data);
      
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
      console.error("❌ Error al registrar enfermero:", error);
      
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
    <div className="min-h-screen bg-auto-primary pt-20">
      <div className="bg-gradient-to-br from-sky-400/15 via-cyan-300/10 to-sky-400/15 w-full h-full absolute"></div>
      <div className="relative min-h-screen">
        <main className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10 py-10">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <FormLayout title="Registrar Enfermero" onSubmit={handleSubmit} widthClass="max-w-4xl">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <TextField label="Número de Empleado" name="numeroEmpleado" value={form.numeroEmpleado} onChange={handleChange as any} required />
                  <TextField label="Nombre" name="nombre" value={form.nombre} onChange={handleChange as any} required />
                  <TextField label="Apellido Paterno" name="apellidoPaterno" value={form.apellidoPaterno} onChange={handleChange as any} required />
                  <TextField label="Apellido Materno" name="apellidoMaterno" value={form.apellidoMaterno} onChange={handleChange as any} required />
                  <TextField label="Especialidad" name="especialidad" value={form.especialidad} onChange={handleChange as any} />
                  <SelectField label="Es Coordinador" name="esCoordinador" value={form.esCoordinador} onChange={handleChange as any} options={[{ value: "true", label: "Sí" }, { value: "false", label: "No" }]} />
                  <TextField label="Habitación(es) Asignada(s)" name="habitacionesAsignadas" value={form.habitacionesAsignadas} onChange={handleChange as any} placeholder="Ej: 101, 102, 103" required />
                  <SelectField 
                    label="Turno"
                    name="turno"
                    value={form.turno}
                    onChange={handleChange as any}
                    required
                    options={[
                      { value: "", label: "Seleccionar turno" },
                      { value: "matutino", label: "Matutino" },
                      { value: "vespertino", label: "Vespertino" },
                      { value: "nocturno", label: "Nocturno" },
                    ]}
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
                  <SubmitButton label={loading ? "Registrando..." : "Registrar"} />
                </div>

                {alert && (
                  <div className={`mt-4 p-4 rounded-xl ${alert.type === 'success' ? 'bg-green-100 text-green-800 border border-green-300' : 'bg-red-100 text-red-800 border border-red-300'}`}>
                    {alert.message}
                  </div>
                )}
              </FormLayout>
            </div>

            <aside className="lg:col-span-1">
              <div className="bg-auto-secondary backdrop-blur-sm border border-auto rounded-3xl p-6 shadow-lg">
                <h3 className="text-lg font-semibold text-auto-primary mb-3">Lista / Búsqueda</h3>
                <p className="text-auto-secondary text-sm">Aquí puedes agregar una lista de enfermeros o una barra de búsqueda para consultarlos rápidamente.</p>
                <div className="mt-4">
                  <input className="w-full pl-4 pr-4 py-3 border rounded-xl bg-auto-tertiary/60 text-auto-primary" placeholder="Buscar por nombre o número" />
                </div>
              </div>
            </aside>
          </div>
        </main>
      </div>
    </div>
  );
}

export default RegistrarEnfermero;
