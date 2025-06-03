import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { HeroUIProvider } from '@heroui/react';
import './index.css'; // Importa el archivo CSS de Tailwind
import App from './App';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import ProtectedRoute from './components/ProtectedRoute'; // Sin extensión .js si usas JSX
import GuestRoute from './components/GuestRoute'; // Sin extensión .js si usas JSX

// Componente interno para configurar HeroUIProvider con React Router
const AppWrapper = () => {
  return (
    <HeroUIProvider>
      <App />
    </HeroUIProvider>
  );
};

// Define las rutas
const router = createBrowserRouter([
  {
    path: '/',
    element: <AppWrapper />,
    children: [
      {
        path: 'register',
        element: (
          <GuestRoute>
            <RegisterPage />
          </GuestRoute>
        ),
      },
      {
        path: 'login',
        element: (
          <GuestRoute>
            <LoginPage />
          </GuestRoute>
        ),
      },
      {
        path: '',
        element: (
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        ),
      },
      {
        path: 'test',
        element: <h1 className="text-red-500">¡Ruta de prueba funciona!</h1>,
      },
    ],
  },
]);

// Usa createRoot en lugar de render
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<RouterProvider router={router} />);