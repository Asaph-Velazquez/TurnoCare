import './App.css';
import { Routes, Route } from 'react-router-dom';

import UserHome from './Components/UserHome';
import Nav from './Components/UserNav';
import Login from './Components/Login';

function App() {
  return (
    <div>
      <Nav />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<UserHome />} />
        <Route path="/nav" element={<div>Nav Component</div>} />
      </Routes>
    </div>
  );
}

export default App;
