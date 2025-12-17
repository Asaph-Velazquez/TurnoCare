import { useState, useEffect } from "react";
import axios from "axios";
import DeleteCard from "../utilities/DeleteUpdate/Delete";
import ConfirmDialog from "../utilities/ConfirmDialog";

interface Enfermero {
  enfermeroId: number;
  numeroEmpleado: string;
  nombre: string;
  apellidoPaterno: string;
  apellidoMaterno: string;
  especialidad: string | null;
  esCoordinador: boolean;
}

function EliminarEnfermero() {
  const [enfermeros, setEnfermeros] = useState<Enfermero[]>([]);
  const [filteredEnfermeros, setFilteredEnfermeros] = useState<Enfermero[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [loadingList, setLoadingList] = useState(true);
  const [alert, setAlert] = useState<{ type: string; message: string } | null>(null);
  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean;
    enfermero: Enfermero | null;
  }>({
    isOpen: false,
    enfermero: null,
  });

  useEffect(() => {
    fetchEnfermeros();
  }, []);

  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredEnfermeros(enfermeros);
    } else {
      const term = searchTerm.toLowerCase();
      const filtered = enfermeros.filter((enf) => {
        const fullName = `${enf.nombre} ${enf.apellidoPaterno} ${enf.apellidoMaterno}`.toLowerCase();
        const numeroEmpleado = enf.numeroEmpleado.toLowerCase();
        const especialidad = (enf.especialidad || "").toLowerCase();
        
        return (
          fullName.includes(term) ||
          numeroEmpleado.includes(term) ||
          especialidad.includes(term)
        );
      });
      setFilteredEnfermeros(filtered);
    }
  }, [searchTerm, enfermeros]);

  const fetchEnfermeros = async () => {
    try {
      setLoadingList(true);
      const response = await axios.get("http://localhost:5000/api/enfermeros/");
      if (response.data.success && response.data.data) {
        setEnfermeros(response.data.data);
        setFilteredEnfermeros(response.data.data);
      }
    } catch (error) {} finally {
      setLoadingList(false);
    }
  };

  const handleDelete = async (enfermero: Enfermero) => {
    setConfirmDialog({ isOpen: true, enfermero });
  };

  const confirmDelete = async () => {
    if (!confirmDialog.enfermero) return;

    setAlert(null);
    setLoading(true);

    try {
      const response = await axios.delete(
        `http://localhost:5000/api/enfermeros/${confirmDialog.enfermero.enfermeroId}`
      );
      setAlert({
        type: "success",
        message: `Enfermero ${confirmDialog.enfermero.nombre} ${confirmDialog.enfermero.apellidoPaterno} eliminado exitosamente`,
      });
      // Recargar lista
      await fetchEnfermeros();
    } catch (error: any) {
      let errorMessage = "Error al eliminar enfermero";
      if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
      } else if (error.message) {
        errorMessage = error.message;
      }
      setAlert({ type: "danger", message: errorMessage });
    } finally {
      setLoading(false);
      setConfirmDialog({ isOpen: false, enfermero: null });
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
                <h2 className="text-3xl font-bold text-auto-primary">
                  Eliminar Enfermero
                </h2>
                <p className="text-auto-secondary text-sm">
                  Gestión de eliminación de personal
                </p>
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

          {/* Tarjeta de lista de enfermeros */}
          <div className="bg-auto-secondary rounded-2xl shadow-xl p-6 md:p-8 border border-auto backdrop-blur-sm">
            {loadingList ? (
              <div className="flex items-center justify-center py-16">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-sky-500 mx-auto mb-4"></div>
                  <p className="text-auto-secondary font-medium">Cargando enfermeros...</p>
                </div>
              </div>
            ) : (
              <DeleteCard
                items={filteredEnfermeros}
                loading={loading}
                onDelete={handleDelete}
                searchTerm={searchTerm}
                onClearSearch={searchTerm ? () => setSearchTerm("") : undefined}
                emptyMessage="No se encontraron enfermeros"
                deleteLabel="Eliminar Enfermero"
                renderInfo={(enf) => (
                  <>
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-auto-primary group-hover:text-sky-500 transition-colors">
                          {enf.nombre} {enf.apellidoPaterno} {enf.apellidoMaterno}
                        </h3>
                        <p className="text-sm text-auto-secondary flex items-center gap-1 mt-1">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" />
                          </svg>
                          <span className="font-semibold">{enf.numeroEmpleado}</span>
                        </p>
                      </div>
                      {enf.esCoordinador && (
                        <span className="ml-2 px-3 py-1 bg-gradient-to-r from-amber-100 to-amber-200 text-amber-800 text-xs font-bold rounded-lg shadow-sm dark:from-amber-900/40 dark:to-amber-900/30 dark:text-amber-200 border border-amber-300 dark:border-amber-700">
                          ⭐ Coordinador
                        </span>
                      )}
                    </div>
                    <div className="mb-4 bg-auto-secondary rounded-lg p-3 border border-auto">
                      <p className="text-sm text-auto-secondary flex items-start gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <span>
                          <span className="font-semibold">Especialidad:</span>{" "}
                          {enf.especialidad || (
                            <span className="italic text-auto-tertiary">No especificada</span>
                          )}
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

      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        title="¿Eliminar Enfermero?"
        message={`¿Estás seguro de eliminar al enfermero ${confirmDialog.enfermero?.nombre} ${confirmDialog.enfermero?.apellidoPaterno} ${confirmDialog.enfermero?.apellidoMaterno}?`}
        details={
          confirmDialog.enfermero
            ? [
                {
                  label: "Número de empleado",
                  value: confirmDialog.enfermero.numeroEmpleado,
                },
                {
                  label: "Especialidad",
                  value:
                    confirmDialog.enfermero.especialidad || "No especificada",
                },
                {
                  label: "Rol",
                  value: confirmDialog.enfermero.esCoordinador
                    ? "Coordinador"
                    : "Enfermero",
                },
              ]
            : []
        }
        confirmLabel="Eliminar Enfermero"
        cancelLabel="Cancelar"
        onConfirm={confirmDelete}
        onCancel={() => setConfirmDialog({ isOpen: false, enfermero: null })}
        loading={loading}
        type="danger"
      />
    </div>
  );
}

export default EliminarEnfermero;

