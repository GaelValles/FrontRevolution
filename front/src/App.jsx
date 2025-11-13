import { BrowserRouter, Routes, Route } from "react-router-dom";

//Ingreso de las credenciales y validacion de cuenta
import Login from "./pages/login";
import Register from "./pages/registro";

//Páginas de inicio principales
import Inicio from "./pages/inicio/inicioAdmin";
import InicioCliente from "./pages/inicio/inicioCliente";

//Página para agregar
import AgregarCarro from "./pages/agregar/agregarCarro";
import AgregarCita from "./pages/agregar/agregarCita";

//Página para ver mis elementos
import MisCarros from "./pages/Mis/misCarros";
import MisCitas from "./pages/Mis/misCitas";

//Planes
import Planes from "./pages/planes";
import Perfil from "./pages/perfil";
import PerfilAdmin from "./pages/perfilAdmin";

import Historial from "./pages/components/historial";
//Contextos
import { AuthProvider } from "./context/AuthContext";
import { CarroProvider } from "./context/CarroContext";
import { CitasProvider } from "./context/CitasContext";
import { DiasProvider } from "./context/DiasContext";
import { ThemeProvider } from './context/ThemeContext';
//Rutas protegidas
import ProtectedRoutes from "./protectedRoutes";
import LoadingTransition from "./pages/loading/LoadingTransition";


function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <DiasProvider>
          <CarroProvider>
            <CitasProvider>
              <BrowserRouter basename="/FrontRevolution">
                <Routes>
                  <Route path="/" element={<Login />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/registro" element={<Register />} />
                  <Route element={<ProtectedRoutes />}>
                    <Route path="/inicio" element={<Inicio />} />
                    <Route path="/inicioCliente" element={<InicioCliente />} />

                    <Route path="/misCarros" element={<MisCarros />} />
                    <Route path="/misCitas" element={<MisCitas />} />

                    <Route path="/agregarCarro" element={<AgregarCarro />} />
                    <Route path="/agregarCita" element={<AgregarCita />} />

                    <Route path="/planes" element={<Planes />} />
                    <Route path="/perfil" element={<Perfil />} />
                    <Route path="/perfilAdmin" element={<PerfilAdmin />} />
                    <Route path="/historial" element={<Historial />} />
                  </Route>
                  <Route path="/loading" element={<LoadingTransition />} />
                </Routes>
              </BrowserRouter>
            </CitasProvider>
          </CarroProvider>
        </DiasProvider>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;