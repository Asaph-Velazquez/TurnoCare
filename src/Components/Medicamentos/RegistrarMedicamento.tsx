import { useState } from "react";
import axios from "axios";
import FormLayout from "../utilities/Form/FormLayout";
import TextField from "../utilities/Form/TextField";
import SelectField from "../utilities/Form/SelectField";
import SubmitButton from "../utilities/Form/SubmitButton";

function RegistrarMedicamento() {
  const [form, setForm] = useState({
    nombre: "",
    dosis: "",
    viaAdministracion: "Oral",
    frecuencia: "",
    fechaHoraAdministracion: "",
    enfermeroResponsable: "",
  });

  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState<{ type: string; message: string } | null>(
    null
  );

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((s) => ({
      ...s,
      [name]: name === "enfermeroResponsable" ? value.toUpperCase() : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAlert(null);
    setLoading(true);

    try {
      const payload = {
        ...form,
        enfermeroResponsable: form.enfermeroResponsable.trim() || null,
        fechaHoraAdministracion: form.fechaHoraAdministracion
          ? new Date(form.fechaHoraAdministracion).toISOString()
          : null,
      };

      if (!payload.enfermeroResponsable) {
        setAlert({
          type: "danger",
          message: "El ID del enfermero responsable es obligatorio",
        });
        setLoading(false);
        return;
      }

      const response = await axios.post(
        "http://localhost:5000/api/medicamentos/",
        payload
      );
      console.log("✅ Medicamento registrado:", response.data);

      setAlert({
        type: "success",
        message: "Medicamento registrado exitosamente",
      });
      setForm({
        nombre: "",
        dosis: "",
        viaAdministracion: "Oral",
        frecuencia: "",
        fechaHoraAdministracion: "",
        enfermeroResponsable: "",
      });
    } catch (error: any) {
      console.error("❌ Error al registrar medicamento:", error);
      let errorMessage = "Error al registrar medicamento";
      if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
      } else if (error.message) {
        errorMessage = error.message;
      }
      setAlert({ type: "danger", message: errorMessage });
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
              <FormLayout
                title="Registrar Medicamento"
                onSubmit={handleSubmit}
                widthClass="max-w-4xl"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <TextField
                    label="Nombre"
                    name="nombre"
                    value={form.nombre}
                    onChange={handleChange as any}
                    required
                  />
                  <TextField
                    label="Dosis"
                    name="dosis"
                    value={form.dosis}
                    onChange={handleChange as any}
                  />
                  <SelectField
                    label="Vía de administración"
                    name="viaAdministracion"
                    value={form.viaAdministracion}
                    onChange={handleChange as any}
                    options={[
                      { value: "Oral", label: "Oral" },
                      { value: "Intravenosa", label: "Intravenosa" },
                      { value: "Intramuscular", label: "Intramuscular" },
                      { value: "Subcutánea", label: "Subcutánea" },
                      { value: "Sublingual", label: "Sublingual" },
                      { value: "Rectal", label: "Rectal" },
                      { value: "Tópica", label: "Tópica" },
                      { value: "Transdérmica", label: "Transdérmica" },
                      { value: "Inhalatoria", label: "Inhalatoria" },
                    ]}
                  />
                  <TextField
                    label="Frecuencia"
                    name="frecuencia"
                    value={form.frecuencia}
                    onChange={handleChange as any}
                    placeholder="Ej. Cada 8 horas"
                  />
                  <TextField
                    label="Fecha/hora próxima dosis"
                    name="fechaHoraAdministracion"
                    type="datetime-local"
                    value={form.fechaHoraAdministracion}
                    onChange={handleChange as any}
                  />
                  <TextField
                    label="ID Enfermero Responsable"
                    name="enfermeroResponsable"
                    value={form.enfermeroResponsable}
                    onChange={handleChange as any}
                    required
                  />
                </div>

                <div className="mt-6">
                  <SubmitButton
                    label={loading ? "Registrando..." : "Registrar"}
                  />
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
                <h3 className="text-lg font-semibold text-auto-primary mb-3">
                  Información
                </h3>
                <p className="text-auto-secondary text-sm">
                  Registra medicamentos según receta médica, controlando dosis,
                  vía y frecuencia.
                </p>
              </div>
            </aside>
          </div>
        </main>
      </div>
    </div>
  );
}

export default RegistrarMedicamento;
