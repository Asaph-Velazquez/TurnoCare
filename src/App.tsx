import './App.css';
import { Routes, Route } from 'react-router-dom';

import AdminNav from './Components/Admin/AdminNav';
import Login from './Components/Login';
import AdminHome from './Components/Admin/AdminHome';
import RegistrarEnfermero from './Components/Enfermero/RegistrarEnfermero';

function App() {
  return (
    <div>
      <AdminNav />
      <Routes>
        <Route path="/RegistrarEnfermero" element={<RegistrarEnfermero />} />
        <Route path="/" element={<Login />} />
        <Route path="/AdminHome" element={<AdminHome />} />
      </Routes>
    </div>
  );
}

export default App;
