import "./App.css";
import { Routes, Route } from "react-router-dom";

import AdminNav from "./Components/Admin/AdminNav";
import Login from "./Components/Login";
import AdminHome from "./Components/Admin/AdminHome";
import Footer from "./Components/Footer";
import RegistrarEnfermero from "./Components/Enfermero/RegistrarEnfermero";
import RegistrarMedicamento from "./Components/Medicamentos/RegistrarMedicamento";
import Enfermero from "./Components/Enfermero/Enfermero";
import Inventario from "./Components/Inventario/Inventario";
import Medicamento from "./Components/Medicamentos/Medicamento";
import Insumos from "./Components/Insumos/Insumos";
import RegistrarInsumo from "./Components/Insumos/RegistrarInsumo";

function App() {
  return (
    <div>
      <AdminNav />
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/AdminHome" element={<AdminHome />} />
        <Route path="/Enfermero" element={<Enfermero />} />
        <Route path="/RegistrarEnfermero" element={<RegistrarEnfermero />} />
        <Route path="/Inventario" element={<Inventario />} />
        <Route path="/Medicamento" element={<Medicamento />} />
        <Route
          path="/RegistrarMedicamento"
          element={<RegistrarMedicamento />}
        />
        <Route path="/Insumos" element={<Insumos />} />
        <Route path="/RegistrarInsumo" element={<RegistrarInsumo />} />
      </Routes>
      <Footer />
    </div>
  );
}

export default App;
