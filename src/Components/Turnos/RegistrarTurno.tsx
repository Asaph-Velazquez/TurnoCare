import { useState } from "react";
import axios from "axios";
import TextField from "../utilities/Form/TextField";
import SelectField from "../utilities/Form/SelectField";

function RegistrarTurno() {
  const [form, setForm] = useState({
    horaInicio: "",
    horaFin: "",
    tipo: "",
    observaciones: "",
  });

  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState<{type: string, message: string} | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((s) => ({ ...s, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAlert(null);
    setLoading(true);

    try {
      const dataToSend = {
        horaInicio: form.horaInicio,
        horaFin: form.horaFin,
        tipo: form.tipo,
        observaciones: form.observaciones || null,
      };

      const response = await axios.post("http://localhost:5000/api/turnos", dataToSend);
      
      setAlert({
        type: "success",
        message: response.data.message || "Turno registrado exitosamente"
      });

      setForm({
        horaInicio: "",
        horaFin: "",
        tipo: "",
        observaciones: "",
      });
    } catch (error: any) {
      let errorMessage = "Error al registrar turno";
      if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
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
    <div className="min-h-screen bg-auto-primary pt-20 pb-10">
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-sky-400/10 via-transparent to-cyan-400/10"></div>
        <div className="absolute top-1/4 right-0 w-96 h-96 bg-sky-300/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 left-0 w-96 h-96 bg-cyan-300/20 rounded-full blur-3xl"></div>
      </div>

      <div className="relative min-h-screen">
        <main className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10 py-10">
          <div className="bg-auto-secondary rounded-2xl shadow-xl p-6 md:p-8 border border-auto mb-6 backdrop-blur-sm">
            <div className="flex items-center gap-3 mb-2">
              <div className="bg-gradient-to-br from-sky-500 to-sky-600 p-3 rounded-xl shadow-lg">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                </svg>
              </div>
              <div>
                <h2 className="text-3xl font-bold text-auto-primary">Crear Turno Laboral</h2>
                <p className="text-auto-secondary text-sm">Programar un nuevo turno de trabajo para el personal</p>
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
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <TextField 
                  label=" Hora de Inicio" 
                  name="horaInicio" 
                  type="time"
                  value={form.horaInicio} 
                  onChange={handleChange as any} 
                  required 
                />
                <TextField 
                  label="🕐 Hora de Fin" 
                  name="horaFin" 
                  type="time"
                  value={form.horaFin} 
                  onChange={handleChange as any} 
                  required 
                />
                <SelectField 
                  label="⏰ Tipo de Turno"
                  name="tipo"
                  value={form.tipo}
                  onChange={handleChange as any}
                  required
                  options={[
                    { value: "", label: "Seleccionar tipo de turno" },
                    { value: "matutino", label: "☀️ Matutino (7:00 - 15:00)" },
                    { value: "vespertino", label: "🌆 Vespertino (15:00 - 23:00)" },
                    { value: "nocturno", label: "🌙 Nocturno (23:00 - 7:00)" },
                  ]}
                />
              </div>

              <div className="mt-6">
                <label className="block text-sm font-medium text-auto-primary mb-2">
                  📝 Observaciones del Turno
                </label>
                <textarea
                  name="observaciones"
                  value={form.observaciones}
                  onChange={handleChange}
                  rows={4}
                  className="w-full px-4 py-2 bg-auto-primary border-2 border-auto rounded-xl text-auto-primary placeholder-auto-secondary/70 focus:border-sky-500 focus:outline-none focus:ring-4 focus:ring-sky-500/20 transition-all duration-200"
                  placeholder="Notas adicionales sobre el turno laboral (ej: cobertura especial, requisitos específicos, etc.)"
                />
              </div>

              <div className="mt-6 flex gap-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-sky-500 to-cyan-500 text-white font-semibold rounded-xl hover:from-sky-600 hover:to-cyan-600 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed transition-all duration-200 shadow-lg"
                >
                  {loading ? "Creando turno..." : "✓ Crear Turno Laboral"}
                </button>
              </div>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
}

export default RegistrarTurno;

