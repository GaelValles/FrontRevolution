import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useCarro } from '../../context/CarroContext';
import { useNavigate } from 'react-router-dom';
import { Car } from 'lucide-react';
import carWashImage from '../../assets/images/agregarcarro.jpg';
import Sidebar from '../components/sidebar';

function AgregarCarro() {
  const navigate = useNavigate();
  const { cliente } = useAuth();
  const { addCarro, validateCarroData } = useCarro();
  const [showSuccess, setShowSuccess] = useState(false);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  
  // Initialize form without propietario
  const [formData, setFormData] = useState({
    marca: '',
    modelo: '',
    año: '',
    placas: '',
    color: '',
    tipo: ''
  });

  // Load client data from localStorage if needed
  useEffect(() => {
    const cachedData = localStorage.getItem('userData');
    if (cachedData) {
      const userData = JSON.parse(cachedData);
      console.log('Datos del usuario cargados:', userData);
    }
  }, []);

  const tiposVehiculo = [
    'carro chico',
    'carro grande',
    'camioneta chica',
    'camioneta grande',
    'motocicleta chica',
    'motocicleta grande'
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    let processedValue = value;
    
    // Special handling for specific fields
    switch (name) {
      case 'placas':
        processedValue = value.toUpperCase().slice(0, 3);
        break;
      case 'año':
        processedValue = value ? parseInt(value) : '';
        break;
      default:
        processedValue = value;
    }

    setFormData(prev => ({
      ...prev,
      [name]: processedValue
    }));
    
    // Clear field error
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});

    const cachedData = localStorage.getItem('userData');
    const userData = cachedData ? JSON.parse(cachedData) : null;
    const clienteId = cliente?._id || userData?._id;

    console.log('ID del cliente:', userData.id);
    if (!userData.id) {
      console.error('No hay ID de cliente disponible');
      setErrors({ 
        submit: 'Error de conexión. Por favor, actualice la página.' 
      });
      return;
    }

    try {
      setIsLoading(true);

      const carroData = {
        ...formData,
        propietario: userData.id
      };

      console.log('Datos a enviar:', carroData);

      const validation = validateCarroData(carroData);
      if (!validation.isValid) {
        setErrors(validation.errors);
        return;
      }

      const result = await addCarro(carroData);
      
      if (result.success) {
        setShowSuccess(true);
        setFormData({
          marca: '',
          modelo: '',
          año: '',
          placas: '',
          color: '',
          tipo: ''
        });
        
        setTimeout(() => {
          navigate('/misCarros');
        }, 2000);
      } else {
        throw new Error(result.error?.message || 'Error al registrar el vehículo');
      }
    } catch (error) {
      console.error('Error en el registro:', error);
      setErrors({ 
        submit: error.message || 'Error al registrar el vehículo. Por favor, intente nuevamente.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Modify the loading check
  const shouldShowLoading = !cliente?._id && !localStorage.getItem('userData');
  
  if (shouldShowLoading) {
    return (
      <div className="min-h-screen flex bg-gradient-to-br from-gray-900 via-black to-gray-800 relative">
        <Sidebar />
        <div className="flex-1 ml-[80px] flex items-center justify-center p-4">
          <div className="bg-black/40 backdrop-blur-xl rounded-2xl p-8 border border-white/10">
            <div className="flex flex-col items-center">
              <div className="w-8 h-8 border-4 border-white/20 border-t-white rounded-full animate-spin mb-4"></div>
              <p className="text-white">Cargando datos del usuario...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-gray-900 via-black to-gray-800 relative">
      <Sidebar />
      <div className="flex-1 ml-[80px] flex items-center justify-center p-4 transition-all duration-300"> 
        <div className="relative w-full max-w-5xl bg-black/40 backdrop-blur-xl rounded-2xl shadow-2xl overflow-hidden border border-white/10 transition-all duration-500 hover:border-white/30 hover:shadow-[0_0_15px_rgba(255,255,255,0.1)] hover:bg-black/50">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/[0.02] rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-white/[0.02] rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>

          <div className="grid md:grid-cols-2 gap-0 relative">
            {/* Left Column - Form Header & Description */}
            <div className="bg-gradient-to-b from-[#1F1F20] to-transparent p-8 flex flex-col justify-center relative overflow-hidden">
              <div 
                className="absolute inset-0 z-0" 
                style={{
                  backgroundImage: `url(${carWashImage})`,
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
                    <Car className="w-20 h-20 text-white/80" />
                  </div>
                  <h1 className="text-4xl font-black text-white mb-4 tracking-tight">
                    Registra tu Vehículo
                  </h1>
                  <p className="text-white/70 text-lg backdrop-blur-sm">
                    Ingresa los detalles de tu vehículo para una mejor experiencia personalizada
                  </p>
                </div>
              </div>
            </div>

            {/* Right Column - Form */}
            <div className="bg-black/40 p-8 relative">
              <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-white/60 text-sm mb-2">Marca</label>
                    <input
                      type="text"
                      name="marca"
                      value={formData.marca}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-white/10 border border-white/30 rounded-lg text-white placeholder-white/30 focus:outline-none focus:border-white/50"
                      placeholder="ej. Toyota"
                    />
                    {errors.marca && (
                      <span className="text-red-400 text-xs mt-1 block">{errors.marca}</span>
                    )}
                  </div>
                  <div>
                    <label className="block text-white/60 text-sm mb-2">Modelo</label>
                    <input
                      type="text"
                      name="modelo"
                      value={formData.modelo}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-white/10 border border-white/30 rounded-lg text-white placeholder-white/30 focus:outline-none focus:border-white/50"
                      placeholder="ej. Corolla"
                    />
                    {errors.modelo && (
                      <span className="text-red-400 text-xs mt-1 block">{errors.modelo}</span>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-white/60 text-sm mb-2">Año</label>
                    <input
                      type="number"
                      name="año"
                      value={formData.año}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-white/10 border border-white/30 rounded-lg text-white placeholder-white/30 focus:outline-none focus:border-white/50"
                      placeholder="2024"
                      min="1900"
                      max={new Date().getFullYear() + 1}
                    />
                    <p className="text-white/40 text-xs mt-1">
                      Ingresa un año entre 1900 y {new Date().getFullYear() + 1}
                    </p>
                    {errors.año && (
                      <span className="text-red-400 text-xs mt-1 block">{errors.año}</span>
                    )}
                  </div>
                  <div>
                    <label className="block text-white/60 text-sm mb-2">Color</label>
                    <input
                      type="text"
                      name="color"
                      value={formData.color}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-white/10 border border-white/30 rounded-lg text-white placeholder-white/30 focus:outline-none focus:border-white/50"
                      placeholder="ej. Negro"
                    />
                    {errors.color && (
                      <span className="text-red-400 text-xs mt-1 block">{errors.color}</span>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-white/60 text-sm mb-2">Terminación de Placas</label>
                  <input
                    type="text"
                    name="placas"
                    value={formData.placas}
                    onChange={handleInputChange}
                    maxLength={3}
                    className="w-full px-4 py-3 bg-white/10 border border-white/30 rounded-lg text-white placeholder-white/30 focus:outline-none focus:border-white/50 uppercase tracking-widest text-center text-xl font-bold"
                    placeholder="ABC"
                  />
                  <p className="text-white/40 text-xs mt-1">Ingresa los últimos 3 caracteres de tus placas</p>
                  {errors.placas && (
                    <span className="text-red-400 text-xs mt-1 block">{errors.placas}</span>
                  )}
                </div>

                <div>
                  <label className="block text-white/60 text-sm mb-2">Tipo de Vehículo</label>
                  <select
                    name="tipo"
                    value={formData.tipo}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-white/10 border border-white/30 rounded-lg text-white focus:outline-none focus:border-white/50 appearance-none"
                  >
                    <option value="" className="bg-gray-900">Selecciona el tipo</option>
                    {tiposVehiculo.map((tipo) => (
                      <option 
                        key={tipo} 
                        value={tipo} 
                        className="bg-gray-900"
                      >
                        {tipo.charAt(0).toUpperCase() + tipo.slice(1)}
                      </option>
                    ))}
                  </select>
                  {errors.tipo && (
                    <span className="text-red-400 text-xs mt-1 block">{errors.tipo}</span>
                  )}
                </div>

                {errors.submit && (
                  <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
                    <p className="text-red-500 text-sm">{errors.submit}</p>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-white/90 hover:bg-white text-black font-black py-4 rounded-lg text-lg uppercase tracking-wider transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? 'Registrando...' : 'Registrar Vehículo'}
                </button>
              </form>

              {showSuccess && (
                <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center">
                  <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-8 border border-white/20 text-center">
                    <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">¡Vehículo Registrado!</h3>
                    <p className="text-white/70">Tu vehículo ha sido registrado exitosamente.</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AgregarCarro;
