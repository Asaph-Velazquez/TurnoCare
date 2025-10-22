import './App.css';
import { Routes, Route } from 'react-router-dom';

import AdminNav from './Components/Admin/AdminNav';
import Login from './Components/Login';
import AdminHome from './Components/Admin/AdminHome';
import RegistrarEnfermero from './Components/Enfermero/RegistrarEnfermero';
import Enfermero from './Components/Enfermero/Enfermero';
import Footer from './Components/Footer';
import Pacientes from './Components/Pacientes/Pacientes';
import RegistrarPacientes from './Components/Pacientes/RegistrarPacientes';

function App() {
  return (
    <div>
      <AdminNav />
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/AdminHome" element={<AdminHome />} />
        <Route path="/Enfermero" element={<Enfermero />} />
        <Route path="/RegistrarEnfermero" element={<RegistrarEnfermero />} />
        <Route path="/pacientes" element={<Pacientes />} />
        <Route path="/pacientes/registrar" element={<RegistrarPacientes />} />
      </Routes>
      <Footer />
    </div>
  );
}

export default App;
