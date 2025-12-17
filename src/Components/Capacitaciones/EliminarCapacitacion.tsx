import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import ConfirmDialog from "../utilities/ConfirmDialog";

interface Capacitacion {
  capacitacionId: number;
  titulo: string;
  descripcion: string;
  fechaImparticion: string;
  duracion: number;
  instructor: string;
}

function EliminarCapacitacion() {
  const [capacitaciones, setCapacitaciones] = useState<Capacitacion[]>([]);
  const [alert, setAlert] = useState<{type: string, message: string} | null>(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [selectedCapacitacion, setSelectedCapacitacion] = useState<Capacitacion | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    cargarCapacitaciones();
  }, []);

  const cargarCapacitaciones = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/capacitaciones");
      setCapacitaciones(response.data);
    } catch (error) {
    }
  };

  const handleDeleteClick = (capacitacion: Capacitacion) => {
    setSelectedCapacitacion(capacitacion);
    setShowConfirm(true);
  };

  const handleCancelDelete = () => {
    setShowConfirm(false);
    setSelectedCapacitacion(null);
  };

  const handleConfirmDelete = async () => {
    if (!selectedCapacitacion) return;

    try {
      await axios.delete(`http://localhost:5000/api/capacitaciones/${selectedCapacitacion.capacitacionId}`);
      setAlert({ type: "success", message: "Capacitación eliminada exitosamente" });
      cargarCapacitaciones();
      setShowConfirm(false);
      setSelectedCapacitacion(null);
      setTimeout(() => setAlert(null), 3000);
    } catch (error: any) {
      setAlert({
        type: "danger",
        message: error.response?.data?.error || "Error al eliminar capacitación"
      });
      setShowConfirm(false);
      setSelectedCapacitacion(null);
    }
  };


  return (
    <div className="min-h-screen bg-auto-primary p-8 pt-28">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-auto-primary">
            Eliminar Capacitación
          </h1>
          <button
            onClick={() => navigate("/capacitaciones")}
            className="flex items-center gap-2 px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg font-semibold transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Regresar
          </button>
        </div>

        {alert && (
          <div className={`alert alert-${alert.type} mb-4`} role="alert">
            {alert.message}
          </div>
        )}

        <div className="grid gap-4">
          {capacitaciones.map((cap) => (
            <div key={cap.capacitacionId} className="bg-auto-secondary p-6 rounded-lg shadow flex justify-between items-center">
              <div>
                <h3 className="text-xl font-bold text-auto-primary">{cap.titulo}</h3>
                <p className="text-auto-tertiary text-sm">{cap.descripcion}</p>
              </div>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleDeleteClick(cap);
                }}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors"
              >
                Eliminar
              </button>
            </div>
          ))}

          {capacitaciones.length === 0 && (
            <p className="text-center text-auto-tertiary py-8">
              No hay capacitaciones para eliminar
            </p>
          )}
        </div>
      </div>

      <ConfirmDialog
        isOpen={showConfirm}
        title="Eliminar Capacitación"
        message={`¿Estás seguro de que deseas eliminar la capacitación "${selectedCapacitacion?.titulo}"?`}
        details={selectedCapacitacion ? [
          { label: "Título", value: selectedCapacitacion.titulo },
          { label: "Instructor", value: selectedCapacitacion.instructor || "No asignado" }
        ] : []}
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
        confirmLabel="Eliminar"
        cancelLabel="Cancelar"
        type="danger"
      />
    </div>
  );
}

export default EliminarCapacitacion;

