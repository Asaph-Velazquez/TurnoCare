import { useEffect, useState } from "react";
import axios from "axios";
import TextField from "../utilities/Form/TextField";
import SelectField from "../utilities/Form/SelectField";
import UpdateCard from "../utilities/DeleteUpdate/Update";

type Enfermero = {
  enfermeroId: number;
  numeroEmpleado: string;
  nombre: string;
  apellidoPaterno: string;
  apellidoMaterno: string;
  especialidad: string | null;
  esCoordinador: boolean;
  servicioActualId: number | null;
  habitacionesAsignadas?: string;
  turno?: string;
};

type Servicio = {
  servicioId: number;
  nombre: string;
  descripcion?: string;
};

export default function ActualizarEnfermero() {
  const [enfermeros, setEnfermeros] = useState<Enfermero[]>([]);
  const [filteredEnfermeros, setFilteredEnfermeros] = useState<Enfermero[]>([]);
  const [servicios, setServicios] = useState<Servicio[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loadingList, setLoadingList] = useState(true);
  const [loadingServicios, setLoadingServicios] = useState(false);
  const [saving, setSaving] = useState(false);
  const [alert, setAlert] = useState<{ type: "success" | "danger"; message: string } | null>(null);

  useEffect(() => {
    fetchEnfermeros();
    fetchServicios();
  }, []);

  useEffect(() => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) {
      setFilteredEnfermeros(enfermeros);
    } else {
      setFilteredEnfermeros(
        enfermeros.filter((e) =>
          `${e.nombre} ${e.apellidoPaterno} ${e.apellidoMaterno}`.toLowerCase().includes(term) ||
          e.numeroEmpleado.toLowerCase().includes(term) ||
          (e.especialidad ?? "").toLowerCase().includes(term)
        )
      );
    }
  }, [searchTerm, enfermeros]);

  const mapEnfermeros = (raw: any[]): Enfermero[] => raw.map((e) => ({
    ...e,
    habitacionesAsignadas: e.habitacionesAsignadas ?? e.habitacionAsignada ?? "",
    turno: e.turno && typeof e.turno === "object" && e.turno.nombre ? e.turno.nombre : (typeof e.turno === "string" ? e.turno : ""),
  }));

  const fetchEnfermeros = async () => {
    try {
      setLoadingList(true);
      const res = await axios.get("http://localhost:5000/api/enfermeros");
      const raw: any[] = Array.isArray(res.data?.data) ? res.data.data : Array.isArray(res.data) ? res.data : [];
      const data: Enfermero[] = mapEnfermeros(raw);
      setEnfermeros(data);
      setFilteredEnfermeros(data);
    } catch (e) {
      setEnfermeros([]);
      setFilteredEnfermeros([]);
    } finally {
      setLoadingList(false);
    }
  };

  const fetchServicios = async () => {
    try {
      setLoadingServicios(true);
      const response = await axios.get("http://localhost:5000/api/servicios/listServices");
      const data = response.data.success ? response.data.data : response.data;
      setServicios(data || []);
    } catch (error) {
      console.error("❌ Error al cargar servicios:", error);
      setServicios([]);
    } finally {
      setLoadingServicios(false);
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
                <h2 className="text-3xl font-bold text-auto-primary">Actualizar Enfermero</h2>
                <p className="text-auto-secondary text-sm">Edita los datos del personal</p>
              </div>
            </div>

            <div className="h-px bg-gradient-to-r from-transparent via-auto-tertiary to-transparent my-6"></div>

            {/* Barra de búsqueda */}
            <div>
              <label className="block text-sm font-semibold text-auto-primary mb-3 flex items-center gap-2">
                <span className="text-xl">🔍</span>
                <span>Buscar enfermero</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Buscar por nombre, número de empleado o especialidad..."
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
                  <p className="text-auto-secondary font-medium">Cargando enfermeros...</p>
                </div>
              </div>
            ) : (
              <UpdateCard
                items={filteredEnfermeros}
                searchTerm={searchTerm}
                onClearSearch={searchTerm ? () => setSearchTerm("") : undefined}
                saving={saving}
                getKey={(e) => (e as any).enfermeroId}
                renderInfo={(enf) => (
                  <>
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-auto-primary group-hover:text-sky-500 transition-colors">
                          {(enf as any).nombre} {(enf as any).apellidoPaterno} {(enf as any).apellidoMaterno}
                        </h3>
                        <p className="text-sm text-auto-secondary flex items-center gap-1 mt-1">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" />
                          </svg>
                          <span className="font-semibold">{(enf as any).numeroEmpleado}</span>
                        </p>
                      </div>
                      {(enf as any).esCoordinador && (
                        <span className="ml-2 px-3 py-1 bg-gradient-to-r from-amber-100 to-amber-200 text-amber-800 text-xs font-bold rounded-lg shadow-sm dark:from-amber-900/40 dark:to-amber-900/30 dark:text-amber-200 border border-amber-300 dark:border-amber-700">
                          ⭐ Coordinador
                        </span>
                      )}
                    </div>
                    <div className="mb-4 bg-auto-secondary rounded-lg p-3 border border-auto">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        <p className="text-sm text-auto-secondary flex items-start gap-2">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                          <span>
                            <span className="font-semibold">Especialidad:</span>{" "}
                            {(enf as any).especialidad || <span className="italic text-auto-tertiary">No especificada</span>}
                          </span>
                        </p>
                        <p className="text-sm text-auto-secondary flex items-start gap-2">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 8c-2.21 0-4-1.79-4-4h2a2 2 0 104 0h2c0 2.21-1.79 4-4 4z" />
                          </svg>
                          <span>
                            <span className="font-semibold">Habitación(es):</span>{" "}
                            {(enf as any).habitacionesAsignadas || <span className="italic text-auto-tertiary">No asignada</span>}
                          </span>
                        </p>
                        <p className="text-sm text-auto-secondary flex items-start gap-2">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3" />
                          </svg>
                          <span>
                            <span className="font-semibold">Turno:</span>{" "}
                            {(enf as any).turno || <span className="italic text-auto-tertiary">No asignado</span>}
                          </span>
                        </p>
                      </div>
                    </div>
                  </>
                )}
                buildForm={(enf) => ({ ...enf })}
                renderEditor={(form, onFieldChange, enf) => (
                  <div className="grid gap-3 md:grid-cols-2">
                    <TextField label="Número de empleado" name="numeroEmpleado" value={form.numeroEmpleado ?? ""} onChange={(e) => onFieldChange("numeroEmpleado", e.target.value)} />
                    <TextField label="Nombre" name="nombre" value={form.nombre ?? ""} onChange={(e) => onFieldChange("nombre", e.target.value)} />
                    <TextField label="Apellido paterno" name="apellidoPaterno" value={form.apellidoPaterno ?? ""} onChange={(e) => onFieldChange("apellidoPaterno", e.target.value)} />
                    <TextField label="Apellido materno" name="apellidoMaterno" value={form.apellidoMaterno ?? ""} onChange={(e) => onFieldChange("apellidoMaterno", e.target.value)} />
                    <TextField label="Especialidad" name="especialidad" value={form.especialidad ?? ""} onChange={(e) => onFieldChange("especialidad", e.target.value)} />
                    <TextField label="Habitación(es) asignada(s)" name="habitacionesAsignadas" value={form.habitacionesAsignadas ?? ""} onChange={(e) => onFieldChange("habitacionesAsignadas", e.target.value)} placeholder="Ej: 101, 102, 103" />
                    <SelectField 
                      label="Turno"
                      name="turno"
                      value={form.turno ?? ""}
                      onChange={(e) => onFieldChange("turno", e.target.value)}
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
                      value={form.servicioActualId?.toString() ?? ""} 
                      onChange={(e) => onFieldChange("servicioActualId", e.target.value ? parseInt(e.target.value) : null)}
                      options={[
                        { value: "", label: loadingServicios ? "Cargando servicios..." : "Sin asignar" },
                        ...servicios.map(s => ({
                          value: s.servicioId.toString(),
                          label: `${s.nombre}${s.descripcion ? ` - ${s.descripcion}` : ''}`
                        }))
                      ]}
                    />
                    <div className="flex items-center gap-3 mt-2">
                      <input id={`coord-${(enf as any).enfermeroId}`} type="checkbox" checked={!!form.esCoordinador} onChange={(e) => onFieldChange("esCoordinador", e.currentTarget.checked)} className="h-4 w-4" />
                      <label htmlFor={`coord-${(enf as any).enfermeroId}`} className="text-auto-primary">Es coordinador</label>
                    </div>
                  </div>
                )}
                onSave={async (_enf, form) => {
                  setSaving(true);
                  setAlert(null);
                  try {
                    await axios.put(`http://localhost:5000/api/enfermeros/${form.enfermeroId}` , {
                      numeroEmpleado: form.numeroEmpleado,
                      nombre: form.nombre,
                      apellidoPaterno: form.apellidoPaterno,
                      apellidoMaterno: form.apellidoMaterno,
                      especialidad: form.especialidad ?? null,
                      esCoordinador: !!form.esCoordinador,
                      servicioActualId: form.servicioActualId ?? null,
                      habitacionesAsignadas: form.habitacionesAsignadas ?? "",
                      turno: form.turno ?? "",
                    });
                    setAlert({ type: "success", message: "Datos actualizados correctamente" });
                    await fetchEnfermeros();
                  } catch (err: any) {
                    const msg = err?.response?.data?.error || err?.message || "Error al actualizar";
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
