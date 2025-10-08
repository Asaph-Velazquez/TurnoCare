import './App.css';
import { Routes, Route } from 'react-router-dom';

import UserNav from './Components/UserNav';
import Login from './Components/Login';

function App() {
  return (
    <div>
      <UserNav />
      <Routes>
        <Route path="/" element={<Login />} />
      </Routes>
    </div>
  );
}

export default App;
