import React, { useState } from 'react';
import UserList from './UserList';
import UserEdit from './UserEdit';
import UserDelete from './UserDelete';
import UserCreate from './UserCreate';

const UserManagementModal = ({ isOpen, onClose }) => {
  // Inicia directamente en la vista de lista para simplificar el flujo
  const [activeView, setActiveView] = useState('list');
  const [selectedUser, setSelectedUser] = useState(null);

  // Resetea la vista a 'list' cada vez que el modal se abre
  React.useEffect(() => {
    if (isOpen) {
      setActiveView('list');
      setSelectedUser(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleBackToList = () => {
    setActiveView('list');
    setSelectedUser(null);
  };

  const handleEditUser = (user) => {
    setSelectedUser(user);
    setActiveView('edit');
  };

  const handleDeleteUser = (user) => {
    setSelectedUser(user);
    setActiveView('delete');
  };

  const handleCreateUser = () => {
    setActiveView('create');
  };

  const renderContent = () => {
    switch (activeView) {
      case 'list':
        // El botón "onBack" de la lista ahora cierra el modal
        return <UserList onBack={onClose} onEdit={handleEditUser} onDelete={handleDeleteUser} onCreate={handleCreateUser} />;
      case 'edit':
        return <UserEdit user={selectedUser} onBack={handleBackToList} />;
      case 'delete':
        return <UserDelete user={selectedUser} onBack={handleBackToList} />;
      case 'create':
        return <UserCreate onBack={handleBackToList} onUserCreated={handleBackToList} />;
      default:
        return null; // El menú ya no es necesario
    }
  };

  // Determina la acción del botón principal (cerrar o volver a la lista)
  const handleHeaderButton = activeView === 'list' ? onClose : handleBackToList;
  // Determina el ícono del botón (cruz para cerrar, flecha para volver)
  const headerButtonIcon = activeView === 'list' ? '✕' : '←';

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <div style={styles.header}>
          <button style={styles.backButton} onClick={handleHeaderButton}>
            {headerButtonIcon}
          </button>
          <h2 style={styles.title}>
            {activeView === 'list' && 'Gestión de Usuarios'}
            {activeView === 'edit' && 'Modificar Usuario'}
            {activeView === 'delete' && 'Eliminar Usuario'}
            {activeView === 'create' && 'Crear Nuevo Usuario'}
          </h2>
        </div>
        <div style={styles.content}>
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

const styles = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  modal: {
    backgroundColor: '#2d2d2d',
    borderRadius: '8px',
    width: '90%',
    maxWidth: '800px',
    maxHeight: '90vh',
    overflow: 'hidden',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.5)',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    padding: '20px',
    borderBottom: '1px solid #444',
    backgroundColor: '#1a1a1a',
  },
  backButton: {
    background: 'none',
    border: 'none',
    color: '#4fc3f7',
    fontSize: '1.5rem',
    cursor: 'pointer',
    padding: '5px 10px',
    marginRight: '15px',
  },
  title: {
    color: '#fff',
    margin: 0,
    fontSize: '1.5rem',
  },
  content: {
    padding: '20px',
    maxHeight: 'calc(90vh - 80px)',
    overflow: 'auto',
  },
  menuContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
  },
  menuTitle: {
    color: '#fff',
    marginBottom: '20px',
    textAlign: 'center',
  },
  menuButton: {
    padding: '15px 20px',
    backgroundColor: '#3d3d3d',
    border: 'none',
    borderRadius: '6px',
    color: '#fff',
    fontSize: '1rem',
    cursor: 'pointer',
    textAlign: 'left',
    transition: 'background-color 0.3s ease',
  },
};

export default UserManagementModal;