import React, { useState, useEffect } from 'react';
import Sidebar from './sidebar';
import CitaClienteCard from './CitaClienteCard';
import { useTheme } from '../../context/ThemeContext';
import { useCitas } from '../../context/CitasContext';
import { useAuth } from '../../context/AuthContext';

const Historial = () => {
  const { isDarkMode } = useTheme();
  const citasCtx = useCitas() || {};
  const allCitas = citasCtx.citasCliente ?? citasCtx.citas ?? [];
  const { cliente } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [historial, setHistorial] = useState([]);

  useEffect(() => {
    // Filtrar citas del usuario (si hay cliente), si no mostrar todas
    if (!cliente) {
      setHistorial(allCitas || []);
      return;
    }
    const filtered = (allCitas || []).filter(c =>
      // soportar varias formas de referenciar cliente en la cita
      c?.cliente === cliente._id ||
      c?.cliente?._id === cliente._id ||
      c?.clienteId === cliente._id
    );
    setHistorial(filtered);
  }, [allCitas, cliente]);

  return (
    <div className={`flex min-h-screen ${isDarkMode ? 'bg-gradient-to-br from-gray-900 via-black to-gray-800' : 'bg-gradient-to-br from-gray-50 to-gray-200'}`}>
      <Sidebar onHover={(open) => setIsSidebarOpen(open)} />

      <main
        className="flex-1 transition-all duration-300"
        style={{ marginLeft: isSidebarOpen ? 320 : 80 }} /* sincronizar con ancho del sidebar */
      >
        <div className="p-6 md:p-8 max-w-7xl mx-auto">
          <header className={`mb-6 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            <h1 className={`text-4xl font-extrabold tracking-tight ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              Historial de citas
            </h1>
          </header>

          <section className="space-y-6">
            {historial.length === 0 ? (
              <div className={`p-6 rounded-2xl ${isDarkMode ? 'bg-black/40 border-white/10' : 'bg-white/80 border-gray-200'} border text-center`}>
                <p className={isDarkMode ? 'text-white/70' : 'text-gray-600'}>No hay citas en el historial.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6">
                {historial.map((cita) => (
                  <CitaClienteCard key={cita._id || cita.id} cita={cita} />
                ))}
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
};

export default Historial;