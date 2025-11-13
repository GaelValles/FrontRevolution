import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Mail, Phone, MapPin } from 'lucide-react';
import LogoImg from '../assets/images/logo.png';
import { useCitas } from '../context/CitasContext';

export default function PerfilAdmin() {
  const { cliente } = useAuth();
  const { isDarkMode } = useTheme();
  const navigate = useNavigate();
  const { getAllCitas } = useCitas();

  // state para todas las citas (se obtiene igual que en inicioAdmin)
  const [citas, setCitas] = useState([]);
  const [loadingCitas, setLoadingCitas] = useState(true);

  useEffect(() => {
    let mounted = true;
    const fetchCitas = async () => {
      setLoadingCitas(true);
      try {
        const data = await getAllCitas();
        if (!mounted) return;
        setCitas(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error('Error cargando citas en PerfilAdmin:', err);
        if (mounted) setCitas([]);
      } finally {
        if (mounted) setLoadingCitas(false);
      }
    };
    fetchCitas();
    return () => {
      mounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // defensivo: ahora usamos 'citas' cargadas desde el backend
  const totalCitas = Array.isArray(citas) ? citas.length : 0;
  const now = new Date();
  const parseDate = (c) => {
    const v = c?.fecha || c?.date || c?.datetime || c?.fecha_cita || c?.time || c?.fechaInicio || c?.fechaFin;
    const d = v ? new Date(v) : null;
    return d instanceof Date && !isNaN(d) ? d : null;
  };
  const proximas = (citas || []).filter(c => {
    const d = parseDate(c);
    return d ? d > now : false;
  }).slice(0, 5);
  const past = (citas || []).filter(c => {
    const d = parseDate(c);
    return d ? d <= now : false;
  }).length;

  const containerBg = isDarkMode ? 'bg-[#060607] text-white' : 'bg-gray-50 text-gray-900';
  const card = isDarkMode
    ? 'bg-[#0f1113] border border-white/6 text-white'
    : 'bg-white border border-gray-200 text-gray-900';

  return (
    <div className={`${containerBg} min-h-screen py-10`}>
      <div className="max-w-4xl mx-auto px-6">
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => navigate('/inicio')}
            className={`px-4 py-2 rounded-md font-medium ${isDarkMode ? 'bg-white/6 text-white' : 'bg-white shadow text-gray-900'}`}
          >
            Volver a inicio
          </button>
        </div>

        <header className={`${card} rounded-2xl p-6 mb-8 flex flex-col md:flex-row items-center gap-6`}>
          <div className="w-28 h-28 rounded-full flex items-center justify-center bg-gradient-to-br from-indigo-600 to-emerald-400 overflow-hidden">
            <img src={LogoImg} alt="logo" className="w-20 h-20 object-contain" />
          </div>

          <div className="flex-1 text-center md:text-left">
            <h1 className="text-3xl font-bold">{(cliente && (cliente.nombre || cliente.nombreCompleto)) || 'Admin'}</h1>
            <div className="mt-4 flex flex-wrap gap-4">
              <div className="flex items-center gap-2 text-sm text-gray-300">
                <Mail className="w-4 h-4" /> <span>{cliente?.correo || cliente?.email || '-'}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-300">
                <Phone className="w-4 h-4" /> <span>{cliente?.telefono || '-'}</span>
              </div>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className={`${card} rounded-lg p-4`}>
            <div className="text-sm text-gray-400">Total de citas</div>
            <div className="text-2xl font-bold mt-2">{loadingCitas ? '...' : totalCitas}</div>
          </div>

          <div className={`${card} rounded-lg p-4`}>
            <div className="text-sm text-gray-400">Citas pasadas</div>
            <div className="text-2xl font-bold mt-2">{loadingCitas ? '...' : past}</div>
          </div>

          <div className={`${card} rounded-lg p-4`}>
            <div className="text-sm text-gray-400">Próximas (vis.)</div>
            <div className="text-2xl font-bold mt-2">{loadingCitas ? '...' : proximas.length}</div>
          </div>
        </div>

        
          <section className={`${card} rounded-lg p-6`}>
            <h2 className="text-lg font-semibold mb-3">Próximas citas</h2>
            {loadingCitas ? (
              <div className="text-sm text-gray-400">Cargando citas...</div>
            ) : proximas.length === 0 ? (
              <div className="text-sm text-gray-400">No hay citas próximas.</div>
            ) : (
              <ul className="space-y-3">
                {proximas.map((c, i) => {
                  const d = parseDate(c);
                  return (
                    <li key={c._id || i} className="flex items-start justify-between gap-4">
                      <div>
                        <div className="font-medium">{c?.clienteName || c?.nombre || c?.cliente?.nombre || 'Sin nombre'}</div>
                        <div className="text-sm text-gray-400">{d ? d.toLocaleString() : (c?.fecha || '-')}</div>
                        <div className="text-sm text-gray-400">{c?.servicio || c?.tipo || ''}</div>
                      </div>
                      <div className="text-sm text-gray-300">{c?.vehiculo?.modelo || c?.vehiculo || '-'}</div>
                    </li>
                  );
                })}
              </ul>
            )}
          </section>


        
      </div>
    </div>
  );
}