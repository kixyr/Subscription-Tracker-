import './App.css';
import Dashboard from './Dashboard.js';
import Login from './Auth/Login.js';
import Register from './Auth/Register.js';
import Nav from './Nav.js';
import { Route, Routes } from 'react-router-dom';
import { DataProvider } from './context/DataProvider.js';

function App() {
  return (
    <DataProvider>
      <div className="App">
        <Nav />
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </div>
    </DataProvider>
  );
}

export default App;
