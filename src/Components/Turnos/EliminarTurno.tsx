import { useState, useEffect } from "react";
import axios from "axios";
import DataTable from "../utilities/DataTable";
import ConfirmDialog from "../utilities/ConfirmDialog";

interface Enfermero {
  enfermeroId: number;
  nombre: string;
  apellidoPaterno: string;
  apellidoMaterno: string;
  numeroEmpleado: string;
}

interface Turno {
  turnoId: number;
  nombre: string;
  horaInicio: string;
  horaFin: string;
  enfermeros?: Enfermero[];
}

function EliminarTurno() {
  const [turnos, setTurnos] = useState<Turno[]>([]);
  const [filteredTurnos, setFilteredTurnos] = useState<Turno[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState<{type: string, message: string} | null>(null);
  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean;
    turno: Turno | null;
  }>({
    isOpen: false,
    turno: null,
  });

  useEffect(() => {
    fetchTurnos();
  }, []);

  const fetchTurnos = async () => {
    setLoading(true);
    try {
      const response = await axios.get("http://localhost:5000/api/turnos");
      const data = response.data.success ? response.data.data : response.data;
      setTurnos(data || []);
      setFilteredTurnos(data || []);
    } catch (error) {
      setAlert({
        type: "danger",
        message: "Error al cargar los turnos"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const filtered = turnos.filter((turno) => {
      const searchLower = searchTerm.toLowerCase();
      const nombreTurno = turno.nombre.toLowerCase();
      const horario = `${formatHora(turno.horaInicio)} ${formatHora(turno.horaFin)}`.toLowerCase();
      
      const enfermerosNombres = turno.enfermeros
        ?.map(e => `${e.nombre} ${e.apellidoPaterno} ${e.apellidoMaterno}`.toLowerCase())
        .join(" ") || "";
      
      return (
        nombreTurno.includes(searchLower) ||
        horario.includes(searchLower) ||
        enfermerosNombres.includes(searchLower)
      );
    });
    setFilteredTurnos(filtered);
  }, [searchTerm, turnos]);

  const formatHora = (horaISO: string): string => {
    try {
      const fecha = new Date(horaISO);
      const hours = fecha.getUTCHours().toString().padStart(2, '0');
      const minutes = fecha.getUTCMinutes().toString().padStart(2, '0');
      return `${hours}:${minutes}`;
    } catch {
      return horaISO;
    }
  };

  const getTipoTurno = (nombre: string): { tipo: string; icono: string } => {
    const nombreLower = nombre.toLowerCase();
    if (nombreLower.includes('matutino')) {
      return { tipo: 'Matutino', icono: '☀️' };
    } else if (nombreLower.includes('vespertino')) {
      return { tipo: 'Vespertino', icono: '🌆' };
    } else if (nombreLower.includes('nocturno')) {
      return { tipo: 'Nocturno', icono: '🌙' };
    }
    return { tipo: nombre, icono: '⏰' };
  };

  const handleDelete = async (turno: Turno) => {
    setConfirmDialog({ isOpen: true, turno });
  };

  const confirmDelete = async () => {
    if (!confirmDialog.turno) return;

    setAlert(null);

    try {
      await axios.delete(`http://localhost:5000/api/turnos/${confirmDialog.turno.turnoId}`);
      
      setAlert({
        type: "success",
        message: "Turno eliminado exitosamente"
      });
      
      await fetchTurnos();
    } catch (error: any) {
      let errorMessage = "Error al eliminar turno";
      if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
      }
      
      setAlert({
        type: "danger",
        message: errorMessage
      });
    } finally {
      setConfirmDialog({ isOpen: false, turno: null });
    }
  };

  const columns = [
    { 
      key: "nombre", 
      label: "Tipo de Turno",
      render: (turno: Turno) => {
        const { tipo, icono } = getTipoTurno(turno.nombre);
        return (
          <span className="inline-block px-3 py-1.5 rounded-lg text-sm font-semibold bg-sky-100 text-sky-800 dark:bg-sky-900/40 dark:text-sky-200">
            {icono} {tipo}
          </span>
        );
      }
    },
    { 
      key: "horario", 
      label: "Horario",
      render: (turno: Turno) => (
        <span className="font-medium text-auto-primary">
          🕐 {formatHora(turno.horaInicio)} → {formatHora(turno.horaFin)}
        </span>
      )
    },
    { 
      key: "enfermeros", 
      label: "Enfermeros Asignados",
      render: (turno: Turno) => {
        if (!turno.enfermeros || turno.enfermeros.length === 0) {
          return <span className="text-auto-tertiary italic">Sin asignar</span>;
        }
        if (turno.enfermeros.length === 1) {
          const enf = turno.enfermeros[0];
          return (
            <div className="text-sm">
              <div className="font-medium text-auto-primary">
                {enf.nombre} {enf.apellidoPaterno} {enf.apellidoMaterno}
              </div>
              <div className="text-xs text-auto-secondary">
                #{enf.numeroEmpleado}
              </div>
            </div>
          );
        }
        return (
          <span className="text-auto-primary font-medium">
            {turno.enfermeros.length} enfermeros
          </span>
        );
      }
    },
    {
      key: "acciones",
      label: "Acciones",
      render: (turno: Turno) => (
        <button
          onClick={() => handleDelete(turno)}
          className="px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg hover:from-red-600 hover:to-red-700 transition-all duration-200 shadow-lg hover:shadow-xl font-medium flex items-center gap-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
          Eliminar
        </button>
      )
    }
  ];

  return (
    <div className="min-h-screen bg-auto-primary pt-20 pb-10">
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-sky-400/10 via-transparent to-cyan-400/10"></div>
        <div className="absolute top-1/4 right-0 w-96 h-96 bg-sky-300/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 left-0 w-96 h-96 bg-cyan-300/20 rounded-full blur-3xl"></div>
      </div>

      <div className="relative min-h-screen">
        <main className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10 py-10">
          {/* Header */}
          <div className="bg-auto-secondary rounded-2xl shadow-xl p-6 md:p-8 border border-auto mb-6 backdrop-blur-sm">
            <div className="flex items-center gap-3 mb-2">
              <div className="bg-gradient-to-br from-red-500 to-red-600 p-3 rounded-xl shadow-lg">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </div>
              <div>
                <h2 className="text-3xl font-bold text-auto-primary">Eliminar Turno</h2>
                <p className="text-auto-secondary text-sm">Selecciona un turno para eliminarlo del sistema</p>
              </div>
            </div>

            <div className="h-px bg-gradient-to-r from-transparent via-auto-tertiary to-transparent my-6"></div>

            {/* Barra de búsqueda */}
            <div>
              <label className="block text-sm font-semibold text-auto-primary mb-3 flex items-center gap-2">
                <span className="text-xl">🔍</span>
                <span>Buscar turno</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Buscar por tipo de turno, horario o enfermero..."
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

          {/* Tabla de turnos */}
          <div className="bg-auto-secondary rounded-2xl shadow-xl p-6 md:p-8 border border-auto backdrop-blur-sm">
            {loading ? (
              <div className="flex items-center justify-center py-16">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-sky-500 mx-auto mb-4"></div>
                  <p className="text-auto-secondary font-medium">Cargando turnos...</p>
                </div>
              </div>
            ) : (
              <DataTable
                data={filteredTurnos}
                columns={columns}
                emptyMessage="No se encontraron turnos"
              />
            )}
          </div>
        </main>
      </div>

      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        title="¿Eliminar Turno?"
        message={`¿Estás seguro de que deseas eliminar el turno ${
          confirmDialog.turno ? getTipoTurno(confirmDialog.turno.nombre).icono : ""
        } ${confirmDialog.turno ? getTipoTurno(confirmDialog.turno.nombre).tipo : ""}?`}
        details={
          confirmDialog.turno
            ? [
                {
                  label: "Horario",
                  value: `${formatHora(confirmDialog.turno.horaInicio)} - ${formatHora(confirmDialog.turno.horaFin)}`,
                },
                {
                  label: "Enfermeros asignados",
                  value: confirmDialog.turno.enfermeros?.length
                    ? `${confirmDialog.turno.enfermeros.length} enfermero(s)`
                    : "Sin asignar",
                },
              ]
            : []
        }
        confirmLabel="Eliminar Turno"
        cancelLabel="Cancelar"
        onConfirm={confirmDelete}
        onCancel={() => setConfirmDialog({ isOpen: false, turno: null })}
        loading={false}
        type="danger"
      />
    </div>
  );
}

export default EliminarTurno;

