import React from 'react';
import Button from '../UI/Button';

const UserCard = ({ user, onDelete }) => {
  const getRoleColor = (role) => {
    const colors = {
      'admin': 'bg-purple-100 text-purple-800',
      'super-admin': 'bg-red-100 text-red-800',
      'user': 'bg-blue-100 text-blue-800',
      'basic': 'bg-gray-100 text-gray-800'
    };
    return colors[role] || colors.user;
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h3 className="text-lg font-semibold text-gray-800">
              {user.name} {user.surname}
            </h3>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRoleColor(user.role)}`}>
              {user.role}
            </span>
            {user.deleted && (
              <span className="px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                Eliminado
              </span>
            )}
          </div>
          
          <div className="text-sm text-gray-600 space-y-1">
            <p>📧 {user.email}</p>
            <p>🎂 Edad: {user.age} años</p>
            <p>📅 Registrado: {new Date(user.createdAt).toLocaleDateString()}</p>
            {user.lastLogin && (
              <p>🔐 Último login: {new Date(user.lastLogin).toLocaleDateString()}</p>
            )}
          </div>
        </div>

        <div className="flex gap-2">
          <Button variant="secondary" size="sm">
            Editar
          </Button>
          <Button 
            variant="danger" 
            size="sm"
            onClick={() => onDelete(user._id)}
            disabled={user.deleted}
          >
            {user.deleted ? 'Eliminado' : 'Eliminar'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default UserCard;