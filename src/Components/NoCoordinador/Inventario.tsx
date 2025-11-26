import { useState, useEffect } from "react";
import axios from "axios";

type Medicamento = {
  medicamentoId: number;
  nombre: string;
  descripcion: string | null;
  cantidadStock: number;
  lote: string | null;
  fechaCaducidad: string | null;
  ubicacion: string | null;
};

type Insumo = {
  insumoId: number;
  nombre: string;
  descripcion: string | null;
  categoria: string | null;
  cantidadDisponible: number;
  unidadMedida: string | null;
  ubicacion: string | null;
};

type InventarioServicio = {
  inventarioServicioId: number;
  cantidadAsignada: number;
  servicio: {
    servicioId: number;
    nombre: string;
    hospital?: {
      nombre: string;
    };
  };
  medicamento?: {
    medicamentoId: number;
    nombre: string;
    descripcion?: string;
  } | null;
  insumo?: {
    insumoId: number;
    nombre: string;
    categoria?: string;
  } | null;
};

function Inventario() {
  const [activeTab, setActiveTab] = useState<"medicamentos" | "insumos" | "servicios">("medicamentos");
  const [medicamentos, setMedicamentos] = useState<Medicamento[]>([]);
  const [insumos, setInsumos] = useState<Insumo[]>([]);
  const [inventarioServicios, setInventarioServicios] = useState<InventarioServicio[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    setLoading(true);
    try {
      switch (activeTab) {
        case "medicamentos":
          const resMeds = await axios.get("http://localhost:5000/api/medicamentos/");
          setMedicamentos(Array.isArray(resMeds.data?.data) ? resMeds.data.data : []);
          break;
        case "insumos":
          const resInsumos = await axios.get("http://localhost:5000/api/insumos/");
          setInsumos(Array.isArray(resInsumos.data?.data) ? resInsumos.data.data : []);
          break;
        case "servicios":
          const resServicios = await axios.get("http://localhost:5000/api/inventario-servicio/");
          const serviciosData = Array.isArray(resServicios.data?.data) 
            ? resServicios.data.data 
            : Array.isArray(resServicios.data) 
            ? resServicios.data 
            : [];
          setInventarioServicios(serviciosData);
          break;
      }
    } catch (error) {
      console.error("Error al cargar datos:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredMedicamentos = medicamentos.filter(m =>
    m.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (m.ubicacion || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredInsumos = insumos.filter(i =>
    i.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (i.categoria || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredServicios = inventarioServicios.filter(s => {
    const searchLower = searchTerm.toLowerCase();
    const servicioNombre = (s.servicio?.nombre || "").toLowerCase();
    const hospitalNombre = (s.servicio?.hospital?.nombre || "").toLowerCase();
    const itemNombre = (s.medicamento?.nombre || s.insumo?.nombre || "").toLowerCase();
    
    return (
      servicioNombre.includes(searchLower) ||
      hospitalNombre.includes(searchLower) ||
      itemNombre.includes(searchLower)
    );
  });

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
              <div className="bg-gradient-to-br from-sky-500 to-cyan-500 p-3 rounded-xl shadow-lg">
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
                    d="m7.875 14.25 1.214 1.942a2.25 2.25 0 0 0 1.908 1.058h2.006c.776 0 1.497-.4 1.908-1.058l1.214-1.942M2.41 9h4.636a2.25 2.25 0 0 1 1.872 1.002l.164.246a2.25 2.25 0 0 0 1.872 1.002h2.092a2.25 2.25 0 0 0 1.872-1.002l.164-.246A2.25 2.25 0 0 1 16.954 9h4.636M2.41 9a2.25 2.25 0 0 0-.16.832V12a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 12V9.832c0-.287-.055-.57-.16-.832M2.41 9a2.25 2.25 0 0 1 .382-.632l3.285-3.832a2.25 2.25 0 0 1 1.708-.786h8.43c.657 0 1.281.287 1.709.786l3.284 3.832c.163.19.291.404.382.632M4.5 20.25h15A2.25 2.25 0 0 0 21.75 18v-2.625c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125V18a2.25 2.25 0 0 0 2.25 2.25Z"
                  />
                </svg>
              </div>
              <div>
                <h2 className="text-3xl font-bold text-auto-primary">Consultar Inventario</h2>
                <p className="text-auto-secondary text-sm">Visualiza medicamentos, insumos e inventario por servicio</p>
              </div>
            </div>

            <div className="h-px bg-gradient-to-r from-transparent via-auto-tertiary to-transparent my-6"></div>

            {/* Búsqueda */}
            <div>
              <label className="block text-sm font-semibold text-auto-primary mb-3 flex items-center gap-2">
                <span className="text-xl">🔍</span>
                <span>Buscar en inventario</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Buscar por nombre, categoría, ubicación..."
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

          {/* Tabs */}
          <div className="bg-auto-secondary rounded-2xl shadow-xl border border-auto mb-6 backdrop-blur-sm">
            <div className="flex gap-2 p-2 border-b border-auto">
              <button
                onClick={() => setActiveTab("medicamentos")}
                className={`flex-1 px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
                  activeTab === "medicamentos"
                    ? "bg-gradient-to-r from-sky-500 to-cyan-500 text-white shadow-lg"
                    : "text-auto-secondary hover:text-auto-primary hover:bg-auto-tertiary"
                }`}
              >
                💊 Medicamentos ({medicamentos.length})
              </button>
              <button
                onClick={() => setActiveTab("insumos")}
                className={`flex-1 px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
                  activeTab === "insumos"
                    ? "bg-gradient-to-r from-sky-500 to-cyan-500 text-white shadow-lg"
                    : "text-auto-secondary hover:text-auto-primary hover:bg-auto-tertiary"
                }`}
              >
                🏥 Insumos ({insumos.length})
              </button>
              <button
                onClick={() => setActiveTab("servicios")}
                className={`flex-1 px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
                  activeTab === "servicios"
                    ? "bg-gradient-to-r from-sky-500 to-cyan-500 text-white shadow-lg"
                    : "text-auto-secondary hover:text-auto-primary hover:bg-auto-tertiary"
                }`}
              >
                📋 Por Servicio ({inventarioServicios.length})
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="bg-auto-secondary rounded-2xl shadow-xl p-6 md:p-8 border border-auto backdrop-blur-sm">
            {loading ? (
              <div className="flex items-center justify-center py-16">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-sky-500 mx-auto mb-4"></div>
                  <p className="text-auto-secondary font-medium">Cargando inventario...</p>
                </div>
              </div>
            ) : (
              <>
                {/* Medicamentos */}
                {activeTab === "medicamentos" && (
                  <div className="space-y-4">
                    {filteredMedicamentos.length === 0 ? (
                      <div className="text-center py-12">
                        <p className="text-auto-secondary">No se encontraron medicamentos</p>
                      </div>
                    ) : (
                      filteredMedicamentos.map((med) => (
                        <div key={med.medicamentoId} className="bg-auto-primary rounded-xl p-4 border border-auto hover:shadow-lg transition-shadow">
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex-1">
                              <h3 className="text-lg font-bold text-auto-primary">{med.nombre}</h3>
                              <p className="text-sm text-auto-secondary mt-1">Stock: {med.cantidadStock} unidades</p>
                            </div>
                            <span className="px-3 py-1 bg-gradient-to-r from-sky-100 to-cyan-100 text-sky-800 text-xs font-bold rounded-lg">
                              {med.ubicacion || "Sin ubicación"}
                            </span>
                          </div>
                          <div className="grid grid-cols-2 gap-3 text-sm">
                            <p className="text-auto-secondary">
                              <span className="font-semibold">Lote:</span> {med.lote || "N/A"}
                            </p>
                            <p className="text-auto-secondary">
                              <span className="font-semibold">Caducidad:</span>{" "}
                              {med.fechaCaducidad ? new Date(med.fechaCaducidad).toLocaleDateString() : "N/A"}
                            </p>
                          </div>
                          {med.descripcion && (
                            <p className="text-sm text-auto-secondary mt-2 italic">{med.descripcion}</p>
                          )}
                        </div>
                      ))
                    )}
                  </div>
                )}

                {/* Insumos */}
                {activeTab === "insumos" && (
                  <div className="space-y-4">
                    {filteredInsumos.length === 0 ? (
                      <div className="text-center py-12">
                        <p className="text-auto-secondary">No se encontraron insumos</p>
                      </div>
                    ) : (
                      filteredInsumos.map((ins) => (
                        <div key={ins.insumoId} className="bg-auto-primary rounded-xl p-4 border border-auto hover:shadow-lg transition-shadow">
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex-1">
                              <h3 className="text-lg font-bold text-auto-primary">{ins.nombre}</h3>
                              <p className="text-sm text-auto-secondary mt-1">
                                {ins.cantidadDisponible} {ins.unidadMedida || "unidades"}
                              </p>
                            </div>
                            <span className="px-3 py-1 bg-gradient-to-r from-emerald-100 to-emerald-200 text-emerald-800 text-xs font-bold rounded-lg">
                              {ins.categoria || "Sin categoría"}
                            </span>
                          </div>
                          <div className="text-sm">
                            <p className="text-auto-secondary">
                              <span className="font-semibold">Ubicación:</span> {ins.ubicacion || "No especificada"}
                            </p>
                          </div>
                          {ins.descripcion && (
                            <p className="text-sm text-auto-secondary mt-2 italic">{ins.descripcion}</p>
                          )}
                        </div>
                      ))
                    )}
                  </div>
                )}

                {/* Inventario por Servicio */}
                {activeTab === "servicios" && (
                  <div className="space-y-4">
                    {filteredServicios.length === 0 ? (
                      <div className="text-center py-12">
                        <p className="text-auto-secondary">No se encontró inventario por servicio</p>
                      </div>
                    ) : (
                      <div className="space-y-6">
                        {/* Agrupar por servicio */}
                        {Object.entries(
                          filteredServicios.reduce((acc, inv) => {
                            const servicioId = inv.servicio.servicioId;
                            if (!acc[servicioId]) {
                              acc[servicioId] = {
                                servicio: inv.servicio,
                                items: [],
                              };
                            }
                            acc[servicioId].items.push(inv);
                            return acc;
                          }, {} as Record<number, { servicio: any; items: InventarioServicio[] }>)
                        ).map(([servicioId, data]) => (
                          <div key={servicioId} className="bg-auto-primary rounded-xl border border-auto overflow-hidden">
                            {/* Header del servicio */}
                            <div className="bg-gradient-to-r from-purple-500 to-purple-600 p-4">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                  <div className="bg-white/20 p-2 rounded-lg">
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
                                        d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                                      />
                                    </svg>
                                  </div>
                                  <div>
                                    <h3 className="text-xl font-bold text-white">
                                      {data.servicio.nombre}
                                    </h3>
                                    {data.servicio.hospital?.nombre && (
                                      <p className="text-purple-100 text-sm">
                                        🏥 {data.servicio.hospital.nombre}
                                      </p>
                                    )}
                                  </div>
                                </div>
                                <span className="bg-white/20 text-white px-3 py-1 rounded-lg text-sm font-semibold">
                                  {data.items.length} {data.items.length === 1 ? "ítem" : "ítems"}
                                </span>
                              </div>
                            </div>

                            {/* Lista de items del servicio */}
                            <div className="p-4 space-y-3">
                              {data.items.map((inv) => (
                                <div
                                  key={inv.inventarioServicioId}
                                  className="bg-auto-secondary rounded-lg p-4 border border-auto hover:shadow-md transition-shadow"
                                >
                                  <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                      <div className="flex items-center gap-2 mb-2">
                                        <span className={`px-2 py-1 rounded text-xs font-bold ${
                                          inv.medicamento
                                            ? "bg-sky-100 text-sky-800 dark:bg-sky-900/40 dark:text-sky-200"
                                            : "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-200"
                                        }`}>
                                          {inv.medicamento ? "💊 Medicamento" : "🏥 Insumo"}
                                        </span>
                                      </div>
                                      <h4 className="text-lg font-bold text-auto-primary">
                                        {inv.medicamento?.nombre || inv.insumo?.nombre}
                                      </h4>
                                      {inv.medicamento?.descripcion && (
                                        <p className="text-sm text-auto-secondary mt-1 italic">
                                          {inv.medicamento.descripcion}
                                        </p>
                                      )}
                                      {inv.insumo?.categoria && (
                                        <p className="text-sm text-auto-secondary mt-1">
                                          <span className="font-semibold">Categoría:</span>{" "}
                                          {inv.insumo.categoria}
                                        </p>
                                      )}
                                    </div>
                                    <div className="text-right ml-4">
                                      <div className="bg-gradient-to-r from-purple-100 to-purple-200 dark:from-purple-900/40 dark:to-purple-900/30 px-4 py-2 rounded-lg">
                                        <p className="text-xs text-purple-600 dark:text-purple-300 font-medium">
                                          Cantidad Asignada
                                        </p>
                                        <p className="text-2xl font-bold text-purple-800 dark:text-purple-200">
                                          {inv.cantidadAsignada}
                                        </p>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

export default Inventario;
