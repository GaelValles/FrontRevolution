import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import Sidebar from './components/sidebar';
import { User, Mail, Phone, MapPin, Calendar, Shield, Car } from 'lucide-react';

function Perfil() {
  const { cliente } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800">
      <Sidebar onHover={(isOpen) => setIsSidebarOpen(isOpen)} />
      
      <div className={`flex-1 transition-all duration-300 ${
        isSidebarOpen ? 'ml-[250px]' : 'ml-[80px]'
      }`}>
        <div className="p-6 md:p-8">
          {/* Header Section */}
          <header className="max-w-4xl mx-auto mb-12">
            <div className="bg-black/40 backdrop-blur-xl rounded-2xl border border-white/10 p-8">
              <div className="flex flex-col md:flex-row items-center gap-6">
                <div className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                  <User className="w-16 h-16 text-white" />
                </div>
                <div className="text-center md:text-left">
                  <h1 className="text-4xl font-black text-white mb-2">
                    {cliente?.nombre} {cliente?.apellido}
                  </h1>
                  <p className="text-white/70">
                    {cliente?.rol ? 'Administrador' : 'Cliente'}
                  </p>
                </div>
              </div>
            </div>
          </header>

          {/* Content Grid */}
          <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Información Personal */}
            <div className="bg-black/40 backdrop-blur-xl rounded-2xl border border-white/10 p-8">
              <h2 className="text-2xl font-black text-white mb-6">Información Personal</h2>
              <div className="space-y-4">
                <div className="flex items-center gap-4 p-4 bg-white/5 rounded-xl">
                  <Mail className="w-5 h-5 text-white/60" />
                  <div>
                    <div className="text-white/60 text-sm">Email</div>
                    <div className="text-white">{cliente?.email}</div>
                  </div>
                </div>
                <div className="flex items-center gap-4 p-4 bg-white/5 rounded-xl">
                  <Phone className="w-5 h-5 text-white/60" />
                  <div>
                    <div className="text-white/60 text-sm">Teléfono</div>
                    <div className="text-white">{cliente?.telefono}</div>
                  </div>
                </div>
                <div className="flex items-center gap-4 p-4 bg-white/5 rounded-xl">
                  <MapPin className="w-5 h-5 text-white/60" />
                  <div>
                    <div className="text-white/60 text-sm">Dirección</div>
                    <div className="text-white">{cliente?.direccion}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Estadísticas */}
            <div className="bg-black/40 backdrop-blur-xl rounded-2xl border border-white/10 p-8">
              <h2 className="text-2xl font-black text-white mb-6">Estadísticas</h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-white/5 rounded-xl">
                  <Car className="w-8 h-8 text-white/60 mb-2" />
                  <div className="text-2xl font-bold text-white">
                    {cliente?.carros?.length || 0}
                  </div>
                  <div className="text-white/60 text-sm">Vehículos</div>
                </div>
                <div className="p-4 bg-white/5 rounded-xl">
                  <Calendar className="w-8 h-8 text-white/60 mb-2" />
                  <div className="text-2xl font-bold text-white">
                    {cliente?.citas?.length || 0}
                  </div>
                  <div className="text-white/60 text-sm">Citas</div>
                </div>
              </div>
            </div>

            {/* Botones de Acción */}
            <div className="md:col-span-2">
              <div className="flex flex-col sm:flex-row gap-4">
                <button className="flex-1 bg-white/10 hover:bg-white/20 text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 text-sm uppercase tracking-wider border border-white/20 hover:border-white/40">
                  Editar Perfil
                </button>
                <button className="flex-1 bg-red-500/20 hover:bg-red-500/30 text-red-500 font-bold py-4 px-6 rounded-xl transition-all duration-300 text-sm uppercase tracking-wider">
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