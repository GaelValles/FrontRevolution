import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar } from 'lucide-react';
import { useCitaForm } from '../../hooks/useCitaForm';
import { CitaForm } from '../../components/forms/CitaForm';
import Sidebar from '../components/sidebar';
import citaImage from '../../assets/images/agregarcarro.jpg';

function AgregarCita() {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [vehiculosCliente, setVehiculosCliente] = useState([]);
  const { formData, loading, showSuccess, errors, handleInputChange, handleSubmit } = useCitaForm(navigate);

  useEffect(() => {
    const loadUserAndCars = async () => {
      try {
        const cachedData = localStorage.getItem('userData');
        if (!cachedData) {
          console.error('No hay datos de usuario en localStorage');
          return;
        }

        const userData = JSON.parse(cachedData);
        console.log('Datos del usuario cargados:', userData);

        // Since the cars are already complete objects in userData.carros
        if (userData.carros && Array.isArray(userData.carros)) {
          // Use the car objects directly instead of fetching them again
          setVehiculosCliente(userData.carros);
          console.log('Carros cargados directamente:', userData.carros);
        }
      } catch (error) {
        console.error('Error al cargar datos:', error);
        setErrors(prev => ({
          ...prev,
          general: 'Error al cargar los datos del usuario'
        }));
      }
    };

    loadUserAndCars();
  }, []); // Remove getCarroById from dependencies since we're not using it anymore

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-gray-900 via-black to-gray-800">
      <Sidebar onHover={setIsSidebarOpen} />
      <div className={`flex-1 transition-all duration-300 ${
        isSidebarOpen ? 'ml-[250px]' : 'ml-[80px]'
      } p-6 flex items-center justify-center`}>
        <div className="w-full max-w-5xl bg-black/40 backdrop-blur-xl rounded-2xl shadow-2xl overflow-hidden border border-white/10 transition-all duration-500 hover:border-white/30 hover:shadow-[0_0_15px_rgba(255,255,255,0.1)] hover:bg-black/50">
          <div className="grid md:grid-cols-2 gap-0 min-h-[600px]">
            {/* Left Column - Form Header & Description */}
            <div className="bg-gradient-to-b from-[#1F1F20] to-transparent p-8 flex flex-col justify-center relative overflow-hidden">
              <div 
                className="absolute inset-0 z-0" 
                style={{
                  backgroundImage: `url(${citaImage})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  opacity: '0.75',
                  filter: 'grayscale(100%)',
                  mixBlendMode: 'overlay'
                }}
              ></div>

              <div className="relative z-10">
                <div className="mb-8">
                  <div className="inline-block p-4 bg-gradient-to-r from-white/10 to-white/5 rounded-full mb-6 backdrop-blur-xl">
                    <Calendar className="w-20 h-20 text-white/80" />
                  </div>
                  <h1 className="text-4xl font-black text-white mb-4 tracking-tight">
                    Programa tu Cita
                  </h1>
                  <p className="text-white/70 text-lg backdrop-blur-sm">
                    Selecciona el servicio y la fecha que mejor se adapte a tu agenda
                  </p>
                </div>
              </div>
            </div>

            {/* Right Column - Form */}
            <div className="bg-black/40 p-8 relative overflow-y-auto max-h-[800px] scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
              <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
              
              <CitaForm 
                formData={formData}
                errors={errors}
                loading={loading}
                handleInputChange={handleInputChange}
                handleSubmit={handleSubmit}
                vehiculosCliente={vehiculosCliente}
              />
            </div>
          </div>
        </div>

        {showSuccess && (
          <div className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-green-600 to-green-800 text-white px-6 py-3 rounded-lg shadow-lg border border-green-500/50 z-50 animate-pulse">
            <div className="flex items-center">
              <div className="w-2 h-2 bg-white rounded-full mr-2 animate-ping"></div>
              ¡Cita programada exitosamente!
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default AgregarCita;