import { useState } from "react";
import axios from "axios";
import FormLayout from "../utilities/Form/FormLayout";
import TextField from "../utilities/Form/TextField";
import SubmitButton from "../utilities/Form/SubmitButton";

function ActualizarHospital() {
  const [form, setForm] = useState({
    id: "",
    nombre: "",
    direccion: "",
    telefono: "",
  });
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState<{ type: string; message: string } | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAlert(null);
    setLoading(true);

    try {
      const response = await axios.put(`http://localhost:5000/api/hospital/${form.id}`, {
        nombre: form.nombre,
        direccion: form.direccion,
        telefono: form.telefono,
      });

      console.log("✅ Hospital actualizado:", response.data);
      setAlert({ type: "success", message: "Hospital actualizado exitosamente" });
      setForm({ id: "", nombre: "", direccion: "", telefono: "" });
    } catch (error: any) {
      console.error("❌ Error al actualizar hospital:", error);
      let errorMessage = "Error al actualizar hospital";
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
      <div className="bg-gradient-to-br from-sky-400/15 via-cyan-300/10 to-sky-400/15 w-full h-full absolute top-0 left-0"></div>
      <div className="relative min-h-screen">
        <main className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10 py-10">
          <FormLayout title="Actualizar Hospital" onSubmit={handleSubmit} widthClass="max-w-3xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <TextField
                label="ID del hospital"
                name="id"
                value={form.id}
                onChange={handleChange as any}
                required
              />
              <TextField
                label="Nuevo nombre"
                name="nombre"
                value={form.nombre}
                onChange={handleChange as any}
              />
              <TextField
                label="Nuevo teléfono"
                name="telefono"
                value={form.telefono}
                onChange={handleChange as any}
              />
              <TextField
                label="Nueva dirección"
                name="direccion"
                value={form.direccion}
                onChange={handleChange as any}
              />
            </div>

            <div className="mt-6">
              <SubmitButton label={loading ? "Actualizando..." : "Actualizar"} />
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
        </main>
      </div>
    </div>
  );
}

export default ActualizarHospital;
