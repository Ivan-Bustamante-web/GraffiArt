import ConfiguratorPage from "./pages/ConfiguratorPage";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import AuthPage from "./pages/AuthPage";

function App() {
  return <BrowserRouter><Routes><Route path="/" element={<ConfiguratorPage />} /><Route path="/auth" element={<AuthPage />} /><Route path="/registro" element={<AuthPage />} /><Route path="/verificar-email" element={<AuthPage />} /><Route path="/restablecer-password" element={<AuthPage />} /></Routes></BrowserRouter>;
}

export default App;