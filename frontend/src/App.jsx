import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import ConfiguratorPage from "./pages/ConfiguratorPage";
import Inventario from "./pages/Inventario";
import Login from "./pages/Login";
import Register from "./pages/Register";

function App() {
  return (
    <BrowserRouter>
      <nav className="p-4 bg-gray-900 text-white flex gap-4">
        <Link to="/">Configurador</Link>
        <Link to="/inventario">Inventario</Link>
        <Link to="/login">Login</Link>
        <Link to="/register">Registrarme</Link>
      </nav>
      <Routes>
        <Route path="/" element={<ConfiguratorPage />} />
        <Route path="/inventario" element={<Inventario />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;