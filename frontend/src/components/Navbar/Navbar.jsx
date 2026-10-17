import { LogIn, LogOut, ShoppingBag, UserRound } from "lucide-react";
import { Link, useNavigate } from "react-router";
import { ROLES } from "../../constants/APP";
import { NAVBAR } from "../../constants/NAVBAR";
import { ROUTES } from "../../constants/ROUTES";
import { selectCantidadTotal, useCartStore } from "../../store/cartStore";
import { useAuthStore } from "../../store/authStore";
import GraffiartLink from "../GraffiartLink/GraffiartLink";
import NavItem from "../NavItem/NavItem";

// Barra de navegación superior: links del sitio, perfil o login, cerrar sesión y carrito con la cantidad de productos.
const Navbar = () => {
  const navigate = useNavigate();
  const usuario = useAuthStore((state) => state.usuario);
  const logout = useAuthStore((state) => state.logout);
  const cantidad = useCartStore(selectCantidadTotal);
  const isAdmin = usuario?.rol === ROLES.admin;
  const links = isAdmin ? [...NAVBAR.links, ...NAVBAR.adminLinks] : NAVBAR.links;

  const handleLogout = () => {
    logout();
    navigate(ROUTES.login);
  };

  return (
    <header className="px-4 pt-4">
      <nav className="grid h-[76px] grid-cols-[auto_1fr_auto] items-center gap-4 rounded-xl bg-neutral-900 px-5 sm:px-8">
        <GraffiartLink className="text-lg font-semibold text-white" />

        <div className="flex h-full items-center justify-center gap-5 sm:gap-8">
          {links.map(({ label, to }) => (
            <NavItem key={to} to={to}>
              {label}
            </NavItem>
          ))}
        </div>

        <div className="flex items-center justify-end gap-4 text-white sm:gap-5">
          {usuario ? (
            <>
              <Link to={ROUTES.profile} aria-label={NAVBAR.aria.profile} title={usuario.nombre}>
                <UserRound size={19} />
              </Link>
              <button
                type="button"
                onClick={handleLogout}
                aria-label={NAVBAR.aria.logout}
                className="cursor-pointer"
              >
                <LogOut size={19} />
              </button>
            </>
          ) : (
            <Link to={ROUTES.login} aria-label={NAVBAR.aria.login}>
              <LogIn size={19} />
            </Link>
          )}
          <Link to={ROUTES.cart} aria-label={NAVBAR.aria.cart} className="relative">
            <ShoppingBag size={19} />
            {cantidad > 0 && (
              <span className="absolute -top-2 -right-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-blue-600 px-1 text-[10px] font-semibold">
                {cantidad}
              </span>
            )}
          </Link>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
