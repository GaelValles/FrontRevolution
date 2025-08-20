import { useState } from "react";

function Register() {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    nombre: "",
    correo: "",
    telefono: "",
    password: ""
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

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      // Simulate API call
      console.log("Registering user:", { ...formData, rol: "cliente" });
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        console.log("Redirecting to login...");
      }, 2000);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Fondo estilo Fast & Furious sin video */}
      <div className="absolute inset-0 w-full h-full">
        {/* Gradiente base estilo nocturno urbano */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-gray-900 to-black"></div>
        
        {/* Gradientes dinámicos superpuestos */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/40 via-transparent to-red-900/40"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-purple-900/30"></div>
        
        {/* Efectos de "velocidad" con líneas diagonales */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/2 to-transparent transform -skew-y-12 animate-pulse"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-400/5 to-transparent transform skew-y-6 translate-y-20"></div>
        
        {/* Patrones de grid sutil para efecto "ciudad" */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `
              linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px'
          }}></div>
        </div>
      </div>

      {/* Elementos decorativos flotantes estilo "luces de neón" */}
      <div className="absolute top-10 left-10 w-72 h-72 bg-gradient-to-r from-blue-500/15 to-cyan-500/15 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-gradient-to-r from-red-500/15 to-pink-500/15 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute top-1/3 right-1/4 w-48 h-48 bg-gradient-to-r from-purple-500/10 to-violet-500/10 rounded-full blur-2xl animate-bounce"></div>
      <div className="absolute bottom-1/3 left-1/4 w-64 h-64 bg-gradient-to-r from-yellow-500/10 to-orange-500/10 rounded-full blur-3xl animate-ping"></div>
      
      {/* Efectos de "reflejo" estilo carros deportivos */}
      <div className="absolute top-20 left-1/2 transform -translate-x-1/2 w-full h-32 bg-gradient-to-b from-white/3 to-transparent blur-xl"></div>
      <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 w-full h-48 bg-gradient-to-t from-blue-400/5 to-transparent blur-2xl"></div>
      
      {/* Líneas de "velocidad" animadas */}
      <div className="absolute top-1/4 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-blue-400/30 to-transparent animate-pulse transform -skew-y-3"></div>
      <div className="absolute top-2/4 right-0 w-full h-0.5 bg-gradient-to-l from-transparent via-red-400/30 to-transparent animate-pulse transform skew-y-3"></div>
      <div className="absolute top-3/4 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-purple-400/20 to-transparent animate-pulse transform -skew-y-2"></div>
      
      {/* Contenedor del formulario con efecto premium */}
      <div className="relative bg-black/90 backdrop-blur-2xl p-12 rounded-2xl shadow-2xl w-full max-w-md border border-white/30 transition-all duration-500 hover:border-blue-400/50 hover:shadow-blue-500/20 hover:shadow-2xl z-10">
        
        {/* Efectos de "neón" en el contenedor */}
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-red-500/5 animate-pulse"></div>
        <div className="absolute -inset-0.5 rounded-2xl bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-red-500/20 blur opacity-30 animate-pulse"></div>
        
        {/* Success Toast */}
        {showSuccess && (
          <div className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-green-600 to-green-800 text-white p-4 rounded-lg shadow-lg border border-green-500/50 z-50 animate-pulse">
            <div className="flex items-center">
              <div className="w-2 h-2 bg-white rounded-full mr-2 animate-ping"></div>
              ¡Cliente registrado correctamente!
            </div>
          </div>
        )}

        {/* Error Toast */}
        {showError && (
          <div className="bg-gradient-to-r from-red-600 to-red-800 text-white p-3 mb-4 rounded-lg shadow-lg border border-red-500/50 animate-pulse">
            <div className="flex items-center">
              <div className="w-2 h-2 bg-white rounded-full mr-2 animate-ping"></div>
              {showError}
            </div>
          </div>
        )}

        {/* Header con efecto premium mejorado */}
        <div className="text-center mb-8 relative z-10">
          <div className="inline-block p-4 bg-gradient-to-r from-white/15 to-white/10 rounded-full mb-4 relative">
            {/* Efecto de "glow" alrededor del logo */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-400/30 to-red-400/30 blur animate-pulse"></div>
            <div className="relative w-12 h-12 bg-gradient-to-r from-blue-500 via-purple-500 to-red-500 rounded-full flex items-center justify-center">
              <span className="text-white font-black text-xl drop-shadow-lg">R</span>
            </div>
          </div>
          <h1 className="text-4xl font-black text-white mb-2 tracking-tight drop-shadow-2xl">
            Revolution
            <span className="block text-2xl font-light tracking-widest text-white/90 drop-shadow-lg">
              CarWash
            </span>
          </h1>
          <div className="h-0.5 w-20 bg-gradient-to-r from-blue-400 via-white to-red-400 mx-auto mt-4 shadow-lg animate-pulse"></div>
        </div>

        <div className="space-y-6 relative z-10">
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
              className="w-full px-4 py-3 bg-white/15 backdrop-blur border border-white/40 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400/70 transition-all duration-300 hover:bg-white/20 hover:border-white/60"
              placeholder="Tu nombre completo"
              autoComplete="name"
            />
            {errors.nombre && (
              <span className="text-red-400 text-xs mt-1 block font-semibold">{errors.nombre}</span>
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
              className="w-full px-4 py-3 bg-white/15 backdrop-blur border border-white/40 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400/70 transition-all duration-300 hover:bg-white/20 hover:border-white/60"
              placeholder="tu@email.com"
              autoComplete="email"
            />
            {errors.correo && (
              <span className="text-red-400 text-xs mt-1 block font-semibold">{errors.correo}</span>
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
              className="w-full px-4 py-3 bg-white/15 backdrop-blur border border-white/40 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400/70 transition-all duration-300 hover:bg-white/20 hover:border-white/60"
              placeholder="618-123-4567"
              autoComplete="tel"
            />
            {errors.telefono && (
              <span className="text-red-400 text-xs mt-1 block font-semibold">{errors.telefono}</span>
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
                className="w-full px-4 py-3 bg-white/15 backdrop-blur border border-white/40 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400/70 transition-all duration-300 hover:bg-white/20 hover:border-white/60 pr-20"
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
            onClick={handleSubmit}
            className="w-full bg-gradient-to-r from-blue-600 via-purple-600 to-red-600 text-white font-black py-4 rounded-lg text-lg uppercase tracking-wider transition-all duration-300 hover:from-blue-700 hover:via-purple-700 hover:to-red-700 hover:scale-105 hover:shadow-xl hover:shadow-blue-500/30 focus:outline-none focus:ring-4 focus:ring-blue-500/40 active:scale-95 transform relative overflow-hidden"
          >
            {/* Efecto de brillo animado en el botón */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 translate-x-[-100%] animate-pulse group-hover:translate-x-[100%] transition-transform duration-1000"></div>
            <span className="flex items-center justify-center relative z-10">
              Crear Cuenta
              <div className="ml-2 w-0 h-0 border-l-4 border-l-white border-t-2 border-b-2 border-t-transparent border-b-transparent"></div>
            </span>
          </button>
        </div>

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

        {/* Elemento decorativo inferior con efecto neón */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-red-500 animate-pulse shadow-lg"></div>
        <div className="absolute -bottom-0.5 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-400 via-white to-red-400 blur animate-pulse"></div>
      </div>
    </div>
  );
}

export default Register;