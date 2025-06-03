import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { Provider } from 'react-redux';
import { HeroUIProvider } from '@heroui/react';

import { store } from './store'; // 👈 Asegúrate de tener esto

import './index.css';
import App from './App';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import ProtectedRoute from './components/ProtectedRoute';
import GuestRoute from './components/GuestRoute';

const AppWrapper = () => {
  return (
    <Provider store={store}>  {/*  AQUI está el arreglo */}
      <HeroUIProvider>
        <App />
      </HeroUIProvider>
    </Provider>
  );
};

// Rutas
const router = createBrowserRouter([
  {
    path: '/',
    element: <AppWrapper />,
    children: [
      { path: 'register', element: <GuestRoute><RegisterPage /></GuestRoute> },
      { path: 'login', element: <GuestRoute><LoginPage /></GuestRoute> },
      { path: '', element: <ProtectedRoute><DashboardPage /></ProtectedRoute> },
      { path: 'test', element: <h1 className="text-red-500">¡Ruta de prueba funciona!</h1> },
    ],
  },
]);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<RouterProvider router={router} />);
