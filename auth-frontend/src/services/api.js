import axios from 'axios';
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ;

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
  withCredentials: true, // Importante: enviar cookies automáticamente
});

// Interceptor para manejar tokens desde cookies
api.interceptors.request.use(
  (config) => {
    // Intentar obtener el token de las cookies
    const token = getTokenFromCookies();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error('Error en request:', error);
    return Promise.reject(error);
  }
);

// Interceptor para manejar respuestas
api.interceptors.response.use(
  (response) => {
    return response.data; // Devolver directamente los datos de la respuesta
  },
  (error) => {
    console.error('Error en respuesta:', error);
    
    if (error.response?.status === 401) {
      // Token expirado o inválido
      deleteTokenFromCookies();
      localStorage.removeItem('userData');
    /*   window.location.href = '/login'; */
      window.location.href = '/workshop-frontend/login';
    }
    
    return Promise.reject(error.response?.data || error);
  }
);

// Funciones para manejar cookies
const getTokenFromCookies = () => {
  const cookies = document.cookie.split(';');
  for (let cookie of cookies) {
    const [name, value] = cookie.trim().split('=');
    if (name === 'authToken') {
      return decodeURIComponent(value);
    }
  }
  return null;
};


const setTokenInCookies = (token, days = 7) => {
  const date = new Date();
  date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
  const expires = `expires=${date.toUTCString()}`;
  document.cookie = `authToken=${encodeURIComponent(token)}; ${expires}; path=/; SameSite=Strict`;
};
const deleteTokenFromCookies = () => {
  document.cookie = 'authToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
};

export { setTokenInCookies, getTokenFromCookies, deleteTokenFromCookies };
export default api;