import { useState, useEffect } from "react";
import axios from "axios";
import DeleteCard from "../utilities/DeleteUpdate/Delete";

interface Paciente {
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
}

function EliminarPacientes() {
  const [pacientes, setPacientes] = useState<Paciente[]>([]);
  const [filteredPacientes, setFilteredPacientes] = useState<Paciente[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [loadingList, setLoadingList] = useState(true);
  const [alert, setAlert] = useState<{ type: string; message: string } | null>(null);

  // Cargar pacientes al montar
  useEffect(() => {
    fetchPacientes();
  }, []);

  // Filtrar pacientes por búsqueda
  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredPacientes(pacientes);
    } else {
      const term = searchTerm.toLowerCase();
      const filtered = pacientes.filter((p) => {
        const fullName = `${p.nombre} ${p.apellidop} ${p.apellidom}`.toLowerCase();
        const expediente = (p.numeroExpediente || "").toLowerCase();
        const habitacion = (p.numeroHabitacion || "").toLowerCase();
        const cama = (p.numeroCama || "").toLowerCase();
        const motivo = (p.motivoConsulta || "").toLowerCase();

        return (
          fullName.includes(term) ||
          expediente.includes(term) ||
          habitacion.includes(term) ||
          cama.includes(term) ||
          motivo.includes(term)
        );
      });
      setFilteredPacientes(filtered);
    }
  }, [searchTerm, pacientes]);

  // Obtener lista de pacientes
  const fetchPacientes = async () => {
    try {
      setLoadingList(true);
      const response = await axios.get("http://localhost:5000/api/pacientes/");
      const data = Array.isArray(response.data?.data) ? response.data.data : [];
      setPacientes(data);
      setFilteredPacientes(data);
    } catch (error) {setAlert({ type: "danger", message: "Error al cargar pacientes" });
    } finally {
      setLoadingList(false);
    }
  };

  // Manejar eliminación de paciente
  const handleDelete = async (paciente: Paciente) => {
    const confirmDelete = window.confirm(
      `¿Estás seguro de eliminar al paciente ${paciente.nombre} ${paciente.apellidop} ${paciente.apellidom}?\n\nExpediente: ${paciente.numeroExpediente}\nHabitación: ${paciente.numeroHabitacion || "N/A"}\nCama: ${paciente.numeroCama || "N/A"}\n\nEsta acción no se puede deshacer.`
    );

    if (!confirmDelete) return;

    setAlert(null);
    setLoading(true);

    try {
      await axios.delete(`http://localhost:5000/api/pacientes/${paciente.pacienteId}`);
      setAlert({ type: "success", message: `Paciente ${paciente.nombre} ${paciente.apellidop} eliminado exitosamente` });
      await fetchPacientes();
    } catch (error: any) {const errorMessage = error.response?.data?.error || error.message || "Error al eliminar paciente";
      setAlert({ type: "danger", message: errorMessage });
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
                <h2 className="text-3xl font-bold text-auto-primary">Eliminar Paciente</h2>
                <p className="text-auto-secondary text-sm">Gestión de eliminación de pacientes</p>
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

          {/* Alertas de estado */}
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

          {/* Lista de pacientes */}
          <div className="bg-auto-secondary rounded-2xl shadow-xl p-6 md:p-8 border border-auto backdrop-blur-sm">
            {loadingList ? (
              <div className="flex items-center justify-center py-16">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-sky-500 mx-auto mb-4"></div>
                  <p className="text-auto-secondary font-medium">Cargando pacientes...</p>
                </div>
              </div>
            ) : (
              <DeleteCard
                items={filteredPacientes}
                loading={loading}
                onDelete={handleDelete}
                searchTerm={searchTerm}
                onClearSearch={searchTerm ? () => setSearchTerm("") : undefined}
                emptyMessage="No se encontraron pacientes"
                deleteLabel="Eliminar Paciente"
                renderInfo={(p) => (
                  <>
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-auto-primary group-hover:text-sky-500 transition-colors">
                          {p.nombre} {p.apellidop} {p.apellidom}
                        </h3>
                        <p className="text-sm text-auto-secondary flex items-center gap-1 mt-1">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" />
                          </svg>
                          <span className="font-semibold">{p.numeroExpediente}</span>
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-auto-secondary">
                          <span className="font-semibold">Edad:</span> {p.edad ?? "-"}
                        </p>
                      </div>
                    </div>
                    <div className="mb-4 bg-auto-secondary rounded-lg p-3 border border-auto">
                      <p className="text-sm text-auto-secondary flex items-start gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <span>
                          <span className="font-semibold">Ubicación:</span> Hab. {p.numeroHabitacion || "-"} / Cama {p.numeroCama || "-"}
                        </span>
                      </p>
                      <p className="text-sm text-auto-secondary mt-3">
                        <span className="font-semibold">Motivo:</span> {p.motivoConsulta || (<span className="italic text-auto-tertiary">No especificado</span>)}
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

export default EliminarPacientes;
