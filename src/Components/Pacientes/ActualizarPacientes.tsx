import { useEffect, useState } from "react";
import axios from "axios";
import TextField from "../utilities/Form/TextField";
import UpdateCard from "../utilities/DeleteUpdate/Update";

type Paciente = {
  pacienteId: number;
  numeroExpediente: string;
  nombre: string;
  apellidop: string;
  apellidom: string;
  edad?: number | null;
  numeroCama?: string | null;
  numeroHabitacion?: string | null;
  fechaIngreso?: string | null;
  motivoConsulta?: string | null;
  servicioId?: number | null;
};

export default function ActualizarPacientes() {
  const [pacientes, setPacientes] = useState<Paciente[]>([]);
  const [filteredPacientes, setFilteredPacientes] = useState<Paciente[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loadingList, setLoadingList] = useState(true);
  const [saving, setSaving] = useState(false);
  const [alert, setAlert] = useState<{ type: "success" | "danger"; message: string } | null>(null);

  useEffect(() => {
    fetchPacientes();
  }, []);

  useEffect(() => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) {
      setFilteredPacientes(pacientes);
    } else {
      setFilteredPacientes(
        pacientes.filter((p) =>
          `${p.nombre} ${p.apellidop} ${p.apellidom}`.toLowerCase().includes(term) ||
          p.numeroExpediente.toLowerCase().includes(term) ||
          (p.numeroHabitacion ?? "").toLowerCase().includes(term) ||
          (p.numeroCama ?? "").toLowerCase().includes(term)
        )
      );
    }
  }, [searchTerm, pacientes]);

  const fetchPacientes = async () => {
    try {
      setLoadingList(true);
      const res = await axios.get("http://localhost:5000/api/pacientes");
      const data: Paciente[] = Array.isArray(res.data?.data) ? res.data.data : Array.isArray(res.data) ? res.data : [];
      setPacientes(data);
      setFilteredPacientes(data);
    } catch (e) {
      setPacientes([]);
      setFilteredPacientes([]);
    } finally {
      setLoadingList(false);
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
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M21.731 2.269a2.625 2.625 0 0 0-3.712 0l-1.157 1.157 3.712 3.712 1.157-1.157a2.625 2.625 0 0 0 0-3.712z" />
                  <path d="M3 17.25V21h3.75L19.061 8.689l-3.712-3.712L3 17.25z" />
                </svg>
              </div>
              <div>
                <h2 className="text-3xl font-bold text-auto-primary">Actualizar Paciente</h2>
                <p className="text-auto-secondary text-sm">Edita los datos del paciente</p>
              </div>
            </div>

            <div className="h-px bg-gradient-to-r from-transparent via-auto-tertiary to-transparent my-6"></div>

            {/* Barra de búsqueda */}
            <div>
              <label className="block text-sm font-semibold text-auto-primary mb-3 flex items-center gap-2">
                <span className="text-xl">🔍</span>
                <span>Buscar paciente</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Buscar por nombre, expediente, habitación o cama..."
                  className="block w-full pl-12 pr-4 py-4 border-2 border-auto rounded-xl bg-auto-primary text-auto-primary placeholder-auto-secondary/70 focus:border-sky-500 focus:outline-none focus:ring-4 focus:ring-sky-500/20 transition-all duration-200 shadow-sm"
                />
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-auto-secondary">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

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

          {/* Lista editable modular */}
          <div className="bg-auto-secondary rounded-2xl shadow-xl p-6 md:p-8 border border-auto backdrop-blur-sm">
            {loadingList ? (
              <div className="flex items-center justify-center py-16">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-sky-500 mx-auto mb-4"></div>
                  <p className="text-auto-secondary font-medium">Cargando pacientes...</p>
                </div>
              </div>
            ) : (
              <UpdateCard
                items={filteredPacientes}
                searchTerm={searchTerm}
                onClearSearch={searchTerm ? () => setSearchTerm("") : undefined}
                saving={saving}
                getKey={(p) => (p as any).pacienteId}
                renderInfo={(pac) => (
                  <>
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-auto-primary group-hover:text-sky-500 transition-colors">
                          {(pac as any).nombre} {(pac as any).apellidop} {(pac as any).apellidom}
                        </h3>
                        <p className="text-sm text-auto-secondary flex items-center gap-1 mt-1">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" />
                          </svg>
                          <span className="font-semibold">{(pac as any).numeroExpediente}</span>
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-auto-secondary">
                          <span className="font-semibold">Edad:</span> {(pac as any).edad ?? "-"}
                        </p>
                      </div>
                    </div>
                    <div className="mb-4 bg-auto-secondary rounded-lg p-3 border border-auto space-y-2">
                      <p className="text-sm text-auto-secondary flex items-start gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                        </svg>
                        <span>
                          <span className="font-semibold">Ubicación:</span>{" "}
                          Hab. {(pac as any).numeroHabitacion || "-"} / Cama {(pac as any).numeroCama || "-"}
                        </span>
                      </p>
                      <p className="text-sm text-auto-secondary">
                        <span className="font-semibold">Motivo:</span>{" "}
                        {(pac as any).motivoConsulta || <span className="italic text-auto-tertiary">No especificado</span>}
                      </p>
                    </div>
                  </>
                )}
                buildForm={(pac) => ({ ...pac })}
                renderEditor={(form, onFieldChange) => (
                  <div className="grid gap-3 md:grid-cols-2">
                    <TextField 
                      label="Número de expediente" 
                      name="numeroExpediente" 
                      value={form.numeroExpediente ?? ""} 
                      onChange={(e) => onFieldChange("numeroExpediente", e.target.value)} 
                    />
                    <TextField 
                      label="Nombre" 
                      name="nombre" 
                      value={form.nombre ?? ""} 
                      onChange={(e) => onFieldChange("nombre", e.target.value)} 
                    />
                    <TextField 
                      label="Apellido paterno" 
                      name="apellidop" 
                      value={form.apellidop ?? ""} 
                      onChange={(e) => onFieldChange("apellidop", e.target.value)} 
                    />
                    <TextField 
                      label="Apellido materno" 
                      name="apellidom" 
                      value={form.apellidom ?? ""} 
                      onChange={(e) => onFieldChange("apellidom", e.target.value)} 
                    />
                    <TextField 
                      label="Edad" 
                      name="edad" 
                      type="number"
                      value={form.edad?.toString() ?? ""} 
                      onChange={(e) => onFieldChange("edad", e.target.value ? parseInt(e.target.value) : null)} 
                    />
                    <TextField 
                      label="Número de habitación" 
                      name="numeroHabitacion" 
                      value={form.numeroHabitacion ?? ""} 
                      onChange={(e) => onFieldChange("numeroHabitacion", e.target.value)} 
                    />
                    <TextField 
                      label="Número de cama" 
                      name="numeroCama" 
                      value={form.numeroCama ?? ""} 
                      onChange={(e) => onFieldChange("numeroCama", e.target.value)} 
                    />
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-auto-primary mb-2">Motivo de consulta</label>
                      <textarea
                        value={form.motivoConsulta ?? ""}
                        onChange={(e) => onFieldChange("motivoConsulta", e.target.value)}
                        className="w-full pl-4 pr-4 py-3 border rounded-xl bg-auto-tertiary/60 text-auto-primary min-h-[80px] focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition"
                        placeholder="Descripción del motivo de consulta..."
                      />
                    </div>
                  </div>
                )}
                onSave={async (_pac, form) => {
                  setSaving(true);
                  setAlert(null);
                  try {
                    await axios.put(`http://localhost:5000/api/pacientes/${form.pacienteId}`, {
                      numeroExpediente: form.numeroExpediente,
                      nombre: form.nombre,
                      apellidop: form.apellidop,
                      apellidom: form.apellidom,
                      edad: form.edad ?? null,
                      numeroCama: form.numeroCama || null,
                      numeroHabitacion: form.numeroHabitacion || null,
                      motivoConsulta: form.motivoConsulta || null,
                    });
                    setAlert({ type: "success", message: "Datos del paciente actualizados correctamente" });
                    await fetchPacientes();
                  } catch (err: any) {
                    const msg = err?.response?.data?.error || err?.message || "Error al actualizar paciente";
                    setAlert({ type: "danger", message: msg });
                    throw err;
                  } finally {
                    setSaving(false);
                  }
                }}
              />
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
