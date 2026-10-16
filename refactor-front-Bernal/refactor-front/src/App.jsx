import { BrowserRouter, Link, Navigate, Route, Routes, useNavigate } from "react-router";
import Footer from "./components/Footer";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import LoginPage from "./pages/login";
import { useAuthStore } from "./store/authStore";

function HomePage() {
  const navigate = useNavigate();
  const { usuario, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <main className="flex flex-1 items-center justify-center bg-neutral-100 px-4 py-10">
      <section className="w-full max-w-xl rounded-2xl border border-neutral-200 bg-white p-8 text-center shadow-lg">
        <h1 className="text-2xl font-bold text-neutral-900">GraffiArt</h1>
        {usuario ? (
          <>
            <p className="mt-4 text-neutral-700">
              Sesión iniciada como{" "}
              <strong>{usuario.nombre || usuario.email}</strong>.
            </p>
            <p className="mt-1 text-sm text-neutral-500">
              Rol: {usuario.rol}
            </p>
            <button
              type="button"
              onClick={handleLogout}
              className="mt-6 rounded-lg bg-neutral-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-neutral-800"
            >
              Cerrar sesión
            </button>
          </>
        ) : (
          <>
            <p className="mt-4 text-neutral-700">
              Iniciá sesión para continuar.
            </p>
            <Link
              to="/login"
              className="mt-6 inline-block rounded-lg bg-neutral-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-neutral-800"
            >
              Ir al inicio de sesión
            </Link>
          </>
        )}
      </section>
    </main>
  );
}

function App() {
  return (
    <BrowserRouter>
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <div className="flex flex-1 flex-col">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/admin" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<LoginPage />} />
            <Route path="/registro" element={<LoginPage />} />
            <Route path="/auth" element={<LoginPage />} />
            <Route path="/forgot-password" element={<LoginPage />} />
            <Route path="/recuperar-password" element={<LoginPage />} />
            <Route path="/restablecer-password" element={<LoginPage />} />
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </div>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
