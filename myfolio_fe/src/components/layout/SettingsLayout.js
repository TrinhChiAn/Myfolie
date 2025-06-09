import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { Settings, FolderOpen, Person, ExitToApp, Menu } from '@mui/icons-material';

const Container = styled.div`
  display: grid;
  grid-template-columns: 250px 1fr;
  min-height: 100vh;

  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
    grid-template-columns: 1fr;
  }
`;

const Sidebar = styled.aside`
  background-color: white;
  padding: 2rem;
  border-right: 1px solid #E5E7EB;

  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
    display: ${props => props.isOpen ? 'block' : 'none'};
    position: fixed;
    top: 60px;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 100;
    border-right: none;
    border-top: 1px solid #E5E7EB;
  }
`;

const Logo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 2rem;
  font-size: 1.5rem;
  font-weight: bold;
  color: ${props => props.theme.colors.text};
`;

const Navigation = styled.nav`
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

const NavSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const NavLink = styled(Link)`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem;
  color: ${props => props.active ? props.theme.colors.primary : props.theme.colors.text};
  text-decoration: none;
  border-radius: 0.5rem;
  transition: all 0.2s ease-in-out;

  &:hover {
    background-color: ${props => props.theme.colors.background};
  }

  svg {
    font-size: 1.25rem;
  }
`;

const LogoutButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem;
  color: ${props => props.theme.colors.error};
  background: none;
  border: none;
  width: 100%;
  text-align: left;
  font-size: 1rem;
  cursor: pointer;
  border-radius: 0.5rem;
  transition: all 0.2s ease-in-out;

  &:hover {
    background-color: ${props => props.theme.colors.background};
  }

  svg {
    font-size: 1.25rem;
  }
`;

const Content = styled.main`
  padding: 2rem;
  background-color: #F9FAFB;

  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
    padding-top: calc(60px + 2rem);
  }
`;

const MobileHeader = styled.div`
  display: none;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 60px;
  background-color: white;
  padding: 0 1rem;
  border-bottom: 1px solid #E5E7EB;
  align-items: center;
  justify-content: space-between;
  z-index: 101;

  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
    display: flex;
  }
`;

const MobileMenuButton = styled.button`
  display: none;
  background: none;
  border: none;
  padding: 0.5rem;
  cursor: pointer;
  color: ${props => props.theme.colors.text};

  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
    display: block;
  }
`;

const SettingsLayout = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <Container>
      <MobileHeader>
        <MobileMenuButton onClick={toggleMenu}>
          <Menu />
        </MobileMenuButton>
        <Logo>BlueCyber</Logo>
        <MobileMenuButton onClick={handleLogout}>
          <ExitToApp />
        </MobileMenuButton>
      </MobileHeader>
      
      <Sidebar isOpen={isMenuOpen}>
        <Logo>BlueCyber</Logo>
        <Navigation>
          <NavSection>
            <NavLink 
              to="/settings/profile" 
              active={location.pathname === '/settings/profile'}
            >
              <Person /> Profile
            </NavLink>
            <NavLink 
              to="/settings/projects" 
              active={location.pathname === '/settings/projects'}
            >
              <FolderOpen /> Projects
            </NavLink>
            <NavLink 
              to="/settings/account" 
              active={location.pathname === '/settings/account'}
            >
              <Settings /> Account
            </NavLink>
          </NavSection>
          <NavSection>
            <LogoutButton onClick={handleLogout}>
              <ExitToApp /> Logout
            </LogoutButton>
          </NavSection>
        </Navigation>
      </Sidebar>
      <Content>
        {children}
      </Content>
    </Container>
  );
};

export default SettingsLayout; 