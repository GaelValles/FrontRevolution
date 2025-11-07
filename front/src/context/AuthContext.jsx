import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { registerRequest, loginRequest, verifyTokenRequest } from '../api/auth';
import { 
    addAdminRequest, 
    getAdminsRequest, 
    deleteAdminRequest, 
    getAdminRequest,
    loginAdminRequest
} from '../api/auth.admin';
import Cookies from 'js-cookie';

const AuthContext = createContext();

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [cliente, setCliente] = useState(null);
    const [isAuth, setIsAuth] = useState(false);
    const [error, setError] = useState([]);
    const [loading, setLoading] = useState(true);

    const register = async (cliente) => {
        try {
            const res = await registerRequest(cliente);
            setCliente(res.data);
            console.log("Lo que se guarda es:", res);
            setIsAuth(true);
            return res.data;
        } catch (error) {
            console.log(error.response?.data);
            setError([error.response ? error.response.data : 'An error occurred']);
            setIsAuth(false);
            throw error; 
        }
    }
 
    const createUser = async (cliente) => {
        try {
            const res = await addAdminRequest(cliente);
            return { success: true, user: res.data };
        } catch (error) {
            setError([error.response ? error.response.data : 'An error occurred']);
            return { success: false, error: error.response?.data };
        }
    }

    const signup = async (cliente) => {
        try {
            const res = await registerRequest(cliente);
            setCliente(res.data);
            setIsAuth(true);
        } catch (error) {
            setError([error.response ? error.response.data : 'An error occurred']);
            setIsAuth(false); 
        }
    };

    const login = async (user) => {
        try {
            const res = await loginRequest(user);
            setIsAuth(true);
            setCliente(res.data);
            return { 
                success: true, 
                role: res.data.rol 
            };
        } catch (error) {
            setError([error.response?.data?.message || 'Error de autenticación']);
            setIsAuth(false);
            return { 
                success: false, 
                error: error.response?.data 
            };
        }
    };

    const getUsers = async () => {
        try {
            const res = await getAdminsRequest();
            return res.data;
        } catch (error) {
            setError([error.response?.data?.message || 'Error al obtener usuarios']);
            throw error;
        }
    };

    const getClienteById = useCallback(async (id) => {
        try {
            const res = await getAdminRequest(id);
            return res.data;
        } catch (error) {
            console.error("Error al obtener el usuario:", error);
            setError(["No se pudo obtener el usuario"]);
            throw error;
        }
    }, []);

    const deleteUsers = async (ids) => {
        try {
            if (Array.isArray(ids)) {
                const results = await Promise.all(
                    ids.map(id => deleteAdminRequest(id))
                );
                return results.map(res => res.data);
            } else {
                const res = await deleteAdminRequest(ids);
                return res.data;
            }
        } catch (error) {
            setError([error.response?.data?.message || 'Error al eliminar usuario(s)']);
            throw error;
        }  
    };

    const logout = () => {
        Cookies.remove('token');
        setIsAuth(false);
        setCliente(null);
    }

    useEffect(() => {
        if (error.length > 0) {
            const timer = setTimeout(() => {
                setError([]);
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [error]);

    useEffect(() => {
        async function checkLogin() {
            const cookies = Cookies.get();
            const cachedData = localStorage.getItem('userData');
            
            if (cachedData) {
              const userData = JSON.parse(cachedData);
              setCliente(userData);
              setIsAuth(true);
            }
            
            if (!cookies.token) {
              setIsAuth(false);
              setLoading(false);
              localStorage.removeItem('userData');
              return setCliente(null);
            }
                
            try {
              const res = await verifyTokenRequest(cookies.token);
              if (!res.data) {
                setIsAuth(false);
                setLoading(false);
                localStorage.removeItem('userData');
                return;
              }

              setIsAuth(true);
              setCliente(res.data);
              localStorage.setItem('userData', JSON.stringify(res.data));
              setLoading(false);
            } catch (error) {
              console.error('Token verification failed:', error);
              setIsAuth(false);
              setCliente(null);
              localStorage.removeItem('userData');
              setLoading(false);
            }
          }

          checkLogin();
    }, []);

    return (
        <AuthContext.Provider value={{
            cliente,
            setCliente,
            signup,
            register,
            getUsers,
            getClienteById,
            createUser,
            deleteUsers,
            login,
            isAuth,
            setIsAuth,
            error,
            setError,
            loading,
            verifyTokenRequest,  // Add this
            logout
        }}>
            {children}
        </AuthContext.Provider>
    );
};
