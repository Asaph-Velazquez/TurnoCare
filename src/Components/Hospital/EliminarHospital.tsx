import { useEffect, useState } from "react";
import axios from "axios";
import DeleteCard from "../utilities/DeleteUpdate/Delete";

type Hospital = {
  hospitalId: number;
  nombre: string;
  direccion?: string | null;
  telefono?: string | null;
};

function EliminarHospital() {
  const [hospitales, setHospitales] = useState<Hospital[]>([]);
  const [filtered, setFiltered] = useState<Hospital[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [loadingList, setLoadingList] = useState(true);
  const [alert, setAlert] = useState<{ type: "success" | "danger"; message: string } | null>(null);

  useEffect(() => {
    fetchHospitales();
  }, []);

  useEffect(() => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) {
      setFiltered(hospitales);
    } else {
      setFiltered(
        hospitales.filter((h) =>
          h.nombre.toLowerCase().includes(term) ||
          (h.direccion || "").toLowerCase().includes(term) ||
          (h.telefono || "").toLowerCase().includes(term)
        )
      );
    }
  }, [searchTerm, hospitales]);

  const fetchHospitales = async () => {
    try {
      setLoadingList(true);
      const res = await axios.get("http://localhost:5000/api/hospital/");
      const data: Hospital[] = Array.isArray(res.data?.data)
        ? res.data.data
        : Array.isArray(res.data)
        ? res.data
        : [];
      setHospitales(data);
      setFiltered(data);
    } catch (e) {
      setHospitales([]);
      setFiltered([]);
    } finally {
      setLoadingList(false);
    }
  };

  const handleDelete = async (h: Hospital) => {
    const confirmDelete = window.confirm(
      `¿Seguro que deseas eliminar el hospital "${h.nombre}"?\n\nDirección: ${h.direccion || "N/A"}\nTeléfono: ${h.telefono || "N/A"}\n\nEsta acción no se puede deshacer.`
    );
    if (!confirmDelete) return;

    setAlert(null);
    setLoading(true);
    try {
      await axios.delete(`http://localhost:5000/api/hospital/${h.hospitalId}`);
      setAlert({ type: "success", message: `Hospital "${h.nombre}" eliminado correctamente` });
      await fetchHospitales();
    } catch (err: any) {
      const msg = err?.response?.data?.error || err?.message || "Error al eliminar hospital";
      setAlert({ type: "danger", message: msg });
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
              <div className="bg-gradient-to-br from-red-500 to-red-600 p-3 rounded-xl shadow-lg">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </div>
              <div>
                <h2 className="text-3xl font-bold text-auto-primary">Eliminar Hospital</h2>
                <p className="text-auto-secondary text-sm">Gestión de eliminación de hospitales</p>
              </div>
            </div>

            <div className="h-px bg-gradient-to-r from-transparent via-auto-tertiary to-transparent my-6"></div>

            <div>
              <label className="block text-sm font-semibold text-auto-primary mb-3 flex items-center gap-2">
                <span className="text-xl">🔍</span>
                <span>Buscar hospital</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Buscar por nombre, dirección o teléfono..."
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

          <div className="bg-auto-secondary rounded-2xl shadow-xl p-6 md:p-8 border border-auto backdrop-blur-sm">
            {loadingList ? (
              <div className="flex items-center justify-center py-16">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-sky-500 mx-auto mb-4"></div>
                  <p className="text-auto-secondary font-medium">Cargando hospitales...</p>
                </div>
              </div>
            ) : (
              <DeleteCard
                items={filtered}
                loading={loading}
                onDelete={handleDelete}
                searchTerm={searchTerm}
                onClearSearch={searchTerm ? () => setSearchTerm("") : undefined}
                emptyMessage="No se encontraron hospitales"
                deleteLabel="Eliminar Hospital"
                renderInfo={(h) => (
                  <>
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-auto-primary group-hover:text-sky-500 transition-colors">
                          {(h as any).nombre}
                        </h3>
                      </div>
                    </div>
                    <div className="mb-4 bg-auto-secondary rounded-lg p-3 border border-auto">
                      <p className="text-sm text-auto-secondary flex items-start gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l-6 6-3-3" />
                        </svg>
                        <span>
                          <span className="font-semibold">Dirección:</span> {(h as any).direccion || <span className="italic text-auto-tertiary">No especificada</span>}
                        </span>
                      </p>
                      <p className="text-sm text-auto-secondary flex items-start gap-2 mt-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h2l.4 2M7 13h10l4-8H5.4" />
                        </svg>
                        <span>
                          <span className="font-semibold">Teléfono:</span> {(h as any).telefono || <span className="italic text-auto-tertiary">No especificado</span>}
                        </span>
                      </p>
                    </div>
                  </>
                )}
              />
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

export default EliminarHospital;
