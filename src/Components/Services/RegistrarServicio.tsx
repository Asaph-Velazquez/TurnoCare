import React, { useEffect, useState } from "react";
import axios from "axios";
import FormLayout from "../utilities/Form/FormLayout";
import TextField from "../utilities/Form/TextField";
import SubmitButton from "../utilities/Form/SubmitButton";

function RegistrarServicio({ onBack }: { onBack?: () => void }) {
  const [form, setForm] = useState({ nombre: "", descripcion: "", capacidadmaxima: "", personalasignado: "", hospitalid: "" });
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState<{ type: string; message: string } | null>(null);
  const [hospitals, setHospitals] = useState<Array<{ hospitalId: number; nombre: string }>>([]);
  const [hospitalsLoading, setHospitalsLoading] = useState(false);
  const [hospitalsError, setHospitalsError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAlert(null);
    setLoading(true);
    try {
      await axios.post("http://localhost:5000/api/servicios/createService", {
        nombre: form.nombre,
        descripcion: form.descripcion,
        capacidadmaxima: Number(form.capacidadmaxima),
        personalasignado: Number(form.personalasignado),
        hospitalid: Number(form.hospitalid),
      });
      setAlert({ type: "success", message: "Servicio registrado correctamente" });
      setForm({ nombre: "", descripcion: "", capacidadmaxima: "", personalasignado: "", hospitalid: "" });
    } catch (err: any) {
      setAlert({ type: "danger", message: err?.response?.data?.error || err?.message || "Error" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchHospitals = async () => {
      setHospitalsLoading(true);
      setHospitalsError(null);
      try {
        const resp = await axios.get("http://localhost:5000/api/hospital");
        // backend returns { success: true, data: hospitales }
        const data = resp.data?.data ?? resp.data;
        setHospitals(Array.isArray(data) ? data : []);
      } catch (err: any) {
        console.error("Error fetching hospitals:", err?.message || err);
        setHospitalsError("No se pudieron cargar los hospitales");
      } finally {
        setHospitalsLoading(false);
      }
    };

    fetchHospitals();
  }, []);

  return (
    <div className="min-h-screen bg-auto-primary pt-20 pb-10">
      <div className="bg-gradient-to-br from-sky-400/15 via-cyan-300/10 to-sky-400/15 w-full h-full absolute top-0 left-0"></div>
      <div className="relative min-h-screen">
        <main className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10 py-10">
          <FormLayout title="Registrar Servicio" onSubmit={handleSubmit} widthClass="max-w-3xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <TextField label="Nombre" name="nombre" value={form.nombre} onChange={handleChange as any} required />
              <TextField label="Descripción" name="descripcion" value={form.descripcion} onChange={handleChange as any} required />
              <TextField label="Capacidad máxima" name="capacidadmaxima" value={form.capacidadmaxima} onChange={handleChange as any} required />
              <TextField label="Personal asignado" name="personalasignado" value={form.personalasignado} onChange={handleChange as any} required />
              <div>
                <label className="block text-sm font-medium text-auto-primary mb-1">Hospital</label>
                {hospitalsLoading ? (
                  <div className="text-sm text-gray-500">Cargando hospitales...</div>
                ) : hospitalsError ? (
                  <div className="text-sm text-red-600">{hospitalsError}</div>
                ) : (
                  <select
                    name="hospitalid"
                    value={form.hospitalid}
                    onChange={(e) => setForm((prev) => ({ ...prev, hospitalid: e.target.value }))}
                    className="w-full rounded-xl border border-gray-300 px-3 py-2"
                    required
                  >
                    <option value="">Selecciona un hospital</option>
                    {hospitals.map((h) => (
                      <option key={h.hospitalId} value={h.hospitalId}>
                        {h.nombre}
                      </option>
                    ))}
                  </select>
                )}
              </div>
            </div>

            <div className="mt-6">
              <SubmitButton label={loading ? "Registrando..." : "Registrar Servicio"} />
            </div>

            {alert && (
              <div className={`mt-4 p-4 rounded-xl ${alert.type === "success" ? "bg-green-100 text-green-800 border border-green-300" : "bg-red-100 text-red-800 border border-red-300"}`}>
                {alert.message}
              </div>
            )}

            {onBack && (
              <div className="mt-6">
                <button type="button" onClick={onBack} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-xl hover:bg-gray-300 transition">Volver</button>
              </div>
            )}
          </FormLayout>
        </main>
      </div>
    </div>
  );
}

export default RegistrarServicio;
