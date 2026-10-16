import { NavLink } from "react-router";

export default function NavItem({ to, children }) {
  return (
    <NavLink
      to={to}
      end={to === "/"}
      className={({ isActive }) =>
        `relative flex h-full items-center text-sm transition-colors ${
          isActive
            ? "font-semibold text-white after:absolute after:inset-x-0 after:bottom-5 after:h-0.5 after:bg-white"
            : "text-neutral-400 hover:text-white"
        }`
      }
    >
      {children}
    </NavLink>
  );
}