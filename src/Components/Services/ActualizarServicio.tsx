import { useEffect, useState } from "react";
import axios from "axios";
import TextField from "../utilities/Form/TextField";
import UpdateCard from "../utilities/DeleteUpdate/Update";

type Service = {
  id: number;
  nombre: string;
  descripcion?: string | null;
  capacidadmaxima?: number | null;
  personalasignado?: number | null;
  hospitalid?: number | null;
};

export default function ActualizarServicio() {
  const [services, setServices] = useState<Service[]>([]);
  const [filtered, setFiltered] = useState<Service[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loadingList, setLoadingList] = useState(true);
  const [saving, setSaving] = useState(false);
  const [alert, setAlert] = useState<{ type: "success" | "danger"; message: string } | null>(null);

  useEffect(() => { fetchServices(); }, []);

  useEffect(() => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) setFiltered(services); else setFiltered(services.filter(s => s.nombre.toLowerCase().includes(term) || (s.descripcion||"").toLowerCase().includes(term)));
  }, [searchTerm, services]);

  const fetchServices = async () => {
    try {
      setLoadingList(true);
      const res = await axios.get("http://localhost:5000/api/servicios/listServices");
      const data: Service[] = Array.isArray(res.data) ? res.data : Array.isArray(res.data?.data) ? res.data.data : [];
      setServices(data); setFiltered(data);
    } catch (e) { setServices([]); setFiltered([]); } finally { setLoadingList(false); }
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
                <h2 className="text-3xl font-bold text-auto-primary">Actualizar Servicio</h2>
                <p className="text-auto-secondary text-sm">Edita los datos del servicio</p>
              </div>
            </div>

            <div className="h-px bg-gradient-to-r from-transparent via-auto-tertiary to-transparent my-6"></div>

            <div>
              <label className="block text-sm font-semibold text-auto-primary mb-3 flex items-center gap-2"><span className="text-xl">🔍</span><span>Buscar servicio</span></label>
              <div className="relative">
                <input type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Buscar por nombre o descripción..." className="block w-full pl-12 pr-4 py-4 border-2 border-auto rounded-xl bg-auto-primary text-auto-primary placeholder-auto-secondary/70 focus:border-sky-500 focus:outline-none focus:ring-4 focus:ring-sky-500/20 transition-all duration-200 shadow-sm" />
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-auto-secondary">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                </div>
              </div>
            </div>
          </div>

          {alert && (<div className={`mb-6 p-4 rounded-xl shadow-lg backdrop-blur-sm ${alert.type === "success" ? "bg-green-100 text-green-800 border-2 border-green-300" : "bg-red-100 text-red-800 border-2 border-red-300"}`}><div className="flex items-center gap-2"><span className="font-medium">{alert.message}</span></div></div>)}

          <div className="bg-auto-secondary rounded-2xl shadow-xl p-6 md:p-8 border border-auto backdrop-blur-sm">
            {loadingList ? (
              <div className="flex items-center justify-center py-16"><div className="text-center"><div className="animate-spin rounded-full h-16 w-16 border-b-4 border-sky-500 mx-auto mb-4"></div><p className="text-auto-secondary font-medium">Cargando servicios...</p></div></div>
            ) : (
              <UpdateCard
                items={filtered}
                searchTerm={searchTerm}
                onClearSearch={searchTerm ? () => setSearchTerm("") : undefined}
                saving={saving}
                getKey={(s) => (s as any).id}
                renderInfo={(s) => (<><div className="flex items-start justify-between mb-3"><div className="flex-1"><h3 className="text-lg font-bold text-auto-primary group-hover:text-sky-500 transition-colors">{(s as any).nombre}</h3></div></div><div className="mb-4 bg-auto-secondary rounded-lg p-3 border border-auto"><p className="text-sm text-auto-secondary">{(s as any).descripcion || <span className="italic text-auto-tertiary">No especificada</span>}</p></div></>) }
                buildForm={(s) => ({ ...s })}
                renderEditor={(form, onFieldChange) => (
                  <div className="grid gap-3 md:grid-cols-2">
                    <TextField label="Nombre" name="nombre" value={form.nombre ?? ""} onChange={(e) => onFieldChange("nombre", e.target.value)} />
                    <TextField label="Descripción" name="descripcion" value={form.descripcion ?? ""} onChange={(e) => onFieldChange("descripcion", e.target.value)} />
                    <TextField label="Capacidad máxima" name="capacidadmaxima" value={form.capacidadmaxima ?? ""} onChange={(e) => onFieldChange("capacidadmaxima", e.target.value)} />
                    <TextField label="Personal asignado" name="personalasignado" value={form.personalasignado ?? ""} onChange={(e) => onFieldChange("personalasignado", e.target.value)} />
                    <TextField label="ID Hospital" name="hospitalid" value={form.hospitalid ?? ""} onChange={(e) => onFieldChange("hospitalid", e.target.value)} />
                  </div>
                )}
                onSave={async (_s, form) => {
                  setSaving(true); setAlert(null);
                  try {
                    await axios.put(`http://localhost:5000/api/servicios/updateService/${form.id}`, {
                      nombre: form.nombre,
                      descripcion: form.descripcion ?? null,
                      capacidadmaxima: form.capacidadmaxima ? Number(form.capacidadmaxima) : null,
                      personalasignado: form.personalasignado ? Number(form.personalasignado) : null,
                      hospitalid: form.hospitalid ? Number(form.hospitalid) : null,
                    });
                    setAlert({ type: "success", message: "Servicio actualizado correctamente" });
                    await fetchServices();
                  } catch (err: any) {
                    const msg = err?.response?.data?.error || err?.message || "Error al actualizar";
                    setAlert({ type: "danger", message: msg });
                    throw err;
                  } finally { setSaving(false); }
                }}
              />
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
