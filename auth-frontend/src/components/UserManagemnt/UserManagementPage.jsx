import React, { useState } from 'react';
import UserList from './UserList';
import UserEdit from './UserEdit';
import UserDelete from './UserDelete';
import UserCreate from './UserCreate';

const UserManagementPage = () => {
  const [activeView, setActiveView] = useState('list');
  const [selectedUser, setSelectedUser] = useState(null);

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
      case 'edit':
        return <UserEdit user={selectedUser} onBack={handleBackToList} />;
      case 'delete':
        return <UserDelete user={selectedUser} onBack={handleBackToList} />;
      case 'create':
        return <UserCreate onBack={handleBackToList} onUserCreated={handleBackToList} />;
      case 'list':
      default:
        return (
          <UserList
            onEdit={handleEditUser}
            onDelete={handleDeleteUser}
            onCreate={handleCreateUser}
            // onBack no es necesario aquí, ya que no hay a dónde "volver" desde la lista principal
          />
        );
    }
  };

  return (
    <div style={styles.container}>
      {/* El título ahora se maneja en DashboardLayout, pero podemos tener un subtítulo si es necesario */}
      {renderContent()}
    </div>
  );
};

const styles = {
  container: {
    width: '98%',
    backgroundColor: '#151515',
    border: '1px solid #333',
    borderRadius: '10px',
    padding: 'clamp(15px, 2vw, 20px)',
    margin: '0 27px 0 auto',
    boxSizing: 'border-box'
  },
};

export default UserManagementPage;