import React, { useEffect } from 'react';
import { CheckCircle, AlertTriangle } from 'lucide-react';

const NotificationToast = ({ notification, onClose }) => {
  useEffect(() => {
    if (!notification) return;
    const t = setTimeout(() => {
      onClose?.();
    }, 3500);
    return () => clearTimeout(t);
  }, [notification, onClose]);

  if (!notification) return null;

  const isSuccess = notification.type === 'success';
  return (
    <div className="fixed right-6 top-6 z-50">
      <div className={`max-w-sm w-full p-4 rounded-lg shadow-lg flex items-start gap-3 border ${isSuccess ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-rose-50 border-rose-200 text-rose-800'}`}>
        <div className="mt-0.5">
          {isSuccess ? <CheckCircle className="w-6 h-6" /> : <AlertTriangle className="w-6 h-6" />}
        </div>
        <div className="flex-1">
          <div className="font-semibold">{isSuccess ? 'Éxito' : 'Atención'}</div>
          <div className="text-sm mt-1">{notification.text}</div>
        </div>
        <button onClick={onClose} className="text-sm text-gray-500 ml-2">Cerrar</button>
      </div>
    </div>
  );
};

export default NotificationToast;