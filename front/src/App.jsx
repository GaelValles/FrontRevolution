import { BrowserRouter, Routes, Route } from "react-router-dom";

//Ingreso de las credenciales y validacion de cuenta
import Login from "./pages/login";
import Register from "./pages/registro";

//Páginas de inicio principales
import Inicio from "./pages/inicio/inicioAdmin";
import InicioCliente from "./pages/inicio/inicioCliente";

//Página para agregar
import AgregarCarro from "./pages/agregar/agregarCarro";

//Contextos
import { AuthProvider } from "./context/AuthContext";
import { CarroProvider } from "./context/CarroContext";

//Rutas protegidas
import ProtectedRoutes from "./protectedRoutes";
import LoadingTransition from "./pages/loading/LoadingTransition";

function App() {
  return (
    <AuthProvider>
      <CarroProvider>
        <BrowserRouter basename="/FrontRevolution">
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/login" element={<Login />} />
            <Route path="/registro" element={<Register />} />
            <Route element={<ProtectedRoutes />}>
              <Route path="/inicio" element={<Inicio />} />
              <Route path="/inicioCliente" element={<InicioCliente />} />
              <Route path="/agregarCarro" element={<AgregarCarro />} />
            </Route>
            <Route path="/loading" element={<LoadingTransition />} />
          </Routes>
        </BrowserRouter>
      </CarroProvider>
    </AuthProvider>
  );
}

export default App;