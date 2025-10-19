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
import Hospital from './Components/Hospital/Hospital';
import Service from './Components/Services/Service';

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
        <Route path="/Servicios" element={<Service />} />
      </Routes>
      <Footer />
    </div>
  );
}

export default App;
