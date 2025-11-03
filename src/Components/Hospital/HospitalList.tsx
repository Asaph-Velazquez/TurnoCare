import { useEffect, useState } from "react";
import axios from "axios";
import DataTable from "../utilities/DataTable";

interface Hospital {
  hospitalId: number;
  nombre: string;
  direccion?: string | null;
  telefono?: string | null;
}

interface HospitalListProps {
  refreshTrigger?: number;
}

function HospitalList({ refreshTrigger = 0 }: HospitalListProps) {
  const [hospitales, setHospitales] = useState<Hospital[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    fetchHospitales();
  }, [refreshTrigger]);

  const fetchHospitales = async () => {
    try {
      setLoading(true);
      const response = await axios.get("http://localhost:5000/api/hospital/");
      if (response.data?.success && Array.isArray(response.data.data)) {
        setHospitales(response.data.data);
      } else {
        setHospitales([]);
      }
    } catch (err) {setHospitales([]);
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    { key: "nombre", label: "Nombre" },
    { key: "direccion", label: "Dirección", render: (h: Hospital) => h.direccion || "—" },
    { key: "telefono", label: "Teléfono", render: (h: Hospital) => h.telefono || "—" },
  ];

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-2xl font-bold text-auto-primary">Lista de Hospitales</h3>
        <button
          onClick={fetchHospitales}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 bg-sky-500 hover:bg-sky-600 text-white rounded-xl font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <svg className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Actualizar
        </button>
      </div>

      <DataTable
        data={hospitales}
        columns={columns}
        loading={loading}
        searchPlaceholder="Buscar por nombre, dirección o teléfono..."
        emptyMessage="No hay hospitales registrados"
      />
    </div>
  );
}

export default HospitalList;
