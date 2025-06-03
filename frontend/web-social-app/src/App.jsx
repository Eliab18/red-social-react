import React from 'react';
import { Outlet } from 'react-router-dom'; // Importa Outlet
import './App.css';

import Navbar from './components/Sidebar/navbar'; // Importa el componente Navbar

function App() {
  return (
    <div>
      {/* Contenido común (opcional) */}
      <Navbar />

      {/* Renderiza el contenido de las rutas secundarias */}
      <main>
        <Outlet />
      </main>

      {/* Pie de página común (opcional) */}
   
    </div>
  );
}

export default App;