import styled from 'styled-components';
import { Link } from 'react-router-dom';

export const SidebarContainer = styled.nav`
  position: fixed;
  left: 0;
  top: 0;
  bottom: 0;
  /* open width increased so labels fit */
  width: ${({ isOpen }) => (isOpen ? '300px' : '72px')};
  padding: ${({ isOpen }) => (isOpen ? '2rem' : '1rem 0.5rem')};
  transition: width 220ms cubic-bezier(.2,.9,.2,1), padding 220ms ease, background 200ms ease;
  z-index: 50;
  overflow-y: auto;
  height: 100vh;
  -webkit-overflow-scrolling: touch;
  background: ${({ isDarkMode }) =>
    isDarkMode ? 'rgba(9, 12, 20, 0.98)' : 'rgba(255, 255, 255, 0.98)'};
  border-right: 1px solid
    ${({ isDarkMode }) => (isDarkMode ? 'rgba(255, 255, 255, 0.06)' : 'rgba(0, 0, 0, 0.06)')};
  box-shadow: ${({ isDarkMode }) =>
    isDarkMode ? '0 2px 12px rgba(0,0,0,0.6)' : '0 2px 12px rgba(16,24,40,0.04)'};
`;

/* custom thin scrollbar that matches the style (modern browsers) */
export const ScrollbarStyles = styled.div`
  ::-webkit-scrollbar {
    width: 6px;
  }
  ::-webkit-scrollbar-track {
    background: transparent;
  }
  ::-webkit-scrollbar-thumb {
    background: ${({ isDarkMode }) => (isDarkMode ? 'rgba(255,255,255,0.08)' : 'rgba(16,24,40,0.08)')};
    border-radius: 999px;
  }
  scrollbar-width: thin;
  scrollbar-color: ${({ isDarkMode }) => (isDarkMode ? 'rgba(255,255,255,0.08) transparent' : 'rgba(16,24,40,0.08) transparent')};
`;

export const Logo = styled.img`
  height: 40px;
  width: auto;
  margin: 0 auto;
`;

// MenuItem ahora respeta isOpen para centrar iconos cuando está cerrado
export const MenuItem = styled(Link)`
  display: flex;
  align-items: center;
  gap: ${({ isOpen }) => (isOpen ? '1rem' : '0')};
  padding: 0.75rem 1rem;
  border-radius: 0.75rem;
  transition: all 180ms ease;
  margin-bottom: 0.25rem;
  color: ${({ isDarkMode }) => (isDarkMode ? 'rgba(255, 255, 255, 0.92)' : 'rgba(10, 10, 10, 0.88)')};
  justify-content: ${({ isOpen }) => (isOpen ? 'flex-start' : 'center')};
  white-space: nowrap;
  overflow: hidden;

  &:hover {
    background: ${({ isDarkMode }) =>
      isDarkMode ? 'rgba(255, 255, 255, 0.06)' : 'rgba(0, 0, 0, 0.04)'};
    color: ${({ isDarkMode }) => (isDarkMode ? '#ffffff' : '#000000')};
  }

  svg {
    width: 1.25rem;
    height: 1.25rem;
    opacity: ${({ isDarkMode }) => (isDarkMode ? '0.95' : '0.9')};
    flex-shrink: 0;
  }

  /* show text only when open, with ellipsis and space to fit */
  span {
    display: ${({ isOpen }) => (isOpen ? 'inline-block' : 'none')};
    max-width: ${({ isOpen }) => (isOpen ? '195px' : '0')};
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    transition: opacity 180ms ease, transform 180ms ease;
  }
`;

export const MenuLabel = styled.div`
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin: 1.5rem 0 0.75rem;
  padding-left: ${({ isOpen }) => (isOpen ? '0.75rem' : '0')};
  color: ${({ isDarkMode }) => (isDarkMode ? 'rgba(255, 255, 255, 0.45)' : 'rgba(0, 0, 0, 0.45)')};
  display: ${({ isOpen }) => (isOpen ? 'block' : 'none')};
`;

export const MenuSection = styled.div`
  margin-bottom: 1rem;
`;

export const ConfigButton = styled.div`
  position: relative;
`;