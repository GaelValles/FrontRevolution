import React, { useState, useEffect, useMemo } from 'react';
import Sidebar from './sidebar';
import CitaClienteCard from './CitaClienteCard';
import { useTheme } from '../../context/ThemeContext';
import { useCitas } from '../../context/CitasContext';
import { useAuth } from '../../context/AuthContext';

const Historial = () => {
  const { isDarkMode } = useTheme();
  const citasCtx = useCitas() || {};
  const { cliente } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // estado local con las citas obtenidas (para controlar llamadas y render)
  const [citasList, setCitasList] = useState([]);

  // Nueva función: filtra solo citas del usuario y con estado completada/cancelada
  const filterUserCompletedCanceled = (citas = [], clienteId) => {
    if (!clienteId) return [];
    return (citas || []).filter(cita => {
      const citaClienteId = cita?.cliente?._id ?? cita?.cliente ?? cita?.clienteId;
      const estado = (cita?.estado || '').toString().toLowerCase();
      return String(citaClienteId) === String(clienteId) && (estado === 'completada' || estado === 'cancelada');
    }).sort((a, b) => new Date(b.fechaInicio) - new Date(a.fechaInicio)); // ordenar más recientes primero
  };

  // Al montar / cambiar cliente: traer las citas del contexto / API y guardarlas en citasList
  useEffect(() => {
    let mounted = true;
    const clienteId = cliente?.id || cliente?._id;

    const load = async () => {
      if (!clienteId) {
        if (mounted) setCitasList([]);
        return;
      }

      try {
        // prioridad: si el context expone una función para obtener por cliente, úsala
        if (typeof citasCtx.getCitasPorCliente === 'function') {
          const res = await citasCtx.getCitasPorCliente(clienteId);
          // la función podría devolver datos o poblar citas en el context; normalizamos ambos casos
          const data = Array.isArray(res) ? res : (Array.isArray(citasCtx.citas) ? citasCtx.citas : []);
          if (mounted) setCitasList(data);
          return;
        }

        // si existe función para traer todas las citas en admin, usarla y filtrar por cliente
        if (typeof citasCtx.getAllCitas === 'function') {
          const all = await citasCtx.getAllCitas();
          const data = Array.isArray(all) ? all : (Array.isArray(citasCtx.citas) ? citasCtx.citas : []);
          if (mounted) setCitasList(data);
          return;
        }

        // fallback: usar citas ya cargadas en el contexto (citas o citasCliente)
        const fallback = citasCtx.citasCliente ?? citasCtx.citas ?? [];
        if (mounted) setCitasList(fallback);
      } catch (err) {
        // no romper la UI si hay error; dejar lista vacía
        console.error('Historial: error cargando citas', err);
        if (mounted) setCitasList([]);
      }
    };

    load();

    return () => { mounted = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cliente, citasCtx]);

  // memorizar sólo las citas completadas/canceladas del usuario para renderizar
  const historial = useMemo(() => {
    const clienteId = cliente?.id || cliente?._id;
    return filterUserCompletedCanceled(citasList, clienteId);
  }, [citasList, cliente]);

  return (
    <div className={`flex min-h-screen ${isDarkMode ? 'bg-gradient-to-br from-gray-900 via-black to-gray-800' : 'bg-gradient-to-br from-gray-50 to-gray-200'}`}>
      <Sidebar onHover={(open) => setIsSidebarOpen(open)} />

      <main
        className="flex-1 transition-all duration-300"
        style={{ marginLeft: isSidebarOpen ? 320 : 80 }}
      >
        <div className="p-6 md:p-8 max-w-7xl mx-auto">
          <header className={`mb-6 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            <h1 className={`text-4xl font-extrabold tracking-tight ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              Historial de citas
            </h1>
          </header>

          <section className="space-y-6">
            {!cliente ? (
              <div className={`p-6 rounded-2xl ${isDarkMode ? 'bg-black/40 border-white/10' : 'bg-white/80 border-gray-200'} border text-center`}>
                <p className={isDarkMode ? 'text-white/70' : 'text-gray-600'}>No se ha identificado el usuario.</p>
              </div>
            ) : historial.length === 0 ? (
              <div className={`p-6 rounded-2xl ${isDarkMode ? 'bg-black/40 border-white/10' : 'bg-white/80 border-gray-200'} border text-center`}>
                <p className={isDarkMode ? 'text-white/70' : 'text-gray-600'}>No hay citas completadas o canceladas en tu historial.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {historial.map((cita) => {
                  const estado = (cita?.estado || '').toLowerCase();
                  const isCompleted = estado === 'completada';
                  const isCanceled = estado === 'cancelada';
                  const rowBg = isCompleted
                    ? (isDarkMode ? 'bg-green-900/30 border-green-700' : 'bg-green-50 border-green-200')
                    : (isCanceled ? (isDarkMode ? 'bg-red-900/30 border-red-700' : 'bg-red-50 border-red-200') : '');
                  const textColor = isDarkMode ? 'text-white' : 'text-gray-800';

                  return (
                    <div key={cita._id || cita.id} className={`flex items-center justify-between p-4 rounded-lg border ${rowBg}`}>
                      <div className="flex-1">
                        <div className={`font-semibold ${textColor}`}>{cita.tipoServicio} — {cita.carro?.marca} {cita.carro?.modelo}</div>
                        <div className={`text-sm mt-1 ${isDarkMode ? 'text-white/70' : 'text-gray-600'}`}>
                          {new Date(cita.fechaInicio).toLocaleString()} · Costo: ${cita.costo}
                        </div>
                        {cita.informacionAdicional && <div className={`mt-2 text-sm ${isDarkMode ? 'text-white/60' : 'text-gray-600'}`}>{cita.informacionAdicional}</div>}
                      </div>

                      <div className="ml-4 flex-shrink-0 text-right">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${isCompleted ? 'bg-green-600/90 text-white' : isCanceled ? 'bg-red-600/90 text-white' : 'bg-gray-500 text-white'}`}>
                          {isCompleted ? 'Completada' : isCanceled ? 'Cancelada' : cita.estado}
                        </span>
                        <div className="mt-2 text-xs text-gray-400">{cita.createdAt ? new Date(cita.createdAt).toLocaleDateString() : null}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
};

export default Historial;