import React, { useState } from 'react';
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
  LogoutButton,
  MenuSection,
  MenuLabel
} from '../../styles/sidebar.styles';
import LogoImg from '../../assets/images/logo.png'; // Updated import path
import { useAuth } from '../../context/AuthContext';

const Sidebar = ({ onHover }) => {
  const [showLogout, setShowLogout] = useState(false);
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    try {
      logout();
      navigate('/login');
      // Opcional: Mostrar algún mensaje de éxito
    } catch (error) {
      console.error('Error during logout:', error);
      // Opcional: Mostrar algún mensaje de error
    }
  };

  return (
    <SidebarContainer 
      onMouseEnter={() => onHover(true)}
      onMouseLeave={() => onHover(false)}
    >
      <Link to="/inicioCliente" className="block mb-8">
        <Logo src={LogoImg} alt="Logo" />
      </Link>

      <MenuSection>
        <MenuLabel>Regresar al Inicio</MenuLabel>
        <MenuItem to="/inicioCliente">
          <BsHouse/>
          <span>Inicio</span>
        </MenuItem>

      </MenuSection>

      <MenuSection>
        <MenuLabel>Vehículos</MenuLabel>
        <MenuItem to="/agregarCarro">
          <BsCarFrontFill />
          <span>Agregar Vehículo</span>
        </MenuItem>
        <MenuItem to="/misCarros">
          <AiFillCar />
          <span>Mis Vehículos</span>
        </MenuItem>
      </MenuSection>

      <MenuSection>
        <MenuLabel>Citas</MenuLabel>
        <MenuItem to="/agregarCita">
          <AiOutlineSchedule />
          <span>Nueva Cita</span>
        </MenuItem>
        <MenuItem to="/misCitas">
          <BsCalendarCheck />
          <span>Citas Activas</span>
        </MenuItem>
        <MenuItem to="/historialCitas">
          <BsClockHistory />
          <span>Historial</span>
        </MenuItem>
      </MenuSection>

      <MenuSection>
        <MenuLabel>Servicios</MenuLabel>
        <MenuItem to="/planes">
          <MdLocalOffer />
          <span>Planes y Promociones</span>
        </MenuItem>
      </MenuSection>

      <MenuSection className="mt-auto">
        <MenuLabel>Usuario</MenuLabel>
        <MenuItem to="/perfil">
          <AiOutlineUser />
          <span>Mi Perfil</span>
        </MenuItem>
        <ConfigButton>
          <MenuItem to="#" onClick={() => setShowLogout(!showLogout)}>
            <AiOutlineSetting />
            <span>Configuración</span>
          </MenuItem>
          {showLogout && (
            <LogoutButton onClick={handleLogout}>
              <AiOutlineLogout />
              <span>Cerrar Sesión</span>
            </LogoutButton>
          )}
        </ConfigButton>
      </MenuSection>
    </SidebarContainer>
  );
};

export default Sidebar;
