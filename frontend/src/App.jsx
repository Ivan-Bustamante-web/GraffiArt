import { BrowserRouter, Routes, Route, NavLink } from "react-router-dom";
import ConfiguratorPage from "./pages/ConfiguratorPage";
import AuthPage from "./pages/AuthPage";
import Inventario from "./pages/Inventario";
import { useAuthStore } from "./store/authStore";

function App() {
  const { usuario, logout } = useAuthStore();
  const linkClass = ({ isActive }) =>
    `px-3 py-2 rounded-md text-sm font-medium transition-colors ${
      isActive ? "bg-blue-600 text-white" : "text-gray-300 hover:bg-gray-800 hover:text-white"
    }`;

  return (
    <BrowserRouter>
      <nav className="bg-gray-900 shadow-md">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <span className="text-white font-bold text-lg tracking-wide">GraffiArt</span>
          <div className="flex gap-2">
            <NavLink to="/" className={linkClass} end>Configurador</NavLink>
            <NavLink to="/inventario" className={linkClass}>Inventario</NavLink>
            {usuario ? (
              <div className="flex items-center gap-2">
                <span className="px-3 py-2 text-sm text-gray-200">Hola, {usuario.nombre}</span>
                <button
                  type="button"
                  onClick={() => logout()}
                  className="px-3 py-2 rounded-md text-sm text-gray-300 hover:bg-gray-800 hover:text-white transition-colors cursor-pointer"
                >
                  Cerrar sesión
                </button>
              </div>
            ) : (
              <NavLink to="/auth" className={linkClass}>Ingresar</NavLink>
            )}
          </div>
        </div>
      </nav>
      <Routes>
        <Route path="/" element={<ConfiguratorPage />} />
        <Route path="/inventario" element={<Inventario />} />
        <Route path="/login" element={<AuthPage />} />
        <Route path="/register" element={<AuthPage />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/registro" element={<AuthPage />} />
        <Route path="/forgot-password" element={<AuthPage />} />
        <Route path="/recuperar-password" element={<AuthPage />} />
        <Route path="/verificar-email" element={<AuthPage />} />
        <Route path="/restablecer-password" element={<AuthPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
