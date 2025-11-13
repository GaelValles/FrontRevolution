import React, { useEffect, useState } from 'react';
import { X, CheckCircle, AlertTriangle } from 'lucide-react';

const EditVehiculoModal = ({ isOpen, onClose, vehiculo, onSave }) => {
  const [form, setForm] = useState({
    marca: '',
    modelo: '',
    año: '',
    color: '',
    placas: '',
    tipo: ''
  });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null); // { type: 'success'|'error', text: '' }
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (vehiculo) {
      setForm({
        marca: vehiculo.marca || '',
        modelo: vehiculo.modelo || '',
        año: vehiculo.año || '',
        color: vehiculo.color || '',
        placas: vehiculo.placas || '',
        tipo: vehiculo.tipo || ''
      });
      setErrors({});
      setMessage(null);
    }
  }, [vehiculo]);

  if (!isOpen) return null;

  const validate = () => {
    const errs = {};
    if (!form.marca || form.marca.trim().length < 2) errs.marca = 'Marca requerida (min 2 caracteres).';
    if (!form.modelo || form.modelo.trim().length < 1) errs.modelo = 'Modelo requerido.';
    if (!form.placas || form.placas.trim().length < 3) errs.placas = 'Placas inválidas.';
    const añoNum = form.año ? Number(form.año) : null;
    if (form.año && (isNaN(añoNum) || añoNum < 1900 || añoNum > new Date().getFullYear() + 1)) errs.año = 'Año inválido.';
    return errs;
  };

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    setErrors(prev => ({ ...prev, [e.target.name]: undefined }));
    setMessage(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validation = validate();
    if (Object.keys(validation).length > 0) {
      setErrors(validation);
      setMessage({ type: 'error', text: 'Corrige los campos marcados antes de guardar.' });
      return;
    }

    setSaving(true);
    setMessage(null);
    try {
      if (typeof onSave === 'function') {
        await onSave(form);
      }
      setMessage({ type: 'success', text: 'Vehículo actualizado correctamente.' });
      // show success briefly then close
      setTimeout(() => {
        setSaving(false);
        setMessage(null);
        onClose();
      }, 900);
    } catch (err) {
      console.error('Error guardando vehículo:', err);
      const text = err?.message || err?.response?.data?.message || 'Error al guardar el vehículo.';
      setMessage({ type: 'error', text });
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 sm:px-6 md:px-10">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={() => { if (!saving) onClose(); }}
        aria-hidden="true"
      />
      <div
        role="dialog"
        aria-modal="true"
        className="relative w-full max-w-3xl mx-auto bg-white dark:bg-gray-900 rounded-3xl shadow-2xl border border-white/10 overflow-hidden transform transition-all"
      >
        <div className="flex items-center justify-between px-6 py-5 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-600 to-emerald-400 flex items-center justify-center shadow-md">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-white">
                <path d="M3 7.5a4 4 0 014-4h10a4 4 0 014 4v9a1 1 0 01-1 1H4a1 1 0 01-1-1v-9z" fill="currentColor" opacity="0.08"/>
                <path d="M7 10h10M7 13h6" stroke="white" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" opacity="0.95"/>
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-extrabold text-gray-900 dark:text-white">Editar vehículo</h3>
              <p className="text-sm text-gray-500 dark:text-gray-300">Modifica los datos del vehículo. Los campos obligatorios están marcados.</p>
            </div>
          </div>
          <button
            onClick={() => { if (!saving) onClose(); }}
            className="p-2 rounded-md hover:bg-white/5 text-gray-500 dark:text-gray-300"
            aria-label="Cerrar modal"
            disabled={saving}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="px-6 py-6">
          {/* Alert */}
          {message && (
            <div className={`mb-4 flex items-start gap-3 p-4 rounded-lg border ${message.type === 'success' ? 'bg-emerald-50 border-emerald-200 text-emerald-700' : 'bg-rose-50 border-rose-200 text-rose-700'}`}>
              <div className="mt-0.5">
                {message.type === 'success' ? <CheckCircle className="w-5 h-5" /> : <AlertTriangle className="w-5 h-5" />}
              </div>
              <div className="text-sm leading-tight">
                <div className="font-semibold">{message.type === 'success' ? 'Éxito' : 'Error'}</div>
                <div className="mt-0.5">{message.text}</div>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <label className="block">
                <span className="text-xs font-semibold text-gray-600 dark:text-gray-300">Marca *</span>
                <input
                  name="marca"
                  value={form.marca}
                  onChange={handleChange}
                  placeholder="Ej. Toyota"
                  className={`mt-1 w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-indigo-400 transition ${errors.marca ? 'border-rose-400' : 'border-gray-200 dark:border-gray-700'} bg-white dark:bg-gray-800`}
                  required
                />
                {errors.marca && <div className="text-rose-600 text-xs mt-1">{errors.marca}</div>}
              </label>

              <label className="block">
                <span className="text-xs font-semibold text-gray-600 dark:text-gray-300">Modelo *</span>
                <input
                  name="modelo"
                  value={form.modelo}
                  onChange={handleChange}
                  placeholder="Ej. Corolla"
                  className={`mt-1 w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-indigo-400 transition ${errors.modelo ? 'border-rose-400' : 'border-gray-200 dark:border-gray-700'} bg-white dark:bg-gray-800`}
                  required
                />
                {errors.modelo && <div className="text-rose-600 text-xs mt-1">{errors.modelo}</div>}
              </label>

              <label className="block">
                <span className="text-xs font-semibold text-gray-600 dark:text-gray-300">Año</span>
                <input
                  name="año"
                  value={form.año}
                  onChange={handleChange}
                  placeholder="2020"
                  inputMode="numeric"
                  className={`mt-1 w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-indigo-400 transition ${errors.año ? 'border-rose-400' : 'border-gray-200 dark:border-gray-700'} bg-white dark:bg-gray-800`}
                />
                {errors.año && <div className="text-rose-600 text-xs mt-1">{errors.año}</div>}
              </label>

              <label className="block">
                <span className="text-xs font-semibold text-gray-600 dark:text-gray-300">Color</span>
                <input
                  name="color"
                  value={form.color}
                  onChange={handleChange}
                  placeholder="Ej. Blanco"
                  className="mt-1 w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
                />
              </label>

              <label className="block sm:col-span-2">
                <span className="text-xs font-semibold text-gray-600 dark:text-gray-300">Placas *</span>
                <input
                  name="placas"
                  value={form.placas}
                  onChange={handleChange}
                  placeholder="ABC-1234"
                  className={`mt-1 w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-indigo-400 transition ${errors.placas ? 'border-rose-400' : 'border-gray-200 dark:border-gray-700'} bg-white dark:bg-gray-800`}
                  required
                />
                {errors.placas && <div className="text-rose-600 text-xs mt-1">{errors.placas}</div>}
              </label>

              <label className="block sm:col-span-2">
                <span className="text-xs font-semibold text-gray-600 dark:text-gray-300">Tipo</span>
                <input
                  name="tipo"
                  value={form.tipo}
                  onChange={handleChange}
                  placeholder="Ej. Sedán"
                  className="mt-1 w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
                />
              </label>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => { if (!saving) onClose(); }}
                className="px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white/60 dark:bg-transparent text-gray-700 dark:text-gray-200 hover:bg-white/70 transition"
                disabled={saving}
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={saving}
                className="inline-flex items-center gap-2 px-5 py-3 rounded-lg bg-gradient-to-r from-indigo-600 to-emerald-400 text-white font-semibold shadow hover:scale-[1.02] transition transform disabled:opacity-60"
              >
                {saving ? 'Guardando...' : 'Guardar cambios'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditVehiculoModal;