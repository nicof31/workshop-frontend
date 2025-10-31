import React, { useState, useRef, useEffect } from 'react';
import Navigation from './Navigation';

const Sidebar = ({ sidebarOpen, user, logout, activeComponent, setActiveComponent, openUserModal }) => {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const userMenuRef = useRef(null);

  const handleUserMenuToggle = (e) => {
    e.stopPropagation();
    setShowUserMenu(!showUserMenu);
  };

  const closeUserMenu = () => {
    setShowUserMenu(false);
  };

  // Cerrar menú al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        closeUserMenu();
      }
    };

    if (showUserMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showUserMenu]);

  return (
    <div 
      style={{
        width: sidebarOpen ? '280px' : '80px',
        backgroundColor: '#151515',
        borderRight: '1px solid #333',
        transition: 'all 0.3s ease',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        zIndex: 100,
        flexShrink: 0,
      }}
    >
      {/* Logo y Toggle */}
      <div style={{
        padding: 'clamp(15px, 3vw, 20px) clamp(20px, 4vw, 30px)',
        display: 'flex',
        alignItems: 'center',
        flexShrink: 0,
        minHeight: '70px',
      }}>
        <div
          style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          justifyContent: sidebarOpen ? 'flex-start' : 'center',
          width: '100%'
        }}
        >
          <div style={{
            width: '32px',
            height: '32px',
            background: 'linear-gradient(135deg, #4fc3f7, #6f42c1)',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 'bold',
            fontSize: '14px',
            flexShrink: 0,
            marginTop: '-20px'
          }}>
            AW
          </div>
          {sidebarOpen && (
            <span style={{
              fontWeight: 700,
              background: 'linear-gradient(90deg, #4fc3f7, #6f42c1)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              fontSize: '1.2rem',
              marginTop: '-20px'
            }}>
              AuthWorkshop
            </span>
          )}
        </div>
      </div>

      {/* Navigation */}
      <div style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden', padding: '20px 0' }}>
        <Navigation 
          sidebarOpen={sidebarOpen}
          activeComponent={activeComponent}
          setActiveComponent={setActiveComponent}
          openUserModal={openUserModal}
        />
      </div>

      {/* User Info y Logout - En la parte inferior */}
      <div style={{
        padding: '20px',
        marginTop: 'auto',
        borderTop: '1px solid #333',
        position: 'relative'
      }}>
        {/* Avatar del usuario */}
        <button
          onClick={handleUserMenuToggle}
          style={{
            width: '100%',
            padding: '10px',
            backgroundColor: 'transparent',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            transition: 'all 0.3s ease',
            outline: 'none'
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.backgroundColor = '#1a1a1a';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent';
          }}
        >
          <div style={{
            width: '40px',
            height: '40px',
            backgroundColor: '#4fc3f7',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 'bold',
            color: '#000',
            fontSize: '16px',
            flexShrink: 0
          }}>
            {user?.name?.charAt(0)?.toUpperCase() || 'U'}
          </div>
          {sidebarOpen && (
            <div style={{ textAlign: 'left', flex: 1, minWidth: 0 }}>
              <div style={{
                fontWeight: 600, 
                fontSize: 'clamp(0.8rem, 2vw, 0.9rem)',
                color: '#ffffff',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis'
              }}>
                {user?.name} {user?.surname}
              </div>
              <div style={{
                color: '#4fc3f7',
                fontSize: 'clamp(0.7rem, 2vw, 0.8rem)',
                textTransform: 'capitalize',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis'
              }}>
                {user?.role}
              </div>
            </div>
          )}
        </button>

        {/* Modal del menú de usuario - POSICIONADO AL LADO DEL SIDEBAR */}
        {showUserMenu && (
          <div 
            ref={userMenuRef}
            style={{
              position: 'fixed',
              top: 'auto',
              bottom: '80px',
              left: sidebarOpen ? '280px' : '80px',
              width: '220px',
              backgroundColor: '#0a0a0a',
              border: '1px solid #333',
              borderRadius: '8px',
              boxShadow: '0 8px 30px rgba(0, 0, 0, 0.8)',
              zIndex: 1002,
              padding: '10px 0',
              backdropFilter: 'blur(10px)',
              transition: 'left 0.3s ease'
            }}
          >
            {/* Información del usuario en el modal */}
            <div style={{
              padding: '12px 16px',
              borderBottom: '1px solid #333',
              marginBottom: '5px'
            }}>
              <div style={{
                fontWeight: 600,
                color: '#ffffff',
                fontSize: '0.9rem',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis'
              }}>
                {user?.name} {user?.surname}
              </div>
              <div style={{
                color: '#4fc3f7',
                fontSize: '0.8rem',
                textTransform: 'capitalize'
              }}>
                {user?.role}
              </div>
              <div style={{
                color: '#888',
                fontSize: '0.7rem',
                marginTop: '4px'
              }}>
                {user?.email}
              </div>
            </div>

            {/* Opción Mi Perfil */}
            <button
              style={{
                width: '100%',
                padding: '12px 16px',
                backgroundColor: 'transparent',
                border: 'none',
                color: '#cccccc',
                textAlign: 'left',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                transition: 'all 0.3s ease',
                fontSize: '0.9rem',
                outline: 'none'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.backgroundColor = '#1a1a1a';
                e.currentTarget.style.color = '#4fc3f7';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.color = '#cccccc';
              }}
              onClick={(e) => {
                e.stopPropagation();
                setActiveComponent('profile');
                closeUserMenu();
              }}
            >
              <span style={{ fontSize: '1rem' }}>👤</span>
              <span>Mi Perfil</span>
            </button>

            {/* Opción Configuración */}
            <button
              style={{
                width: '100%',
                padding: '12px 16px',
                backgroundColor: 'transparent',
                border: 'none',
                color: '#cccccc',
                textAlign: 'left',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                transition: 'all 0.3s ease',
                fontSize: '0.9rem',
                outline: 'none'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.backgroundColor = '#1a1a1a';
                e.currentTarget.style.color = '#4fc3f7';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.color = '#cccccc';
              }}
              onClick={(e) => {
                e.stopPropagation();
                setActiveComponent('settings');
                closeUserMenu();
              }}
            >
              <span style={{ fontSize: '1rem' }}>⚙️</span>
              <span>Configuración</span>
            </button>

            {/* Opción MFA */}
            <button
              style={{
                width: '100%',
                padding: '12px 16px',
                backgroundColor: 'transparent',
                border: 'none',
                color: '#cccccc',
                textAlign: 'left',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                transition: 'all 0.3s ease',
                fontSize: '0.9rem',
                outline: 'none'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.backgroundColor = '#1a1a1a';
                e.currentTarget.style.color = '#4fc3f7';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.color = '#cccccc';
              }}
              onClick={(e) => {
                e.stopPropagation();
                console.log('MFA clicked');
                closeUserMenu();
              }}
            >
              <span style={{ fontSize: '1rem' }}>🔒</span>
              <span>Autenticación MFA</span>
            </button>

            {/* Separador */}
            <div style={{
              height: '1px',
              backgroundColor: '#333',
              margin: '5px 0'
            }}></div>

            {/* Opción Cerrar Sesión */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                logout();
              }}
              style={{
                width: '100%',
                padding: '12px 16px',
                backgroundColor: 'transparent',
                border: 'none',
                color: '#dc3545',
                textAlign: 'left',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                transition: 'all 0.3s ease',
                fontSize: '0.9rem',
                outline: 'none'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.backgroundColor = '#dc3545';
                e.currentTarget.style.color = '#ffffff';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.color = '#dc3545';
              }}
            >
              <span style={{ fontSize: '1rem' }}>🚪</span>
              <span>Cerrar Sesión</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;