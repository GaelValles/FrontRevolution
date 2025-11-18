import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  AiFillCar, 
  AiOutlineSchedule, 
  AiOutlineUser,
  AiOutlineLogout 
} from 'react-icons/ai';
import { BsCarFrontFill, BsCalendarCheck, BsClockHistory, BsHouse } from 'react-icons/bs';
import { MdLocalOffer } from 'react-icons/md';
import {
  SidebarContainer,
  Logo,
  MenuItem,
  MenuSection,
  MenuLabel,
  ScrollbarStyles
} from '../../styles/sidebar.styles';
import LogoImg from '../../assets/images/logo.png';
import { useAuth } from '../../context/AuthContext';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

const ThemeSwitch = ({ isDarkMode, toggleTheme, isOpen }) => {
  // local label class (keeps same hide/show behaviour as other menu labels)
  const labelClass = `ml-2 transition-all duration-300 ${isOpen ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-2 pointer-events-none'}`;

  // When sidebar is open: show pill switch with label (existing behavior)
  if (isOpen) {
    return (
      <div className="flex items-center justify-between px-4 py-3" style={{ borderBottom: `1px solid ${isDarkMode ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.06)'}` }}>
        <div className="flex items-center gap-3">
          <span className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
            {isDarkMode ? 'Modo oscuro' : 'Modo claro'}
          </span>
        </div>

        <button
          onClick={toggleTheme}
          aria-label="Cambiar tema"
          className={`relative inline-flex items-center h-8 w-14 rounded-full transition-shadow focus:outline-none ${isDarkMode ? 'bg-gradient-to-r from-indigo-600 to-emerald-400' : 'bg-gray-200'}`}
        >
          <span
            className={`absolute left-1 top-1 h-6 w-6 rounded-full bg-white shadow-md transform transition-transform ${isDarkMode ? 'translate-x-6' : 'translate-x-0'}`}
          />
          <div className="absolute left-2 top-1 text-xs" style={{ opacity: isDarkMode ? 0 : 1 }}>
            <Sun className="w-4 h-4 text-yellow-400" />
          </div>
          <div className="absolute right-2 top-1 text-xs" style={{ opacity: isDarkMode ? 1 : 0 }}>
            <Moon className="w-4 h-4 text-white" />
          </div>
        </button>
      </div>
    );
  }

  // When sidebar is closed: render a single icon button using MenuItem so it matches other icons
  return (
    <MenuItem
      to="#"
      isDarkMode={isDarkMode}
      isOpen={isOpen}
      onClick={(e) => {
        e.preventDefault();
        toggleTheme();
      }}
      style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
    >
      {isDarkMode ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5 text-yellow-400" />}
      <span className={labelClass}>{isDarkMode ? 'Modo oscuro' : 'Modo claro'}</span>
    </MenuItem>
  );
};

const Sidebar = ({ onHover }) => {
  const [isOpenLocal, setIsOpenLocal] = useState(false);
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
    // kept intentionally minimal
  }, [isOpenLocal]);

  const handleMouseEnter = () => {
    setIsOpenLocal(true);
    if (typeof onHover === 'function') onHover(true);
  };

  const handleMouseLeave = () => {
    setIsOpenLocal(false);
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
      <ScrollbarStyles isDarkMode={isDarkMode}>
        <Link to="/inicioCliente" className="block mb-8">
          <div className="flex items-center gap-3">
            <Logo src={LogoImg} alt="Logo" />
          </div>
        </Link>

        <MenuSection>
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
            <span className={labelClass(isOpenLocal)}>Servicios</span>
          </MenuItem>
        </MenuSection>

        <MenuSection className="mt-auto">
          <MenuLabel isDarkMode={isDarkMode} isOpen={isOpenLocal}>Usuario</MenuLabel>

          <MenuItem to="/perfil" isDarkMode={isDarkMode} isOpen={isOpenLocal}>
            <AiOutlineUser />
            <span className={labelClass(isOpenLocal)}>Mi Perfil</span>
          </MenuItem>

          <MenuItem
            to="#"
            isDarkMode={isDarkMode}
            isOpen={isOpenLocal}
            onClick={(e) => { e.preventDefault(); handleLogout(); }}
            className="group text-rose-500 hover:bg-red-600/50 rounded-md transition-colors"
          >
            <AiOutlineLogout className="w-5 h-5 text-rose-500" />
            <span className={`${labelClass(isOpenLocal)} text-rose-500 `}>Cerrar Sesión</span>
          </MenuItem>

        <ThemeSwitch isDarkMode={isDarkMode} toggleTheme={toggleTheme} isOpen={isOpenLocal} />

        </MenuSection>
      </ScrollbarStyles>
    </SidebarContainer>
  );
};

export default Sidebar;
