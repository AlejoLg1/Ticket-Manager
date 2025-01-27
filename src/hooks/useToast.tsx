import { useContext } from 'react';
import { ToastContext } from '@ui/toasts/toastManager';

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast debe ser usado dentro de ToastProvider');
  }
  return context;
};
