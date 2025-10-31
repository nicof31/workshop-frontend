import React, { createContext, useState, useContext, useEffect } from 'react';
import { authService } from '../services/auth';
import { setTokenInCookies, getTokenFromCookies, deleteTokenFromCookies } from '../services/api';
import { jwtDecode } from 'jwt-decode';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};

// Función para decodificar el token JWT
const decodeToken = (token) => {
  try {
    return jwtDecode(token);
  } catch (error) {
    console.error('Error decoding token:', error);
    return null;
  }
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  // Cargar perfil del usuario desde el backend
const loadUserProfile = async () => {
  try {
    // El interceptor ya devuelve response.data, así que usamos la respuesta directa
    const response = await authService.getProfile();
    console.log('✅ Respuesta completa del perfil:', response);
    
    // La estructura es: {statusCode: 200, message: 'User retrieved successfully', data: {...}}
    // Necesitamos extraer los datos del usuario de response.data
    if (response && response.data) {
      console.log('✅ Datos del usuario extraídos:', response.data);
      return response.data; // ← Esto devuelve el objeto del usuario
    } else {
      console.error('❌ Estructura de respuesta inválida:', response);
      throw new Error('Estructura de respuesta del perfil inválida');
    }
  } catch (error) {
    console.error('Error loading user profile from API:', error);
    
    // Si falla la API, intentar cargar del token
    const token = getTokenFromCookies();
    if (token) {
      const decoded = decodeToken(token);
      if (decoded) {
        console.log('✅ User loaded from token:', decoded);
        return decoded;
      }
    }
    
    return null;
  }
};

  // Cargar usuario al iniciar la aplicación
// En tu AuthProvider, modifica el useEffect de inicialización
useEffect(() => {
  const initializeAuth = async () => {
    const token = getTokenFromCookies();
    const savedUserData = localStorage.getItem('userData');
    
    console.log('🔄 Inicializando auth...');
    console.log('📝 Token en cookies:', token ? 'Sí' : 'No');
    console.log('💾 Datos guardados en localStorage:', savedUserData ? 'Sí' : 'No');
    
    if (token) {
      try {
        console.log('🔄 Cargando perfil del usuario...');
        let userProfile = await loadUserProfile();
        
        if (userProfile) {
          console.log('✅ Usuario cargado:', userProfile);
          setUser(userProfile);
          localStorage.setItem('userData', JSON.stringify(userProfile));
        } else {
          console.log('❌ No se pudo cargar el perfil');
          deleteTokenFromCookies();
          localStorage.removeItem('userData');
        }
      } catch (error) {
        console.error('❌ Error inicializando auth:', error);
        deleteTokenFromCookies();
        localStorage.removeItem('userData');
      }
    } else if (savedUserData) {
      console.log('🔐 No hay token, limpiando datos guardados');
      localStorage.removeItem('userData');
    }
    
    console.log('🏁 Finalizada inicialización de auth');
  };

  initializeAuth();
}, []);
  const login = async (email, password) => {
    try {
      setLoading(true);
      console.log('📤 Enviando credenciales...');
      
      // El interceptor ya devuelve response.data, así que response es directamente los datos
      const response = await authService.login(email, password);
      console.log('📥 Respuesta completa del login:', response);
      
      // La estructura es: {statusCode: 200, message: 'Login successful', data: {access_token: '...'}}
      const { data } = response;
      
      if (!data || !data.access_token) {
        console.error('❌ Estructura de respuesta inválida:', response);
        throw new Error('No se recibió token de acceso en la respuesta');
      }
      
      const { access_token } = data;
      
      // Guardar token en cookies
      setTokenInCookies(access_token);
      console.log('✅ Token guardado en cookies:', access_token.substring(0, 20) + '...');

      // Decodificar el token para obtener la información del usuario
      console.log('🔄 Decodificando token JWT...');
      const decodedUser = decodeToken(access_token);
      
      if (decodedUser) {
        console.log('✅ Usuario decodificado del token:', decodedUser);
        setUser(decodedUser);
        localStorage.setItem('userData', JSON.stringify(decodedUser));
        
        // Pequeño delay para asegurar que todo se guarde antes de redirigir
        setTimeout(() => {
          window.location.href = '/dashboard';
        }, 100);
        
        return { success: true };
      } else {
        throw new Error('No se pudo decodificar el token JWT');
      }
      
    } catch (error) {
      console.error('❌ Login error:', error);
      
      // Limpiar datos en caso de error
      deleteTokenFromCookies();
      localStorage.removeItem('userData');
      setUser(null);
      
      return { 
        success: false, 
        message: error.message || 'Error en el login' 
      };
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    try {
      // El interceptor ya devuelve response.data
      const result = await authService.register(userData);
      return { success: true, data: result };
    } catch (error) {
      return { 
        success: false, 
        message: error.message || 'Error en el registro' 
      };
    }
  };

  const logout = () => {
    console.log('🚪 Cerrando sesión...');
    deleteTokenFromCookies();
    localStorage.removeItem('userData');
    setUser(null);
   /*  window.location.href = '/login'; */
    window.location.href = '/workshop-frontend/login';
  };

const checkAdminAccess = () => {
  // Acceder a user.data.role en lugar de user.role
  const userRole = user?.data?.role || user?.role;
  const isAdmin = userRole === 'admin' || userRole === 'super-admin';
  
  console.log('🔐 Verificando acceso admin:', { 
    user, 
    userRole, 
    isAdmin 
  });
  
  if (!isAdmin) {
    console.warn('🚫 Acceso denegado: Usuario no es administrador.', user);
    alert('🚫 Acceso denegado\nSolo los usuarios administradores pueden acceder a esta sección.');
  }
  return isAdmin;
};

  // Función para verificar si el token está expirado
  const isTokenExpired = () => {
    const token = getTokenFromCookies();
    if (!token) return true;
    
    try {
      const decoded = decodeToken(token);
      const currentTime = Date.now() / 1000;
      return decoded.exp < currentTime;
    } catch (error) {
      return true;
    }
  };

const value = {
  user: user?.data || user, // ← Esto es importante: usar user.data si existe
  login,
  register,
  logout,
  loading,
  isAuthenticated: !!user && !isTokenExpired(),
  isAdmin: (user?.data?.role === 'admin' || user?.data?.role === 'super-admin' || user?.role === 'admin' || user?.role === 'super-admin'),
  checkAdminAccess,
  isTokenExpired
};

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};