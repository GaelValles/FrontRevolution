import React, { useMemo, useState, useEffect } from 'react';
import { Car, Edit3, AlertTriangle, Trash2 } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useCitas } from '../../context/CitasContext';
import { useCarro } from '../../context/CarroContext';
import EditVehiculoModal from './modals/EditVehiculoModal';
import ConfirmModal from './modals/ConfirmModal';
import NotificationToast from './modals/NotificationToast';

const VehiculoCard = ({ vehiculo, onDelete, onUpdate }) => {
  const { isDarkMode } = useTheme();
  const citasCtx = useCitas();
  const carroCtx = useCarro();
  const { deleteCarros, updateCarros } = carroCtx || {};
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [hasActiveCitas, setHasActiveCitas] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [notification, setNotification] = useState(null);

  if (!vehiculo) return null;

  // Determina citas activas: usa vehiculo.citas si existe, si no intenta pedirlas al contexto/ API
  useEffect(() => {
    let mounted = true;
    const check = async () => {
      try {
        // Si vienen incluidas en el vehículo
        if (Array.isArray(vehiculo.citas)) {
          const active = vehiculo.citas.some(c => ['programada', 'en_proceso'].includes((c?.estado || '').toString().toLowerCase()));
          if (mounted) setHasActiveCitas(active);
          return;
        }

        // Intentar funciones disponibles en contextos
        const fnCandidates = [
          carroCtx?.getCitasByCarro,
          citasCtx?.getCitasByCarro,
          citasCtx?.getCitasPorCarro,
          citasCtx?.getCitasByCarroRequest
        ].filter(Boolean);

        if (fnCandidates.length > 0) {
          const fn = fnCandidates[0];
          const res = await fn(vehiculo._id);
          const arr = Array.isArray(res) ? res : (res?.data ?? []);
          const active = (arr || []).some(c => ['programada', 'en_proceso'].includes((c?.estado || '').toString().toLowerCase()));
          if (mounted) setHasActiveCitas(active);
          return;
        }

        // Fallback: no info -> asumir no activo
        if (mounted) setHasActiveCitas(false);
      } catch (err) {
        console.warn('Error verificando citas del vehículo:', err);
        if (mounted) setHasActiveCitas(false);
      }
    };

    check();
    return () => { mounted = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [vehiculo, citasCtx, carroCtx]);

  const handleRequestEdit = () => {
    if (hasActiveCitas) {
      setNotification({ type: 'error', text: 'No puedes modificar este vehículo porque tiene citas activas.' });
      return;
    }
    setIsEditOpen(true);
  };

  const handleRequestDelete = () => {
    if (hasActiveCitas) {
      setNotification({ type: 'error', text: 'No puedes eliminar este vehículo porque tiene citas activas.' });
      return;
    }
    setShowConfirm(true);
  };

  const onConfirmDelete = async () => {
    setShowConfirm(false);
    setBusy(true);
    try {
      if (typeof onDelete === 'function') {
        await onDelete(vehiculo._id);
      } else if (typeof deleteCarros === 'function') {
        await deleteCarros(vehiculo._id);
      } else {
        throw new Error('No hay función de eliminación disponible');
      }
      setNotification({ type: 'success', text: 'Vehículo eliminado correctamente.' });
    } catch (err) {
      console.error('Error eliminando vehículo:', err);
      setNotification({ type: 'error', text: err?.response?.data?.message || err?.message || 'Error al eliminar vehículo.' });
    } finally {
      setBusy(false);
    }
  };

  const handleSaveEdit = async (updated) => {
    setBusy(true);
    try {
      if (typeof onUpdate === 'function') {
        await onUpdate(vehiculo._id, updated);
      } else if (typeof updateCarros === 'function') {
        await updateCarros(vehiculo._id, updated);
      } else {
        throw new Error('No hay función de actualización disponible');
      }
      setNotification({ type: 'success', text: 'Vehículo actualizado correctamente.' });
      setIsEditOpen(false);
    } catch (err) {
      console.error('Error actualizando vehículo:', err);
      setNotification({ type: 'error', text: err?.response?.data?.message || err?.message || 'Error al actualizar vehículo.' });
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <div className={`relative group rounded-2xl p-6 border ${isDarkMode ? 'bg-black/40 border-white/10' : 'bg-white/80 border-gray-200'} hover:shadow-2xl transition transform`}>
        <div className="flex items-center justify-between mb-4">
          <div className={`${isDarkMode ? 'text-white' : 'text-gray-900'} font-black text-xl`}>{vehiculo.marca} {vehiculo.modelo}</div>
        </div>

        <div className="space-y-4 mb-6">
          <div className={`flex items-center gap-3 p-3 rounded-xl border ${isDarkMode ? 'bg-white/5 border-white/10' : 'bg-gray-50 border-gray-200'}`}>
            <Car className={`${isDarkMode ? 'text-white/60' : 'text-gray-600'} w-5 h-5`} />
            <div>
              <div className={isDarkMode ? 'text-white' : 'text-gray-900'}>{vehiculo.placas}</div>
              <div className={`${isDarkMode ? 'text-white/60' : 'text-gray-500'} text-xs uppercase`}>PLACAS</div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className={`flex items-center gap-3 p-3 rounded-xl border ${isDarkMode ? 'bg-white/5 border-white/10' : 'bg-gray-50 border-gray-200'}`}>
              <div className={isDarkMode ? 'text-white/60' : 'text-gray-500'}>Año</div>
              <div className={isDarkMode ? 'text-white' : 'text-gray-900'}>{vehiculo.año}</div>
            </div>
            <div className={`flex items-center gap-3 p-3 rounded-xl border ${isDarkMode ? 'bg-white/5 border-white/10' : 'bg-gray-50 border-gray-200'}`}>
              <div className={isDarkMode ? 'text-white/60' : 'text-gray-500'}>Color</div>
              <div className={isDarkMode ? 'text-white' : 'text-gray-900'}>{vehiculo.color}</div>
            </div>
          </div>

          <div className={`flex items-center gap-3 p-3 rounded-xl border ${isDarkMode ? 'bg-white/5 border-white/10' : 'bg-gray-50 border-gray-200'}`}>
            <div className={isDarkMode ? 'text-white/60' : 'text-gray-500'}>Tipo</div>
            <div className={`${isDarkMode ? 'text-white' : 'text-gray-900'} font-bold capitalize`}>{vehiculo.tipo}</div>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={handleRequestEdit}
            disabled={hasActiveCitas || busy}
            aria-disabled={hasActiveCitas || busy}
            className={`flex-1 font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-2 text-sm uppercase tracking-wider border transition ${hasActiveCitas || busy ? 'opacity-60 cursor-not-allowed' : 'hover:scale-[1.02]' } ${isDarkMode ? 'text-white border-white/20 bg-white/10' : 'text-gray-900 bg-gray-100 border-gray-200'}`}
          >
            <Edit3 className="w-4 h-4" /> MODIFICAR
          </button>

          <button
            onClick={handleRequestDelete}
            disabled={hasActiveCitas || busy}
            aria-disabled={hasActiveCitas || busy}
            className={`'flex-1 font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-2 text-sm uppercase tracking-wider border transition ${hasActiveCitas || busy ? 'opacity-60 cursor-not-allowed' : 'hover:scale-[1.02]' } ${isDarkMode ? 'text-white border-white/20 bg-red-600' : 'text-gray-900 bg-gray-100 border-gray-200'}`}
          >
            <Trash2 className="w-4 h-4" /> ELIMINAR
          </button>
        </div>

        {hasActiveCitas && (
          <div className="mt-3 p-3 rounded-lg bg-black-50 border border-red-200 text-red-500 text-sm flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-red-500 mt-0.5" />
            <div>
              Este vehículo tiene citas activas (programadas o en proceso). No se puede modificar ni eliminar hasta que las citas finalicen o se cancelen.
            </div>
          </div>
        )}

        <div className={`absolute bottom-0 left-0 right-0 h-1 rounded-b-3xl ${isDarkMode ? 'bg-gradient-to-r from-transparent via-white/30 to-transparent' : 'bg-gradient-to-r from-transparent via-gray-300 to-transparent'} opacity-0 group-hover:opacity-100 transition-opacity`} />
      </div>

      <EditVehiculoModal isOpen={isEditOpen} onClose={() => setIsEditOpen(false)} vehiculo={vehiculo} onSave={handleSaveEdit} />
      <ConfirmModal isOpen={showConfirm} title="Eliminar vehículo" description="¿Estás seguro de eliminar el carro? Esta acción no se puede deshacer." onCancel={() => setShowConfirm(false)} onConfirm={onConfirmDelete} />
      <NotificationToast notification={notification} onClose={() => setNotification(null)} />
    </>
  );
};

export default VehiculoCard;