import { BrowserRouter, Link, Navigate, Route, Routes, useNavigate } from "react-router";
import Navbar from "./components/Navbar";
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
    <main className="flex min-h-[calc(100vh-53px)] items-center justify-center bg-neutral-100 px-4 py-10">
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
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
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
    </BrowserRouter>
  );
}

export default App;
