import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserData, logout } from "../../../features/authSlice";
import { useNavigate } from 'react-router-dom';

const Dropdown = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const { user, isAuthenticated, status } = useSelector((state) => state.auth);

  useEffect(() => {
    if (isAuthenticated && !user) {
      dispatch(fetchUserData());
    }
  }, [dispatch, isAuthenticated, user]);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
    setIsOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const getUsernameInitial = () => {
    if (!user?.username) return "?";
    return user.username.charAt(0).toUpperCase();
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-full transition-all duration-300"
        aria-label="Menú de usuario"
      >
        {status === "loading" ? (
          <div className="animate-pulse flex space-x-2">
            <div className="w-8 h-8 bg-gray-600 rounded-full"></div>
          </div>
        ) : (
          <>
            <span className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">
              {getUsernameInitial()}
            </span>
            <span className="hidden md:inline">
              {user?.username || "Usuario"}
            </span>
          </>
        )}
      </button>

      <div
        className={`absolute right-0 mt-2 w-48 bg-slate-700 shadow-lg rounded-md overflow-hidden z-50 transition-all ${
          isOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
        style={{ transform: isOpen ? 'none' : 'translateY(-10px)' }}
      >
        <ul className="py-1">
          <li>
            <a
              href="/profile"
              className="block px-4 py-3 hover:bg-slate-600 transition-colors"
            >
              Perfil
            </a>
          </li>
          <li>
            <a
              href="/settings"
              className="block px-4 py-3 hover:bg-slate-600 transition-colors"
            >
              Configuración
            </a>
          </li>
          <li>
            <button
              onClick={handleLogout}
              className="w-full text-left px-4 py-3 hover:bg-slate-600 transition-colors"
            >
              Cerrar Sesión
            </button>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Dropdown;