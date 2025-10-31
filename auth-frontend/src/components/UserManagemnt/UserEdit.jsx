import React, { useState, useEffect } from 'react';
import { userService } from '../../services/auth';
import ConfirmationModal from './ConfirmationModal';

const UserEdit = ({ user, onBack }) => {
  const [formData, setFormData] = useState({
    name: '',
    surname: '',
    age: '',
    birthDate: '',
    email: '',
    password: '',
    role: '' // Se inicia vacío para no enviarlo si no se cambia
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: 'info' });
  const [modalState, setModalState] = useState({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => {},
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setMessage({ text: '', type: 'info' });
  };

  const closeModal = () => {
    setModalState({ isOpen: false });
  };

  const handleUpdateClick = (e) => {
    e.preventDefault();

    // 1. Construir objeto solo con los campos que tienen valor
    const dataToSend = {};
    Object.keys(formData).forEach(key => {
      if (formData[key] !== '') {
        if (key === 'age') {
          dataToSend[key] = parseInt(formData[key], 10);
        } else if (key === 'birthDate') {
          dataToSend[key] = new Date(formData[key]).toISOString();
        } else {
          dataToSend[key] = formData[key];
        }
      }
    });

    // 2. Validar si hay algo que enviar
    if (Object.keys(dataToSend).length === 0) {
      setMessage({ text: 'No se ha modificado ningún campo.', type: 'error' });
      return;
    }

    // 3. Preparar y mostrar el modal de confirmación
    setModalState({
      isOpen: true,
      title: 'Confirmar Modificación',
      // Mostramos los datos que se enviarán en el modal
      message: (
        <div>
          <p>Se guardarán los siguientes cambios para <strong>{user.name} {user.surname}</strong>:</p>
          <pre style={{ backgroundColor: '#1a1a1a', padding: '10px', borderRadius: '4px', color: '#4fc3f7', whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}>
            {JSON.stringify(dataToSend, null, 2)}
          </pre>
        </div>
      ),
      confirmText: 'Sí, guardar',
      variant: 'success',
      onConfirm: async () => {
        closeModal();
        setLoading(true);
        setMessage({ text: '', type: 'info' });
        try {
          await userService.update(user._id, dataToSend);
          setMessage({ text: 'Usuario modificado con éxito. Redirigiendo...', type: 'success' });
          setTimeout(() => {
            onBack(); // Redirige a la lista de usuarios
          }, 2000);
        } catch (err) {
          const errorMessage = Array.isArray(err.message) ? err.message.join(', ') : (err.response?.data?.message || err.message || 'Ocurrió un error al modificar el usuario.');
          setMessage({ text: errorMessage, type: 'error' });
          console.error('Error updating user:', err);
          setLoading(false);
        }
      },
    });
  };

  if (!user) {
    return <div>Cargando información del usuario...</div>;
  }

  return (
    <div>
      <ConfirmationModal
        {...modalState}
        onClose={closeModal}
      />

      <form onSubmit={handleUpdateClick} style={styles.form}>
        <div style={styles.formRow}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Nombre:</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              style={styles.input}
              placeholder={user.name}
            />
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label}>Apellido:</label>
            <input
              type="text"
              name="surname"
              value={formData.surname}
              onChange={handleChange}
              style={styles.input}
              placeholder={user.surname}
            />
          </div>
        </div>

        <div style={styles.formRow}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Edad:</label>
            <input
              type="number"
              name="age"
              value={formData.age}
              onChange={handleChange}
              style={styles.input}
              placeholder={user.age}
            />
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label}>Fecha de Nacimiento:</label>
            <input
              type="date"
              name="birthDate"
              value={formData.birthDate}
              onChange={handleChange}
              style={styles.input}
            />
          </div>
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>Email:</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            style={styles.input}
            placeholder={user.email}
          />
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>Nueva Contraseña (opcional):</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            style={styles.input}
            placeholder="Nueva contraseña"
          />
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>Rol:</label>
          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            style={styles.select}
          >
            <option value="">-- Mantener Rol Actual ({user.role}) --</option>
            <option value="user">Usuario</option>
            <option value="admin">Administrador</option>
            <option value="super-admin">Super Administrador</option>
          </select>
        </div>

        {message.text && <div style={{...styles.message, backgroundColor: message.type === 'success' ? '#198754' : '#dc3545'}}>{message.text}</div>}

        <div style={styles.formActions}>
          <button 
            type="button" 
            onClick={onBack}
            style={styles.cancelButton}
          >
            Cancelar
          </button>
          <button 
            type="submit" 
            disabled={loading}
            style={styles.submitButton}
          >
            {loading ? 'Guardando...' : '✏️ Guardar Cambios'}
          </button>
        </div>
      </form>
    </div>
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
    backgroundColor: '#198754',
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

export default UserEdit;