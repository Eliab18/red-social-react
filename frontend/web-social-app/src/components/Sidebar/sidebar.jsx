import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faHome,
  faUser,
  faUsers,
  faEnvelope,
  faBook,
  faCog,
  faChevronDown,
  faXmark,
  faArrowRight,
  faPlus // Add this icon
} from '@fortawesome/free-solid-svg-icons';

const Sidebar = ({ isCollapsed, onToggle, openCreatePostModal }) => {
  const [expandedSections, setExpandedSections] = useState({}); // Estado para manejar secciones desplegables

  // Función para expandir/colapsar una sección
  const toggleSection = (section) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  return (
    <div
      className={`h-full bg-gray-900 border-r text-white transition-all duration-300 ${
        isCollapsed ? 'w-12' : 'w-64'
      } relative`}
    >
      {/* Botón para colapsar el Sidebar */}
      <button
        onClick={() => onToggle(!isCollapsed)}
        className={`absolute top-1/2 transform -translate-y-1/2 w-8 h-8 cursor-pointer rounded-full bg-gray-700 text-lg text-white hover:text-gray-300 flex items-center justify-center transition-all duration-300 ${
          isCollapsed ? 'right-[-20px]' : 'right-[-20px]'
        }`}
      >
        <FontAwesomeIcon icon={isCollapsed ? faArrowRight : faXmark} />
      </button>

      {/* Contenido del Sidebar */}
      <div className="pt-16 flex flex-col space-y-2">
        {/* Dashboard */}
        <a
          href="/"
          className="flex items-center space-x-4 px-4 py-2 hover:bg-gray-800 transition duration-200"
        >
          <FontAwesomeIcon icon={faHome} />
          {!isCollapsed && <span>Dashboard</span>}
        </a>

        {/* Usuario */}
        <a
          href="/user"
          className="flex items-center space-x-4 px-4 py-2 hover:bg-gray-800  transition duration-200"
        >
          <FontAwesomeIcon icon={faUser} />
          {!isCollapsed && <span>Usuario</span>}
        </a>

        {/* Comunidades */}
        <div>
          <button
            onClick={() => toggleSection('communities')}
            className="flex items-center justify-between w-full px-4 py-2 hover:bg-gray-800 transition duration-200"
          >
            <div className="flex items-center space-x-4">
              <FontAwesomeIcon icon={faUsers} />
              {!isCollapsed && <span>Comunidades</span>}
            </div>
            {!isCollapsed && (
              <FontAwesomeIcon
                icon={faChevronDown}
                className={`${expandedSections['communities'] ? 'rotate-180' : ''} transition-transform`}
              />
            )}
          </button>
          <div
            className={`overflow-hidden transition-all duration-500 ${
              expandedSections['communities'] ? 'max-h-48' : 'max-h-0'
            }`}
          >
            <div className="pl-8">
              <a
                href="/groups/community1"
                className="block px-4 py-2 hover:bg-gray-800 transition duration-200"
              >
                {!isCollapsed && <span>Comunidad 1</span>}
              </a>
              <a
                href="/groups/community2"
                className="block px-4 py-2 hover:bg-gray-800 transition duration-200"
              >
                {!isCollapsed && <span>Comunidad 2</span>}
              </a>
            </div>
          </div>
        </div>

        {/* Inbox */}
        <a
          href="/chat"
          className="flex items-center space-x-4 px-4 py-2 hover:bg-gray-800  transition duration-200"
        >
          <FontAwesomeIcon icon={faEnvelope} />
          {!isCollapsed && <span>Inbox</span>}
        </a>

        {/* Páginas */}
        <div>
          <button
            onClick={() => toggleSection('pages')}
            className="flex items-center justify-between w-full px-4 py-2 hover:bg-gray-800  transition duration-200"
          >
            <div className="flex items-center space-x-4">
              <FontAwesomeIcon icon={faBook} />
              {!isCollapsed && <span>Páginas</span>}
            </div>
            {!isCollapsed && (
              <FontAwesomeIcon
                icon={faChevronDown}
                className={`${expandedSections['pages'] ? 'rotate-180' : ''} transition-transform`}
              />
            )}
          </button>
          <div
            className={`overflow-hidden transition-all duration-500 ${
              expandedSections['pages'] ? 'max-h-48' : 'max-h-0'
            }`}
          >
            <div className="pl-8">
              <a
                href="/pages/page1"
                className="block px-4 py-2 hover:bg-gray-800 transition duration-200"
              >
                {!isCollapsed && <span>Página 1</span>}
              </a>
              <a
                href="/pages/page2"
                className="block px-4 py-2 hover:bg-gray-800 transition duration-200"
              >
                {!isCollapsed && <span>Página 2</span>}
              </a>
            </div>
          </div>
        </div>

        {/* Configuración */}
        <a
          href="/settings"
          className="flex items-center space-x-4 px-4 py-2 hover:bg-gray-800 transition duration-200"
        >
          <FontAwesomeIcon icon={faCog} />
          {!isCollapsed && <span>Configuración</span>}
        </a>

        {/* Create Post Button */}
        <button
          onClick={openCreatePostModal}
          className="flex items-center space-x-4 px-4 py-3 mt-4 hover:bg-gray-800 transition duration-200 bg-blue-600 hover:bg-blue-700 rounded-lg mx-4" // Added some distinct styling
        >
          <FontAwesomeIcon icon={faPlus} />
          {!isCollapsed && <span className="font-semibold">Crear Post</span>}
        </button>
      </div>
    </div>
  );
};

export default Sidebar;