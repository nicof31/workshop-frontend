import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';

const UserCreate = ({ onBack, onUserCreated }) => {
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
  const [error, setError] = useState('');

  const { register } = useAuth();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    if (message) setMessage('');
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setError('');

    // Preparamos los datos para el backend, asegurando los tipos correctos.
    const dataToSend = {
      ...formData,
      age: parseInt(formData.age, 10), // Convertir edad a número
      birthDate: new Date(formData.birthDate).toISOString(), // Convertir fecha a formato ISO
    };

    const result = await register(dataToSend);
    
    if (result.success) {
      setMessage('¡Usuario creado con éxito!');
      setTimeout(() => {
        onUserCreated(); // Vuelve a la lista y refresca
      }, 1500);
    } else {
      setError(result.message || 'Ocurrió un error al crear el usuario.');
    }
    
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} style={styles.form}>
      <div style={styles.formRow}>
        <div style={styles.formGroup}>
          <label style={styles.label}>Nombre:</label>
          <input type="text" name="name" value={formData.name} onChange={handleChange} required style={styles.input} />
        </div>
        <div style={styles.formGroup}>
          <label style={styles.label}>Apellido:</label>
          <input type="text" name="surname" value={formData.surname} onChange={handleChange} required style={styles.input} />
        </div>
      </div>

      <div style={styles.formRow}>
        <div style={styles.formGroup}>
          <label style={styles.label}>Edad:</label>
          <input type="number" name="age" value={formData.age} onChange={handleChange} required style={styles.input} />
        </div>
        <div style={styles.formGroup}>
          <label style={styles.label}>Fecha de Nacimiento:</label>
          <input type="date" name="birthDate" value={formData.birthDate} onChange={handleChange} required style={styles.input} />
        </div>
      </div>

      <div style={styles.formGroup}>
        <label style={styles.label}>Email:</label>
        <input type="email" name="email" value={formData.email} onChange={handleChange} required style={styles.input} />
      </div>

      <div style={styles.formGroup}>
        <label style={styles.label}>Contraseña:</label>
        <input type="password" name="password" value={formData.password} onChange={handleChange} required style={styles.input} placeholder="••••••••" />
      </div>

      <div style={styles.formGroup}>
        <label style={styles.label}>Rol:</label>
        <select name="role" value={formData.role} onChange={handleChange} style={styles.select}>
          <option value="" disabled>-- Seleccionar un Rol --</option>
          <option value="user">Usuario</option>
          <option value="admin">Administrador</option>
          <option value="super-admin">Super Administrador</option>
        </select>
      </div>

      {message && <div style={{...styles.message, backgroundColor: '#198754'}}>{message}</div>}
      {error && <div style={{...styles.message, backgroundColor: '#dc3545'}}>{error}</div>}

      <div style={styles.formActions}>
        <button type="button" onClick={onBack} style={styles.cancelButton}>Cancelar</button>
        <button type="submit" disabled={loading} style={styles.submitButton}>
          {loading ? 'Creando...' : 'Crear Usuario'}
        </button>
      </div>
    </form>
  );
};

const styles = {
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
  },
  formRow: {
    display: 'flex',
    gap: '15px',
  },
  formGroup: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
  },
  label: {
    color: '#fff',
    marginBottom: '5px',
    fontSize: '0.9rem',
  },
  input: {
    padding: '10px',
    borderRadius: '4px',
    border: '1px solid #444',
    backgroundColor: '#1a1a1a',
    color: '#fff',
    fontSize: '1rem',
  },
  select: {
    padding: '10px',
    borderRadius: '4px',
    border: '1px solid #444',
    backgroundColor: '#1a1a1a',
    color: '#fff',
    fontSize: '1rem',
  },
  message: {
    padding: '10px',
    borderRadius: '4px',
    color: '#fff',
    textAlign: 'center',
  },
  formActions: {
    display: 'flex',
    gap: '10px',
    justifyContent: 'flex-end',
    marginTop: '20px',
  },
  cancelButton: {
    padding: '10px 20px',
    backgroundColor: '#757575',
    border: 'none',
    borderRadius: '4px',
    color: '#fff',
    cursor: 'pointer',
  },
  submitButton: {
    padding: '10px 20px',
    backgroundColor: '#4fc3f7',
    border: 'none',
    borderRadius: '4px',
    color: '#000',
    fontWeight: 'bold',
    cursor: 'pointer',
  },
};

export default UserCreate;