import { useState, useEffect } from "react";
import axios from "axios";
import DataTable from "../utilities/DataTable";
import TextField from "../utilities/Form/TextField";

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

function ActualizarTurno() {
  const [turnos, setTurnos] = useState<Turno[]>([]);
  const [filteredTurnos, setFilteredTurnos] = useState<Turno[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState<{type: string, message: string} | null>(null);
  const [selectedTurno, setSelectedTurno] = useState<Turno | null>(null);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [formData, setFormData] = useState({
    nombre: "",
    horaInicio: "",
    horaFin: "",
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

  const formatHora = (hora: string) => {
    const date = new Date(hora);
    const hours = date.getUTCHours().toString().padStart(2, '0');
    const minutes = date.getUTCMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  };

  const getTipoTurno = (horaInicio: string) => {
    const date = new Date(horaInicio);
    const hours = date.getUTCHours();
    if (hours >= 6 && hours < 14) return 'Matutino';
    if (hours >= 14 && hours < 22) return 'Vespertino';
    return 'Nocturno';
  };

  useEffect(() => {
    const filtered = turnos.filter((turno) => {
      const searchLower = searchTerm.toLowerCase();
      const tipo = getTipoTurno(turno.horaInicio).toLowerCase();
      const horario = `${formatHora(turno.horaInicio)} - ${formatHora(turno.horaFin)}`.toLowerCase();
      const enfermeroNombres = turno.enfermeros
        ? turno.enfermeros.map(e => `${e.nombre} ${e.apellidoPaterno}`).join(' ').toLowerCase()
        : '';
      
      return (
        turno.nombre.toLowerCase().includes(searchLower) ||
        tipo.includes(searchLower) ||
        horario.includes(searchLower) ||
        enfermeroNombres.includes(searchLower)
      );
    });
    setFilteredTurnos(filtered);
  }, [searchTerm, turnos]);

  const handleUpdate = (turno: Turno) => {
    setSelectedTurno(turno);
    setFormData({
      nombre: turno.nombre,
      horaInicio: formatHora(turno.horaInicio),
      horaFin: formatHora(turno.horaFin),
    });
    setShowUpdateModal(true);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const confirmUpdate = async () => {
    if (!selectedTurno) return;

    try {
      if (!formData.nombre || !formData.horaInicio || !formData.horaFin) {
        setAlert({
          type: "danger",
          message: "Por favor completa todos los campos"
        });
        return;
      }

      const dataToSend = {
        nombre: formData.nombre,
        horaInicio: formData.horaInicio,
        horaFin: formData.horaFin,
      };

      await axios.put(`http://localhost:5000/api/turnos/${selectedTurno.turnoId}`, dataToSend);
      
      setAlert({
        type: "success",
        message: "Turno actualizado exitosamente. El tipo de turno se actualizó automáticamente según el horario."
      });
      
      fetchTurnos();
      setShowUpdateModal(false);
      setSelectedTurno(null);
    } catch (error: any) {
      let errorMessage = "Error al actualizar turno";
      if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
      }
      
      setAlert({
        type: "danger",
        message: errorMessage
      });
    }
  };

  const columns = [
    { key: "nombre", label: "Nombre" },
    { 
      key: "tipo", 
      label: "Tipo de Turno",
      render: (turno: Turno) => {
        const tipo = getTipoTurno(turno.horaInicio);
        const colorClass = tipo === 'Matutino' 
          ? 'bg-yellow-100 text-yellow-800' 
          : tipo === 'Vespertino'
          ? 'bg-orange-100 text-orange-800'
          : 'bg-blue-100 text-blue-800';
        return (
          <span className={`px-2 py-1 rounded-full text-xs font-semibold ${colorClass}`}>
            {tipo}
          </span>
        );
      }
    },
    { 
      key: "horario", 
      label: "Horario",
      render: (turno: Turno) => `${formatHora(turno.horaInicio)} - ${formatHora(turno.horaFin)}`
    },
    { 
      key: "enfermeros", 
      label: "Enfermeros Asignados",
      render: (turno: Turno) => turno.enfermeros && turno.enfermeros.length > 0
        ? turno.enfermeros.map(e => `${e.nombre} ${e.apellidoPaterno}`).join(', ')
        : "Sin asignar"
    },
    {
      key: "acciones",
      label: "Acciones",
      render: (turno: Turno) => (
        <button
          onClick={() => handleUpdate(turno)}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200"
        >
          Actualizar
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
              <div className="bg-gradient-to-br from-sky-500 to-sky-600 p-3 rounded-xl shadow-lg">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M21.731 2.269a2.625 2.625 0 0 0-3.712 0l-1.157 1.157 3.712 3.712 1.157-1.157a2.625 2.625 0 0 0 0-3.712z" />
                  <path d="M3 17.25V21h3.75L19.061 8.689l-3.712-3.712L3 17.25z" />
                </svg>
              </div>
              <div>
                <h2 className="text-3xl font-bold text-auto-primary">Actualizar Turno</h2>
                <p className="text-auto-secondary text-sm">Selecciona un turno para actualizar su información</p>
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
                  placeholder="Buscar por tipo, fecha, enfermero..."
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

      {/* Modal de actualización */}
      {showUpdateModal && selectedTurno && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-auto-secondary border border-auto rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-auto">
              <h2 className="text-2xl font-bold text-auto-primary">Actualizar Turno</h2>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <TextField 
                  label="Nombre del Turno" 
                  name="nombre" 
                  type="text"
                  value={formData.nombre} 
                  onChange={handleChange as any} 
                  required 
                />
                <div>
                  <label className="block text-sm font-medium text-auto-primary mb-2">
                    Hora de Inicio (24 hrs)
                  </label>
                  <input
                    type="time"
                    name="horaInicio"
                    value={formData.horaInicio}
                    onChange={handleChange}
                    required
                    step="60"
                    className="w-full px-4 py-2 bg-auto-primary border-2 border-auto rounded-xl text-auto-primary focus:border-sky-500 focus:outline-none focus:ring-4 focus:ring-sky-500/20 transition-all duration-200"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-auto-primary mb-2">
                    Hora de Fin (24 hrs)
                  </label>
                  <input
                    type="time"
                    name="horaFin"
                    value={formData.horaFin}
                    onChange={handleChange}
                    required
                    step="60"
                    className="w-full px-4 py-2 bg-auto-primary border-2 border-auto rounded-xl text-auto-primary focus:border-sky-500 focus:outline-none focus:ring-4 focus:ring-sky-500/20 transition-all duration-200"
                  />
                </div>
              </div>
            </div>
            <div className="p-6 border-t border-auto flex justify-end gap-4">
              <button
                onClick={() => {
                  setShowUpdateModal(false);
                  setSelectedTurno(null);
                }}
                className="px-6 py-2 bg-gray-500 text-white rounded-xl hover:bg-gray-600 transition-colors duration-200"
              >
                Cancelar
              </button>
              <button
                onClick={confirmUpdate}
                className="px-6 py-2 bg-gradient-to-r from-sky-500 to-cyan-500 text-white rounded-xl hover:from-sky-600 hover:to-cyan-600 transition-all duration-200"
              >
                Actualizar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ActualizarTurno;
