import React from 'react';
import { X, Check, AlertOctagon } from 'lucide-react';

const ConfirmModal = ({ isOpen, title = 'Confirmar', description = '', onConfirm, onCancel }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onCancel} />
      <div className="relative w-full max-w-lg bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-white/10 overflow-hidden">
        <div className="flex items-start gap-4 p-6">
          <div className="w-12 h-12 rounded-lg bg-rose-600/90 flex items-center justify-center">
            <AlertOctagon className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">{title}</h3>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">{description}</p>
          </div>
        </div>
        <div className="flex items-center justify-end gap-3 p-4 border-t border-white/10">
          <button onClick={onCancel} className="px-4 py-2 rounded-lg border bg-white/60 dark:bg-transparent text-gray-700 dark:text-gray-200">Cancelar</button>
          <button onClick={onConfirm} className="px-4 py-2 rounded-lg bg-rose-600 text-white font-semibold hover:opacity-95">Sí, eliminar</button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;