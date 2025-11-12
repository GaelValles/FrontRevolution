import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  AiFillCar, 
  AiOutlineSchedule, 
  AiOutlineUser,
  AiOutlineSetting,
  AiOutlineLogout 
} from 'react-icons/ai';
import { BsCarFrontFill, BsCalendarCheck, BsClockHistory, BsHouse } from 'react-icons/bs';
import { MdLocalOffer } from 'react-icons/md';
import {
  SidebarContainer,
  Logo,
  MenuItem,
  ConfigButton,
  MenuSection,
  MenuLabel,
  ScrollbarStyles
} from '../../styles/sidebar.styles';
import LogoImg from '../../assets/images/logo.png';
import { useAuth } from '../../context/AuthContext';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

const ThemeSwitch = ({ isDarkMode, toggleTheme, isOpen }) => {
  return (
    <div className="flex items-center justify-between p-4" style={{ borderBottom: `1px solid ${isDarkMode ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'}` }}>
      <div className={`flex items-center gap-3 ${isOpen ? 'opacity-100' : 'opacity-0'}`}>
        <span className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
          Cambiar a modo {isDarkMode ? 'claro' : 'oscuro'}
        </span>
      </div>

      {/* Custom attractive switch */}
      <button
        onClick={toggleTheme}
        aria-label="Cambiar tema"
        className={`relative inline-flex items-center transition-colors duration-250 ${isDarkMode ? 'bg-gradient-to-r from-gray-700 to-blue-600' : 'bg-gray-200'}`}
        style={{ width: 46, height: 26, borderRadius: 999 }}
      >
        <div style={{
          position: 'absolute',
          left: 6,
          top: 6,
          width: 14,
          height: 14,
          borderRadius: 999,
          background: isDarkMode ? '#fff' : '#fff',
          transform: `translateX(${isDarkMode ? 18 : 0}px)`,
          boxShadow: '0 2px 6px rgba(0,0,0,0.15)',
          transition: 'transform 220ms cubic-bezier(.2,.9,.2,1)'
        }}>
        </div>
        <div style={{ position: 'absolute', right: 8, opacity: isDarkMode ? 1 : 0.0, transition: 'opacity 200ms' }}>
          <Moon className="h-3 w-3 text-white" />
        </div>
        <div style={{ position: 'absolute', left: 8, opacity: isDarkMode ? 0.0 : 1, transition: 'opacity 200ms' }}>
          <Sun className="h-3 w-3 text-yellow-400" />
        </div>
      </button>
    </div>
  );
};

const Sidebar = ({ onHover }) => {
  const [showConfig, setShowConfig] = useState(false);
  const [isOpenLocal, setIsOpenLocal] = useState(false); // local open/close for animation
  const { logout } = useAuth();
  const { isDarkMode, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleLogout = () => {
    try {
      logout();
      navigate('/login');
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  useEffect(() => {
    // Si el sidebar se cierra, asegurarse de cerrar la configuración
    if (!isOpenLocal) {
      setShowConfig(false);
    }
  }, [isOpenLocal]);

  const handleMouseEnter = () => {
    setIsOpenLocal(true);
    if (typeof onHover === 'function') onHover(true);
  };

  const handleMouseLeave = () => {
    setIsOpenLocal(false);
    setShowConfig(false); // cerrar panel de configuración al contraer sidebar
    if (typeof onHover === 'function') onHover(false);
  };

  const labelClass = (open) => `ml-2 transition-all duration-300 ${open ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-2 pointer-events-none'}`;

  return (
    <SidebarContainer
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      isDarkMode={isDarkMode}
      isOpen={isOpenLocal}
      className="backdrop-blur-xl"
    >
      {/* apply custom scrollbar styles wrapper */}
      <ScrollbarStyles isDarkMode={isDarkMode}>
        <Link to="/inicioCliente" className="block mb-8">
          <div className="flex items-center gap-3">
            <Logo src={LogoImg} alt="Logo" />
          </div>
        </Link>

        <MenuSection>
          <MenuLabel isDarkMode={isDarkMode} isOpen={isOpenLocal}>Regresar al Inicio</MenuLabel>
          <MenuItem to="/inicioCliente" isDarkMode={isDarkMode} isOpen={isOpenLocal}>
            <BsHouse/>
            <span className={labelClass(isOpenLocal)}>Inicio</span>
          </MenuItem>
        </MenuSection>

        <MenuSection>
          <MenuLabel isDarkMode={isDarkMode} isOpen={isOpenLocal}>Vehículos</MenuLabel>
          <MenuItem to="/agregarCarro" isDarkMode={isDarkMode} isOpen={isOpenLocal}>
            <BsCarFrontFill />
            <span className={labelClass(isOpenLocal)}>Agregar Vehículo</span>
          </MenuItem>
          <MenuItem to="/misCarros" isDarkMode={isDarkMode} isOpen={isOpenLocal}>
            <AiFillCar />
            <span className={labelClass(isOpenLocal)}>Mis Vehículos</span>
          </MenuItem>
        </MenuSection>

        <MenuSection>
          <MenuLabel isDarkMode={isDarkMode} isOpen={isOpenLocal}>Citas</MenuLabel>
          <MenuItem to="/agregarCita" isDarkMode={isDarkMode} isOpen={isOpenLocal}>
            <AiOutlineSchedule />
            <span className={labelClass(isOpenLocal)}>Agendar cita</span>
          </MenuItem>
          <MenuItem to="/misCitas" isDarkMode={isDarkMode} isOpen={isOpenLocal}>
            <BsCalendarCheck />
            <span className={labelClass(isOpenLocal)}>Mis citas</span>
          </MenuItem>
          <MenuItem to="/historial" isDarkMode={isDarkMode} isOpen={isOpenLocal}>
            <BsClockHistory />
            <span className={labelClass(isOpenLocal)}>Historial</span>
          </MenuItem>
        </MenuSection>

        <MenuSection>
          <MenuLabel isDarkMode={isDarkMode} isOpen={isOpenLocal}>Servicios</MenuLabel>
          <MenuItem to="/planes" isDarkMode={isDarkMode} isOpen={isOpenLocal}>
            <MdLocalOffer />
            <span className={labelClass(isOpenLocal)}>Planes y Promociones</span>
          </MenuItem>
        </MenuSection>

        <MenuSection className="mt-auto">
          <MenuLabel isDarkMode={isDarkMode} isOpen={isOpenLocal}>Usuario</MenuLabel>
          <MenuItem to="/perfil" isDarkMode={isDarkMode} isOpen={isOpenLocal}>
            <AiOutlineUser />
            <span className={labelClass(isOpenLocal)}>Mi Perfil</span>
          </MenuItem>

          <ConfigButton>
            <button
              type="button"
              onClick={() => setShowConfig(prev => !prev)}
              className={`w-full flex items-center gap-3 p-3 rounded-lg transition-colors ${isDarkMode ? 'text-white/90 hover:bg-white/10' : 'text-gray-800 hover:bg-gray-100'}`}
            >
              <AiOutlineSetting />
              <span className={labelClass(isOpenLocal)}>Configuración</span>
            </button>

            {showConfig && (
              <div className={`absolute bottom-full left-0 w-full mb-2 ${isDarkMode ? 'bg-gray-900 border-gray-700 text-white' : 'bg-white border-gray-200 text-gray-900'} rounded-lg shadow-xl border overflow-hidden`}>
                <ThemeSwitch isDarkMode={isDarkMode} toggleTheme={toggleTheme} isOpen={isOpenLocal} />

                <button
                  onClick={handleLogout}
                  className={`w-full p-4 text-left flex items-center gap-2 ${isDarkMode ? 'text-red-400 hover:bg-gray-800' : 'text-red-600 hover:bg-gray-100'}`}
                >
                  <AiOutlineLogout />
                  <span className={labelClass(isOpenLocal)}>Cerrar Sesión</span>
                </button>
              </div>
            )}
          </ConfigButton>
        </MenuSection>
      </ScrollbarStyles>
    </SidebarContainer>
  );
};

export default Sidebar;
