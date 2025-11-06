import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useAuth } from "../context/AuthContext";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import logo from "../assets/images/logo.png";

function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm();
  const { login, error: loginErrors, isAuth, cliente } = useAuth();
  const navigate = useNavigate();

  const onSubmit = handleSubmit(async data => {
    const res = await login(data);
    console.log("esto guardo", res);
    if (res.success) {
      toast.success("¡Acceso autorizado!", {
        position: "top-center",
        autoClose: 1500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "dark",
        style: {
          background: "linear-gradient(135deg, #000000 0%, #333333 100%)",
          color: "#ffffff",
          border: "1px solid #666666"
        }
      });
      
      setTimeout(() => {
        // Pass the role data to LoadingTransition
        navigate('/loading', { 
          state: { 
            userRole: res.rol,
            isAuthenticated: true
          } 
        });
      }, 1500);
    }
  });

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-black to-gray-800 relative overflow-hidden">
      {/* Elementos decorativos de fondo */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent transform -skew-y-6"></div>
      <div className="absolute top-20 left-20 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
      <div className="absolute bottom-20 right-20 w-40 h-40 bg-white/5 rounded-full blur-3xl"></div>
      
      <div className="relative bg-black/80 backdrop-blur-xl rounded-2xl shadow-2xl w-full max-w-md border border-white/20 transition-all duration-500 hover:border-white/40 hover:shadow-white/10 hover:shadow-2xl overflow-hidden">
        {/* Header con degradado */}
        <div className="bg-gradient-to-b from-[#1F1F20] to-transparent pt-10 pb-16">
          <div className="text-center">
            <img 
              src={logo} 
              alt="Elite Auto Wash Logo" 
              className="w-16 h-16 object-contain mx-auto mb-4"
            />
            <h1 className="text-4xl font-black text-white mb-2 tracking-tight">
              Revolution
              <span className="block text-2xl font-light tracking-widest text-white/80">
                CarWash
              </span>
            </h1>
          </div>
        </div>

        {/* Contenido del formulario */}
        <div className="p-10 pt-0">
          {/* Error messages con estilo agresivo */}
          {loginErrors.map((error, i) => (
            <div key={i} className="bg-gradient-to-r from-red-600 to-red-800 text-white p-3 mb-4 rounded-lg shadow-lg border border-red-500/50 animate-pulse">
              <div className="flex items-center">
                <div className="w-2 h-2 bg-white rounded-full mr-2 animate-ping"></div>
                {typeof error === "object" ? error.message : error}
              </div>
            </div>
          ))}

          <form className="space-y-6" onSubmit={onSubmit}>
            <div className="space-y-1">
              <label htmlFor="correo" className="block text-sm font-bold text-white/90 mb-2 uppercase tracking-wider">
                Correo Electrónico
              </label>
              <input
                type="text"
                {...register("correo", { required: true })}
                id="correo"
                name="correo"
                
                required
                className="w-full px-4 py-3 bg-white/10 backdrop-blur border border-white/30 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white focus:border-white/50 transition-all duration-300 hover:bg-white/15"
                autoComplete="email"
              />
              {errors.correo && (
                <span className="text-red-400 text-xs mt-1 block font-semibold"> Campo requerido</span>
              )}
            </div>

            <div className="space-y-1">
              <label htmlFor="password" className="block text-sm font-bold text-white/90 mb-2 uppercase tracking-wider">
                Contraseña
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  {...register("password", { required: true })}
                  id="password"
                  name="password"
                  required
                  className="w-full px-4 py-3 bg-white/10 backdrop-blur border border-white/30 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white focus:border-white/50 transition-all duration-300 hover:bg-white/15 pr-20"
                  placeholder="••••••••"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/70 hover:text-white font-semibold text-sm transition-colors duration-200 focus:outline-none"
                  tabIndex={-1}
                >
                  {showPassword ? "Ocultar" : "Mostrar"}
                </button>
              </div>
              {errors.password && (
                <span className="text-red-400 text-xs mt-1 block font-semibold"> Campo requerido</span>
              )}
            </div>

            {/* Reemplaza el botón existente con este nuevo diseño */}
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-white to-gray-100 text-black font-black py-4 rounded-lg text-lg uppercase tracking-wider transition-all duration-300 group relative overflow-hidden shadow-lg hover:shadow-white/20"
            >
              <div className="absolute inset-0 bg-white transition-all duration-300 ease-out group-hover:bg-gradient-to-r group-hover:from-gray-100 group-hover:to-white"></div>
              <span className="relative flex items-center justify-center space-x-2">
                <span>Entrar</span>

              </span>
            </button>
          </form>

          {/* Divisor con estilo premium */}
          <div className="flex items-center my-8">
            <div className="flex-1 h-px bg-gradient-to-r from-transparent to-white/30"></div>
            <span className="px-4 text-white/60 text-sm font-semibold">O</span>
            <div className="flex-1 h-px bg-gradient-to-l from-transparent to-white/30"></div>
          </div>

          {/* Enlace de registro con estilo agresivo */}
          <div className="text-center">
            <p className="text-white/70 mb-4 font-medium">
              ¿Aún no tienes cuenta?
            </p>
            <Link 
              to="/registro"
              className="inline-block bg-transparent border-2 border-white text-white font-bold py-3 px-8 rounded-lg uppercase tracking-wider transition-all duration-300 hover:bg-white hover:text-black hover:scale-105 hover:shadow-lg focus:outline-none focus:ring-4 focus:ring-white/30 active:scale-95 transform"
            >
              <span className="flex items-center justify-center">
                Crear Cuenta
                <div className="ml-2 text-xs"></div>
              </span>
            </Link>
          </div>

          {/* Elemento decorativo inferior */}
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-white to-transparent"></div>
        </div>
        
        <ToastContainer 
          position="top-center"
          autoClose={2000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="dark"
          toastStyle={{
            background: "linear-gradient(135deg, #000000 0%, #333333 100%)",
            color: "#ffffff",
            border: "1px solid #666666",
            borderRadius: "8px"
          }}
        />
      </div>
    </div>
  );
}

export default Login;