import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const { login } = useAuth();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    if (message) setMessage('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.email || !formData.password) {
      setMessage('Por favor completa todos los campos');
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      const result = await login(formData.email, formData.password);
      
      if (!result.success) {
        setMessage(result.message || 'Error al iniciar sesión');
      }
    } catch (error) {
      setMessage('Error de conexión. Verifica que el backend esté ejecutándose.');
      console.error('Login error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      backgroundColor: '#0a0a0a',
      color: '#ffffff',
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      minHeight: '100vh',
      margin: 0,
      padding: '20px',
      display: 'flex',
      flexDirection: 'column',
      boxSizing: 'border-box'
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1,
        width: '100%',
        boxSizing: 'border-box'
      }}>
        <div style={{
          textAlign: 'center',
          width: '100%',
          maxWidth: '400px',
          padding: '0 15px',
          boxSizing: 'border-box'
        }}>
          {/* Navbar */}
          <nav style={{
            background: 'linear-gradient(135deg, #050505 0%, #1a1a1a 100%)',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.5)',
            borderBottom: '1px solid #333',
            padding: '15px 20px',
            width: '100%',
            marginBottom: '30px',
            borderRadius: '10px',
            boxSizing: 'border-box'
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center'
            }}>
              <span style={{
                fontWeight: 700,
                letterSpacing: '1px',
                background: 'linear-gradient(90deg, #4fc3f7, #6f42c1)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                fontSize: 'clamp(1.2rem, 4vw, 1.5rem)' // Responsive font size
              }}>
                AuthWorkshop
              </span>
            </div>
          </nav>
          
          <h1 style={{
            color: '#4fc3f7',
            fontWeight: 600,
            marginBottom: '30px',
            paddingBottom: '10px',
            borderBottom: '2px solid #333',
            fontSize: 'clamp(1.4rem, 5vw, 1.8rem)' // Responsive font size
          }}>
            Sistema de Autenticación
          </h1>
          
          {/* Card de Login */}
          <div style={{
            backgroundColor: '#151515',
            border: '1px solid #333',
            borderRadius: '10px',
            boxShadow: '0 6px 15px rgba(0, 0, 0, 0.4)',
            transition: 'transform 0.3s ease, box-shadow 0.3s ease',
            marginBottom: '20px',
            padding: 'clamp(20px, 5vw, 30px)', // Responsive padding
            width: '100%',
            boxSizing: 'border-box'
          }}>
            {message && (
              <div style={{
                backgroundColor: 'rgba(220, 53, 69, 0.2)',
                border: '1px solid #dc3545',
                color: '#ffffff',
                padding: '12px 16px',
                borderRadius: '8px',
                marginBottom: '20px',
                fontSize: '0.9rem',
                width: '100%',
                boxSizing: 'border-box'
              }}>
                {message}
              </div>
            )}

            <form onSubmit={handleSubmit} style={{ width: '100%', boxSizing: 'border-box' }}>
              <div style={{ 
                marginBottom: '20px', 
                textAlign: 'left',
                width: '100%',
                boxSizing: 'border-box'
              }}>
                <label style={{
                  display: 'block',
                  color: '#cccccc',
                  fontWeight: 500,
                  marginBottom: '8px',
                  fontSize: '0.9rem',
                  width: '100%'
                }}>
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  disabled={loading}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    backgroundColor: '#1a1a1a',
                    border: '1px solid #333',
                    borderRadius: '8px',
                    color: '#ffffff',
                    fontSize: '1rem',
                    outline: 'none',
                    transition: 'all 0.3s ease',
                    boxSizing: 'border-box',
                    maxWidth: '100%'
                  }}
                  placeholder="tu@email.com"
                  onFocus={(e) => {
                    e.target.style.borderColor = '#4fc3f7';
                    e.target.style.boxShadow = '0 0 0 2px rgba(79, 195, 247, 0.2)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#333';
                    e.target.style.boxShadow = 'none';
                  }}
                />
              </div>

              <div style={{ 
                marginBottom: '30px', 
                textAlign: 'left',
                width: '100%',
                boxSizing: 'border-box'
              }}>
                <label style={{
                  display: 'block',
                  color: '#cccccc',
                  fontWeight: 500,
                  marginBottom: '8px',
                  fontSize: '0.9rem',
                  width: '100%'
                }}>
                  Contraseña
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  disabled={loading}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    backgroundColor: '#1a1a1a',
                    border: '1px solid #333',
                    borderRadius: '8px',
                    color: '#ffffff',
                    fontSize: '1rem',
                    outline: 'none',
                    transition: 'all 0.3s ease',
                    boxSizing: 'border-box',
                    maxWidth: '100%'
                  }}
                  placeholder="••••••••"
                  onFocus={(e) => {
                    e.target.style.borderColor = '#4fc3f7';
                    e.target.style.boxShadow = '0 0 0 2px rgba(79, 195, 247, 0.2)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#333';
                    e.target.style.boxShadow = 'none';
                  }}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                style={{
                  backgroundColor: '#4fc3f7',
                  border: '1px solid #4fc3f7',
                  color: '#000000',
                  fontWeight: 'bold',
                  padding: '15px 30px',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '100%',
                  marginBottom: '15px',
                  textDecoration: 'none',
                  transition: 'all 0.3s ease',
                  fontSize: '1rem',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  opacity: loading ? 0.7 : 1,
                  boxSizing: 'border-box'
                }}
                onMouseOver={(e) => {
                  if (!loading) {
                    e.target.style.backgroundColor = '#29b6f6';
                    e.target.style.borderColor = '#29b6f6';
                    e.target.style.transform = 'scale(1.02)';
                  }
                }}
                onMouseOut={(e) => {
                  if (!loading) {
                    e.target.style.backgroundColor = '#4fc3f7';
                    e.target.style.borderColor = '#4fc3f7';
                    e.target.style.transform = 'scale(1)';
                  }
                }}
              >
                {loading ? (
                  <span style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    flexWrap: 'nowrap'
                  }}>
                    <div style={{
                      animation: 'spin 1s linear infinite',
                      borderRadius: '50%',
                      height: '20px',
                      width: '20px',
                      border: '2px solid transparent',
                      borderTop: '2px solid #000000',
                      marginRight: '10px',
                      flexShrink: 0
                    }}></div>
                    Iniciando sesión...
                  </span>
                ) : (
                  'Iniciar Sesión'
                )}
              </button>
            </form>

            <div style={{ 
              marginTop: '20px', 
              textAlign: 'center',
              width: '100%',
              boxSizing: 'border-box'
            }}>
              <p style={{ 
                color: '#cccccc', 
                margin: 0,
                fontSize: 'clamp(0.8rem, 3vw, 1rem)' // Responsive font size
              }}>
                ¿No tienes cuenta?{' '}
                <button
                 /*  onClick={() => window.location.href = '/register'} */
                  onClick={() => window.location.href = '/workshop-frontend/register'}
                  style={{
                    color: '#4fc3f7',
                    background: 'none',
                    border: 'none',
                    fontWeight: 600,
                    textDecoration: 'underline',
                    cursor: 'pointer',
                    transition: 'color 0.3s ease',
                    fontSize: 'inherit'
                  }}
                  onMouseOver={(e) => e.target.style.color = '#29b6f6'}
                  onMouseOut={(e) => e.target.style.color = '#4fc3f7'}
                >
                  Regístrate aquí
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
      
      <footer style={{
        marginTop: 'auto',
        padding: '20px 0',
        color: '#cccccc',
        fontSize: 'clamp(0.8rem, 3vw, 0.9rem)', // Responsive font size
        textAlign: 'center',
        width: '100%',
        boxSizing: 'border-box'
      }}>
        Workshop de Autenticación &copy; 2024
      </footer>

      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }

          /* Responsive para móviles muy pequeños */
          @media (max-width: 360px) {
            body {
              padding: 10px;
            }
          }

          /* Mejorar scroll en móviles */
          @media (max-height: 600px) {
            .login-container {
              padding-top: 10px;
              padding-bottom: 10px;
            }
          }
        `}
      </style>
    </div>
  );
};

export default Login;