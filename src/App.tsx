import "./App.css";
import { Routes, Route } from "react-router-dom";

import AdminNav from "./Components/Admin/AdminNav";
import Login from "./Components/Login";
import AdminHome from "./Components/Admin/AdminHome";
import RegistrarEnfermero from "./Components/Enfermero/RegistrarEnfermero";
import EliminarEnfermero from "./Components/Enfermero/EliminarEnfermero";
import Enfermero from "./Components/Enfermero/Enfermero";
import ActualizarEnfermero from "./Components/Enfermero/ActualizarEnfermero";
import Footer from "./Components/Footer";
import RegistrarHospital from "./Components/Hospital/RegistrarHospital";
import Hospital from "./Components/Hospital/Hospital";
import RegistrarMedicamento from "./Components/Medicamentos/RegistrarMedicamento";
import Medicamento from "./Components/Medicamentos/Medicamento";
import ActualizarMedicamento from "./Components/Medicamentos/ActualizarMedicamento";
import EliminarMedicamento from "./Components/Medicamentos/EliminarMedicamento";
import Inventario from "./Components/Inventario/Inventario";
import Insumos from "./Components/Insumos/Insumos";
import RegistrarInsumo from "./Components/Insumos/RegistrarInsumo";
import ActualizarInsumo from "./Components/Insumos/ActualizarInsumo";
import EliminarInsumo from "./Components/Insumos/EliminarInsumo";

function App() {
  return (
    <div>
      <AdminNav />
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/AdminHome" element={<AdminHome />} />
        <Route path="/Enfermero" element={<Enfermero />} />
        <Route path="/RegistrarEnfermero" element={<RegistrarEnfermero />} />
        <Route path="/EliminarEnfermero" element={<EliminarEnfermero />} />
        <Route path="/ActualizarEnfermero" element={<ActualizarEnfermero />} />
        <Route path="/RegistrarHospital" element={<RegistrarHospital />} />
        <Route path="/Hospital" element={<Hospital />} />
        <Route path="/Inventario" element={<Inventario />} />
        <Route path="/Medicamento" element={<Medicamento />} />
        <Route
          path="/RegistrarMedicamento"
          element={<RegistrarMedicamento />}
        />
        <Route
          path="/ActualizarMedicamento"
          element={<ActualizarMedicamento />}
        />
        <Route path="/EliminarMedicamento" element={<EliminarMedicamento />} />
        <Route path="/Insumos" element={<Insumos />} />
        <Route path="/RegistrarInsumo" element={<RegistrarInsumo />} />
        <Route path="/ActualizarInsumo" element={<ActualizarInsumo />} />
        <Route path="/EliminarInsumo" element={<EliminarInsumo />} />
      </Routes>
      <Footer />
    </div>
  );
}

export default App;
