import { BrowserRouter, Routes, Route, NavLink } from "react-router-dom";
import ConfiguratorPage from "./pages/ConfiguratorPage";
import AuthPage from "./pages/AuthPage";
import Inventario from "./pages/Inventario";
import Login from "./pages/Login";
import Register from "./pages/Register";

function App() {
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
            <NavLink to="/login" className={linkClass}>Login</NavLink>
            <NavLink to="/register" className={linkClass}>Registrarme</NavLink>
          </div>
        </div>
      </nav>
      <Routes>
        <Route path="/" element={<ConfiguratorPage />} />
        <Route path="/inventario" element={<Inventario />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/registro" element={<AuthPage />} />
        <Route path="/verificar-email" element={<AuthPage />} />
        <Route path="/restablecer-password" element={<AuthPage />} />
      </Routes>
    </BrowserRouter>
  );
=======
import Inventario from "./pages/Inventario";
import Login from "./pages/Login";
import Register from "./pages/Register";

function App() {
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
            <NavLink to="/login" className={linkClass}>Login</NavLink>
            <NavLink to="/register" className={linkClass}>Registrarme</NavLink>
          </div>
        </div>
      </nav>
      <Routes>
        <Route path="/" element={<ConfiguratorPage />} />
        <Route path="/inventario" element={<Inventario />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </BrowserRouter>
  );
>>>>>>> 5b76a462d221ea03c453e9ccfc9072dd2c32b8a0
}

export default App;