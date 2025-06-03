import React, { useState } from "react";

const SearchInput = ({ placeholder = "Buscar algo", className = "" }) => {
  const [isFocused, setIsFocused] = useState(false); // Estado para controlar si el input está enfocado

  return (
    <div className={`relative w-fit mx-auto ${className}`}>
      {/* Campo de entrada */}
      <input
        type="text"
        placeholder={placeholder}
        onFocus={() => setIsFocused(true)} // Activar cuando se enfoca
        onBlur={() => setIsFocused(false)} // Desactivar cuando se desenfoca
        className="w-2xl px-4 py-2 pl-10 bg-gray-800 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
      />
      {/* Ícono de búsqueda */}
      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5 text-gray-400"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
            clipRule="evenodd"
          />
        </svg>
      </div>

      {/* Contenedor de sugerencias */}
      {isFocused && (
        <div className="absolute top-full mt-2 w-2xl bg-gray-700 text-white rounded-md shadow-lg overflow-hidden z-10">
          <div className="px-4 py-2 text-sm text-gray-400">Sin búsquedas</div>
        </div>
      )}
    </div>
  );
};

export default SearchInput;