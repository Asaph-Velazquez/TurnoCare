import { useEffect, useState } from "react";
import axios from "axios";
import DeleteCard from "../utilities/DeleteUpdate/Delete";
import ConfirmDialog from "../utilities/ConfirmDialog";

type Insumo = {
  insumoId: number;
  nombre: string;
  descripcion: string | null;
  categoria: string | null;
  cantidadDisponible: number;
  unidadMedida: string | null;
  ubicacion: string | null;
};

type AlertState = { type: "success" | "danger"; message: string } | null;

export default function EliminarInsumo() {
  const [insumos, setInsumos] = useState<Insumo[]>([]);
  const [filtered, setFiltered] = useState<Insumo[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loadingList, setLoadingList] = useState(true);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState<AlertState>(null);
  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean;
    insumo: Insumo | null;
  }>({
    isOpen: false,
    insumo: null,
  });

  useEffect(() => {
    fetchInsumos();
  }, []);

  useEffect(() => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) {
      setFiltered(insumos);
      return;
    }

    setFiltered(
      insumos.filter((ins) => {
        const nombre = ins.nombre.toLowerCase();
        const categoria = (ins.categoria ?? "").toLowerCase();
        const ubicacion = (ins.ubicacion ?? "").toLowerCase();
        const descripcion = (ins.descripcion ?? "").toLowerCase();
        return (
          nombre.includes(term) ||
          categoria.includes(term) ||
          ubicacion.includes(term) ||
          descripcion.includes(term)
        );
      })
    );
  }, [searchTerm, insumos]);

  const fetchInsumos = async () => {
    try {
      setLoadingList(true);
      const res = await axios.get("http://localhost:5000/api/insumos/");
      const data: Insumo[] = Array.isArray(res.data?.data)
        ? res.data.data
        : Array.isArray(res.data)
        ? res.data
        : [];
      setInsumos(data);
      setFiltered(data);
    } catch (error) {
      setInsumos([]);
      setFiltered([]);
    } finally {
      setLoadingList(false);
    }
  };

  const handleDelete = async (insumo: Insumo) => {
    setConfirmDialog({ isOpen: true, insumo });
  };

  const confirmDelete = async () => {
    if (!confirmDialog.insumo) return;

    setAlert(null);
    setLoading(true);

    try {
      await axios.delete(
        `http://localhost:5000/api/insumos/${confirmDialog.insumo.insumoId}`
      );
      setAlert({
        type: "success",
        message: `Insumo ${confirmDialog.insumo.nombre} eliminado correctamente`,
      });
      await fetchInsumos();
    } catch (error: any) {
      const message =
        error?.response?.data?.error ||
        error?.message ||
        "Error al eliminar insumo";
      setAlert({ type: "danger", message });
    } finally {
      setLoading(false);
      setConfirmDialog({ isOpen: false, insumo: null });
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
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 7l-.867 12.142A2 2 0 0 1 16.138 21H7.862a2 2 0 0 1-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v3M4 7h16"
                  />
                </svg>
              </div>
              <div>
                <h2 className="text-3xl font-bold text-auto-primary">
                  Eliminar Insumo
                </h2>
                <p className="text-auto-secondary text-sm">
                  Depura el inventario de suministros
                </p>
              </div>
            </div>

            <div className="h-px bg-gradient-to-r from-transparent via-auto-tertiary to-transparent my-6"></div>

            <div>
              <label className="block text-sm font-semibold text-auto-primary mb-3 flex items-center gap-2">
                <span className="text-xl">🔍</span>
                <span>Buscar insumo</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Buscar por nombre, categoría, ubicación o descripción..."
                  className="block w-full pl-12 pr-4 py-4 border-2 border-auto rounded-xl bg-auto-primary text-auto-primary placeholder-auto-secondary/70 focus:border-sky-500 focus:outline-none focus:ring-4 focus:ring-sky-500/20 transition-all duration-200 shadow-sm"
                />
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-auto-secondary">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 1 1-14 0 7 7 0 0 1 14 0z"
                    />
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
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 1 0-8-8 8 8 0 0 0 8 8Zm3.707-9.293a1 1 0 0 0-1.414-1.414L9 10.586 7.707 9.293a1 1 0 0 0-1.414 1.414l2 2a1 1 0 0 0 1.414 0l4-4Z"
                      clipRule="evenodd"
                    />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 1 0-8-8 8 8 0 0 0 8 8ZM8.707 7.293a1 1 0 0 0-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 1 0 1.414 1.414L10 11.414l1.293 1.293a1 1 0 0 0 1.414-1.414L11.414 10l1.293-1.293a1 1 0 0 0-1.414-1.414L10 8.586 8.707 7.293Z"
                      clipRule="evenodd"
                    />
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
                  <p className="text-auto-secondary font-medium">
                    Cargando insumos...
                  </p>
                </div>
              </div>
            ) : (
              <DeleteCard
                items={filtered}
                loading={loading}
                onDelete={handleDelete}
                renderInfo={(ins) => (
                  <>
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-auto-primary group-hover:text-sky-500 transition-colors">
                          {ins.nombre}
                        </h3>
                        <p className="text-sm text-auto-secondary mt-1">
                          {ins.ubicacion || "Ubicación no registrada"}
                        </p>
                      </div>
                      <span className="ml-2 px-3 py-1 bg-gradient-to-r from-emerald-100 to-emerald-200 text-emerald-800 text-xs font-bold rounded-lg shadow-sm border border-emerald-200">
                        {ins.categoria || "Sin categoría"}
                      </span>
                    </div>
                    <div className="mb-4 bg-auto-secondary rounded-lg p-3 border border-auto">
                      <p className="text-sm text-auto-secondary flex items-start gap-2">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4 mt-0.5 flex-shrink-0"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M3 3h18M9 7v14m6-14v14M4 21h16"
                          />
                        </svg>
                        <span>
                          <span className="font-semibold">Cantidad:</span>{" "}
                          {`${ins.cantidadDisponible ?? 0} ${
                            ins.unidadMedida || "unidades"
                          }`}
                        </span>
                      </p>
                    </div>
                  </>
                )}
                searchTerm={searchTerm}
                onClearSearch={searchTerm ? () => setSearchTerm("") : undefined}
                emptyMessage="No se encontraron insumos"
                deleteLabel="Eliminar insumo"
              />
            )}
          </div>
        </main>
      </div>

      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        title="¿Eliminar Insumo?"
        message={`¿Deseas eliminar el insumo "${confirmDialog.insumo?.nombre}" del inventario?`}
        details={
          confirmDialog.insumo
            ? [
                {
                  label: "Categoría",
                  value: confirmDialog.insumo.categoria || "Sin categoría",
                },
                {
                  label: "Cantidad",
                  value: `${confirmDialog.insumo.cantidadDisponible ?? 0} ${
                    confirmDialog.insumo.unidadMedida || "unidades"
                  }`,
                },
                {
                  label: "Ubicación",
                  value: confirmDialog.insumo.ubicacion || "Sin ubicación",
                },
              ]
            : []
        }
        confirmLabel="Eliminar Insumo"
        cancelLabel="Cancelar"
        onConfirm={confirmDelete}
        onCancel={() => setConfirmDialog({ isOpen: false, insumo: null })}
        loading={loading}
        type="danger"
      />
    </div>
  );
}
