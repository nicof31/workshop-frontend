import React, { useState, useEffect } from 'react';
import { userService } from '../../services/auth';
import Card from '../UI/Card';
import Button from '../UI/Button';
import UserCard from './UserCard';

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const response = await userService.getAll();
      setUsers(response.data);
    } catch (err) {
      setError('Error al cargar usuarios');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (userId) => {
    if (window.confirm('¿Estás seguro de eliminar este usuario?')) {
      try {
        await userService.delete(userId);
        setUsers(users.filter(user => user._id !== userId));
      } catch (err) {
        setError('Error al eliminar usuario');
      }
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="text-turquoise-500">Cargando usuarios...</div>
      </div>
    );
  }

  return (
    <Card>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-turquoise-500">
          Gestión de Usuarios
        </h2>
        <Button>
          Agregar Usuario
        </Button>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <div className="grid gap-4">
        {users.map(user => (
          <UserCard 
            key={user._id} 
            user={user} 
            onDelete={handleDelete}
          />
        ))}
      </div>

      {users.length === 0 && (
        <div className="text-center text-gray-500 py-8">
          No hay usuarios registrados
        </div>
      )}
    </Card>
  );
};

export default UserList;