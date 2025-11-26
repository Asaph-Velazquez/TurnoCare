import "./App.css";
import { Routes, Route } from "react-router-dom";

import AdminNav from "./Components/Admin/AdminNav";
import EnfermeroNav from "./Components/NoCoordinador/EnfermeroNav";
import Login from "./Components/Login";
import AdminHome from "./Components/Admin/AdminHome";
import RegistrarEnfermero from "./Components/Enfermero/RegistrarEnfermero";
import EliminarEnfermero from "./Components/Enfermero/EliminarEnfermero";
import Enfermero from "./Components/Enfermero/Enfermero";
import ActualizarEnfermero from "./Components/Enfermero/ActualizarEnfermero";
import Detalles from "./Components/Enfermero/Detalles";
import AsignarServicioPaciente from "./Components/Pacientes/AsignarServicioPaciente";
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
import EliminarPacientes from "./Components/Pacientes/EliminarPacientes";
import ActualizarPacientes from "./Components/Pacientes/ActualizarPacientes";
import PacienteDetalles from "./Components/Pacientes/PacienteDetalles";
import AsignarMedicamentosInsumos from "./Components/Pacientes/AsignarMedicamentosInsumos";
import ActualizarAsignaciones from "./Components/Pacientes/ActualizarAsignaciones";
import EliminarAsignaciones from "./Components/Pacientes/EliminarAsignaciones";
import GestionAsignaciones from "./Components/Pacientes/GestionAsignaciones";
import InventarioPorServicio from "./Components/Inventario/InventarioPorServicio";
import Turnos from "./Components/Turnos/Turnos";
import RegistrarTurno from "./Components/Turnos/RegistrarTurno";
import EliminarTurno from "./Components/Turnos/EliminarTurno";
import ActualizarTurno from "./Components/Turnos/ActualizarTurno";
import AsignarHorarioEnfermero from "./Components/Enfermero/AsignarHorarioEnfermero";
import ListarTurnos from "./Components/Turnos/ListarTurnos";
import ProtectedRoute from "./Components/ProtectedRoute";

//No Coordniador
import Home from "./Components/NoCoordinador/Home";
import NotaMedicaForm from "./Components/NoCoordinador/NotaMedicaForm";
import MisPacientes from "./Components/NoCoordinador/MisPacientes";
import InventarioNoCoordinador from "./Components/NoCoordinador/Inventario";

function App() {
  return (
    <div>
      <AdminNav />
      <EnfermeroNav />
      <Routes>
        <Route path="/" element={<Login />} />
        <Route
          path="/AdminHome"
          element={
            <ProtectedRoute>
              <AdminHome />
            </ProtectedRoute>
          }
        />
        <Route
          path="/Enfermero"
          element={
            <ProtectedRoute>
              <Enfermero />
            </ProtectedRoute>
          }
        />
        <Route
          path="/RegistrarEnfermero"
          element={
            <ProtectedRoute>
              <RegistrarEnfermero />
            </ProtectedRoute>
          }
        />
        <Route
          path="/EliminarEnfermero"
          element={
            <ProtectedRoute>
              <EliminarEnfermero />
            </ProtectedRoute>
          }
        />
        <Route
          path="/ActualizarEnfermero"
          element={
            <ProtectedRoute>
              <ActualizarEnfermero />
            </ProtectedRoute>
          }
        />
        <Route
          path="/Enfermeros/Detalles"
          element={
            <ProtectedRoute>
              <Detalles />
            </ProtectedRoute>
          }
        />
        <Route
          path="/AsignarServicioPaciente"
          element={
            <ProtectedRoute>
              <AsignarServicioPaciente />
            </ProtectedRoute>
          }
        />
        <Route
          path="/RegistrarHospital"
          element={
            <ProtectedRoute>
              <RegistrarHospital />
            </ProtectedRoute>
          }
        />
        <Route
          path="/ActualizarHospital"
          element={
            <ProtectedRoute>
              <ActualizarHospital />
            </ProtectedRoute>
          }
        />
        <Route
          path="/EliminarHospital"
          element={
            <ProtectedRoute>
              <EliminarHospital />
            </ProtectedRoute>
          }
        />
        <Route
          path="/Hospital"
          element={
            <ProtectedRoute>
              <Hospital />
            </ProtectedRoute>
          }
        />
        <Route
          path="/pacientes"
          element={
            <ProtectedRoute>
              <Pacientes />
            </ProtectedRoute>
          }
        />
        <Route
          path="/pacientes/registrar"
          element={
            <ProtectedRoute>
              <RegistrarPacientes />
            </ProtectedRoute>
          }
        />
        <Route
          path="/Servicios"
          element={
            <ProtectedRoute>
              <Service />
            </ProtectedRoute>
          }
        />
        <Route
          path="/RegistrarServicio"
          element={
            <ProtectedRoute>
              <RegistrarServicio />
            </ProtectedRoute>
          }
        />
        <Route
          path="/ListarServicios"
          element={
            <ProtectedRoute>
              <ListarServicios />
            </ProtectedRoute>
          }
        />
        <Route
          path="/ActualizarServicio"
          element={
            <ProtectedRoute>
              <ActualizarServicio />
            </ProtectedRoute>
          }
        />
        <Route
          path="/EliminarServicio"
          element={
            <ProtectedRoute>
              <EliminarServicio />
            </ProtectedRoute>
          }
        />
        <Route
          path="/Inventario"
          element={
            <ProtectedRoute>
              <Inventario />
            </ProtectedRoute>
          }
        />
        <Route
          path="/Medicamento"
          element={
            <ProtectedRoute>
              <Medicamento />
            </ProtectedRoute>
          }
        />
        <Route
          path="/RegistrarMedicamento"
          element={
            <ProtectedRoute>
              <RegistrarMedicamento />
            </ProtectedRoute>
          }
        />
        <Route
          path="/ActualizarMedicamento"
          element={
            <ProtectedRoute>
              <ActualizarMedicamento />
            </ProtectedRoute>
          }
        />
        <Route
          path="/EliminarMedicamento"
          element={
            <ProtectedRoute>
              <EliminarMedicamento />
            </ProtectedRoute>
          }
        />
        <Route
          path="/Insumos"
          element={
            <ProtectedRoute>
              <Insumos />
            </ProtectedRoute>
          }
        />
        <Route
          path="/RegistrarInsumo"
          element={
            <ProtectedRoute>
              <RegistrarInsumo />
            </ProtectedRoute>
          }
        />
        <Route
          path="/ActualizarInsumo"
          element={
            <ProtectedRoute>
              <ActualizarInsumo />
            </ProtectedRoute>
          }
        />
        <Route
          path="/EliminarInsumo"
          element={
            <ProtectedRoute>
              <EliminarInsumo />
            </ProtectedRoute>
          }
        />
        <Route
          path="/pacientes/eliminar"
          element={
            <ProtectedRoute>
              <EliminarPacientes />
            </ProtectedRoute>
          }
        />
        <Route
          path="/pacientes/actualizar"
          element={
            <ProtectedRoute>
              <ActualizarPacientes />
            </ProtectedRoute>
          }
        />
        <Route
          path="/pacientes/detalles/:pacienteId"
          element={
            <ProtectedRoute>
              <PacienteDetalles />
            </ProtectedRoute>
          }
        />
        <Route
          path="/pacientes/asignar-medicamentos-insumos"
          element={
            <ProtectedRoute>
              <AsignarMedicamentosInsumos />
            </ProtectedRoute>
          }
        />
        <Route
          path="/pacientes/actualizar-asignaciones"
          element={
            <ProtectedRoute>
              <ActualizarAsignaciones />
            </ProtectedRoute>
          }
        />
        <Route
          path="/pacientes/eliminar-asignaciones"
          element={
            <ProtectedRoute>
              <EliminarAsignaciones />
            </ProtectedRoute>
          }
        />
        <Route
          path="/pacientes/gestionar-asignaciones"
          element={
            <ProtectedRoute>
              <GestionAsignaciones />
            </ProtectedRoute>
          }
        />
        <Route
          path="/inventario/servicios"
          element={
            <ProtectedRoute>
              <InventarioPorServicio />
            </ProtectedRoute>
          }
        />
        <Route
          path="/turnos"
          element={
            <ProtectedRoute>
              <Turnos />
            </ProtectedRoute>
          }
        />
        <Route
          path="/turnos/registrar"
          element={
            <ProtectedRoute>
              <RegistrarTurno />
            </ProtectedRoute>
          }
        />
        <Route
          path="/turnos/eliminar"
          element={
            <ProtectedRoute>
              <EliminarTurno />
            </ProtectedRoute>
          }
        />
        <Route
          path="/turnos/actualizar"
          element={
            <ProtectedRoute>
              <ActualizarTurno />
            </ProtectedRoute>
          }
        />
        <Route
          path="/turnos/asignar-enfermero"
          element={
            <ProtectedRoute>
              <AsignarHorarioEnfermero />
            </ProtectedRoute>
          }
        />
        <Route
          path="/turnos/listar"
          element={
            <ProtectedRoute>
              <ListarTurnos />
            </ProtectedRoute>
          }
        />
        <Route
          path="/NoCoordinador/home"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
        <Route
          path="/NoCoordinador/NotaMedicaForm/:pacienteId?"
          element={
            <ProtectedRoute>
              <NotaMedicaForm />
            </ProtectedRoute>
          }
        />
        <Route
          path="/NoCoordinador/mis-pacientes"
          element={
            <ProtectedRoute>
              <MisPacientes />
            </ProtectedRoute>
          }
        />
        <Route path="/nocoordinador/inventario" element={<InventarioNoCoordinador />} />
      </Routes>
      <Footer />
    </div>
  );
}

export default App;
