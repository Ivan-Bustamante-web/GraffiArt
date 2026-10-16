import { Search, ShoppingBag, UserRound } from "lucide-react";
import { Link } from "react-router";
import GraffiartLink from "./GraffiartLink";
import NavItem from "./NavItem";

export default function Navbar() {
  return (
    <header className="px-4 pt-4">
      <nav className="grid h-[76px] grid-cols-3 items-center rounded-xl bg-neutral-900 px-5 sm:px-8">
        <GraffiartLink className="text-lg font-semibold text-white" />

        <div className="flex h-full items-center justify-center gap-5 sm:gap-8">
          <NavItem to="/">Inicio</NavItem>
          <NavItem to="/productos">Productos</NavItem>
          <NavItem to="/categorias">Categorías</NavItem>
          <NavItem to="/contacto">Contacto</NavItem>
        </div>

        <div className="flex items-center justify-end gap-4 text-white sm:gap-5">
          <Link to="/productos" aria-label="Buscar productos">
            <Search size={19} />
          </Link>
          <Link to="/perfil" aria-label="Mi perfil">
            <UserRound size={19} />
          </Link>
          <Link to="/carrito" aria-label="Carrito">
            <ShoppingBag size={19} />
          </Link>
        </div>
      </nav>
    </header>
  );
}