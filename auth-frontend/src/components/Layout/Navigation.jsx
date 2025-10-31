import React from 'react';
import { useAuth } from '../../context/AuthContext';

const Navigation = ({ sidebarOpen, activeComponent, setActiveComponent }) => {
  const { user, checkAdminAccess, isAuthenticated } = useAuth();

  // Función helper para obtener datos del usuario
  const getUserData = () => {
    return user?.data || user;
  };

  const userData = getUserData();

  console.log('🔍 Navigation - User completo:', user);
  console.log('🔍 Navigation - User data:', userData);
  console.log('🔍 Navigation - isAuthenticated:', isAuthenticated);

  // Si no está autenticado, no mostrar navegación
  if (!isAuthenticated) {
    return null;
  }

  const navItems = [
    {
      icon: '📊',
      label: 'Dashboard',
      id: 'dashboard',
      onClick: () => setActiveComponent('dashboard')
    },
    {
      icon: '👥',
      label: 'Gestión de Usuarios',
      id: 'users',
      adminOnly: true,
      onClick: () => setActiveComponent('users')
    },
    {
      icon: '📈',
      label: 'Estadísticas',
      id: 'stats',
      onClick: () => setActiveComponent('stats'),
      adminOnly: true
    },
/*     {
      icon: '⚙️',
      label: 'Configuración',
      id: 'settings',
      onClick: () => setActiveComponent('settings')
    },
    { 
      icon: '👤', 
      label: 'Mi Perfil', 
      id: 'profile', 
      onClick: () => setActiveComponent('profile')
    } */
  ];

  const handleNavigation = (item, e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    
    console.log(`Clicked: ${item.label} (ID: ${item.id})`);
    
    if (item.adminOnly && !checkAdminAccess()) {
      console.log('Acceso denegado: se requiere rol de administrador');
      return;
    }
    
    if (item.onClick) {
      if (e) e.preventDefault();
      window.location.hash = item.id;
    }
  };

  return (
    <nav>
      {navItems.map(item => {
        // Usar userData.role en lugar de user.role
        const userRole = userData?.role;
        const isAdmin = userRole === 'admin' || userRole === 'super-admin';
        
        if (item.adminOnly && !isAdmin) {
          return null;
        }
        
        return (
          <a
            href={`#${item.id}`}
            key={item.id}
            style={{
              width: '100%',
              padding: '15px 20px',
              backgroundColor: activeComponent === item.id ? '#2d2d2d' : 'transparent',
              border: 'none',
              color: activeComponent === item.id ? '#4fc3f7' : '#cccccc',
              textAlign: 'left',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              transition: 'all 0.3s ease',
              fontSize: '0.9rem',
              outline: 'none',
              textDecoration: 'none'
            }}
            onMouseOver={(e) => {
              if (activeComponent !== item.id) {
                e.currentTarget.style.backgroundColor = '#2d2d2d';
                e.currentTarget.style.color = '#4fc3f7';
              }
            }}
            onMouseOut={(e) => {
              if (activeComponent !== item.id) {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.color = '#cccccc';
              }
            }}
            onClick={(e) => handleNavigation(item, e)}
          >
            <span style={{ fontSize: '1.1rem', minWidth: '24px' }}>{item.icon}</span>
            {sidebarOpen && <span>{item.label}</span>}
          </a>
        );
      })}
    </nav>
  );
};

export default Navigation;