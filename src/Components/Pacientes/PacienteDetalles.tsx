import { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";


interface InsumoAsignado {
  pacienteInsumoId: number;
  insumoId: number;
  cantidad: number;
  asignadoEn: string;
  insumo: {
    nombre: string;
  };
}

interface MedicamentoAsignado {
  medicamentoId: number;
  nombre: string;
  dosis: string;
  frecuencia: string;
}

interface Paciente {
  pacienteId: number;
  nombre: string;
  apellidop: string;
  apellidom: string;
  numeroExpediente: string;
  edad?: number | null;
  numeroCama?: string | null;
  numeroHabitacion?: string | null;
  motivoConsulta?: string | null;
  fechaIngreso: string;
  servicioId?: number | null;
}

interface Enfermero {
  enfermeroId: number;
  nombre: string;
  apellidoPaterno: string;
  apellidoMaterno: string;
  numeroEmpleado: string;
  servicioActualId?: number | null;
  habitacionesAsignadas?: string | null;
  habitacionAsignada?: string | null;
}

function PacienteDetalles() {
  const { pacienteId } = useParams<{ pacienteId: string }>();
  const [paciente, setPaciente] = useState<Paciente | null>(null);
  const [enfermeros, setEnfermeros] = useState<Enfermero[]>([]);
  const [medicamentos, setMedicamentos] = useState<MedicamentoAsignado[]>([]);
  const [insumos, setInsumos] = useState<InsumoAsignado[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  // Cargar datos del paciente
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        // Obtener datos del paciente
        const pacienteRes = await axios.get(`http://localhost:5000/api/pacientes/${pacienteId}`);
        let p = pacienteRes.data?.data ?? pacienteRes.data;
        if (Array.isArray(p)) {
          p = p[0] || null;
        }
        setPaciente(p);

        // Obtener insumos asignados
        if (p && p.pacienteId) {
          const insumosRes = await axios.get(`http://localhost:5000/api/insumos/asignados/${p.pacienteId}`);
          let ins: InsumoAsignado[] = [];
          if (Array.isArray(insumosRes.data?.data)) {
            ins = insumosRes.data.data;
          }
          setInsumos(ins);
        }

        // Obtener medicamentos asignados
        if (p && p.pacienteId) {
          const medsRes = await axios.get(`http://localhost:5000/api/medicamentos/asignados/${p.pacienteId}`);
          let meds: MedicamentoAsignado[] = [];
          if (Array.isArray(medsRes.data?.data)) {
            meds = medsRes.data.data.map((m: any) => ({
              medicamentoId: m.medicamento.medicamentoId,
              nombre: m.medicamento.nombre,
              dosis: m.dosis || "",
              frecuencia: m.frecuencia || "",
            }));
          }
          setMedicamentos(meds);
        }

        // Obtener enfermeros del servicio y habitación
        const enfermerosRes = await axios.get("http://localhost:5000/api/enfermeros");
        const allEnfermeros: Enfermero[] = enfermerosRes.data?.data ?? enfermerosRes.data;
        let filtered: Enfermero[] = [];

        // Filtrar por servicio y habitación
        if (p && p.servicioId && p.numeroHabitacion) {
          filtered = allEnfermeros.filter((e) => {
            const matchServicio = e.servicioActualId === p.servicioId;
            let habitaciones = e.habitacionesAsignadas || e.habitacionAsignada || "";
            const habitacionesArr = habitaciones.split(",").map((h: string) => h.trim()).filter(Boolean);
            const matchHabitacion = habitacionesArr.includes(p.numeroHabitacion!);
            return matchServicio && matchHabitacion;
          });
        }

        setEnfermeros(filtered);
      } catch (err) {
        setError("No se pudo cargar la información del paciente o enfermeros");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [pacienteId]);

  // Estado de carga
  if (loading) {
    return (
      <div className="min-h-screen bg-auto-primary pt-20 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-sky-500 mx-auto mb-4"></div>
          <p className="text-auto-secondary font-medium">Cargando información...</p>
        </div>
      </div>
    );
  }

  // Estado de error
  if (error || !paciente) {
    return (
      <div className="min-h-screen bg-auto-primary pt-20 flex items-center justify-center">
        <div className="bg-auto-secondary border border-auto rounded-3xl shadow-2xl p-8 max-w-md w-full">
          <h2 className="text-xl font-bold text-auto-primary text-center mb-2">{error || "Paciente no encontrado"}</h2>
          <button
            onClick={() => navigate(-1)}
            className="mt-4 w-full bg-sky-500 hover:bg-sky-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
          >
            Volver
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-auto-primary pt-20 pb-10">
      <div className="bg-gradient-to-br from-sky-400/15 via-cyan-300/10 to-sky-400/15 h-135 w-full absolute top-0 left-0"></div>
      <div className="relative min-h-screen flex flex-col items-center justify-start">
        <div className="w-full max-w-6xl px-6 py-10">
          {/* Detalles generales */}
          <div className="bg-auto-secondary border border-auto rounded-3xl shadow-2xl p-10 md:p-14 lg:p-16 mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-auto-primary mb-6 text-center tracking-tight">Detalles del Paciente</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-3">
                <p className="text-auto-secondary text-lg"><span className="font-semibold">Nombre:</span> {paciente.nombre} {paciente.apellidop} {paciente.apellidom}</p>
                <p className="text-auto-secondary text-lg"><span className="font-semibold">Expediente:</span> {paciente.numeroExpediente}</p>
                {paciente.edad && <p className="text-auto-secondary text-lg"><span className="font-semibold">Edad:</span> {paciente.edad} años</p>}
                {paciente.numeroCama && <p className="text-auto-secondary text-lg"><span className="font-semibold">Cama:</span> {paciente.numeroCama}</p>}
                {paciente.numeroHabitacion && <p className="text-auto-secondary text-lg"><span className="font-semibold">Habitación:</span> {paciente.numeroHabitacion}</p>}
                <p className="text-auto-secondary text-lg"><span className="font-semibold">Ingreso:</span> {new Date(paciente.fechaIngreso).toLocaleDateString("es-MX")}</p>
                {paciente.motivoConsulta && <p className="text-auto-secondary text-lg"><span className="font-semibold">Motivo de consulta:</span> {paciente.motivoConsulta}</p>}
              </div>
              <div className="flex flex-col items-center justify-center">
                <svg className="w-32 h-32 text-sky-300 mb-2" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                </svg>
              </div>
            </div>
          </div>

          {/* Medicamentos asignados */}
          <div className="bg-auto-secondary border border-auto rounded-3xl shadow-2xl p-8 md:p-10 lg:p-12 mb-8">
            <h2 className="text-2xl font-bold text-sky-700 mb-4 text-center">Medicamentos asignados a este paciente</h2>
            {medicamentos.length === 0 ? (
              <div className="text-auto-tertiary text-base text-center mb-8">No hay medicamentos asignados a este paciente.</div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-2 mb-8">
                {medicamentos.map((med) => (
                  <div
                    key={med.medicamentoId}
                    className="flex flex-col items-center bg-white/90 dark:bg-[#1e293b] border border-sky-200 dark:border-sky-700 rounded-2xl shadow-md px-6 py-6 min-h-[120px]"
                  >
                    <svg className="w-10 h-10 text-sky-500 dark:text-sky-400 mb-2" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 7.5l9 9m0-9l-9 9" />
                    </svg>
                    <div className="font-semibold text-sky-700 dark:text-white text-base text-center">
                      {med.nombre}
                    </div>
                    <div className="text-xs text-auto-secondary dark:text-gray-300 mt-1 text-center">
                      <span className="inline-block bg-sky-100 dark:bg-sky-800 text-sky-700 dark:text-sky-200 rounded px-2 py-0.5 mr-2">
                        Dosis: {med.dosis || "No especificada"}
                      </span>
                      <span className="inline-block bg-cyan-100 dark:bg-cyan-800 text-cyan-700 dark:text-cyan-200 rounded px-2 py-0.5 mt-1">
                        Frecuencia: {med.frecuencia || "No especificada"}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Insumos asignados */}
          <div className="bg-auto-secondary border border-auto rounded-3xl shadow-2xl p-8 md:p-10 lg:p-12 mb-8">
            <h2 className="text-2xl font-bold text-sky-700 mb-4 text-center">Insumos asignados a este paciente</h2>
            {insumos.length === 0 ? (
              <div className="text-auto-tertiary text-base text-center mb-8">No hay insumos asignados a este paciente.</div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-2 mb-8">
                {insumos.map((asig) => (
                  <div
                    key={asig.pacienteInsumoId}
                    className="flex flex-col items-center bg-white/90 dark:bg-[#1e293b] border border-cyan-200 dark:border-cyan-700 rounded-2xl shadow-md px-6 py-6 min-h-[100px]"
                  >
                    <svg className="w-10 h-10 text-cyan-500 dark:text-cyan-400 mb-2" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5" fill="none" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h8M12 8v8" />
                    </svg>
                    <div className="font-semibold text-cyan-700 dark:text-white text-base text-center">
                      {asig.insumo.nombre}
                    </div>
                    <div className="text-xs text-auto-secondary dark:text-gray-300 mt-1 text-center">
                      <span className="inline-block bg-cyan-100 dark:bg-cyan-800 text-cyan-700 dark:text-cyan-200 rounded px-2 py-0.5 mr-2">Cantidad: {asig.cantidad}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Enfermeros asignados */}
          <div className="bg-auto-secondary border border-auto rounded-3xl shadow-2xl p-8 md:p-10 lg:p-12">
            <h2 className="text-2xl font-bold text-sky-700 mb-4 text-center">Enfermeros asignados a este paciente</h2>
            {enfermeros.length === 0 ? (
              <div className="text-auto-tertiary text-base text-center">No hay enfermeros asignados a este paciente según su cuarto y servicio.</div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-2">
                {enfermeros.map((enf) => (
                  <div
                    key={enf.enfermeroId}
                    className="flex flex-col items-center bg-white/90 dark:bg-[#1e293b] border border-sky-200 dark:border-sky-700 rounded-2xl shadow-md px-6 py-6 transition-transform hover:scale-[1.03] hover:shadow-lg min-h-[160px]"
                  >
                    <svg className="w-12 h-12 text-sky-500 dark:text-sky-400 mb-2" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232a3 3 0 11-4.264 4.264m4.264-4.264a3 3 0 014.243 4.243m-4.243-4.243L12 8.5m0 0l-3.232-3.268m3.232 3.268V21m0-12.5l3.232-3.268M12 8.5L8.768 5.232" />
                    </svg>
                    <div className="font-semibold text-sky-700 dark:text-white text-lg text-center">
                      {enf.nombre} {enf.apellidoPaterno} {enf.apellidoMaterno}
                    </div>
                    <div className="text-xs text-auto-secondary dark:text-gray-300 mt-1 text-center">
                      <span className="inline-block bg-sky-100 dark:bg-sky-800 text-sky-700 dark:text-sky-200 rounded px-2 py-0.5 mr-2">#{enf.numeroEmpleado}</span>
                      {enf.habitacionesAsignadas || enf.habitacionAsignada ? (
                        <span className="inline-block bg-cyan-100 dark:bg-cyan-800 text-cyan-700 dark:text-cyan-200 rounded px-2 py-0.5 mt-1">
                          Habitación: {enf.habitacionesAsignadas || enf.habitacionAsignada}
                        </span>
                      ) : null}
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            <button
              onClick={() => navigate(-1)}
              className="mt-8 w-full bg-sky-500 hover:bg-sky-600 text-white font-semibold py-3 px-4 rounded-lg text-lg transition-colors shadow-md"
            >
              Volver
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PacienteDetalles;
