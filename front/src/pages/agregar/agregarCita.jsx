import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useCarro } from '../../context/CarroContext';
import { useCitas } from '../../context/CitasContext';
import { useNavigate } from 'react-router-dom';
import { Calendar } from 'lucide-react';
import citaImage from '../../assets/images/agregarcarro.jpg';
import Sidebar from '../components/sidebar';

function AgregarCita() {
  const navigate = useNavigate();
  const { cliente } = useAuth();
  const { getCarroById } = useCarro();
  const { addCita, validateCitaData } = useCitas();
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [vehiculosCliente, setVehiculosCliente] = useState([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const [formData, setFormData] = useState({
    fechaInicio: '',
    fechaFin: '',
    tipoServicio: '',
    costo: '',
    carro: '',
    cliente: '',  // We'll set this when cliente is available
    informacionAdicional: '',
    estado: 'programada'
  });

  const tiposServicio = [
    'Lavado básico',
    'Lavado premium',
    'Encerado',
    'Pulido',
    'Detallado interior',
    'Detallado completo'
  ];

  const costosPorServicio = {
    'Lavado básico': 150,
    'Lavado premium': 250,
    'Encerado': 350,
    'Pulido': 450,
    'Detallado interior': 550,
    'Detallado completo': 850
  };

  const [errors, setErrors] = useState({});

  useEffect(() => {
    const fetchVehiculos = async () => {
      if (cliente?.carros) {
        try {
          const vehiculosPromises = cliente.carros.map(id => getCarroById(id));
          const vehiculosData = await Promise.all(vehiculosPromises);
          setVehiculosCliente(vehiculosData.filter(v => v !== null));
        } catch (error) {
          console.error('Error al obtener vehículos:', error);
          setErrors(prev => ({ ...prev, carros: 'Error al cargar los vehículos' }));
        }
      }
    };

    fetchVehiculos();
  }, [cliente, getCarroById]);

  // Add this effect to update client ID when it becomes available
  useEffect(() => {
    if (cliente?._id) {
        setFormData(prev => ({
            ...prev,
            cliente: cliente._id
        }));
    }
  }, [cliente]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log('Submitting form data:', formData);
    
    // Validate form data
    const validation = validateCitaData({
      ...formData,
      costo: Number(formData.costo)
    });
    
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    try {
      setLoading(true);
      
      // Format dates and prepare data for submission
      const citaData = {
        ...formData,
        fechaInicio: new Date(formData.fechaInicio).toISOString(),
        fechaFin: new Date(formData.fechaFin).toISOString(),
        costo: Number(formData.costo),
        cliente: cliente._id
      };
      console.log('Formatted cita data for submission:', citaData);
      const result = await addCita(citaData);
      console.log('Cita creation result:', result);
      if (result.success) {
        setShowSuccess(true);
        // Reset form
        setFormData({
          fechaInicio: '',
          fechaFin: '',
          tipoServicio: '',
          costo: '',
          carro: '',
          cliente: cliente?._id,
          informacionAdicional: '',
          estado: 'programada'
        });
        
        // Redirect after success message
        setTimeout(() => {
          navigate('/miCitas');
        }, 2000);
      } else {
        setErrors({ 
          submit: result.error?.message || 'Error al programar la cita' 
        });
      }
    } catch (error) {
      console.error('Error al programar la cita:', error);
      setErrors({ 
        submit: 'Error al programar la cita. Por favor, intente nuevamente.' 
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'tipoServicio') {
      setFormData(prev => ({
        ...prev,
        [name]: value,
        costo: costosPorServicio[value]
      }));
    } else if (name === 'fechaInicio' || name === 'fechaFin') {
      // Validate dates
      const selectedDate = new Date(value);
      const now = new Date();
      
      if (selectedDate < now) {
        setErrors(prev => ({
          ...prev,
          [name]: 'La fecha no puede ser anterior a la actual'
        }));
        return;
      }
      
      if (name === 'fechaFin' && formData.fechaInicio) {
        const inicioDate = new Date(formData.fechaInicio);
        if (selectedDate < inicioDate) {
          setErrors(prev => ({
            ...prev,
            fechaFin: 'La fecha de fin no puede ser anterior a la fecha de inicio'
          }));
          return;
        }
      }
      
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
    
    // Clear error when field is modified
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  // Add minimum date validation for datetime-local inputs
  const getMinDateTime = () => {
    const now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    return now.toISOString().slice(0,16);
  };

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-gray-900 via-black to-gray-800 relative">
      <Sidebar onHover={setIsSidebarOpen} />
      <div className={`flex-1 transition-all duration-300 ${
        isSidebarOpen ? 'ml-[250px]' : 'ml-[80px]'
      }`}>
        <div className="relative w-full max-w-5xl bg-black/40 backdrop-blur-xl rounded-2xl shadow-2xl overflow-hidden border border-white/10 transition-all duration-500 hover:border-white/30 hover:shadow-[0_0_15px_rgba(255,255,255,0.1)] hover:bg-black/50">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/[0.02] rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-white/[0.02] rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>

          <div className="grid md:grid-cols-2 gap-0 relative">
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
            <div className="bg-black/40 p-8 relative">
              <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-white/60 text-sm mb-2">Vehículo</label>
                  <select
                    name="carro"
                    value={formData.carro}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-white/10 border border-white/30 rounded-lg text-white focus:outline-none focus:border-white/50 appearance-none"
                  >
                    <option value="" className="bg-gray-900">Selecciona tu vehículo</option>
                    {vehiculosCliente.map((carro) => (
                      <option 
                        key={carro._id} 
                        value={carro._id}
                        className="bg-gray-900"
                      >
                        {`${carro.marca} ${carro.modelo} - ${carro.placas}`}
                      </option>
                    ))}
                  </select>
                  {errors.carro && (
                    <span className="text-red-400 text-xs mt-1 block">{errors.carro}</span>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-white/60 text-sm mb-2">Fecha y Hora de Inicio</label>
                    <input
                      type="datetime-local"
                      name="fechaInicio"
                      value={formData.fechaInicio}
                      onChange={handleInputChange}
                      min={getMinDateTime()}
                      className="w-full px-4 py-3 bg-white/10 border border-white/30 rounded-lg text-white focus:outline-none focus:border-white/50"
                    />
                    {errors.fechaInicio && (
                      <span className="text-red-400 text-xs mt-1 block">{errors.fechaInicio}</span>
                    )}
                  </div>
                  <div>
                    <label className="block text-white/60 text-sm mb-2">Fecha y Hora de Fin</label>
                    <input
                      type="datetime-local"
                      name="fechaFin"
                      value={formData.fechaFin}
                      onChange={handleInputChange}
                      min={getMinDateTime()}
                      className="w-full px-4 py-3 bg-white/10 border border-white/30 rounded-lg text-white focus:outline-none focus:border-white/50"
                    />
                    {errors.fechaFin && (
                      <span className="text-red-400 text-xs mt-1 block">{errors.fechaFin}</span>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-white/60 text-sm mb-2">Tipo de Servicio</label>
                  <select
                    name="tipoServicio"
                    value={formData.tipoServicio}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-white/10 border border-white/30 rounded-lg text-white focus:outline-none focus:border-white/50 appearance-none"
                  >
                    <option value="" className="bg-gray-900">Selecciona el servicio</option>
                    {tiposServicio.map((tipo) => (
                      <option 
                        key={tipo} 
                        value={tipo}
                        className="bg-gray-900"
                      >
                        {tipo} - ${costosPorServicio[tipo]}
                      </option>
                    ))}
                  </select>
                  {errors.tipoServicio && (
                    <span className="text-red-400 text-xs mt-1 block">{errors.tipoServicio}</span>
                  )}
                </div>

                <div>
                  <label className="block text-white/60 text-sm mb-2">Información Adicional</label>
                  <textarea
                    name="informacionAdicional"
                    value={formData.informacionAdicional}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-white/10 border border-white/30 rounded-lg text-white placeholder-white/30 focus:outline-none focus:border-white/50 min-h-[100px]"
                    placeholder="Agrega cualquier detalle importante sobre el servicio..."
                  />
                </div>

                {formData.costo && (
                  <div className="bg-white/5 p-4 rounded-lg border border-white/10">
                    <div className="text-white/60 text-sm">Costo del Servicio</div>
                    <div className="text-white text-2xl font-bold">${formData.costo}</div>
                  </div>
                )}

                {errors.submit && (
                  <div className="bg-red-500/10 border border-red-500/50 text-red-400 px-4 py-3 rounded-lg text-sm">
                    {errors.submit}
                  </div>
                )}
                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full bg-white/90 hover:bg-white text-black font-black py-4 rounded-lg text-lg uppercase tracking-wider transition-all duration-300 transform 
                    ${loading ? 'opacity-50 cursor-not-allowed' : 'hover:scale-[1.02] active:scale-[0.98]'}`}
                >
                  {loading ? (
                    <div className="flex items-center justify-center">
                      <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin mr-2"></div>
                      Programando...
                    </div>
                  ) : (
                    'Programar Cita'
                  )}
                </button>
              </form>
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