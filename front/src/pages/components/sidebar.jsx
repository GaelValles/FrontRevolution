import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
    AiFillCar, 
    AiOutlineSchedule, 
    AiOutlineUser,
    AiOutlineSetting,
    AiOutlineLogout 
} from 'react-icons/ai';
import { BsCarFrontFill, BsCalendarCheck, BsClockHistory } from 'react-icons/bs';
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

const Sidebar = ({ onHover }) => {
  const [showLogout, setShowLogout] = useState(false);

  const handleLogout = () => {
    // Implementar lógica de logout
    console.log("Logout clicked");
  };

  return (
    <SidebarContainer 
      onMouseEnter={() => onHover(true)}
      onMouseLeave={() => onHover(false)}
    >
      <Link to="/" className="block mb-8">
        <Logo src="../assets/images/logo.png" alt="Logo" />
      </Link>

      <MenuSection>
        <MenuLabel>Vehículos</MenuLabel>
        <MenuItem to="/agregarCarro">
          <BsCarFrontFill />
          <span>Agregar Vehículo</span>
        </MenuItem>
        <MenuItem to="/mis-carros">
          <AiFillCar />
          <span>Mis Vehículos</span>
        </MenuItem>
      </MenuSection>

      <MenuSection>
        <MenuLabel>Citas</MenuLabel>
        <MenuItem to="/agregar-cita">
          <AiOutlineSchedule />
          <span>Nueva Cita</span>
        </MenuItem>
        <MenuItem to="/mis-citas">
          <BsCalendarCheck />
          <span>Citas Activas</span>
        </MenuItem>
        <MenuItem to="/historial-citas">
          <BsClockHistory />
          <span>Historial</span>
        </MenuItem>
      </MenuSection>

      <MenuSection>
        <MenuLabel>Servicios</MenuLabel>
        <MenuItem to="/planes-promociones">
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
