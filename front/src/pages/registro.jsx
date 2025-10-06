import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import logo from "../assets/images/logo.png";

function Register() {
  const navigate = useNavigate();
  const { signup, error: authError } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    nombre: "",
    correo: "",
    telefono: "",
    password: "",
    rol: "cliente" // Agregamos el rol por defecto
  });
  const [errors, setErrors] = useState({});
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState("");

  const validateForm = () => {
    const newErrors = {};

    if (!formData.nombre || formData.nombre.trim().length < 2) {
      newErrors.nombre = "Nombre requerido (mín. 2 caracteres)";
    }

    if (!formData.correo) {
      newErrors.correo = "Campo requerido";
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(formData.correo)) {
      newErrors.correo = "Correo electrónico inválido";
    }

    if (!formData.telefono || formData.telefono.length < 10) {
      newErrors.telefono = "Teléfono requerido (mín. 10 dígitos)";
    }

    if (!formData.password) {
      newErrors.password = "Campo requerido";
    } else if (formData.password.length < 6) {
      newErrors.password = "La contraseña debe tener al menos 6 caracteres";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ""
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      try {
        await signup(formData);
        setShowSuccess(true);
        setTimeout(() => {
          setShowSuccess(false);
          navigate("/login");
        }, 2000);
      } catch (error) {
        console.error("Error en registro:", error);
        setShowError("Error al registrar el usuario. Inténtalo de nuevo.");
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-black to-gray-800 relative overflow-hidden">
      {/* Elementos decorativos de fondo */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent transform -skew-y-6"></div>
      <div className="absolute top-20 left-20 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
      <div className="absolute bottom-20 right-20 w-40 h-40 bg-white/5 rounded-full blur-3xl"></div>
      
      <div className="relative bg-black/80 backdrop-blur-xl rounded-2xl shadow-2xl w-full max-w-4xl border border-white/20 transition-all duration-500 hover:border-white/40 hover:shadow-white/10 hover:shadow-2xl overflow-hidden">
        {/* Success Toast */}
        {showSuccess && (
          <div className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-green-600 to-green-800 text-white p-4 rounded-lg shadow-lg border border-green-500/50 z-50 animate-pulse">
            <div className="flex items-center">
              <div className="w-2 h-2 bg-white rounded-full mr-2 animate-ping"></div>
              ¡Cliente registrado correctamente!
            </div>
          </div>
        )}

        {/* Header con degradado */}
        <div className="bg-gradient-to-b from-[#1F1F20] to-transparent pt-10 pb-16">
          <div className="text-center">
            <img 
              src={logo} 
              alt="Revolution CarWash Logo" 
              className="w-16 h-16 object-contain mx-auto mb-4"
            />
            <h1 className="text-4xl font-black text-white mb-2 tracking-tight">
              Registra tu cuenta
            </h1>
          </div>
        </div>

        {/* Contenido del formulario */}
        <div className="px-10 pb-10">
          <form className="grid grid-cols-2 gap-6" onSubmit={handleSubmit}>
            <div className="space-y-1">
              <label htmlFor="nombre" className="block text-sm font-bold text-white/90 mb-2 uppercase tracking-wider">
                Nombre Completo
              </label>
              <input
                type="text"
                id="nombre"
                name="nombre"
                value={formData.nombre}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 bg-white/10 backdrop-blur border border-white/30 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white focus:border-white/50 transition-all duration-300 hover:bg-white/15"
                placeholder="Tu nombre completo"
                autoComplete="name"
              />
              {errors.nombre && (
                <span className="text-red-400 text-xs mt-1 block font-semibold">{errors.nombre}</span>
              )}
            </div>

            <div className="space-y-1">
              <label htmlFor="telefono" className="block text-sm font-bold text-white/90 mb-2 uppercase tracking-wider">
                Teléfono
              </label>
              <input
                type="tel"
                id="telefono"
                name="telefono"
                value={formData.telefono}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 bg-white/10 backdrop-blur border border-white/30 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white focus:border-white/50 transition-all duration-300 hover:bg-white/15"
                placeholder="618-123-4567"
                autoComplete="tel"
              />
              {errors.telefono && (
                <span className="text-red-400 text-xs mt-1 block font-semibold">{errors.telefono}</span>
              )}
            </div>

            <div className="space-y-1">
              <label htmlFor="correo" className="block text-sm font-bold text-white/90 mb-2 uppercase tracking-wider">
                Correo Electrónico
              </label>
              <input
                type="email"
                id="correo"
                name="correo"
                value={formData.correo}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 bg-white/10 backdrop-blur border border-white/30 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white focus:border-white/50 transition-all duration-300 hover:bg-white/15"
                placeholder="tu@email.com"
                autoComplete="email"
              />
              {errors.correo && (
                <span className="text-red-400 text-xs mt-1 block font-semibold">{errors.correo}</span>
              )}
            </div>

            <div className="space-y-1">
              <label htmlFor="password" className="block text-sm font-bold text-white/90 mb-2 uppercase tracking-wider">
                Contraseña
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 bg-white/10 backdrop-blur border border-white/30 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white focus:border-white/50 transition-all duration-300 hover:bg-white/15 pr-20"
                  placeholder="••••••••"
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/70 hover:text-white font-semibold text-sm transition-colors duration-200 focus:outline-none"
                >
                  {showPassword ? "OCULTAR" : "MOSTRAR"}
                </button>
              </div>
              {errors.password && (
                <span className="text-red-400 text-xs mt-1 block font-semibold">{errors.password}</span>
              )}
            </div>

            <button
              type="submit"
              className="col-span-2 w-full bg-gradient-to-r from-white to-gray-100 text-black font-black py-4 rounded-lg text-lg uppercase tracking-wider transition-all duration-300 group relative overflow-hidden shadow-lg hover:shadow-white/20"
            >
              <div className="absolute inset-0 bg-white transition-all duration-300 ease-out group-hover:bg-gradient-to-r group-hover:from-gray-100 group-hover:to-white"></div>
              <span className="relative flex items-center justify-center space-x-2">
                <span>Crear Cuenta</span>

              </span>
            </button>
          </form>

          {/* Divisor con estilo premium */}
          <div className="flex items-center my-8">
            <div className="flex-1 h-px bg-gradient-to-r from-transparent to-white/30"></div>
            <span className="px-4 text-white/60 text-sm font-semibold">O</span>
            <div className="flex-1 h-px bg-gradient-to-l from-transparent to-white/30"></div>
          </div>

          {/* Enlace de login con estilo agresivo */}
          <div className="text-center">
            <p className="text-white/70 mb-4 font-medium">
              ¿Ya tienes una cuenta?
            </p>
            <button 
              onClick={() => console.log("Navigate to login")}
              className="inline-block bg-transparent border-2 border-white text-white font-bold py-3 px-8 rounded-lg uppercase tracking-wider transition-all duration-300 hover:bg-white hover:text-black hover:scale-105 hover:shadow-lg focus:outline-none focus:ring-4 focus:ring-white/30 active:scale-95 transform"
            >
              <span className="flex items-center justify-center">
                Iniciar Sesión
                <div className="ml-2 text-xs">→</div>
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;