import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { userService } from '../../services/auth';

const StatsDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (user?.role === 'admin' || user?.role === 'super-admin') {
      loadStats();
    }
  }, [user]);

  const loadStats = async () => {
    try {
      setLoading(true);
      const response = await userService.getStats();
      setStats(response.data);
      setError('');
    } catch (err) {
      console.error('Error loading stats:', err);
      setError('Error al cargar las estadísticas');
    } finally {
      setLoading(false);
    }
  };

  // Si no es admin, mostrar mensaje
  if (!user || (user.role !== 'admin' && user.role !== 'super-admin')) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '400px',
        flexDirection: 'column',
        gap: '20px'
      }}>
        <div style={{ fontSize: '4rem' }}>🚫</div>
        <h2 style={{ color: '#dc3545', textAlign: 'center' }}>
          Acceso Restringido
        </h2>
        <p style={{ color: '#cccccc', textAlign: 'center', maxWidth: '400px' }}>
          Solo los usuarios administradores pueden acceder a esta sección.
        </p>
      </div>
    );
  }

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '400px',
        flexDirection: 'column',
        gap: '15px'
      }}>
        <div style={{
          width: '40px',
          height: '40px',
          border: '3px solid #4fc3f7',
          borderTop: '3px solid transparent',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }}></div>
        <p style={{ color: '#4fc3f7' }}>Cargando estadísticas...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '400px',
        flexDirection: 'column',
        gap: '15px'
      }}>
        <div style={{ fontSize: '3rem' }}>❌</div>
        <h3 style={{ color: '#dc3545' }}>Error</h3>
        <p style={{ color: '#cccccc' }}>{error}</p>
        <button
          onClick={loadStats}
          style={{
            padding: '10px 20px',
            backgroundColor: '#4fc3f7',
            border: 'none',
            borderRadius: '6px',
            color: '#000',
            cursor: 'pointer',
            fontWeight: 'bold'
          }}
        >
          Reintentar
        </button>
      </div>
    );
  }

  return (
    <div style={{ width: '100%', boxSizing: 'border-box' }}>
      {/* Header de Estadísticas */}
      <div style={{
        backgroundColor: '#151515',
        border: '1px solid #333',
        borderRadius: '10px',
        padding: 'clamp(20px, 4vw, 30px)',
        marginBottom: 'clamp(20px, 4vw, 30px)',
        background: 'linear-gradient(135deg, #151515 0%, #1a1a1a 100%)'
      }}>
        <h1 style={{
          color: '#4fc3f7',
          margin: '0 0 10px 0',
          fontSize: 'clamp(1.5rem, 5vw, 2rem)',
          lineHeight: '1.2'
        }}>
          📊 Dashboard de Estadísticas
        </h1>
        <p style={{
          color: '#cccccc',
          fontSize: 'clamp(0.9rem, 3vw, 1.1rem)',
          margin: 0,
          lineHeight: '1.5'
        }}>
          Métricas y análisis del sistema de usuarios
        </p>
      </div>

      {/* Grid de Estadísticas Principales */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: 'clamp(15px, 3vw, 20px)',
        marginBottom: 'clamp(20px, 4vw, 30px)',
        width: '100%'
      }}>
        {stats && [
          { 
            icon: '👥', 
            title: 'Usuarios Totales', 
            value: stats.totalUsers, 
            color: '#4fc3f7',
            description: 'Total de usuarios registrados'
          },
          { 
            icon: '📈', 
            title: 'Última Semana', 
            value: stats.createdLastWeek, 
            color: '#198754',
            description: 'Nuevos registros (7 días)'
          },
          { 
            icon: '📅', 
            title: 'Último Mes', 
            value: stats.createdLastMonth, 
            color: '#6f42c1',
            description: 'Nuevos registros (30 días)'
          },
          { 
            icon: '✅', 
            title: 'Activos Semana', 
            value: stats.activeLastWeek, 
            color: '#ffc107',
            description: 'Usuarios activos (7 días)'
          },
          { 
            icon: '🟢', 
            title: 'Activos Mes', 
            value: stats.activeLastMonth, 
            color: '#20c997',
            description: 'Usuarios activos (30 días)'
          },
          { 
            icon: '🗑️', 
            title: 'Eliminados', 
            value: stats.deleted, 
            color: '#dc3545',
            description: 'Usuarios eliminados'
          },
          { 
            icon: '🔒', 
            title: 'Bloqueados', 
            value: stats.blocked, 
            color: '#ff6b6b',
            description: 'Usuarios con acceso denegado'
          }
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
            }}
            className="card-hover"
          >
            <div style={{
              fontSize: 'clamp(2rem, 6vw, 2.5rem)',
              marginBottom: 'clamp(8px, 2vw, 10px)'
            }}>
              {stat.icon}
            </div>
            <div style={{
              color: stat.color,
              fontSize: 'clamp(1.8rem, 5vw, 2.2rem)',
              fontWeight: 'bold',
              marginBottom: '5px',
              lineHeight: '1.2'
            }}>
              {stat.value}
            </div>
            <div style={{
              color: '#4fc3f7',
              fontSize: 'clamp(0.9rem, 2vw, 1rem)',
              fontWeight: '600',
              marginBottom: '8px'
            }}>
              {stat.title}
            </div>
            <div style={{
              color: '#cccccc',
              fontSize: 'clamp(0.7rem, 1.5vw, 0.8rem)',
              lineHeight: '1.3'
            }}>
              {stat.description}
            </div>
          </div>
        ))}
      </div>

      {/* Estadísticas Adicionales */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: 'clamp(15px, 3vw, 20px)',
        marginBottom: 'clamp(20px, 4vw, 30px)',
        width: '100%'
      }}>
        {/* Modificaciones Recientes */}
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
            fontSize: 'clamp(1.1rem, 3vw, 1.3rem)',
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
          }}>
            <span>🔄</span>
            Modificaciones Recientes
          </h3>
          
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '15px',
            marginBottom: '15px'
          }}>
            <div style={{
              fontSize: 'clamp(1.5rem, 4vw, 1.8rem)',
              color: '#6f42c1'
            }}>
              {stats?.modifiedLast30 || 0}
            </div>
            <div>
              <div style={{ color: '#4fc3f7', fontWeight: '600' }}>
                Modificaciones (30 días)
              </div>
              <div style={{ color: '#cccccc', fontSize: '0.8rem' }}>
                Cambios en usuarios
              </div>
            </div>
          </div>
        </div>

        {/* Información del Admin */}
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
            fontSize: 'clamp(1.1rem, 3vw, 1.3rem)',
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
          }}>
            <span>👑</span>
            Información de Administrador
          </h3>
          
          <div style={{ color: '#cccccc', fontSize: 'clamp(0.8rem, 2vw, 0.9rem)' }}>
            <p style={{ margin: '0 0 10px 0' }}>
              <strong>Rol:</strong> <span style={{ color: '#4fc3f7' }}>{user?.role}</span>
            </p>
            <p style={{ margin: '0 0 10px 0' }}>
              <strong>Email:</strong> {user?.email}
            </p>
            <p style={{ margin: 0 }}>
              <strong>Acceso:</strong> <span style={{ color: '#198754' }}>Completo</span>
            </p>
          </div>
        </div>
      </div>

      {/* Botón de Actualizar */}
      <div style={{ textAlign: 'center' }}>
        <button
          onClick={loadStats}
          disabled={loading}
          style={{
            padding: '12px 24px',
            backgroundColor: '#4fc3f7',
            border: 'none',
            borderRadius: '8px',
            color: '#000',
            cursor: 'pointer',
            fontWeight: 'bold',
            fontSize: '1rem',
            transition: 'all 0.3s ease',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px'
          }}
          onMouseOver={(e) => {
            if (!loading) {
              e.target.style.backgroundColor = '#29b6f6';
              e.target.style.transform = 'translateY(-2px)';
            }
          }}
          onMouseOut={(e) => {
            if (!loading) {
              e.target.style.backgroundColor = '#4fc3f7';
              e.target.style.transform = 'translateY(0)';
            }
          }}
        >
          {loading ? (
            <>
              <div style={{
                width: '16px',
                height: '16px',
                border: '2px solid #000',
                borderTop: '2px solid transparent',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite'
              }}></div>
              Actualizando...
            </>
          ) : (
            <>
              <span>🔄</span>
              Actualizar Estadísticas
            </>
          )}
        </button>
      </div>

      <style>
        {`
          .card-hover:hover {
            transform: translateY(-5px);
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.5);
          }
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>
    </div>
  );
};

// Exportación por defecto
export default StatsDashboard;