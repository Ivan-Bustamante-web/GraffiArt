import { Link } from "react-router";
import { LOGIN } from "../types/LOGIN";

export default function AuthModeTabs({ mode, onModeChange }) {
  if (mode !== "login" && mode !== "register") return null;

  return (
    <div className="mt-6 flex rounded-xl bg-neutral-100 p-1">
      <Link
        to="/auth"
        onClick={onModeChange}
        aria-current={mode === "login" ? "page" : undefined}
        className={`flex-1 rounded-lg py-2 text-center text-sm font-medium transition-all ${
          mode === "login"
            ? "bg-white font-semibold text-neutral-900 shadow-sm"
            : "text-neutral-500 hover:text-neutral-900"
        }`}
      >
        {LOGIN.title}
      </Link>
      <Link
        to="/auth?mode=register"
        onClick={onModeChange}
        aria-current={mode === "register" ? "page" : undefined}
        className={`flex-1 rounded-lg py-2 text-center text-sm font-medium transition-all ${
          mode === "register"
            ? "bg-white font-semibold text-neutral-900 shadow-sm"
            : "text-neutral-500 hover:text-neutral-900"
        }`}
      >
        {LOGIN.register.tab}
      </Link>
    </div>
  );
}
