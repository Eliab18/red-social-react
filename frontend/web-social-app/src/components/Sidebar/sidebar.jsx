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
  faPlus
} from '@fortawesome/free-solid-svg-icons';

const Sidebar = ({ isCollapsed, onToggle, openCreatePostModal }) => {
  const [expandedSections, setExpandedSections] = useState({});

  const toggleSection = (section) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  return (
    <div
      className={`h-full bg-gray-900 border-r text-white transition-all duration-300 ${
        isCollapsed ? 'w-16' : 'w-64'
      } relative`}
    >
      {/* Botón para colapsar el Sidebar */}
      <button
        onClick={() => onToggle(!isCollapsed)}
        className="absolute top-1/2 right-[-16px] transform -translate-y-1/2 w-8 h-8 cursor-pointer rounded-full bg-gray-700 text-lg text-white hover:text-gray-300 flex items-center justify-center transition-all duration-300 z-10"
      >
        <FontAwesomeIcon icon={isCollapsed ? faArrowRight : faXmark} />
      </button>

      {/* Contenido del Sidebar */}
      <div className="pt-16 flex flex-col">
        {/* Dashboard */}
        <a
          href="/"
          className="flex items-center py-3 hover:bg-gray-800 transition duration-200 w-full px-2"
        >
          <div className="flex items-center justify-center w-12 h-6 flex-shrink-0">
            <FontAwesomeIcon icon={faHome} className="text-base" />
          </div>
          <span className={`ml-3 transition-opacity duration-300 ${isCollapsed ? 'opacity-0 w-0 overflow-hidden' : 'opacity-100'}`}>
            Dashboard
          </span>
        </a>

        {/* Usuario */}
        <a
          href="/user"
          className="flex items-center py-3 hover:bg-gray-800 transition duration-200 w-full px-2"
        >
          <div className="flex items-center justify-center w-12 h-6 flex-shrink-0">
            <FontAwesomeIcon icon={faUser} className="text-base" />
          </div>
          <span className={`ml-3 transition-opacity duration-300 ${isCollapsed ? 'opacity-0 w-0 overflow-hidden' : 'opacity-100'}`}>
            Usuario
          </span>
        </a>

        {/* Comunidades */}
        <div>
          <button
            onClick={() => toggleSection('communities')}
            className="flex items-center justify-between w-full py-3 hover:bg-gray-800 transition duration-200 px-2"
          >
            <div className="flex items-center">
              <div className="flex items-center justify-center w-12 h-6 flex-shrink-0">
                <FontAwesomeIcon icon={faUsers} className="text-base" />
              </div>
              <span className={`ml-3 transition-opacity duration-300 ${isCollapsed ? 'opacity-0 w-0 overflow-hidden' : 'opacity-100'}`}>
                Comunidades
              </span>
            </div>
            {!isCollapsed && (
              <FontAwesomeIcon
                icon={faChevronDown}
                className={`${expandedSections['communities'] ? 'rotate-180' : ''} transition-transform mr-2 flex-shrink-0`}
              />
            )}
          </button>
          {!isCollapsed && (
            <div
              className={`overflow-hidden transition-all duration-300 ${
                expandedSections['communities'] ? 'max-h-48' : 'max-h-0'
              }`}
            >
              <div className="pl-14">
                <a
                  href="/groups/community1"
                  className="block px-4 py-2 hover:bg-gray-800 transition duration-200"
                >
                  Comunidad 1
                </a>
                <a
                  href="/groups/community2"
                  className="block px-4 py-2 hover:bg-gray-800 transition duration-200"
                >
                  Comunidad 2
                </a>
              </div>
            </div>
          )}
        </div>

        {/* Inbox */}
        <a
          href="/chat"
          className="flex items-center py-3 hover:bg-gray-800 transition duration-200 w-full px-2"
        >
          <div className="flex items-center justify-center w-12 h-6 flex-shrink-0">
            <FontAwesomeIcon icon={faEnvelope} className="text-base" />
          </div>
          <span className={`ml-3 transition-opacity duration-300 ${isCollapsed ? 'opacity-0 w-0 overflow-hidden' : 'opacity-100'}`}>
            Inbox
          </span>
        </a>

        {/* Páginas */}
        <div>
          <button
            onClick={() => toggleSection('pages')}
            className="flex items-center justify-between w-full py-3 hover:bg-gray-800 transition duration-200 px-2"
          >
            <div className="flex items-center">
              <div className="flex items-center justify-center w-12 h-6 flex-shrink-0">
                <FontAwesomeIcon icon={faBook} className="text-base" />
              </div>
              <span className={`ml-3 transition-opacity duration-300 ${isCollapsed ? 'opacity-0 w-0 overflow-hidden' : 'opacity-100'}`}>
                Páginas
              </span>
            </div>
            {!isCollapsed && (
              <FontAwesomeIcon
                icon={faChevronDown}
                className={`${expandedSections['pages'] ? 'rotate-180' : ''} transition-transform mr-2 flex-shrink-0`}
              />
            )}
          </button>
          {!isCollapsed && (
            <div
              className={`overflow-hidden transition-all duration-300 ${
                expandedSections['pages'] ? 'max-h-48' : 'max-h-0'
              }`}
            >
              <div className="pl-14">
                <a
                  href="/pages/page1"
                  className="block px-4 py-2 hover:bg-gray-800 transition duration-200"
                >
                  Página 1
                </a>
                <a
                  href="/pages/page2"
                  className="block px-4 py-2 hover:bg-gray-800 transition duration-200"
                >
                  Página 2
                </a>
              </div>
            </div>
          )}
        </div>

        {/* Configuración */}
        <a
          href="/settings"
          className="flex items-center py-3 hover:bg-gray-800 transition duration-200 w-full px-2"
        >
          <div className="flex items-center justify-center w-12 h-6 flex-shrink-0">
            <FontAwesomeIcon icon={faCog} className="text-base" />
          </div>
          <span className={`ml-3 transition-opacity duration-300 ${isCollapsed ? 'opacity-0 w-0 overflow-hidden' : 'opacity-100'}`}>
            Configuración
          </span>
        </a>

        {/* Create Post Button */}
        <div className="px-2 mt-4">
          <button
            onClick={openCreatePostModal}
            className="flex items-center py-3 hover:bg-blue-700 transition duration-200 bg-blue-600 rounded-lg w-full text-white"
          >
            <div className="flex items-center justify-center w-12 h-6 flex-shrink-0">
              <FontAwesomeIcon icon={faPlus} className="text-base" />
            </div>
            <span className={`ml-3 font-semibold transition-opacity duration-300 ${isCollapsed ? 'opacity-0 w-0 overflow-hidden' : 'opacity-100'}`}>
              Crear Post
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;