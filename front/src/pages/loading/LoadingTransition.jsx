import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Car } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import Cookies from 'js-cookie';

function LoadingTransition() {
  const navigate = useNavigate();
  const location = useLocation();
  const { verifyTokenRequest } = useAuth();
  
  useEffect(() => {
    const checkUserRole = async () => {
      try {
        const token = Cookies.get('token');
        if (!token) {
          navigate('/login', { replace: true });
          return;
        }

        const response = await verifyTokenRequest(token);
        const userData = response.data;
        
        if (!userData) {
          navigate('/login', { replace: true });
          return;
        }

        // Store user data in localStorage for immediate access
        localStorage.setItem('userData', JSON.stringify(userData));
        
        const destination = userData.rol === true ? '/inicio' : '/inicioCliente';
        setTimeout(() => {
          navigate(destination, { replace: true, state: { userData } });
        }, 1000); // Reduced timeout for better UX

      } catch (error) {
        console.error('Error verifying user:', error);
        navigate('/login', { replace: true });
      }
    };

    checkUserRole();
  }, [navigate, verifyTokenRequest]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 flex items-center justify-center relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_-20%,rgba(255,255,255,0.1),transparent_70%)]"></div>
      
      {/* Background Icon */}
      <div className="absolute inset-0 flex items-center justify-center opacity-5">
        <Car className="w-96 h-96 text-white transform -rotate-12" />
      </div>

      {/* Loading Content */}
      <div className="relative z-10 text-center">
        {/* Logo Animation */}
        <div className="mb-8 relative">
          <div className="w-24 h-24 border-4 border-white rounded-full mx-auto
                        animate-[spin_3s_linear_infinite]">
            <div className="w-20 h-20 border-4 border-white/50 rounded-full
                          absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
                          animate-[spin_2s_linear_infinite_reverse]">
            </div>
          </div>
          {/* Animated Car Icon */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
                        w-12 h-12 text-white">
            <Car className="w-full h-full animate-bounce" />
          </div>
        </div>

        {/* Loading Text */}
        <h2 className="text-3xl font-black text-white mb-4 animate-pulse">
          Revolution CarWash
        </h2>
        <p className="text-lg text-white/70">
          Estamos preparando tu experiencia
        </p>

        {/* Loading Bar */}
        <div className="mt-8 w-64 h-1 bg-white/10 rounded-full mx-auto overflow-hidden">
          <div className="h-full bg-gradient-to-r from-white/50 to-white 
                        animate-[loading_2s_ease-in-out_infinite]"></div>
        </div>
      </div>
    </div>
  );
}

export default LoadingTransition;