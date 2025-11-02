import React, { useEffect, useState } from "react";
import axios from "axios";
import TextField from "../utilities/Form/TextField";

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
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-sky-400/10 via-transparent to-cyan-400/10"></div>
        <div className="absolute top-1/4 right-0 w-96 h-96 bg-sky-300/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 left-0 w-96 h-96 bg-cyan-300/20 rounded-full blur-3xl"></div>
      </div>

      <div className="relative min-h-screen">
        <main className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10 py-10">
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
                    d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                  />
                </svg>
              </div>
              <div>
                <h2 className="text-3xl font-bold text-auto-primary">Registrar Servicio</h2>
                <p className="text-auto-secondary text-sm">Añade servicios al hospital</p>
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
                <TextField label="Nombre" name="nombre" value={form.nombre} onChange={handleChange as any} required />
                <TextField label="Descripción" name="descripcion" value={form.descripcion} onChange={handleChange as any} required />
                <TextField label="Capacidad máxima" name="capacidadmaxima" value={form.capacidadmaxima} onChange={handleChange as any} required />
                <TextField label="Personal asignado" name="personalasignado" value={form.personalasignado} onChange={handleChange as any} required />
                
                <div>
                  <label className="block text-sm font-semibold text-auto-primary mb-2">
                    Hospital <span className="text-red-500">*</span>
                  </label>
                  {hospitalsLoading ? (
                    <div className="text-sm text-auto-secondary">Cargando hospitales...</div>
                  ) : hospitalsError ? (
                    <div className="text-sm text-red-600">{hospitalsError}</div>
                  ) : (
                    <select
                      name="hospitalid"
                      value={form.hospitalid}
                      onChange={(e) => setForm((prev) => ({ ...prev, hospitalid: e.target.value }))}
                      className="w-full px-4 py-3 bg-auto-primary border-2 border-auto rounded-xl focus:border-sky-500 focus:outline-none focus:ring-4 focus:ring-sky-500/20 text-auto-primary transition-all duration-200"
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
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full px-6 py-3 bg-gradient-to-r from-sky-500 to-cyan-500 text-white font-semibold rounded-xl hover:from-sky-600 hover:to-cyan-600 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed transition-all duration-200 shadow-lg"
                >
                  {loading ? "Registrando..." : "Registrar Servicio"}
                </button>
              </div>

              {onBack && (
                <div className="mt-6">
                  <button 
                    type="button" 
                    onClick={onBack} 
                    className="w-full px-6 py-3 bg-auto-tertiary text-auto-primary font-semibold rounded-xl hover:bg-auto-secondary transition-all duration-200"
                  >
                    Volver
                  </button>
                </div>
              )}
            </form>
          </div>
        </main>
      </div>
    </div>
  );
}

export default RegistrarServicio;
