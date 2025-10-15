import React, { useState } from "react";

const RegistrarHospital: React.FC = () => {
  const [form, setForm] = useState({
    nombre: "",
    direccion: "",
    telefono: "",
  });
  const [mensaje, setMensaje] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMensaje("");
    try {
      const response = await fetch("http://localhost:3001/api/hospital", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });
      if (response.ok) {
        setMensaje("¡Información registrada correctamente!");
        setForm({ nombre: "", direccion: "", telefono: "" });
      } else {
        setMensaje("Error al registrar la información.");
      }
    } catch (error) {
      setMensaje("Error de conexión con el servidor.");
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-32">
      <div className="bg-auto-secondary backdrop-blur-sm border border-auto rounded-3xl shadow-2xl p-8">
        <h2 className="text-2xl font-bold text-auto-primary mb-6 text-center">
          Registrar Información del Hospital
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label className="block mb-2 font-medium text-auto-primary">
              Nombre del hospital
            </label>
            <input
              type="text"
              name="nombre"
              value={form.nombre}
              onChange={handleChange}
              required
              className="w-full border border-auto rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-sky-400 bg-auto-secondary text-auto-primary"
              placeholder="Ejemplo: Hospital Central"
            />
          </div>
          <div className="mb-6">
            <label className="block mb-2 font-medium text-auto-primary">
              Dirección
            </label>
            <input
              type="text"
              name="direccion"
              value={form.direccion}
              onChange={handleChange}
              required
              className="w-full border border-auto rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-sky-400 bg-auto-secondary text-auto-primary"
              placeholder="Ejemplo: Calle 123, Ciudad"
            />
          </div>
          <div className="mb-8">
            <label className="block mb-2 font-medium text-auto-primary">
              Teléfono
            </label>
            <input
              type="text"
              name="telefono"
              value={form.telefono}
              onChange={handleChange}
              required
              className="w-full border border-auto rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-sky-400 bg-auto-secondary text-auto-primary"
              placeholder="Ejemplo: 555-1234567"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-sky-500 to-cyan-500 text-white py-3 rounded-xl font-semibold text-lg shadow hover:scale-105 transition-transform"
          >
            Registrar Hospital
          </button>
        </form>
        {mensaje && (
          <div className="mt-4 text-center text-auto-primary font-semibold">
            {mensaje}
          </div>
        )}
      </div>
    </div>
  );
};

export default RegistrarHospital;
