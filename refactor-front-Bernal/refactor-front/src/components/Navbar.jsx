import { Link } from "react-router";

const NAV_LINKS = [
  { label: "Configurador", to: "/" },
  { label: "Productos", to: "/productos" },
  { label: "Mi perfil", to: "/perfil" },
  { label: "Carrito", to: "/carrito" },
  { label: "Ingresar", to: "/login" },
  { label: "Registrarme", to: "/register" },
];

export default function Navbar() {
  return (
    <header className="bg-gray-900">
      <nav className="mx-auto flex h-[53px] max-w-6xl items-center justify-between px-4">
        <Link to="/" className="text-base font-bold text-white">
          GraffiArt
        </Link>

        <div className="flex items-center gap-8">
          {NAV_LINKS.map(({ label, to }) => (
            <Link
              key={to}
              to={to}
              className="text-sm text-white transition-colors hover:text-gray-300"
            >
              {label}
            </Link>
          ))}
        </div>
      </nav>
    </header>
  );
}