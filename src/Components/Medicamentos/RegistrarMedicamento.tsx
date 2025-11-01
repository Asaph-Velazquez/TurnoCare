import { useState } from "react";
import axios from "axios";
import FormLayout from "../utilities/Form/FormLayout";
import TextField from "../utilities/Form/TextField";
import SubmitButton from "../utilities/Form/SubmitButton";

function RegistrarMedicamento() {
  const [form, setForm] = useState({
    nombre: "",
    descripcion: "",
    cantidadStock: "",
    lote: "",
    fechaCaducidad: "",
    ubicacion: "",
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
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAlert(null);
    setLoading(true);

    try {
      const payload = {
        nombre: form.nombre.trim(),
        descripcion: form.descripcion.trim() || null,
        cantidadStock: parseInt(form.cantidadStock) || 0,
        lote: form.lote.trim() || null,
        fechaCaducidad: form.fechaCaducidad || null,
        ubicacion: form.ubicacion.trim() || null,
      };

      if (!payload.nombre) {
        setAlert({
          type: "danger",
          message: "El nombre del medicamento es obligatorio",
        });
        setLoading(false);
        return;
      }

      const response = await axios.post(
        "http://localhost:5000/api/medicamentos/",
        payload
      );
      console.log("✅ Medicamento registrado en inventario:", response.data);

      setAlert({
        type: "success",
        message: "Medicamento agregado al inventario exitosamente",
      });
      setForm({
        nombre: "",
        descripcion: "",
        cantidadStock: "",
        lote: "",
        fechaCaducidad: "",
        ubicacion: "",
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
                    label="Nombre del Medicamento"
                    name="nombre"
                    value={form.nombre}
                    onChange={handleChange as any}
                    required
                    placeholder="Ej. Paracetamol 500mg"
                  />
                  <TextField
                    label="Descripción"
                    name="descripcion"
                    value={form.descripcion}
                    onChange={handleChange as any}
                    placeholder="Breve descripción del medicamento"
                  />
                  <TextField
                    label="Cantidad en Stock"
                    name="cantidadStock"
                    type="number"
                    value={form.cantidadStock}
                    onChange={handleChange as any}
                    required
                    placeholder="0"
                  />
                  <TextField
                    label="Lote"
                    name="lote"
                    value={form.lote}
                    onChange={handleChange as any}
                    placeholder="Ej. LOT-2024-001"
                  />
                  <TextField
                    label="Fecha de Caducidad"
                    name="fechaCaducidad"
                    type="date"
                    value={form.fechaCaducidad}
                    onChange={handleChange as any}
                  />
                  <TextField
                    label="Ubicación en Almacén"
                    name="ubicacion"
                    value={form.ubicacion}
                    onChange={handleChange as any}
                    placeholder="Ej. Estante A, Nivel 2"
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
                  Registra medicamentos en el inventario del hospital. Ingresa nombre, cantidad en stock, lote, fecha de caducidad y ubicación en almacén.
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
