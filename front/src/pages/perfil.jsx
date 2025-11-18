import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import Sidebar from './components/sidebar';
import { User, Mail, Phone, MapPin, Calendar, Shield, Car } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

function Perfil() {
  const { cliente } = useAuth();
  const { isDarkMode } = useTheme();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Clases reutilizables para cards y textos, buscando menos blanco en light mode y buen contraste
  const cardBase = isDarkMode
    ? 'bg-black/40 backdrop-blur-xl rounded-2xl border border-white/10 text-white'
    : 'bg-gradient-to-br from-white/95 to-gray-50 rounded-2xl border border-gray-200 text-gray-900 shadow-sm';

  const subtleBox = isDarkMode
    ? 'bg-white/5 rounded-xl'
    : 'bg-gray-50 rounded-xl';

  const labelText = isDarkMode ? 'text-white/60' : 'text-gray-600';
  const valueText = isDarkMode ? 'text-white' : 'text-gray-900';

  return (
    <div className={`flex min-h-screen ${
      isDarkMode
        ? 'bg-gradient-to-br from-gray-900 via-black to-gray-800'
        : 'bg-gradient-to-br from-neutral-50 to-gray-100'
    }`}>
      <Sidebar onHover={(isOpen) => setIsSidebarOpen(isOpen)} />
      
      <div className={`flex-1 transition-all duration-300 ${isSidebarOpen ? 'ml-[250px]' : 'ml-[80px]'}`}>
        <div className="p-6 md:p-8">
          {/* Header Section */}
          <header className="max-w-4xl mx-auto mb-12">
            <div className={`${cardBase} p-8`}>
              <div className="flex flex-col md:flex-row items-center gap-6">
                <div className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-md">
                  <User className="w-16 h-16 text-white" />
                </div>
                <div className="text-center md:text-left">
                  <h1 className={`text-4xl font-black mb-2 tracking-tight ${valueText}`}>
                    {cliente?.nombre} {cliente?.apellido}
                  </h1>
              
                </div>
              </div>
            </div>
          </header>

          {/* Content Grid */}
          <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Información Personal */}
            <div className={`${cardBase} p-8`}>
              <h2 className={`text-2xl font-black mb-6 ${valueText}`}>Información Personal</h2>
              <div className="space-y-4">
                <div className={`flex items-center gap-4 p-4 ${subtleBox}`}>
                  <Mail className={`w-5 h-5 ${isDarkMode ? 'text-white/60' : 'text-gray-600'}`} />
                  <div>
                    <div className={`${labelText} text-sm`}>Email</div>
                    <div className={`${valueText}`}>{cliente.correo}</div>
                  </div>
                </div>
                <div className={`flex items-center gap-4 p-4 ${subtleBox}`}>
                  <Phone className={`w-5 h-5 ${isDarkMode ? 'text-white/60' : 'text-gray-600'}`} />
                  <div>
                    <div className={`${labelText} text-sm`}>Teléfono</div>
                    <div className={`${valueText}`}>{cliente?.telefono}</div>
                  </div>
                </div>
                <div className={`flex items-center gap-4 p-4 ${subtleBox}`}>
                  <MapPin className={`w-5 h-5 ${isDarkMode ? 'text-white/60' : 'text-gray-600'}`} />
      
                </div>
              </div>
            </div>

            {/* Estadísticas */}
            <div className={`${cardBase} p-8`}>
              <h2 className={`text-2xl font-black mb-6 ${valueText}`}>Estadísticas</h2>
              <div className="grid grid-cols-2 gap-4">
                <div className={`p-4 ${subtleBox} flex flex-col items-start gap-2`}>
                  <Car className={`w-8 h-8 ${isDarkMode ? 'text-white/60' : 'text-gray-600'} mb-2`} />
                  <div className={`text-2xl font-bold ${valueText}`}>
                    {cliente?.carros?.length || 0}
                  </div>
                  <div className={`${labelText} text-sm`}>Vehículos</div>
                </div>
                <div className={`p-4 ${subtleBox} flex flex-col items-start gap-2`}>
                  <Calendar className={`w-8 h-8 ${isDarkMode ? 'text-white/60' : 'text-gray-600'} mb-2`} />
                  <div className={`text-2xl font-bold ${valueText}`}>
                    {cliente?.citas?.length || 0}
                  </div>
                  <div className={`${labelText} text-sm`}>Citas</div>
                </div>
              </div>
            </div>

            {/* Botones de Acción */}
            <div className="md:col-span-2">
              <div className="flex flex-col sm:flex-row gap-4">
                <button className={`flex-1 font-bold py-4 px-6 rounded-xl transition-all duration-300 text-sm uppercase tracking-wider border ${
                  isDarkMode
                    ? 'bg-white/10 hover:bg-white/20 text-white border-white/20 hover:border-white/40'
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-900 border-gray-200'
                }`}>
                  Editar Perfil
                </button>
                <button className={`flex-1 font-bold py-4 px-6 rounded-xl transition-all duration-300 text-sm uppercase tracking-wider ${
                  isDarkMode
                    ? 'bg-red-500/20 hover:bg-red-500/30 text-red-500'
                    : 'bg-red-100 hover:bg-red-200 text-red-700'
                }`}>
                  Cambiar Contraseña
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Perfil;