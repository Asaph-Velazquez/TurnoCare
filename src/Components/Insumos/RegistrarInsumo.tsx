import { useState } from "react";
import axios from "axios";
import FormLayout from "../utilities/Form/FormLayout";
import TextField from "../utilities/Form/TextField";
import SelectField from "../utilities/Form/SelectField";
import SubmitButton from "../utilities/Form/SubmitButton";

function RegistrarInsumo() {
  const [form, setForm] = useState({
    nombre: "",
    descripcion: "",
    categoria: "Material Médico",
    cantidadDisponible: "",
    unidadMedida: "Piezas",
    ubicacion: "",
    responsableId: "",
  });

  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState<{ type: string; message: string } | null>(
    null
  );

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((s) => ({ ...s, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAlert(null);
    setLoading(true);

    try {
      const payload = {
        ...form,
        cantidadDisponible: Number(form.cantidadDisponible),
        responsableId: form.responsableId ? Number(form.responsableId) : null,
      };

      const response = await axios.post(
        "http://localhost:5000/api/insumos/",
        payload
      );
      console.log("✅ Insumo registrado:", response.data);

      setAlert({ type: "success", message: "Insumo registrado exitosamente" });
      setForm({
        nombre: "",
        descripcion: "",
        categoria: "Material Médico",
        cantidadDisponible: "",
        unidadMedida: "Piezas",
        ubicacion: "",
        responsableId: "",
      });
    } catch (error: any) {
      console.error("❌ Error al registrar insumo:", error);
      let errorMessage = "Error al registrar insumo";
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
                title="Registrar Insumo"
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
                    label="Descripción"
                    name="descripcion"
                    value={form.descripcion}
                    onChange={handleChange as any}
                    placeholder="Ej. Guantes de látex talla M"
                  />
                  <SelectField
                    label="Categoría"
                    name="categoria"
                    value={form.categoria}
                    onChange={handleChange as any}
                    options={[
                      { value: "Material Médico", label: "Material Médico" },
                      { value: "Equipo", label: "Equipo" },
                      { value: "Farmacia", label: "Farmacia" },
                      { value: "Protección", label: "Protección" },
                    ]}
                  />
                  <TextField
                    label="Cantidad disponible"
                    name="cantidadDisponible"
                    type="number"
                    value={form.cantidadDisponible}
                    onChange={handleChange as any}
                    required
                  />
                  <TextField
                    label="Unidad de medida"
                    name="unidadMedida"
                    value={form.unidadMedida}
                    onChange={handleChange as any}
                    placeholder="Piezas, cajas, litros..."
                  />
                  <TextField
                    label="Ubicación"
                    name="ubicacion"
                    value={form.ubicacion}
                    onChange={handleChange as any}
                    placeholder="Ej. Almacén central"
                  />
                  <TextField
                    label="ID responsable"
                    name="responsableId"
                    value={form.responsableId}
                    onChange={handleChange as any}
                    placeholder="ID de enfermero o responsable"
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
                  Registra insumos médicos y mantén actualizado el inventario de
                  suministros críticos para cada servicio.
                </p>
              </div>
            </aside>
          </div>
        </main>
      </div>
    </div>
  );
}

export default RegistrarInsumo;
