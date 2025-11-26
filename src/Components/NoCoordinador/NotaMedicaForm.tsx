import axios from "axios";
import { useState } from "react";
import EnfermeroNav from "./EnfermeroNav";

type Medicamento = {
  nombre: string;
  dosis: string;
  frecuencia: string;
  cantidad: string;
};

type Insumo = {
  nombre: string;
  cantidad: string;
  notas: string;
};

function NotaMedicaForm() {
  const [pacienteId, setPacienteId] = useState("");
  const [enfermeroId, setEnfermeroId] = useState("");
  const [observaciones, setObservaciones] = useState("");
  const [nombrePaciente, setNombrePaciente] = useState("");
  const [nombreHospital, setNombreHospital] = useState("");
  const [servicio, setServicio] = useState("");
  const [habitacion, setHabitacion] = useState("");
  const [cama, setCama] = useState("");
  const [nombreEnfermeroAlta, setNombreEnfermeroAlta] = useState("");
  const [nombreEnfermeroAsignado, setNombreEnfermeroAsignado] = useState("");
  const [medicamentos, setMedicamentos] = useState<Medicamento[]>([
    { nombre: "", dosis: "", frecuencia: "", cantidad: "" },
  ]);
  const [insumos, setInsumos] = useState<Insumo[]>([
    { nombre: "", cantidad: "", notas: "" },
  ]);
  const [feedback, setFeedback] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleMedicamentoChange = (
    index: number,
    field: keyof Medicamento,
    value: string
  ) => {
    setMedicamentos((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], [field]: value };
      return next;
    });
  };

  const handleInsumoChange = (
    index: number,
    field: keyof Insumo,
    value: string
  ) => {
    setInsumos((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], [field]: value };
      return next;
    });
  };

  const addMedicamento = () => {
    setMedicamentos((prev) => [
      ...prev,
      { nombre: "", dosis: "", frecuencia: "", cantidad: "" },
    ]);
  };

  const removeMedicamento = (index: number) => {
    setMedicamentos((prev) => prev.filter((_, i) => i !== index));
  };

  const addInsumo = () => {
    setInsumos((prev) => [...prev, { nombre: "", cantidad: "", notas: "" }]);
  };

  const removeInsumo = (index: number) => {
    setInsumos((prev) => prev.filter((_, i) => i !== index));
  };

  const isFormValid = () => {
    const datosBasicos = [
      pacienteId,
      nombrePaciente,
      enfermeroId,
      nombreEnfermeroAlta,
      nombreEnfermeroAsignado,
      servicio,
      nombreHospital,
      cama,
      habitacion,
      observaciones,
    ];

    return datosBasicos.every((value) => value.trim());
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!isFormValid()) {
      setFeedback({
        type: "error",
        message: "Por favor completa todos los campos obligatorios.",
      });
      return;
    }

    setIsSubmitting(true);
    setFeedback(null);

    try {
      await axios.post("http://localhost:5000/api/notas-medicas", {
        pacienteId,
        nombrePaciente,
        enfermeroId,
        nombreEnfermeroAlta,
        nombreEnfermeroAsignado,
        servicio,
        nombreHospital,
        habitacion,
        cama,
        observaciones,
        medicamentos: medicamentos
          .filter((med) => med.nombre.trim())
          .map((med) => ({
            nombre: med.nombre,
            dosis: med.dosis,
            frecuencia: med.frecuencia,
            cantidad: med.cantidad,
          })),
        insumos: insumos.filter((insumo) => insumo.nombre.trim()),
      });
      setFeedback({
        type: "success",
        message: "Nota médica guardada correctamente.",
      });
      setPacienteId("");
      setEnfermeroId("");
      setObservaciones("");
      setNombrePaciente("");
      setNombreHospital("");
      setServicio("");
      setHabitacion("");
      setCama("");
      setNombreEnfermeroAlta("");
      setNombreEnfermeroAsignado("");
      setInsumos([{ nombre: "", cantidad: "", notas: "" }]);
      setMedicamentos([
        { nombre: "", dosis: "", frecuencia: "", cantidad: "" },
      ]);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Error desconocido";
      setFeedback({ type: "error", message });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-auto-primary">
      <EnfermeroNav />
      <div className="bg-gradient-to-br from-sky-400/15 via-cyan-300/10 to-sky-400/15 w-full h-full absolute"></div>
      <div className="relative min-h-screen pt-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="bg-auto-secondary backdrop-blur-sm border border-auto rounded-3xl shadow-2xl p-8 space-y-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-auto-primary">
                  Registro de Nota Médica
                </h1>
                <p className="text-auto-secondary mt-1">
                  Completa los datos clínicos del paciente
                </p>
              </div>
              <div className="bg-gradient-to-r from-sky-500 to-cyan-500 rounded-2xl px-4 py-2 text-white text-sm font-semibold">
                {isSubmitting ? "Guardando…" : "Formulario Clínico"}
              </div>
            </div>

            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="space-y-4">
                <p className="text-sm font-semibold text-auto-primary">
                  Información del paciente
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <label className="flex flex-col gap-2 text-sm font-semibold text-auto-tertiary">
                    Nombre del paciente
                    <input
                      type="text"
                      value={nombrePaciente}
                      onChange={(e) => setNombrePaciente(e.target.value)}
                      placeholder="Ej. Juan Pérez"
                      className="rounded-2xl border border-auto px-3 py-2 bg-auto-primary text-auto-primary focus:border-sky-500"
                    />
                  </label>
                  <label className="flex flex-col gap-2 text-sm font-semibold text-auto-tertiary">
                    ID del Paciente
                    <input
                      type="text"
                      value={pacienteId}
                      onChange={(e) => setPacienteId(e.target.value)}
                      placeholder="Ej. 823"
                      className="rounded-2xl border border-auto px-3 py-2 bg-auto-primary text-auto-primary focus:border-sky-500"
                    />
                  </label>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <label className="flex flex-col gap-2 text-sm font-semibold text-auto-tertiary">
                    Hospital
                    <input
                      type="text"
                      value={nombreHospital}
                      onChange={(e) => setNombreHospital(e.target.value)}
                      placeholder="Ej. Hospital General"
                      className="rounded-2xl border border-auto px-3 py-2 bg-auto-primary text-auto-primary focus:border-sky-500"
                    />
                  </label>
                  <label className="flex flex-col gap-2 text-sm font-semibold text-auto-tertiary">
                    Servicio
                    <input
                      type="text"
                      value={servicio}
                      onChange={(e) => setServicio(e.target.value)}
                      placeholder="Ej. Terapia intensiva"
                      className="rounded-2xl border border-auto px-3 py-2 bg-auto-primary text-auto-primary focus:border-sky-500"
                    />
                  </label>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <label className="flex flex-col gap-2 text-sm font-semibold text-auto-tertiary">
                    Habitación
                    <input
                      type="text"
                      value={habitacion}
                      onChange={(e) => setHabitacion(e.target.value)}
                      placeholder="Ej. 203"
                      className="rounded-2xl border border-auto px-3 py-2 bg-auto-primary text-auto-primary focus:border-sky-500"
                    />
                  </label>
                  <label className="flex flex-col gap-2 text-sm font-semibold text-auto-tertiary">
                    Cama
                    <input
                      type="text"
                      value={cama}
                      onChange={(e) => setCama(e.target.value)}
                      placeholder="Ej. Cama 4"
                      className="rounded-2xl border border-auto px-3 py-2 bg-auto-primary text-auto-primary focus:border-sky-500"
                    />
                  </label>
                </div>
              </div>
              <div className="space-y-4">
                <p className="text-sm font-semibold text-auto-primary">
                  Enfermeros
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <label className="flex flex-col gap-2 text-sm font-semibold text-auto-tertiary">
                    Enfermero (da de alta)
                    <input
                      type="text"
                      value={nombreEnfermeroAlta}
                      onChange={(e) => setNombreEnfermeroAlta(e.target.value)}
                      placeholder="Ej. Ana Gómez"
                      className="rounded-2xl border border-auto px-3 py-2 bg-auto-primary text-auto-primary focus:border-sky-500"
                    />
                  </label>
                  <label className="flex flex-col gap-2 text-sm font-semibold text-auto-tertiary">
                    Enfermero asignado
                    <input
                      type="text"
                      value={nombreEnfermeroAsignado}
                      onChange={(e) =>
                        setNombreEnfermeroAsignado(e.target.value)
                      }
                      placeholder="Ej. Luis Torres"
                      className="rounded-2xl border border-auto px-3 py-2 bg-auto-primary text-auto-primary focus:border-sky-500"
                    />
                  </label>
                </div>
                <label className="flex flex-col gap-2 text-sm font-semibold text-auto-tertiary">
                  ID del Enfermero
                  <input
                    type="text"
                    value={enfermeroId}
                    onChange={(e) => setEnfermeroId(e.target.value)}
                    placeholder="Ej. 1041"
                    className="rounded-2xl border border-auto px-3 py-2 bg-auto-primary text-auto-primary focus:border-sky-500"
                  />
                </label>
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold text-auto-tertiary">
                    Medicamentos prescritos
                  </p>
                  <button
                    type="button"
                    onClick={addMedicamento}
                    className="text-sm font-semibold text-sky-600 hover:text-sky-500"
                  >
                    + Agregar
                  </button>
                </div>
                <div className="space-y-3">
                  {medicamentos.map((med, index) => (
                    <div
                      key={index}
                      className="bg-auto-primary/40 border border-auto rounded-2xl p-4 space-y-3"
                    >
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-semibold text-auto-tertiary">
                          Medicamento {index + 1}
                        </span>
                        {medicamentos.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeMedicamento(index)}
                            className="text-xs text-red-500 hover:text-red-400"
                          >
                            Eliminar
                          </button>
                        )}
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                        <input
                          type="text"
                          value={med.nombre}
                          onChange={(e) =>
                            handleMedicamentoChange(
                              index,
                              "nombre",
                              e.target.value
                            )
                          }
                          placeholder="Nombre"
                          className="rounded-2xl border border-auto px-3 py-2 bg-auto-secondary text-auto-primary focus:border-sky-500"
                        />
                        <input
                          type="text"
                          value={med.dosis}
                          onChange={(e) =>
                            handleMedicamentoChange(
                              index,
                              "dosis",
                              e.target.value
                            )
                          }
                          placeholder="Dosis"
                          className="rounded-2xl border border-auto px-3 py-2 bg-auto-secondary text-auto-primary focus:border-sky-500"
                        />
                        <input
                          type="text"
                          value={med.frecuencia}
                          onChange={(e) =>
                            handleMedicamentoChange(
                              index,
                              "frecuencia",
                              e.target.value
                            )
                          }
                          placeholder="Frecuencia"
                          className="rounded-2xl border border-auto px-3 py-2 bg-auto-secondary text-auto-primary focus:border-sky-500"
                        />
                        <input
                          type="text"
                          value={med.cantidad}
                          onChange={(e) =>
                            handleMedicamentoChange(
                              index,
                              "cantidad",
                              e.target.value
                            )
                          }
                          placeholder="Cantidad"
                          className="rounded-2xl border border-auto px-3 py-2 bg-auto-secondary text-auto-primary focus:border-sky-500"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold text-auto-tertiary">
                    Insumos utilizados
                  </p>
                  <button
                    type="button"
                    onClick={addInsumo}
                    className="text-sm font-semibold text-sky-600 hover:text-sky-500"
                  >
                    + Añadir insumo
                  </button>
                </div>
                <div className="space-y-3">
                  {insumos.map((insumo, index) => (
                    <div
                      key={index}
                      className="bg-auto-primary/40 border border-auto rounded-2xl p-4 space-y-3"
                    >
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-semibold text-auto-tertiary">
                          Insumo {index + 1}
                        </span>
                        {insumos.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeInsumo(index)}
                            className="text-xs text-red-500 hover:text-red-400"
                          >
                            Eliminar
                          </button>
                        )}
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <input
                          type="text"
                          value={insumo.nombre}
                          onChange={(e) =>
                            handleInsumoChange(index, "nombre", e.target.value)
                          }
                          placeholder="Nombre"
                          className="rounded-2xl border border-auto px-3 py-2 bg-auto-secondary text-auto-primary focus:border-sky-500"
                        />
                        <input
                          type="text"
                          value={insumo.cantidad}
                          onChange={(e) =>
                            handleInsumoChange(
                              index,
                              "cantidad",
                              e.target.value
                            )
                          }
                          placeholder="Cantidad"
                          className="rounded-2xl border border-auto px-3 py-2 bg-auto-secondary text-auto-primary focus:border-sky-500"
                        />
                        <input
                          type="text"
                          value={insumo.notas}
                          onChange={(e) =>
                            handleInsumoChange(index, "notas", e.target.value)
                          }
                          placeholder="Notas"
                          className="rounded-2xl border border-auto px-3 py-2 bg-auto-secondary text-auto-primary focus:border-sky-500"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex flex-col gap-2 text-sm font-semibold text-auto-tertiary">
                Observaciones clínicas
                <textarea
                  value={observaciones}
                  onChange={(e) => setObservaciones(e.target.value)}
                  rows={5}
                  placeholder="Describe síntomas, evolución y notas relevantes"
                  className="rounded-3xl border border-auto px-4 py-3 bg-auto-primary text-auto-primary focus:border-sky-500"
                />
              </div>

              {feedback && (
                <div
                  className={`rounded-2xl px-4 py-3 text-sm font-semibold ${
                    feedback.type === "success"
                      ? "bg-emerald-500/20 text-emerald-500"
                      : "bg-rose-500/10 text-rose-500"
                  }`}
                >
                  {feedback.message}
                </div>
              )}

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-3 rounded-2xl bg-gradient-to-r from-sky-500 to-cyan-500 text-white font-semibold shadow-xl disabled:opacity-50"
                >
                  Guardar nota
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default NotaMedicaForm;
