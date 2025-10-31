import React, { useState, useEffect } from 'react';
import { userService } from '../../services/auth';
import ConfirmationModal from './ConfirmationModal';

const UserDelete = ({ user, onBack }) => {
  const [users, setUsers] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState(user?._id || '');
  const [selectedUser, setSelectedUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: 'info' });
  const [modalState, setModalState] = useState({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => {},
  });

  useEffect(() => {
    loadUsers();
  }, []);

  useEffect(() => {
    if (user) {
      setSelectedUserId(user._id);
      setSelectedUser(user);
    }
  }, [user]);

  const loadUsers = async () => {
    try {
      const response = await userService.getAll();
      setUsers(response.data.data.filter(u => !u.deleted));
    } catch (err) {
      console.error('Error loading users:', err);
    }
  };

  const handleUserSelect = (userId) => {
    setSelectedUserId(userId);
    const user = users.find(u => u._id === userId);
    setSelectedUser(user);
  };

  const closeModal = () => {
    setModalState({ isOpen: false });
  };

  const handleDeleteClick = () => {
    if (!selectedUserId) {
      setMessage({ text: 'Por favor selecciona un usuario', type: 'error' });
      return;
    }

    setModalState({
      isOpen: true,
      title: 'Confirmar Eliminación',
      message: `¿Estás seguro de que deseas eliminar al usuario ${selectedUser?.name} ${selectedUser?.surname}? Esta acción es irreversible.`,
      confirmText: 'Sí, eliminar',
      variant: 'danger',
      onConfirm: async () => {
        closeModal();
        setLoading(true);
        setMessage({ text: '', type: 'info' });

        try {
          await userService.delete(selectedUserId);
          setMessage({ text: 'Usuario eliminado con éxito. Redirigiendo...', type: 'success' });
          
          setTimeout(() => {
            onBack(); // Redirige a la lista de usuarios
          }, 3000);

        } catch (err) {
          setMessage({ text: 'Error al eliminar el usuario', type: 'error' });
          console.error('Error deleting user:', err);
          setLoading(false);
        }
      },
    });
  };

  return (
    <div>
      <ConfirmationModal
        {...modalState}
        onClose={closeModal}
      />

      {!user && (
        <div style={styles.userSelect}>
          <label style={styles.label}>Seleccionar Usuario a Eliminar:</label>
          <select 
            value={selectedUserId}
            onChange={(e) => handleUserSelect(e.target.value)}
            style={styles.select}
          >
            <option value="">Selecciona un usuario</option>
            {users.map(user => (
              <option key={user._id} value={user._id}>
                {user.name} {user.surname} ({user.email})
              </option>
            ))}
          </select>
        </div>
      )}

      {selectedUser && (
        <div style={styles.userCard}>
          <h3 style={styles.cardTitle}>Información del Usuario</h3>
          <div style={styles.cardContent}>
            <div style={styles.field}>
              <strong>Nombre:</strong> {selectedUser.name}
            </div>
            <div style={styles.field}>
              <strong>Apellido:</strong> {selectedUser.surname}
            </div>
            <div style={styles.field}>
              <strong>Email:</strong> {selectedUser.email}
            </div>
            <div style={styles.field}>
              <strong>Rol:</strong> {selectedUser.role}
            </div>
            <div style={styles.field}>
              <strong>Edad:</strong> {selectedUser.age}
            </div>
            <div style={styles.field}>
              <strong>Estado:</strong> 
              <span style={getStatusStyle(selectedUser)}>
                {selectedUser.isBlocked ? 'Bloqueado' : 'Activo'}
              </span>
            </div>
            <div style={styles.field}>
              <strong>Último login:</strong> {new Date(selectedUser.lastLoginAt).toLocaleString()}
            </div>
          </div>
        </div>
      )}

      {message.text && (
        <div style={{...styles.message, backgroundColor: message.type === 'success' ? '#198754' : '#ef5350'}}>
          {message.text}
        </div>
      )}

      <div style={styles.actions}>
        <button 
          onClick={onBack}
          style={styles.cancelButton}
        >
          Cancelar
        </button>
        <button 
          onClick={handleDeleteClick}
          disabled={loading || !selectedUserId}
          style={styles.deleteButton}
        >
          {loading ? 'Eliminando...' : 'Eliminar Usuario'}
        </button>
      </div>

      <div style={styles.warning}>
        ⚠️ Advertencia: Esta acción eliminará permanentemente al usuario del sistema.
      </div>
    </div>
  );
};

const getStatusStyle = (user) => ({
  padding: '4px 8px',
  borderRadius: '4px',
  fontSize: '0.8rem',
  backgroundColor: user.isBlocked ? '#ff6b6b' : '#66bb6a',
  color: '#fff',
  marginLeft: '10px',
});

const styles = {
  userSelect: {
    marginBottom: '20px',
  },
  label: {
    color: '#fff',
    marginBottom: '5px',
    display: 'block',
  },
  select: {
    padding: '10px',
    borderRadius: '4px',
    border: '1px solid #444',
    backgroundColor: '#1a1a1a',
    color: '#fff',
    fontSize: '1rem',
    width: '100%',
  },
  userCard: {
    backgroundColor: '#1a1a1a',
    borderRadius: '6px',
    padding: '20px',
    marginBottom: '20px',
    border: '1px solid #444',
  },
  cardTitle: {
    color: '#fff',
    marginTop: 0,
    marginBottom: '15px',
    borderBottom: '1px solid #444',
    paddingBottom: '10px',
  },
  cardContent: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  field: {
    color: '#fff',
    display: 'flex',
    alignItems: 'center',
  },
  message: {
    padding: '10px',
    borderRadius: '4px',
    backgroundColor: '#4caf50',
    color: '#fff',
    textAlign: 'center',
    marginBottom: '20px',
  },
  actions: {
    display: 'flex',
    gap: '10px',
    justifyContent: 'flex-end',
    marginBottom: '20px',
  },
  cancelButton: {
    padding: '10px 20px',
    backgroundColor: '#757575',
    border: 'none',
    borderRadius: '4px',
    color: '#fff',
    cursor: 'pointer',
  },
  deleteButton: {
    padding: '10px 20px',
    backgroundColor: '#ef5350',
    border: 'none',
    borderRadius: '4px',
    color: '#fff',
    cursor: 'pointer',
  },
  warning: {
    padding: '15px',
    backgroundColor: '#ffa726',
    color: '#fff',
    borderRadius: '4px',
    textAlign: 'center',
    fontSize: '0.9rem',
  },
};

export default UserDelete;