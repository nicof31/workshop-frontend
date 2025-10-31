// hooks/useTokenValidator.js
import { useState, useEffect, useCallback } from 'react';
import { authService } from '../services/auth';
import { deleteTokenFromCookies } from '../services/api';

export const useTokenValidator = (checkInterval = 120000) => { // 2 minutos por defecto
  const [isTokenValid, setIsTokenValid] = useState(true);
  const [showExpiredModal, setShowExpiredModal] = useState(false);

  const verifyToken = useCallback(async () => {
    try {
      const response = await authService.verifyToken();
      
      if (response.valid) {
        setIsTokenValid(true);
        console.log('✅ Token válido');
      } else {
        setIsTokenValid(false);
        setShowExpiredModal(true);
        console.log('❌ Token inválido');
      }
    } catch (error) {
      console.error('Error verificando token:', error);
      setIsTokenValid(false);
      setShowExpiredModal(true);
    }
  }, []);

  // Verificación periódica
  useEffect(() => {
    const interval = setInterval(verifyToken, checkInterval);
    
    // Verificar inmediatamente al montar el componente
    verifyToken();
    
    return () => clearInterval(interval);
  }, [verifyToken, checkInterval]);

  const handleModalClose = () => {
    // Limpiar token y datos de usuario
    deleteTokenFromCookies();
    localStorage.removeItem('userData');
    setShowExpiredModal(false);
    // Redirigir al login
   /*  window.location.href = '/login'; */
   window.location.href = '/workshop-frontend/login';
  };

  return {
    isTokenValid,
    showExpiredModal,
    handleModalClose,
    manuallyVerifyToken: verifyToken // Para verificación manual
  };
};