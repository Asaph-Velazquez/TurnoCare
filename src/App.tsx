import "./App.css";
import { Routes, Route } from "react-router-dom";

import AdminNav from "./Components/Admin/AdminNav";
import Login from "./Components/Login";
import AdminHome from "./Components/Admin/AdminHome";
import RegistrarEnfermero from "./Components/Enfermero/RegistrarEnfermero";
import EliminarEnfermero from "./Components/Enfermero/EliminarEnfermero";
import Enfermero from "./Components/Enfermero/Enfermero";
import ActualizarEnfermero from "./Components/Enfermero/ActualizarEnfermero";
import Detalles from "./Components/Enfermero/Detalles";
import AsignarPaciente from "./Components/Enfermero/AsignarPaciente";
import Footer from "./Components/Footer";
import RegistrarHospital from "./Components/Hospital/RegistrarHospital";
import ActualizarHospital from "./Components/Hospital/ActualizarHospital";
import EliminarHospital from "./Components/Hospital/EliminarHospital";
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
import Pacientes from "./Components/Pacientes/Pacientes";
import RegistrarPacientes from "./Components/Pacientes/RegistrarPacientes";
import Service from "./Components/Services/Service";
import RegistrarServicio from "./Components/Services/RegistrarServicio";
import ListarServicios from "./Components/Services/ListarServicios";
import ActualizarServicio from "./Components/Services/ActualizarServicio";
import EliminarServicio from "./Components/Services/EliminarServicio";
import EliminarPacientes from './Components/Pacientes/EliminarPacientes';
import ActualizarPacientes from './Components/Pacientes/ActualizarPacientes';

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
        <Route path="/Enfermeros/Detalles" element={<Detalles />} />
        <Route path="/AsignarPaciente" element={<AsignarPaciente />} />
        <Route path="/RegistrarHospital" element={<RegistrarHospital />} />
        <Route path="/ActualizarHospital" element={<ActualizarHospital />} />
        <Route path="/EliminarHospital" element={<EliminarHospital />} />
        <Route path="/Hospital" element={<Hospital />} />
        <Route path="/pacientes" element={<Pacientes />} />
        <Route path="/pacientes/registrar" element={<RegistrarPacientes />} />
        <Route path="/Servicios" element={<Service />} />
        <Route path="/RegistrarServicio" element={<RegistrarServicio />} />
        <Route path="/ListarServicios" element={<ListarServicios />} />
        <Route path="/ActualizarServicio" element={<ActualizarServicio />} />
        <Route path="/EliminarServicio" element={<EliminarServicio />} />
        <Route path="/Inventario" element={<Inventario />} />
        <Route path="/Medicamento" element={<Medicamento />} />
        <Route path="/RegistrarMedicamento" element={<RegistrarMedicamento />}/>
        <Route path="/ActualizarMedicamento" element={<ActualizarMedicamento />}/>
        <Route path="/EliminarMedicamento" element={<EliminarMedicamento />} />
        <Route path="/Insumos" element={<Insumos />} />
        <Route path="/RegistrarInsumo" element={<RegistrarInsumo />} />
        <Route path="/ActualizarInsumo" element={<ActualizarInsumo />} />
        <Route path="/EliminarInsumo" element={<EliminarInsumo />} />
        <Route path="/pacientes/eliminar" element={<EliminarPacientes />} />
        <Route path="/pacientes/actualizar" element={<ActualizarPacientes />} />
      </Routes>
      <Footer />
    </div>
  );
}

export default App;
