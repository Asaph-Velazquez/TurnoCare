import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import TextField from "../utilities/Form/TextField";
import SelectField from "../utilities/Form/SelectField";
import UpdateCard from "../utilities/DeleteUpdate/Update";

type Insumo = {
  insumoId: number;
  nombre: string;
  descripcion: string | null;
  categoria: string | null;
  cantidadDisponible: number;
  unidadMedida: string | null;
  ubicacion: string | null;
  responsableId: number | null;
  actualizadoEn: string | null;
};

type AlertState = { type: "success" | "danger"; message: string } | null;

const CATEGORIAS = ["Material Médico", "Equipo", "Farmacia", "Protección"];

export default function ActualizarInsumo() {
  const [insumos, setInsumos] = useState<Insumo[]>([]);
  const [filtered, setFiltered] = useState<Insumo[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loadingList, setLoadingList] = useState(true);
  const [saving, setSaving] = useState(false);
  const [alert, setAlert] = useState<AlertState>(null);

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
    } catch (error) {setInsumos([]);
      setFiltered([]);
    } finally {
      setLoadingList(false);
    }
  };

  const categoriaOptions = useMemo(
    () => CATEGORIAS.map((value) => ({ value, label: value })),
    []
  );

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
              <div className="bg-gradient-to-br from-sky-500 to-sky-600 p-3 rounded-xl shadow-lg">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-white"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M4.25 4A2.25 2.25 0 0 0 2 6.25v8.5A2.25 2.25 0 0 0 4.25 17h5.545l6.075 3.65a.75.75 0 0 0 1.13-.65V17h2.75A2.25 2.25 0 0 0 22 14.75v-8.5A2.25 2.25 0 0 0 19.75 4Z" />
                </svg>
              </div>
              <div>
                <h2 className="text-3xl font-bold text-auto-primary">
                  Actualizar Insumo
                </h2>
                <p className="text-auto-secondary text-sm">
                  Mantén los suministros al día
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
              <UpdateCard
                items={filtered}
                searchTerm={searchTerm}
                onClearSearch={searchTerm ? () => setSearchTerm("") : undefined}
                emptyMessage="No se encontraron insumos"
                getKey={(ins) => ins.insumoId}
                saving={saving}
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
                buildForm={(ins) => ({
                  ...ins,
                  descripcion: ins.descripcion ?? "",
                  categoria: ins.categoria ?? "",
                  cantidadDisponible: `${ins.cantidadDisponible ?? ""}`,
                  unidadMedida: ins.unidadMedida ?? "",
                  ubicacion: ins.ubicacion ?? "",
                  responsableId: ins.responsableId
                    ? `${ins.responsableId}`
                    : "",
                })}
                renderEditor={(form, onFieldChange) => (
                  <div className="grid gap-3 md:grid-cols-2">
                    <TextField
                      label="Nombre"
                      name="nombre"
                      value={form.nombre ?? ""}
                      onChange={(e) => onFieldChange("nombre", e.target.value)}
                      required
                    />
                    <TextField
                      label="Descripción"
                      name="descripcion"
                      value={form.descripcion ?? ""}
                      onChange={(e) =>
                        onFieldChange("descripcion", e.target.value)
                      }
                      placeholder="Detalle del insumo"
                    />
                    <SelectField
                      label="Categoría"
                      name="categoria"
                      value={form.categoria ?? ""}
                      onChange={(e) =>
                        onFieldChange("categoria", e.target.value)
                      }
                      options={categoriaOptions}
                    />
                    <TextField
                      label="Cantidad disponible"
                      name="cantidadDisponible"
                      type="number"
                      value={form.cantidadDisponible ?? ""}
                      onChange={(e) =>
                        onFieldChange("cantidadDisponible", e.target.value)
                      }
                      required
                    />
                    <TextField
                      label="Unidad de medida"
                      name="unidadMedida"
                      value={form.unidadMedida ?? ""}
                      onChange={(e) =>
                        onFieldChange("unidadMedida", e.target.value)
                      }
                      placeholder="Piezas, cajas, litros..."
                    />
                    <TextField
                      label="Ubicación"
                      name="ubicacion"
                      value={form.ubicacion ?? ""}
                      onChange={(e) =>
                        onFieldChange("ubicacion", e.target.value)
                      }
                      placeholder="Ej. Almacén central"
                    />
                    <TextField
                      label="ID responsable"
                      name="responsableId"
                      value={form.responsableId ?? ""}
                      onChange={(e) =>
                        onFieldChange("responsableId", e.target.value)
                      }
                      placeholder="ID de enfermero o responsable"
                    />
                  </div>
                )}
                onSave={async (ins, formState) => {
                  setSaving(true);
                  setAlert(null);
                  try {
                    const cantidadRaw = `${
                      formState.cantidadDisponible ?? ""
                    }`.trim();
                    const responsableRaw = `${
                      formState.responsableId ?? ""
                    }`.trim();

                    const payload = {
                      nombre: formState.nombre,
                      descripcion: formState.descripcion || null,
                      categoria: formState.categoria || null,
                      cantidadDisponible:
                        cantidadRaw === "" ? null : Number(cantidadRaw),
                      unidadMedida: formState.unidadMedida || null,
                      ubicacion: formState.ubicacion || null,
                      responsableId:
                        responsableRaw === "" ? null : Number(responsableRaw),
                    };

                    await axios.put(
                      `http://localhost:5000/api/insumos/${ins.insumoId}`,
                      payload
                    );

                    setAlert({
                      type: "success",
                      message: "Insumo actualizado correctamente",
                    });
                    await fetchInsumos();
                  } catch (error: any) {const message =
                      error?.response?.data?.error ||
                      error?.message ||
                      "Error al actualizar insumo";
                    setAlert({ type: "danger", message });
                    throw error;
                  } finally {
                    setSaving(false);
                  }
                }}
              />
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
