import React from 'react';
import { useAuth } from '../../context/AuthContext';

const Header = () => {
  const { user, logout, isAdmin } = useAuth();

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-8">
            <h1 className="text-2xl font-bold text-turquoise-500">
              Auth Dashboard
            </h1>
            
            <nav className="flex gap-6">
              <a href="/dashboard" className="text-gray-700 hover:text-turquoise-500 font-medium">
                Dashboard
              </a>
              {isAdmin && (
                <a href="/users" className="text-gray-700 hover:text-turquoise-500 font-medium">
                  Usuarios
                </a>
              )}
              <a href="/stats" className="text-gray-700 hover:text-turquoise-500 font-medium">
                Estadísticas
              </a>
            </nav>
          </div>

          <div className="flex items-center gap-4">
            {user && (
              <>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-800">
                    {user.name} {user.surname}
                  </p>
                  <p className="text-xs text-gray-500 capitalize">
                    {user.role}
                  </p>
                </div>
                <button
                  onClick={logout}
                  className="px-4 py-2 text-sm text-gray-600 hover:text-turquoise-500 font-medium"
                >
                  Cerrar Sesión
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;