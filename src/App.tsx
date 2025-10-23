import './App.css';
import { Routes, Route } from 'react-router-dom';

import AdminNav from './Components/Admin/AdminNav';
import Login from './Components/Login';
import AdminHome from './Components/Admin/AdminHome';
import RegistrarEnfermero from './Components/Enfermero/RegistrarEnfermero';
import EliminarEnfermero from './Components/Enfermero/EliminarEnfermero';
import Enfermero from './Components/Enfermero/Enfermero';
import ActualizarEnfermero from './Components/Enfermero/ActualizarEnfermero';
import Footer from './Components/Footer';
import RegistrarHospital from './Components/Hospital/RegistrarHospital';
import ActualizarHospital from './Components/Hospital/ActualizarHospital';
import EliminarHospital from './Components/Hospital/EliminarHospital';
import Hospital from './Components/Hospital/Hospital';
import Pacientes from './Components/Pacientes/Pacientes';
import RegistrarPacientes from './Components/Pacientes/RegistrarPacientes';
import Service from './Components/Services/Service';
import RegistrarServicio from './Components/Services/RegistrarServicio';
import ListarServicios from './Components/Services/ListarServicios';
import ActualizarServicio from './Components/Services/ActualizarServicio';
import EliminarServicio from './Components/Services/EliminarServicio';

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
      </Routes>
      <Footer />
    </div>
  );
}

export default App;
