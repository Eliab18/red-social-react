import React from "react";
import { useSelector } from "react-redux";
import Dropdown from "./partials/dropdown"; // Importar el componente Dropdown
import SearchInput from "./partials/SearchInput"; // Importar el componente SearchInput

const Navbar = () => {
  // Obtener el estado de autenticación desde Redux
  const { isAuthenticated } = useSelector((state) => state.auth);

  return (
    <nav className="bg-gray-900 border-white z-50 sticky top-0 w-full text-white py-2 border-b ">
      <div className="container mx-auto flex justify-between items-center px-4">
        {/* Logo en el lado izquierdo */}
        <div className="flex items-center">
          <p>Logo</p>
        </div>

        {/* Barra de búsqueda en el centro */}
        <div className="flex-grow mx-4">
          <SearchInput />
        </div>

        {/* Dropdown en el lado derecho */}
        <div className="flex items-center">
          {!isAuthenticated ? (
            <>
              <a
                href="/login"
                className="bg-indigo-500 hover:bg-indigo-400 text-white px-4 py-2 rounded-md transition duration-300 mr-2"
              >
                Iniciar Sesión
              </a>
              <a
                href="/register"
                className="bg-indigo-500 hover:bg-indigo-400 text-white px-4 py-2 rounded-md transition duration-300"
              >
                Registrarse
              </a>
            </>
          ) : (
            <Dropdown />
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;