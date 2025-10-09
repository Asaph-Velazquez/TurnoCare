import './App.css';
import { Routes, Route } from 'react-router-dom';

import AdminNav from './Components/AdminNav';
import Login from './Components/Login';
import AdminHome from './Components/AdminHome';

function App() {
  return (
    <div>
      <AdminNav />
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/AdminHome" element={<AdminHome />} />
      </Routes>
    </div>
  );
}

export default App;
