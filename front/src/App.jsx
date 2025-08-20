import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/login";
import Inicio from "./pages/inicio/inicioAdmin";
import Register from "./pages/registro";
import { AuthProvider } from "./context/AuthContext";
import { ParticipantesProvider } from "./context/ParticipantesContext";
import ProtectedRoutes from "./protectedRoutes";

function App() {
  return (
    <AuthProvider>
      <ParticipantesProvider>
        <BrowserRouter basename="/FrontRevolution">
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/login" element={<Login />} />
            <Route path="/registro" element={<Register />} />
            <Route element={<ProtectedRoutes />}>
              <Route path="/inicio" element={<Inicio />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </ParticipantesProvider>
    </AuthProvider>
  );
}

export default App;