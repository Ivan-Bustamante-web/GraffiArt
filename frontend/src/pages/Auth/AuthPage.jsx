import { Link, useLocation } from "react-router";
import AuthForm from "../../components/Auth/AuthForm/AuthForm";
import AuthModeTabs from "../../components/Auth/AuthModeTabs/AuthModeTabs";
import { getAuthHeading, getAuthMode } from "../../utils/authPageConfig";
import Feedback from "../../components/Feedback/Feedback";
import MainContainer from "../../components/MainContainer/MainContainer";
import useAuthFlow from "../../hooks/useAuthFlow";
import authService from "../../services/authService";
import { LOGIN } from "../../constants/LOGIN";
import { ROUTES } from "../../constants/ROUTES";

// Página de acceso. Según la dirección muestra iniciar sesión o registrarse.
// Props:
//   onLoginSuccess: qué hacer cuando el usuario inicia sesión bien
const AuthPage = ({ onLoginSuccess }) => {
  const location = useLocation();
  const mode = getAuthMode(location.pathname);
  const { title, subtitle } = getAuthHeading(mode);
  const { form, message, error, loading, actionComplete, onFieldChange, resetForm, onSubmit } =
    useAuthFlow({ mode, service: authService, onLoginSuccess });

  const isRegister = mode === "register";
  const footer = isRegister ? (
    <p>
      {LOGIN.hasAccount}{" "}
      <Link
        to={ROUTES.login}
        className="font-semibold text-neutral-900 hover:underline"
      >
        {LOGIN.relogin}
      </Link>
    </p>
  ) : (
    <p>
      {LOGIN.hasntAccount}{" "}
      <Link
        to={ROUTES.register}
        className="font-semibold text-neutral-900 hover:underline"
      >
        {LOGIN.register.submit}
      </Link>
    </p>
  );

  return (
    <MainContainer width="sm" centered>
      <section className="rounded-2xl border border-neutral-200 bg-white p-7 shadow-lg">
        <header className="flex items-center justify-end border-b border-neutral-100 pb-4">
          <span className="rounded-full bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-700">
            {LOGIN.badge.access}
          </span>
        </header>

        <AuthModeTabs mode={mode} onModeChange={resetForm} />

        <div className="mb-5 mt-6">
          <h1 className="text-2xl font-bold tracking-tight text-neutral-900">
            {title}
          </h1>
          <p className="mt-1 text-sm text-neutral-500">{subtitle}</p>
        </div>

        {message && (
          <Feedback type="success">
            <p className="font-medium">{message}</p>
          </Feedback>
        )}
        {error && (
          <Feedback type="error">
            <p className="font-medium">{error}</p>
          </Feedback>
        )}

        {!actionComplete && (
          <AuthForm
            mode={mode}
            form={form}
            onFieldChange={onFieldChange}
            onSubmit={onSubmit}
            isLoading={loading}
          />
        )}

        <footer className="mt-6 border-t border-neutral-100 pt-4 text-center text-xs text-neutral-500">
          {footer}
        </footer>
      </section>
    </MainContainer>
  );
};

export default AuthPage;
