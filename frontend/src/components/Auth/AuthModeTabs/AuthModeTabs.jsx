import { Link } from "react-router";
import { AUTH_TABS } from "../../../constants/LOGIN";

// Pestañas para cambiar entre "Ingresar" y "Registrarse".
// Props:
//   mode: pestaña activa: login o register
//   onModeChange: se ejecuta al cambiar de pestaña (para limpiar el formulario)
const AuthModeTabs = ({ mode, onModeChange }) => {
  return (
    <div className="mt-6 flex rounded-xl bg-neutral-100 p-1">
      {AUTH_TABS.map((tab) => (
        <Link
          key={tab.id}
          to={tab.to}
          onClick={onModeChange}
          aria-current={mode === tab.id ? "page" : undefined}
          className={`flex-1 rounded-lg py-2 text-center text-sm font-medium transition-all ${
            mode === tab.id
              ? "bg-white font-semibold text-neutral-900 shadow-sm"
              : "text-neutral-500 hover:text-neutral-900"
          }`}
        >
          {tab.label}
        </Link>
      ))}
    </div>
  );
};

export default AuthModeTabs;
