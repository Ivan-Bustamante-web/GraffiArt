import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import ConfiguratorPage from "./pages/ConfiguratorPage";
import Inventario from "./pages/Inventario";

function App() {
  return (
    <BrowserRouter>
      <nav className="p-4 bg-gray-900 text-white flex gap-4">
        <Link to="/">Configurador</Link>
        <Link to="/inventario">Inventario</Link>
      </nav>
      <Routes>
        <Route path="/" element={<ConfiguratorPage />} />
        <Route path="/inventario" element={<Inventario />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;