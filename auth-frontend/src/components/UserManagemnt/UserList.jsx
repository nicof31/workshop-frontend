import React, { useState, useEffect } from 'react';
import { userService } from '../../services/auth';
import ConfirmationModal from './ConfirmationModal';

const UserList = ({ onBack, onEdit, onDelete, onCreate }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState('');
  const [notification, setNotification] = useState({ message: '', type: '' });
  const [modalState, setModalState] = useState({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => {},
  });
  const [actionLoading, setActionLoading] = useState(null); // Para saber qué usuario se está procesando

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await userService.getAll();
      console.log('API Response:', response); // Para debug
      
      // Manejar diferentes estructuras de respuesta
      if (response.data && Array.isArray(response.data.data)) {
        setUsers(response.data.data);
      } else if (Array.isArray(response.data)) {
        setUsers(response.data);
      } else if (Array.isArray(response)) {
        setUsers(response);
      } else {
        console.warn('Estructura de respuesta inesperada:', response);
        setUsers([]);
      }
    } catch (err) {
      console.error('Error loading users:', err);
      setError('Error al cargar los usuarios: ' + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  const showNotification = (message, type) => {
    setNotification({ message, type });
    setTimeout(() => setNotification({ message: '', type: '' }), 3000);
  };

  const closeModal = () => {
    setModalState({ isOpen: false, title: '', message: '', onConfirm: () => {} });
  };

  const handleBlockToggle = async (user) => {
    const action = user.isBlocked ? 'desbloquear' : 'bloquear';
    const variant = user.isBlocked ? 'success' : 'warning';

    setModalState({
      isOpen: true,
      title: `Confirmar ${action}`,
      message: `¿Estás seguro de que deseas ${action} a ${user.name} ${user.surname}?`,
      confirmText: action.charAt(0).toUpperCase() + action.slice(1),
      variant: variant,
      onConfirm: async () => {
        closeModal();
        setActionLoading(user._id);
        try {
          if (user.isBlocked) {
            await userService.unblock(user._id);
            showNotification('Usuario desbloqueado con éxito', 'success');
          } else {
            await userService.block(user._id);
            showNotification('Usuario bloqueado con éxito', 'success');
          }
          loadUsers();
        } catch (err) {
          const errorMessage = err.response?.data?.message || `Error al ${action} el usuario`;
          showNotification(errorMessage, 'error');
          console.error(`Error toggling block for user ${user._id}:`, err);
        } finally {
          setActionLoading(null);
        }
      },
    });
  };

  const handleRestore = async (user) => {
    setModalState({
      isOpen: true,
      title: 'Confirmar Restauración',
      message: `¿Estás seguro de que deseas restaurar al usuario ${user.name} ${user.surname}?`,
      confirmText: 'Restaurar',
      variant: 'success',
      onConfirm: async () => {
        closeModal();
        setActionLoading(user._id);
        try {
          await userService.restore(user._id);
          showNotification('Usuario restaurado con éxito', 'success');
          loadUsers();
        } catch (err) {
          const errorMessage = err.response?.data?.message || 'Error al restaurar el usuario';
          showNotification(errorMessage, 'error');
          console.error(`Error restoring user ${user._id}:`, err);
        } finally {
          setActionLoading(null);
        }
      },
    });
  };

  const handleDeleteWithRefresh = async (user) => {
    // Llama a la función onDelete que abre el modal de confirmación
    onDelete(user);
    // Aquí no recargamos, ya que el modal de borrado tiene su propia lógica.
    // Si quisiéramos que el borrado se hiciera aquí, la lógica sería similar a las otras acciones.
    // Por ahora, mantenemos el flujo existente.
  };


  const filteredUsers = users.filter(user =>
    (user.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (user.surname || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (user.email || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Estilos
  const styles = {
    container: {
      color: '#fff'
    },
    actions: {
      marginBottom: '20px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      flexWrap: 'wrap',
      gap: '15px',
    },
    leftActions: {
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      justifyContent: 'space-between',
    },
    refreshButton: {
      padding: '8px 16px',
      backgroundColor: '#4fc3f7',
      border: 'none',
      borderRadius: '4px',
      color: '#fff',
      cursor: 'pointer',
    },
    searchInput: {
      padding: '8px 16px',
      backgroundColor: '#1a1a1a',
      border: '1px solid #444',
      borderRadius: '4px',
      color: '#fff',
      width: '250px',
      fontSize: '0.9rem',
      outline: 'none',
    },
    createButton: {
      padding: '8px 16px',
      backgroundColor: '#198754',
      border: 'none',
      borderRadius: '4px',
      color: '#fff',
      cursor: 'pointer',
      fontWeight: 'bold',
    },
    backButton: {
      padding: '8px 16px',
      backgroundColor: '#757575',
      border: 'none',
      borderRadius: '4px',
      color: '#fff',
      cursor: 'pointer',
    },
    tableContainer: {
      overflowX: 'auto',
    },
    table: {
      tableLayout: 'fixed',
      width: '100%',
      borderCollapse: 'collapse',
      backgroundColor: '#1a1a1a',
      borderRadius: '6px',
      overflow: 'hidden',
    },
    th: {
      padding: '12px 15px',
      textAlign: 'left',
      backgroundColor: '#333',
      color: '#fff',
      borderBottom: '1px solid #444',
      whiteSpace: 'nowrap',
    },
    tr: {
      borderBottom: '1px solid #444',
    },
    td: {
      padding: '12px',
      color: '#fff',
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
    },
    tdActions: { padding: '8px 12px' },
    actionButtons: {
      display: 'flex',
      gap: '8px',
    },
    editButton: {
      padding: '6px 10px',
      backgroundColor: '#ffa726',
      border: 'none',
      borderRadius: '4px',
      color: '#fff',
      cursor: 'pointer',
    },
    blockButton: {
      padding: '6px 10px',
      backgroundColor: '#ffc107',
      border: 'none',
      borderRadius: '4px',
      color: '#000',
      cursor: 'pointer',
    },
    restoreButton: {
      padding: '6px 10px',
      backgroundColor: '#20c997',
      border: 'none',
      borderRadius: '4px',
      color: '#fff',
      cursor: 'pointer',
    },
    deleteButton: {
      padding: '6px 10px',
      backgroundColor: '#ef5350',
      border: 'none',
      borderRadius: '4px',
      color: '#fff',
      cursor: 'pointer',
    },
    loading: {
      color: '#fff',
      textAlign: 'center',
      padding: '20px',
      display: 'flex',
      flexDirection: 'column',
      gap: '10px',
      alignItems: 'center'
    },
    errorContainer: {
      color: '#ef5350',
      textAlign: 'center',
      padding: '20px',
      display: 'flex',
      flexDirection: 'column',
      gap: '10px',
      alignItems: 'center'
    },
    noUsers: {
      color: '#fff',
      textAlign: 'center',
      padding: '40px',
      backgroundColor: '#1a1a1a',
      borderRadius: '6px',
    }
  };

  const notificationStyles = {
    position: 'fixed',
    bottom: '20px',
    left: '50%',
    transform: 'translateX(-50%)',
    padding: '12px 25px',
    borderRadius: '6px',
    color: 'white',
    backgroundColor: notification.type === 'success' ? '#198754' : '#dc3545',
    zIndex: 1050,
    boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
    transition: 'opacity 0.3s ease',
    opacity: notification.message ? 1 : 0,
    pointerEvents: notification.message ? 'auto' : 'none',
  };

  const getRoleStyle = (role) => ({
    padding: '4px 8px',
    borderRadius: '4px',
    fontSize: '0.8rem',
    backgroundColor: role === 'admin' ? '#ff6b6b' : role === 'super-admin' ? '#ffa726' : '#4fc3f7',
    color: '#fff',
  });

  const getStatusStyle = (user) => ({
    padding: '4px 8px',
    borderRadius: '4px',
    fontSize: '0.8rem',
    backgroundColor: user.isBlocked ? '#ff6b6b' : user.deleted ? '#78909c' : '#66bb6a',
    color: '#fff',
  });

  if (loading) {
    return (
      <div style={styles.loading}>
        <div>Cargando usuarios...</div>
        <button 
          style={{...styles.refreshButton, opacity: 0.5}} 
          onClick={loadUsers}
          disabled={true}
        >
          🔄 Cargando...
        </button>
      </div>
    );
  }

  if (error) {
    return (
      <div style={styles.errorContainer}>
        <div>{error}</div>
        <button style={styles.refreshButton} onClick={loadUsers}>
          🔄 Reintentar
        </button>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.actions}>
        <div style={styles.leftActions}>
          <input
            type="text"
            placeholder="Buscar por nombre, apellido, email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={styles.searchInput}
          />
          <button style={styles.createButton} onClick={onCreate}>
            + Crear Usuario
          </button>
          <button style={styles.refreshButton} onClick={loadUsers}>
            🔄
          </button>
        </div>
      </div>

      <ConfirmationModal
        isOpen={modalState.isOpen}
        onClose={closeModal}
        onConfirm={modalState.onConfirm}
        title={modalState.title}
        message={modalState.message}
        confirmText={modalState.confirmText}
        variant={modalState.variant}
      />

      {notification.message && (
        <div style={notificationStyles}>{notification.message}</div>
      )}
      
      <div style={styles.tableContainer}>
        {filteredUsers.length === 0 ? (
          <div style={styles.noUsers}>
            {searchTerm ? `No se encontraron usuarios para "${searchTerm}"` : 'No hay usuarios para mostrar'}
          </div>
        ) : (
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={{...styles.th, width: '15%'}}>Nombre</th>
                <th style={{...styles.th, width: '15%'}}>Apellido</th>
                <th style={{...styles.th, width: '25%'}}>Email</th>
                <th style={{...styles.th, width: '10%'}}>Rol</th>
                <th style={{...styles.th, width: '10%'}}>Estado</th>
                <th style={{...styles.th, width: '25%'}}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map(user => (
                <tr key={user._id} style={styles.tr}>
                  <td style={styles.td}>{user.name || 'N/A'}</td>
                  <td style={styles.td}>{user.surname || 'N/A'}</td>
                  <td style={styles.td}>{user.email || 'N/A'}</td>
                  <td style={styles.td}>
                    <span style={getRoleStyle(user.role)}>
                      {user.role || 'N/A'}
                    </span>
                  </td>

<td style={styles.td}>
  <span style={getStatusStyle(user)}>
    {user.isBlocked ? 'Bloqueado' : user.deleted ? 'Eliminado' : 'Activo'}
  </span>
</td>
<td style={styles.tdActions}>
  <div style={styles.actionButtons}>
    {user.deleted ? (
      <button 
        style={styles.restoreButton}
        onClick={() => handleRestore(user)}
        disabled={actionLoading === user._id}
        title="Restaurar usuario"
      >
        {actionLoading === user._id ? '...' : '♻️'}
      </button>
    ) : (
      <>
        <button 
          style={styles.editButton}
          onClick={() => onEdit(user)}
          disabled={actionLoading === user._id}
          title="Editar usuario"
        >
          {actionLoading === user._id ? '...' : '✏️'}
        </button>
        <button 
          style={user.isBlocked ? styles.unblockButton : styles.blockButton}
          onClick={() => handleBlockToggle(user)}
          disabled={actionLoading === user._id}
          title={user.isBlocked ? "Desbloquear usuario" : "Bloquear usuario"}
        >
          {actionLoading === user._id ? '...' : (user.isBlocked ? '🔓' : '🔒')}
        </button>
        <button 
          style={styles.deleteButton}
          onClick={() => handleDeleteWithRefresh(user)}
          disabled={actionLoading === user._id}
          title="Eliminar usuario"
        >
          {actionLoading === user._id ? '...' : '🗑️'}
        </button>
      </>
    )}
  </div>
</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default UserList;