import { useEffect, useState } from "react";
import axios from "axios";
import DeleteCard from "../utilities/DeleteUpdate/Delete";

type Service = {
  id: number;
  nombre: string;
  descripcion?: string | null;
};

function EliminarServicio() {
  const [services, setServices] = useState<Service[]>([]);
  const [filtered, setFiltered] = useState<Service[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loadingList, setLoadingList] = useState(true);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState<{ type: "success" | "danger"; message: string } | null>(null);

  useEffect(() => { fetchServices(); }, []);

  useEffect(() => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) setFiltered(services); else setFiltered(services.filter(s => s.nombre.toLowerCase().includes(term) || (s.descripcion||"").toLowerCase().includes(term)));
  }, [searchTerm, services]);

  const fetchServices = async () => {
    try { setLoadingList(true); const res = await axios.get("http://localhost:5000/api/servicios/listServices"); const data = Array.isArray(res.data) ? res.data : Array.isArray(res.data?.data) ? res.data.data : []; setServices(data); setFiltered(data); } catch (e) { setServices([]); setFiltered([]); } finally { setLoadingList(false); }
  };

  const handleDelete = async (s: Service) => {
    const ok = window.confirm(`¿Seguro que deseas eliminar el servicio "${s.nombre}"? Esta acción no se puede deshacer.`);
    if (!ok) return;
    setLoading(true); setAlert(null);
    try { await axios.delete(`http://localhost:5000/api/servicios/deleteService/${s.id}`); setAlert({ type: "success", message: `Servicio "${s.nombre}" eliminado correctamente` }); await fetchServices(); } catch (err: any) { const msg = err?.response?.data?.error || err?.message || "Error al eliminar"; setAlert({ type: "danger", message: msg }); } finally { setLoading(false); }
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
              <div className="bg-gradient-to-br from-red-500 to-red-600 p-3 rounded-xl shadow-lg">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </div>
              <div>
                <h2 className="text-3xl font-bold text-auto-primary">Eliminar Servicio</h2>
                <p className="text-auto-secondary text-sm">Gestión de eliminación de servicios</p>
              </div>
            </div>

            <div className="h-px bg-gradient-to-r from-transparent via-auto-tertiary to-transparent my-6"></div>

            <div>
              <label className="block text-sm font-semibold text-auto-primary mb-3 flex items-center gap-2"><span className="text-xl">🔍</span><span>Buscar servicio</span></label>
              <div className="relative">
                <input type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Buscar por nombre o descripción..." className="block w-full pl-12 pr-4 py-4 border-2 border-auto rounded-xl bg-auto-primary text-auto-primary placeholder-auto-secondary/70 focus:border-sky-500 focus:outline-none focus:ring-4 focus:ring-sky-500/20 transition-all duration-200 shadow-sm" />
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-auto-secondary"><svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg></div>
              </div>
            </div>
          </div>

          {alert && (<div className={`mb-6 p-4 rounded-xl shadow-lg backdrop-blur-sm ${alert.type === "success" ? "bg-green-100 text-green-800 border-2 border-green-300" : "bg-red-100 text-red-800 border-2 border-red-300"}`}><div className="flex items-center gap-2"><span className="font-medium">{alert.message}</span></div></div>)}

          <div className="bg-auto-secondary rounded-2xl shadow-xl p-6 md:p-8 border border-auto backdrop-blur-sm">
            {loadingList ? (<div className="flex items-center justify-center py-16"><div className="text-center"><div className="animate-spin rounded-full h-16 w-16 border-b-4 border-sky-500 mx-auto mb-4"></div><p className="text-auto-secondary font-medium">Cargando servicios...</p></div></div>) : (
              <DeleteCard items={filtered} loading={loading} onDelete={handleDelete} searchTerm={searchTerm} onClearSearch={searchTerm ? () => setSearchTerm("") : undefined} emptyMessage="No se encontraron servicios" deleteLabel="Eliminar Servicio" renderInfo={(s) => (<><div className="flex items-start justify-between mb-3"><div className="flex-1"><h3 className="text-lg font-bold text-auto-primary">{s.nombre}</h3></div></div><div className="mb-4 bg-auto-secondary rounded-lg p-3 border border-auto"><p className="text-sm text-auto-secondary">{s.descripcion || <span className="italic text-auto-tertiary">No especificada</span>}</p></div></>)} />
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

export default EliminarServicio;
