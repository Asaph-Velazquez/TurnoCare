import { useState } from "react";
import axios from "axios";
import FormLayout from "../utilities/Form/FormLayout";
import TextField from "../utilities/Form/TextField";
import SubmitButton from "../utilities/Form/SubmitButton";

function EliminarHospital() {
  const [hospitalId, setHospitalId] = useState("");
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState<{ type: string; message: string } | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setHospitalId(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAlert(null);
    setLoading(true);

    

    try {
        console.log("🧾 ID a eliminar:", hospitalId);

      const response = await axios.delete(`http://localhost:5000/api/hospital/${hospitalId}`);
      console.log("✅ Hospital eliminado:", response.data);
      setAlert({ type: "success", message: "Hospital eliminado exitosamente" });
      setHospitalId("");
    } catch (error: any) {
      console.error("❌ Error al eliminar hospital:", error);
      let errorMessage = "Error al eliminar hospital";
      if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
      } else if (error.message) {
        errorMessage = error.message;
      }
      setAlert({ type: "danger", message: errorMessage });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-auto-primary pt-20">
      <div className="bg-gradient-to-br from-sky-400/15 via-cyan-300/10 to-sky-400/15 w-full h-full absolute top-0 left-0"></div>
      <div className="relative min-h-screen">
        <main className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10 py-10">
          <FormLayout title="Eliminar Hospital" onSubmit={handleSubmit} widthClass="max-w-3xl">
            <TextField
              label="ID del hospital a eliminar"
              name="hospitalId"
              value={hospitalId}
              onChange={handleChange}
              required
            />

            <div className="mt-6">
              <SubmitButton label={loading ? "Eliminando..." : "Eliminar"} />
            </div>

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
          </FormLayout>
        </main>
      </div>
    </div>
  );
}

export default EliminarHospital;
