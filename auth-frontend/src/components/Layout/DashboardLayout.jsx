import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import Sidebar from './Sidebar';
import StatsDashboard from '../Stats/StatsDashboard';
import UserManagementPage from '../UserManagemnt/UserManagementPage';

const DashboardLayout = ({ children }) => {
  const { user, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeComponent, setActiveComponent] = useState('dashboard');

  useEffect(() => {
    // Función para leer el hash de la URL y actualizar el componente activo
    const handleHashChange = () => {
      const hash = window.location.hash.substring(1); // Elimina el '#'
      if (hash) {
        setActiveComponent(hash);
      }
    };

    // Escuchar cambios en el hash y establecer el estado inicial
    window.addEventListener('hashchange', handleHashChange);
    handleHashChange(); // Llamar al inicio para leer el hash actual

    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  return (
    <div 
      style={{
        display: 'flex',
        minHeight: '100vh',
        backgroundColor: '#0a0a0a',
        color: '#ffffff',
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        overflow: 'hidden'
      }}
    >
      {/* Sidebar */}
      <Sidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        user={user}
        logout={logout}
        activeComponent={activeComponent}
        setActiveComponent={setActiveComponent}
      />

      {/* Main Content */}
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        minWidth: 0,
        width: '100%',
      }}>
        <div style={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0 }}>
          {/* Header */}
          <header style={{
            backgroundColor: '#151515',
            borderBottom: '1px solid #333',
            padding: 'clamp(15px, 3vw, 20px) clamp(20px, 4vw, 30px)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexShrink: 0,
            gap: '15px',
            minHeight: '70px',
            boxSizing: 'border-box'
          }}>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setSidebarOpen(!sidebarOpen);
              }}
              style={{
                background: 'none',
                border: 'none',
                color: '#4fc3f7',
                cursor: 'pointer',
                fontSize: '1.2rem',
                padding: '8px 12px',
                borderRadius: '6px',
                transition: 'all 0.3s ease',
                flexShrink: 0
              }}
              onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#1a1a1a'}
              onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
            >
              ☰
            </button>
            
            <h1 style={{
              color: '#4fc3f7',
              margin: 0,
              fontSize: 'clamp(1.1rem, 4vw, 1.5rem)',
              fontWeight: 600,
              textAlign: 'center',
              flex: 1
            }}>
              {getPageTitle(activeComponent)}
            </h1>
            
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              color: '#cccccc',
              fontSize: 'clamp(0.8rem, 2vw, 0.9rem)',
              flexShrink: 0
            }}>
              <span>Bienvenido, {user?.name}</span>
              <div style={{
                width: '8px',
                height: '8px',
                backgroundColor: '#198754',
                borderRadius: '50%',
                flexShrink: 0
              }}></div>
            </div>
          </header>

          {/* Page Content */}
          <main style={{
            flex: 1,
            padding: 'clamp(10px, 2vw, 15px)', 
            overflow: 'auto',
            display: 'flex',
            justifyContent: 'center',
            width: '100%'
          }}>
          <div style={{
            width: '98%',
            maxWidth: '1400px',
            margin: '0 27px 0 auto', 
            paddingRight: '0.1px',
            boxSizing: 'border-box'
          }}>
              {renderContent(activeComponent, children)}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

// Función para obtener el título de la página
const getPageTitle = (activeComponent) => {
  switch (activeComponent) {
    case 'dashboard':
      return 'Dashboard Principal';
    case 'stats':
      return 'Estadísticas';
    case 'users':
      return 'Gestión de Usuarios';
    case 'settings':
      return 'Configuración';
    case 'profile':
      return 'Mi Perfil';
    default:
      return 'Dashboard Principal';
  }
};

// Función para renderizar el contenido basado en el componente activo
const renderContent = (activeComponent, children) => {
  switch (activeComponent) {
    case 'dashboard':
      return children; // Aquí renderiza el contenido del dashboard por defecto
    case 'stats':
      return <StatsDashboard />;
    case 'users':
      return <UserManagementPage />;
    case 'settings':
      return <SettingsPage />;
    case 'profile':
      return <ProfilePage />;
    default:
      return children;
  }
};

// Componentes de las páginas (crea estos archivos o define aquí temporalmente)
const SettingsPage = () => (
  <div style={{ color: '#fff' }}>
    <h1>Configuración</h1>
    <p>Contenido de configuración aquí...</p>
  </div>
);

const ProfilePage = () => (
  <div style={{ color: '#fff' }}>
    <h1>Mi Perfil</h1>
    <p>Contenido del perfil aquí...</p>
  </div>
);

export default DashboardLayout;