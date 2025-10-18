import './App.css';
import { Routes, Route } from 'react-router-dom';

import AdminNav from './Components/Admin/AdminNav';
import Login from './Components/Login';
import AdminHome from './Components/Admin/AdminHome';
import RegistrarEnfermero from './Components/Enfermero/RegistrarEnfermero';
import Enfermero from './Components/Enfermero/Enfermero';
import RegistrarHospital from './Components/Hospital/RegistrarHospital';
import Hospital from './Components/Hospital/Hospital';
function App() {
  return (
    <div>
      <AdminNav />
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/AdminHome" element={<AdminHome />} />
        <Route path="/Enfermero" element={<Enfermero />} />
        <Route path="/RegistrarEnfermero" element={<RegistrarEnfermero />} />
        <Route path="/RegistrarHospital" element={<RegistrarHospital />} />
        <Route path="/Hospital" element={<Hospital />} />
      </Routes>
    </div>
  );
}

export default App;
