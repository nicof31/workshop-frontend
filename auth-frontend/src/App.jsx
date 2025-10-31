import React from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './components/Auth/Login';
import Dashboard from './components/Dashboard';
import Register from './components/Auth/Register';
import StatsPage from './components/Stats/StatsPage';

function AppContent() {
  const { isAuthenticated, loading } = useAuth();

  // Función helper para rutas
  const getRoute = (path) => {
    return `/workshop-frontend${path}`;
  };

  if (loading) {
    return (
      <div style={{
        backgroundColor: '#0a0a0a',
        color: '#ffffff',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
      }}>
        <div style={{ 
          color: '#4fc3f7', 
          fontSize: '1.2rem',
          display: 'flex',
          alignItems: 'center',
          gap: '10px'
        }}>
          <div style={{
            width: '20px',
            height: '20px',
            border: '2px solid #4fc3f7',
            borderTop: '2px solid transparent',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite'
          }}></div>
          Cargando...
        </div>
      </div>
    );
  }

  
  const currentPath = window.location.pathname;

  // Determinar qué componente mostrar basado en la ruta actual
  if (currentPath.includes('/register')) {
    return <Register />;
  }
  
  if (currentPath.includes('/dashboard')) {
    return isAuthenticated ? <Dashboard /> : <Login />;
  }
  
  if (currentPath.includes('/stats')) {
    return isAuthenticated ? <StatsPage /> : <Login />;
  }
  
  if (currentPath.includes('/login')) {
    if (isAuthenticated) {
      window.location.href = getRoute('/dashboard');
      return null;
    }
    return <Login />;
  }
  
  // Ruta por defecto (raíz del frontend)
  if (isAuthenticated) {
    window.location.href = getRoute('/dashboard');
    return null;
  }
  return <Login />;
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;