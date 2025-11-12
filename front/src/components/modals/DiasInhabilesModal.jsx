import React, { useState, useEffect } from 'react';
import { Calendar, X, Plus, Trash2, AlertCircle } from 'lucide-react';
import { useDias } from '../../context/DiasContext';

export const DiasInhabilesModal = ({ isOpen, onClose }) => {
  const { 
    diasInhabiles, 
    obtenerDiasInhabiles, 
    registrarDiaInhabil,
    eliminarDiaInhabil,
    loading 
  } = useDias();

  const [nuevaFecha, setNuevaFecha] = useState('');
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);

  // Cargar días inhábiles al abrir el modal
  useEffect(() => {
    if (isOpen) {
      loadDiasInhabiles();
    }
  }, [isOpen]);

  const loadDiasInhabiles = async () => {
    try {
      await obtenerDiasInhabiles();
      setError('');
    } catch (error) {
      setError('Error al cargar días inhábiles');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (nuevaFecha) {
      await agregarFecha();
    }
  };

  const agregarFecha = async () => {
    try {
      if (!nuevaFecha) {
        setError('Por favor selecciona una fecha');
        return;
      }

      // Parsear la fecha desde el input "YYYY-MM-DD" como fecha local
      // para evitar desplazamientos por zona horaria al crear el objeto Date.
      const [y, m, d] = nuevaFecha.split('-').map(Number);
      const fecha = new Date(y, m - 1, d, 12, 0, 0, 0); // mediodía local

      // Verificar si la fecha ya existe usando toLocaleDateString local
      const fechaExiste = diasInhabiles.some(
        dia => new Date(dia.fecha).toLocaleDateString() === fecha.toLocaleDateString()
      );

      if (fechaExiste) {
        setError('Esta fecha ya está registrada como inhábil');
        return;
      }

      // Enviar la fecha en formato ISO (mediodía) para evitar shifts de día
      await registrarDiaInhabil(fecha.toISOString());
      setNuevaFecha('');
      setError('');
    } catch (error) {
      setError(error.response?.data?.message || 'Error al registrar día inhábil');
    }
  };

  const handleEliminar = async (id) => {
    try {
      await eliminarDiaInhabil(id);
      setError('');
    } catch (error) {
      setError('Error al eliminar día inhábil');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gray-900 rounded-2xl border border-white/20 w-full max-w-2xl overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-white/10 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-white flex items-center gap-3">
            <Calendar className="w-6 h-6 text-white/70" />
            Configurar Días Inhábiles
          </h2>
          <button
            onClick={onClose}
            className="text-white/70 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-sm font-bold text-white/90 mb-2">
                Seleccionar Fecha Inhábil
              </label>
              <div className="flex gap-2">
                <input
                  type="date"
                  value={nuevaFecha}
                  onChange={(e) => setNuevaFecha(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  className="flex-1 px-4 py-2 bg-white/10 border border-white/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-white/50"
                />
                <button
                  type="submit"
                  disabled={!nuevaFecha || loading}
                  className="px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Plus className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Error message */}
          {error && (
            <div className="flex items-center gap-2 text-red-400 bg-red-400/10 p-3 rounded-lg">
              <AlertCircle className="w-5 h-5" />
              <p className="text-sm">{error}</p>
            </div>
          )}

          {/* Lista de días inhábiles */}
          <div className="mt-6">
            <h3 className="text-white/90 font-bold mb-4">Días Inhábiles Registrados</h3>
            <div className="space-y-2 max-h-[200px] overflow-y-auto">
              {loading ? (
                <div className="text-center py-4">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto"></div>
                </div>
              ) : (
                <>
                  {diasInhabiles.map((dia) => (
                    <div
                      key={dia._id}
                      className="flex items-center justify-between p-3 bg-white/5 rounded-lg"
                    >
                      <div className="flex items-center gap-4">
                        <Calendar className="w-5 h-5 text-white/70" />
                        <div>
                          <p className="text-white font-medium">
                            {new Date(dia.fecha).toLocaleDateString('es-MX', {
                              weekday: 'long',
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                              timeZone: 'UTC' // Agregar esto para forzar UTC
                            })}
                          </p>
                          <p className="text-white/50 text-sm">
                            Registrado por: {dia.registradoPor?.nombre || 'Sistema'}
                          </p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleEliminar(dia._id)}
                        className="text-red-400 hover:text-red-300 transition-colors"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  ))}
                  {diasInhabiles.length === 0 && (
                    <p className="text-white/50 text-center py-4">
                      No hay días inhábiles registrados
                    </p>
                  )}
                </>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-3 pt-6 border-t border-white/10">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 text-white/70 hover:text-white transition-colors"
            >
              Cerrar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};