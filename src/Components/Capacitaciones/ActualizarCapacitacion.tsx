import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

interface Capacitacion {
  capacitacionId: number;
  titulo: string;
  descripcion: string;
  fechaImparticion: string;
  duracion: number;
  instructor: string;
}

function ActualizarCapacitacion() {
  const [capacitaciones, setCapacitaciones] = useState<Capacitacion[]>([]);
  const [selectedId, setSelectedId] = useState("");
  const [formData, setFormData] = useState({
    titulo: "",
    descripcion: "",
    fechaImparticion: "",
    duracion: "",
    instructor: ""
  });
  const [alert, setAlert] = useState<{type: string, message: string} | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    cargarCapacitaciones();
  }, []);

  const cargarCapacitaciones = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/capacitaciones");
      setCapacitaciones(response.data);
    } catch (error) {
      console.error("Error al cargar capacitaciones:", error);
    }
  };

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const id = e.target.value;
    setSelectedId(id);
    
    const capacitacion = capacitaciones.find(c => c.capacitacionId === parseInt(id));
    if (capacitacion) {
      setFormData({
        titulo: capacitacion.titulo,
        descripcion: capacitacion.descripcion || "",
        fechaImparticion: capacitacion.fechaImparticion ? 
          new Date(capacitacion.fechaImparticion).toISOString().slice(0, 16) : "",
        duracion: capacitacion.duracion?.toString() || "",
        instructor: capacitacion.instructor || ""
      });
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAlert(null);

    try {
      await axios.put(`http://localhost:5000/api/capacitaciones/${selectedId}`, formData);
      setAlert({ type: "success", message: "Capacitación actualizada exitosamente" });
      cargarCapacitaciones();
      setTimeout(() => setAlert(null), 3000);
    } catch (error: any) {
      setAlert({
        type: "danger",
        message: error.response?.data?.error || "Error al actualizar capacitación"
      });
    }
  };

  return (
    <div className="min-h-screen bg-auto-primary p-8 pt-28">
      <div className="max-w-2xl mx-auto bg-auto-secondary rounded-lg shadow-lg p-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-auto-primary">
            Actualizar Capacitación
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

        <div className="mb-6">
          <label className="block text-auto-primary font-semibold mb-2">
            Seleccionar Capacitación
          </label>
          <select
            value={selectedId}
            onChange={handleSelectChange}
            className="w-full px-4 py-2 rounded-lg border border-auto bg-auto-tertiary/50 text-auto-primary"
          >
            <option value="">-- Seleccione una capacitación --</option>
            {capacitaciones.map((cap) => (
              <option key={cap.capacitacionId} value={cap.capacitacionId}>
                {cap.titulo}
              </option>
            ))}
          </select>
        </div>

        {selectedId && (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-auto-primary font-semibold mb-2">Título *</label>
              <input
                type="text"
                name="titulo"
                value={formData.titulo}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg border border-auto bg-auto-tertiary/50 text-auto-primary"
                required
              />
            </div>

            <div>
              <label className="block text-auto-primary font-semibold mb-2">Descripción</label>
              <textarea
                name="descripcion"
                value={formData.descripcion}
                onChange={handleChange}
                rows={4}
                className="w-full px-4 py-2 rounded-lg border border-auto bg-auto-tertiary/50 text-auto-primary"
              />
            </div>

            <div>
              <label className="block text-auto-primary font-semibold mb-2">Fecha de Impartición</label>
              <input
                type="datetime-local"
                name="fechaImparticion"
                value={formData.fechaImparticion}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg border border-auto bg-auto-tertiary/50 text-auto-primary"
              />
            </div>

            <div>
              <label className="block text-auto-primary font-semibold mb-2">Duración (horas)</label>
              <input
                type="number"
                name="duracion"
                value={formData.duracion}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg border border-auto bg-auto-tertiary/50 text-auto-primary"
              />
            </div>

            <div>
              <label className="block text-auto-primary font-semibold mb-2">Instructor</label>
              <input
                type="text"
                name="instructor"
                value={formData.instructor}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg border border-auto bg-auto-tertiary/50 text-auto-primary"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-sky-500 hover:bg-sky-600 text-white font-semibold py-3 rounded-lg"
            >
              Actualizar Capacitación
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

export default ActualizarCapacitacion;
