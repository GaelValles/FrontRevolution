import styled from 'styled-components';
import { Link } from 'react-router-dom';

export const SidebarContainer = styled.div`
  width: 80px;
  min-width: 80px; // Added to prevent shrinking
  height: 100vh;
  background: rgba(10, 10, 10, 0.95);
  position: fixed;
  left: 0;
  top: 0;
  padding: 16px 0;
  color: white;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.2);
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  scrollbar-width: none;
  z-index: 50;
  backdrop-filter: blur(10px);
  transform-origin: left;
  
  &:hover {
    width: 250px;
    background: rgba(15, 15, 15, 0.98);
    padding: 20px 0;
  }

  &::-webkit-scrollbar {
    display: none;
  }
`;

export const MenuSection = styled.div`
  margin-bottom: ${props => props.className?.includes('mt-auto') ? '0' : '8px'};
  position: relative;
  width: 100%; // Added to ensure full width
  display: flex;
  flex-direction: column;
  align-items: center;

  ${SidebarContainer}:hover & {
    margin-bottom: 16px;
    align-items: stretch;
  }
`;

export const MenuItem = styled(Link)`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 10px;
  color: ${props => props.active ? '#fff' : 'rgba(255, 255, 255, 0.7)'};
  text-decoration: none;
  transition: all 0.2s ease;
  position: relative;
  overflow: hidden;
  height: 40px;
  width: 100%; // Added to ensure proper width
  transform: translateX(0);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

  span {
    display: block;
    opacity: 0;
    transform: translateX(-10px);
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    margin-left: 16px;
    font-weight: 500;
    white-space: nowrap;
    width: 0; // Added to hide text in collapsed state
    overflow: hidden; // Added to prevent text overflow
  }

  &:hover {
    color: white;
    background: rgba(255, 255, 255, 0.05);
  }

  &::before {
    content: '';
    position: absolute;
    left: 0;
    top: 50%;
    height: ${props => props.active ? '20px' : '0'};
    width: 3px;
    background: ${props => props.active ? 'white' : 'transparent'};
    transition: all 0.2s ease;
    transform: translateY(-50%);
  }

  svg {
    min-width: 20px;
    width: 20px;
    height: 20px;
    transition: all 0.3s ease;
    margin: 0; // Reset margin in collapsed state
  }

  ${SidebarContainer}:hover & {
    padding: 12px 24px;
    justify-content: flex-start;
    height: 44px; // Slightly increase height in expanded state
    
    span {
      opacity: 1;
      transform: translateX(0);
      transition-delay: 0.1s;
      width: auto; // Restore text width in expanded state
    }

    svg {
      transform: translateX(0);
      transition-delay: 0.05s;
    }
  }
`;

export const MenuLabel = styled.div`
  font-size: 0.75rem;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.3);
  padding: 0 20px;
  margin-bottom: 8px;
  letter-spacing: 0.05em;
  white-space: nowrap;
  opacity: 0;
  transition: opacity 0.3s ease;
  transform: translateX(-10px);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

  ${SidebarContainer}:hover & {
    opacity: 1;
    transform: translateX(0);
    transition-delay: 0.15s;
  }
`;

export const Logo = styled.img`
  width: 40px;
  height: 40px;
  margin: 0 auto;
  display: block;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  filter: brightness(0.95);
  margin-bottom: 16px;
  object-fit: contain;
  transform: scale(0.8);
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);

  ${SidebarContainer}:hover & {
    transform: scale(1);
    width: 150px;
  }
`;

export const ConfigButton = styled.div`
  position: relative;
`;

export const LogoutButton = styled.div`
  padding: 12px 16px;
  cursor: pointer;
  display: flex;
  align-items: center;
  color: #ff4444;
  transition: all 0.2s ease;
  white-space: nowrap;
  overflow: hidden;
  
  &:hover {
    background: rgba(255, 68, 68, 0.1);
  }

  svg {
    min-width: 20px;
    font-size: 20px;
    margin: 0 auto;
    transition: margin 0.3s ease;
  }

  span {
    opacity: 0;
    transform: translateX(10px);
    transition: all 0.3s ease;
    margin-left: 16px;
    font-weight: 500;
  }

  ${SidebarContainer}:hover & {
    padding: 12px 24px;
    
    svg {
      margin: 0;
    }

    span {
      opacity: 1;
      transform: translateX(0);
    }
  }
`;