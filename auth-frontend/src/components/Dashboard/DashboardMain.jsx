import React from 'react';
import { useAuth } from '../../context/AuthContext';

const DashboardMain = () => {
  const { user, isAuthenticated, loading } = useAuth();

  // Debugging mejorado
  console.log('🔍 DashboardMain - User completo:', user);
  console.log('🔍 DashboardMain - isAuthenticated:', isAuthenticated);
  console.log('🔍 DashboardMain - loading:', loading);

  // Función helper para obtener datos del usuario sin importar la estructura
  const getUserData = () => {
    // Si user tiene la propiedad data, usamos user.data
    // Si no, usamos user directamente
    return user?.data || user;
  };

  const userData = getUserData();

  // Mostrar loading mientras se verifica la autenticación
  if (loading) {
    return (
      <div style={{ 
        width: '100%', 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center',
        padding: '40px'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          color: '#4fc3f7'
        }}>
          <div style={{
            animation: 'spin 1s linear infinite',
            borderRadius: '50%',
            height: '24px',
            width: '24px',
            border: '3px solid transparent',
            borderTop: '3px solid #4fc3f7'
          }}></div>
          Cargando...
        </div>
      </div>
    );
  }

  // Si no está autenticado
  if (!isAuthenticated) {
    return (
      <div style={{ 
        width: '100%', 
        textAlign: 'center',
        padding: '40px'
      }}>
        <h2 style={{ color: '#ff6b6b' }}>🔐 No autenticado</h2>
        <p style={{ color: '#cccccc' }}>
          Por favor inicia sesión para acceder al dashboard.
        </p>
      </div>
    );
  }

  // Si user es null pero isAuthenticated es true (caso raro)
  if (!userData) {
    return (
      <div style={{ 
        width: '100%', 
        textAlign: 'center',
        padding: '40px'
      }}>
        <h2 style={{ color: '#ffc107' }}>⚠️ Error cargando datos</h2>
        <p style={{ color: '#cccccc' }}>
          No se pudieron cargar los datos del usuario.
        </p>
        <p style={{ color: '#888', fontSize: '0.8rem', marginTop: '10px' }}>
          Estructura recibida: {JSON.stringify(user, null, 2)}
        </p>
      </div>
    );
  }

  return (
    <div style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }}>
      {/* Welcome Banner */}
      <div style={{
        backgroundColor: '#151515',
        border: '1px solid #333',
        borderRadius: '10px',
        //padding: 'clamp(20px, 4vw, 30px)',
        padding: 'clamp(10px, 2vw, 15px)', // ← Reducido
        marginBottom: 'clamp(15px, 2vw, 20px)', // ← Reducido
        
        //marginBottom: 'clamp(20px, 4vw, 30px)',

        background: 'linear-gradient(135deg, #151515 0%, #1a1a1a 100%)',
        width: '100%',
        boxSizing: 'border-box'
      }}>
        <h1 style={{
          color: '#4fc3f7',
          margin: '0 0 10px 0',
          fontSize: 'clamp(1.5rem, 5vw, 2rem)',
          lineHeight: '1.2'
        }}>
          🎉 ¡Bienvenido{userData?.name ? `, ${userData.name}` : ''}!
        </h1>
        <p style={{
          color: '#cccccc',
          fontSize: 'clamp(0.9rem, 3vw, 1.1rem)',
          margin: 0,
          lineHeight: '1.5'
        }}>
          Has iniciado sesión correctamente en el sistema de autenticación.
        </p>
      </div>

      {/* Stats Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
        gap: 'clamp(15px, 3vw, 20px)',
        marginBottom: 'clamp(20px, 4vw, 30px)',
        width: '100%'
      }}>
        {[
          { icon: '👥', title: 'Usuarios Totales', value: '1', color: '#4fc3f7' },
          { icon: '✅', title: 'Sesiones Activas', value: '1', color: '#198754' },
          { icon: '🛡️', title: 'Nivel de Seguridad', value: 'Alto', color: '#6f42c1' },
          { icon: '📅', title: 'Días Activo', value: '1', color: '#ffc107' }
        ].map((stat, index) => (
          <div
            key={index}
            style={{
              backgroundColor: '#151515',
              border: '1px solid #333',
              borderRadius: '10px',
              padding: 'clamp(20px, 3vw, 25px)',
              textAlign: 'center',
              transition: 'all 0.3s ease',
              width: '100%',
              boxSizing: 'border-box'
            }}>
            <div style={{
              fontSize: 'clamp(2rem, 6vw, 2.5rem)',
              marginBottom: 'clamp(8px, 2vw, 10px)'
            }}>
              {stat.icon}
            </div>
            <div style={{
              color: stat.color,
              fontSize: 'clamp(1.5rem, 4vw, 2rem)',
              fontWeight: 'bold',
              marginBottom: '5px',
              lineHeight: '1.2'
            }}>
              {stat.value}
            </div>
            <div style={{
              color: '#cccccc',
              fontSize: 'clamp(0.8rem, 2vw, 0.9rem)',
              lineHeight: '1.3'
            }}>
              {stat.title}
            </div>
          </div>
        ))}
      </div>

      {/* User Info Card */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: 'clamp(15px, 3vw, 20px)',
        marginBottom: 'clamp(20px, 4vw, 30px)',
        width: '100%'
      }}>
        <div style={{
          backgroundColor: '#151515',
          border: '1px solid #333',
          borderRadius: '10px',
          padding: 'clamp(20px, 3vw, 25px)',
          width: '100%',
          boxSizing: 'border-box'
        }}>
          <h3 style={{
            color: '#4fc3f7',
            margin: '0 0 clamp(15px, 3vw, 20px) 0',
            fontSize: 'clamp(1.1rem, 3vw, 1.3rem)'
          }}>
            📋 Información del Usuario
          </h3>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: 'clamp(12px, 2vw, 15px)',
            color: '#cccccc'
          }}>
            <div>
              <p style={{ margin: '0 0 12px 0', fontSize: 'clamp(0.8rem, 2vw, 0.9rem)' }}>
                <strong>👤 Nombre:</strong><br />
                {userData?.name || 'N/A'} {userData?.surname || ''}
              </p>
              <p style={{ margin: '0 0 12px 0', fontSize: 'clamp(0.8rem, 2vw, 0.9rem)' }}>
                <strong>📧 Email:</strong><br />
                {userData?.email || 'N/A'}
              </p>
              <p style={{ margin: 0, fontSize: 'clamp(0.8rem, 2vw, 0.9rem)' }}>
                <strong>🎂 Edad:</strong><br />
                {userData?.age ? `${userData.age} años` : 'N/A'}
              </p>
            </div>
            <div>
              <p style={{ margin: '0 0 12px 0', fontSize: 'clamp(0.8rem, 2vw, 0.9rem)' }}>
                <strong>🛡️ Rol:</strong><br />
                <span style={{ 
                  color: userData?.role === 'admin' ? '#4fc3f7' : '#6f42c1',
                  textTransform: 'capitalize'
                }}>
                  {userData?.role || 'N/A'}
                </span>
              </p>
              <p style={{ margin: '0 0 12px 0', fontSize: 'clamp(0.8rem, 2vw, 0.9rem)' }}>
                <strong>📅 Registrado:</strong><br />
                {userData?.createdAt ? new Date(userData.createdAt).toLocaleDateString() : 'N/A'}
              </p>
              <p style={{ margin: 0, fontSize: 'clamp(0.8rem, 2vw, 0.9rem)' }}>
                <strong>🆔 User ID:</strong><br />
                {userData?._id ? `${userData._id.substring(0, 8)}...` : 'N/A'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Workshop Info */}
      <div style={{
        backgroundColor: '#151515',
        border: '1px solid #333',
        borderRadius: '10px',
        padding: 'clamp(20px, 3vw, 25px)',
        width: '100%',
        boxSizing: 'border-box'
      }}>
        <h3 style={{
          color: '#4fc3f7',
          margin: '0 0 clamp(12px, 2vw, 15px) 0',
          fontSize: 'clamp(1.1rem, 3vw, 1.3rem)'
        }}>
          🚀 Sobre este Workshop
        </h3>
        <p style={{ 
          color: '#cccccc', 
          lineHeight: '1.6', 
          margin: 0,
          fontSize: 'clamp(0.8rem, 2vw, 0.9rem)'
        }}>
          Este es un sistema de autenticación moderno construido con <strong>NestJS</strong> en el backend 
          y <strong>React + Vite</strong> en el frontend. Incluye características de seguridad avanzadas 
          como JWT, protección contra fuerza bruta, rate limiting y auditoría completa.
        </p>
      </div>

      <style>
        {`@keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }`}
      </style>
    </div>
  );
};

export default DashboardMain;