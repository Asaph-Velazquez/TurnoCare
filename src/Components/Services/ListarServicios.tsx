import { useEffect, useState } from "react";
import axios from "axios";
import DataTable from "../utilities/DataTable";

interface Service {
  id?: number;
  servicioId?: number;
  nombre: string;
  descripcion?: string | null;
  capacidadmaxima?: number | null;
  capacidadMaxima?: number | null;
  personalasignado?: number | null;
  personalAsignado?: number | null;
  hospitalid?: number | null;
  hospitalId?: number | null;
  hospital?: { hospitalId?: number; nombre?: string } | null;
}

function ListarServicios() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      setLoading(true);
      const res = await axios.get("http://localhost:5000/api/servicios/listServices");
      const data: Service[] = Array.isArray(res.data) ? res.data : Array.isArray(res.data?.data) ? res.data.data : [];
      setServices(data);
    } catch (err) {
      console.error(err);
      setServices([]);
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    { key: "nombre", label: "Nombre" },
    { key: "descripcion", label: "Descripción", render: (s: Service) => s.descripcion || "—" },
    {
      key: "capacidad",
      label: "Capacidad",
      render: (s: Service) => {
        const val = s.capacidadMaxima ?? s.capacidadmaxima;
        return val !== undefined && val !== null ? String(val) : "—";
      },
    },
    {
      key: "personal",
      label: "Personal",
      render: (s: Service) => {
        const val = s.personalAsignado ?? s.personalasignado;
        return val !== undefined && val !== null ? String(val) : "—";
      },
    },
    {
      key: "hospital",
      label: "Hospital",
      render: (s: Service) => {
        if (s.hospital && s.hospital.nombre) return s.hospital.nombre;
        const id = s.hospital?.hospitalId ?? s.hospitalId ?? s.hospitalid;
        if (id !== undefined && id !== null) return String(id);
        return "—";
      },
    },
  ];

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-2xl font-bold text-auto-primary">Lista de Servicios</h3>
        <button onClick={fetchServices} disabled={loading} className="flex items-center gap-2 px-4 py-2 bg-sky-500 hover:bg-sky-600 text-white rounded-xl font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed">
          <svg className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Actualizar
        </button>
      </div>

      <DataTable data={services} columns={columns} loading={loading} searchPlaceholder="Buscar por nombre, descripción..." emptyMessage="No hay servicios registrados" />
    </div>
  );
}

export default ListarServicios;
