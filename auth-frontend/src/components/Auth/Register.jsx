import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    surname: '',
    age: '',
    birthDate: '',
    email: '',
    password: '',
    role: 'user'
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const { register } = useAuth();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    if (message) setMessage('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    const result = await register(formData);
    
    if (result.success) {
      setMessage('¡Registro exitoso! Redirigiendo al login...');
      setTimeout(() => {
        /* window.location.href = '/login'; */
        window.location.href = '/workshop-frontend/login';
      }, 2000);
    } else {
      setMessage(result.message);
    }
    
    setLoading(false);
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
      flexDirection: 'column'
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1,
        width: '100%'
      }}>
        <div style={{
          textAlign: 'center',
          width: '100%',
          maxWidth: '500px'
        }}>
          {/* Navbar */}
          <nav style={{
            background: 'linear-gradient(135deg, #050505 0%, #1a1a1a 100%)',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.5)',
            borderBottom: '1px solid #333',
            padding: '15px 0',
            width: '100%',
            marginBottom: '30px',
            borderRadius: '10px'
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
                fontSize: '1.5rem'
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
            fontSize: '1.8rem'
          }}>
            Crear Cuenta
          </h1>
          
          {/* Card de Registro */}
          <div style={{
            backgroundColor: '#151515',
            border: '1px solid #333',
            borderRadius: '10px',
            boxShadow: '0 6px 15px rgba(0, 0, 0, 0.4)',
            transition: 'transform 0.3s ease, box-shadow 0.3s ease',
            marginBottom: '20px',
            padding: '30px'
          }}>
            {message && (
              <div style={{
                backgroundColor: message.includes('éxito') ? 'rgba(25, 135, 84, 0.2)' : 'rgba(220, 53, 69, 0.2)',
                border: message.includes('éxito') ? '1px solid #198754' : '1px solid #dc3545',
                color: '#ffffff',
                padding: '12px 16px',
                borderRadius: '8px',
                marginBottom: '20px',
                fontSize: '0.9rem'
              }}>
                {message}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '15px' }}>
                <div style={{ textAlign: 'left' }}>
                  <label style={{
                    display: 'block',
                    color: '#cccccc',
                    fontWeight: 500,
                    marginBottom: '8px',
                    fontSize: '0.9rem'
                  }}>
                    Nombre
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    style={inputStyle}
                    placeholder="Nombre"
                  />
                </div>

                <div style={{ textAlign: 'left' }}>
                  <label style={{
                    display: 'block',
                    color: '#cccccc',
                    fontWeight: 500,
                    marginBottom: '8px',
                    fontSize: '0.9rem'
                  }}>
                    Apellido
                  </label>
                  <input
                    type="text"
                    name="surname"
                    value={formData.surname}
                    onChange={handleChange}
                    required
                    style={inputStyle}
                    placeholder="Apellido"
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '15px' }}>
                <div style={{ textAlign: 'left' }}>
                  <label style={{
                    display: 'block',
                    color: '#cccccc',
                    fontWeight: 500,
                    marginBottom: '8px',
                    fontSize: '0.9rem'
                  }}>
                    Edad
                  </label>
                  <input
                    type="number"
                    name="age"
                    value={formData.age}
                    onChange={handleChange}
                    required
                    style={inputStyle}
                    placeholder="Edad"
                  />
                </div>

                <div style={{ textAlign: 'left' }}>
                  <label style={{
                    display: 'block',
                    color: '#cccccc',
                    fontWeight: 500,
                    marginBottom: '8px',
                    fontSize: '0.9rem'
                  }}>
                    Fecha Nac.
                  </label>
                  <input
                    type="date"
                    name="birthDate"
                    value={formData.birthDate}
                    onChange={handleChange}
                    required
                    style={inputStyle}
                  />
                </div>
              </div>

              <div style={{ marginBottom: '15px', textAlign: 'left' }}>
                <label style={{
                  display: 'block',
                  color: '#cccccc',
                  fontWeight: 500,
                  marginBottom: '8px',
                  fontSize: '0.9rem'
                }}>
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  style={inputStyle}
                  placeholder="tu@email.com"
                />
              </div>

              <div style={{ marginBottom: '30px', textAlign: 'left' }}>
                <label style={{
                  display: 'block',
                  color: '#cccccc',
                  fontWeight: 500,
                  marginBottom: '8px',
                  fontSize: '0.9rem'
                }}>
                  Contraseña
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  style={inputStyle}
                  placeholder="••••••••"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                style={buttonStyle}
              >
                {loading ? 'Creando cuenta...' : 'Crear Cuenta'}
              </button>
            </form>

            <div style={{ marginTop: '20px', textAlign: 'center' }}>
              <p style={{ color: '#cccccc', margin: 0 }}>
                ¿Ya tienes cuenta?{' '}
                <button
                 /*  onClick={() => window.location.href = '/login'} */
                  onClick={() => window.location.href = '/workshop-frontend/login'}
                  style={{
                    color: '#4fc3f7',
                    background: 'none',
                    border: 'none',
                    fontWeight: 600,
                    textDecoration: 'underline',
                    cursor: 'pointer',
                    transition: 'color 0.3s ease'
                  }}
                  onMouseOver={(e) => e.target.style.color = '#29b6f6'}
                  onMouseOut={(e) => e.target.style.color = '#4fc3f7'}
                >
                  Inicia sesión aquí
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Estilos reutilizables
const inputStyle = {
  width: '100%',
  padding: '12px 16px',
  backgroundColor: '#1a1a1a',
  border: '1px solid #333',
  borderRadius: '8px',
  color: '#ffffff',
  fontSize: '1rem',
  outline: 'none',
  transition: 'all 0.3s ease'
};

const buttonStyle = {
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
  cursor: 'pointer'
};

export default Register;