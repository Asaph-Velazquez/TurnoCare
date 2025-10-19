import React, { useState, useEffect } from "react";
import FormLayout from "../utilities/Form/FormLayout";
import TextField from "../utilities/Form/TextField";
import SelectField from "../utilities/Form/SelectField";
import SubmitButton from "../utilities/Form/SubmitButton";
import axios from "axios";
import type { Field } from "./serviceFields";

interface FormServiceProps {
  action: "RegistrarServicio" | "ListarServicios" | "ActualizarServicio" | "EliminarServicio";
  fields: Field[];
  onBack?: () => void;
}

interface Service {
  id: number;
  nombre: string;
  descripcion: string;
  capacidadmaxima: number;
  personalasignado: number;
  hospitalid: number;
}

const FormService: React.FC<FormServiceProps> = ({ action, fields, onBack }) => {
  const initialFormState = fields.reduce((acc, field) => {
    acc[field.name] = "";
    return acc;
  }, {} as Record<string, string>);

  const [form, setForm] = useState(initialFormState);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState<{ type: string; message: string } | null>(null);


  const [services, setServices] = useState<Service[]>([]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // Efecto para listar servicios cuando action === "ListarServicios"
  useEffect(() => {
    if (action === "ListarServicios") {
      const fetchServices = async () => {
        setLoading(true);
        try {
          const response = await axios.get("http://localhost:5000/api/servicios/listServices");
          setServices(response.data);
        } catch (error) {
          console.error(error);
          setAlert({ type: "danger", message: "Error al obtener los servicios" });
        } finally {
          setLoading(false);
        }
      };
      fetchServices();
    }
  }, [action]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAlert(null);
    setLoading(true);

    try {
      const payload: Record<string, any> = { ...form };
      fields.forEach((field) => {
        if (field.type === "number" && payload[field.name] !== "") {
          payload[field.name] = Number(payload[field.name]);
        }
      });

      let response;
      switch (action) {
        case "RegistrarServicio":
          response = await axios.post("http://localhost:5000/api/servicios/createService", payload);
          break;
        case "ActualizarServicio":
          response = await axios.put(`http://localhost:5000/api/servicios/updateService/${form.id}`, payload);
          break;
        case "EliminarServicio":
          response = await axios.delete(`http://localhost:5000/api/servicios/deleteService/${form.id}`);
          break;
        case "ListarServicios":
          return;
      }

      setAlert({ type: "success", message: "Operación realizada correctamente" });
      setForm(initialFormState);
      console.log(response?.data);
    } catch (error: any) {
      console.error(error);
      setAlert({
        type: "danger",
        message: error.response?.data?.error || "Error al ejecutar la operación",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-auto-primary pt-20 relative">
      <div className="bg-gradient-to-br from-sky-400/15 via-cyan-300/10 to-sky-400/15 h-full w-full absolute top-0 left-0"></div>

      <div className="relative z-10">
        <FormLayout title={action} onSubmit={handleSubmit} widthClass="max-w-4xl">
          {action === "ListarServicios" ? (
            <div>
              {loading ? (
                <p>Cargando servicios...</p>
              ) : services.length === 0 ? (
                <p>No hay servicios registrados.</p>
              ) : (
                <table className="w-full table-auto border border-auto rounded-xl">
                  <thead className="bg-auto-secondary">
                    <tr>
                      <th className="border px-4 py-2">ID</th>
                      <th className="border px-4 py-2">Nombre</th>
                      <th className="border px-4 py-2">Descripción</th>
                      <th className="border px-4 py-2">Capacidad</th>
                      <th className="border px-4 py-2">Personal</th>
                      <th className="border px-4 py-2">Hospital ID</th>
                    </tr>
                  </thead>
                  <tbody>
                    {services.map((s) => (
                      <tr key={s.id}>
                        <td className="border px-4 py-2">{s.id}</td>
                        <td className="border px-4 py-2">{s.nombre}</td>
                        <td className="border px-4 py-2">{s.descripcion}</td>
                        <td className="border px-4 py-2">{s.capacidadmaxima}</td>
                        <td className="border px-4 py-2">{s.personalasignado}</td>
                        <td className="border px-4 py-2">{s.hospitalid}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {fields.map((field) =>
                field.type === "select" ? (
                  <SelectField
                    key={field.name}
                    label={field.label}
                    name={field.name}
                    value={form[field.name]}
                    onChange={handleChange as any}
                    options={field.options || []}
                  />
                ) : (
                  <TextField
                    key={field.name}
                    label={field.label}
                    name={field.name}
                    value={form[field.name]}
                    onChange={handleChange as any}
                    required={field.required}
                  />
                )
              )}
            </div>
          )}

          {action !== "ListarServicios" && (
            <div className="mt-6">
              <SubmitButton label={loading ? "Procesando..." : action} />
            </div>
          )}

          {alert && (
            <div
              className={`mt-4 p-4 rounded-xl ${
                alert.type === "success"
                  ? "bg-green-100 text-green-800 border border-green-300"
                  : "bg-red-100 text-red-800 border border-red-300"
              }`}
            >
              {alert.message}
            </div>
          )}

          {onBack && (
            <div className="mt-6">
              <button
                type="button"
                onClick={onBack}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-xl hover:bg-gray-300 transition"
              >
                Volver
              </button>
            </div>
          )}
        </FormLayout>
      </div>
    </div>
  );
};

export default FormService;
