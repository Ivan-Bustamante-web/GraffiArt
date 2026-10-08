import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  loginUser,
  registerUser,
  requestPasswordReset,
  resetPassword,
  verifyEmail,
  resendVerification,
} from "../services/authApi";
import { useAuthStore } from "../store/authStore";

const initialForm = {
  nombre: "",
  apellido: "",
  email: "",
  password: "",
  confirmPassword: "",
  telefono: "",
  resetCode: "",
};

export default function AuthPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { login: storeLogin } = useAuthStore();

  const query = new URLSearchParams(location.search);
  const tokenFromQuery = query.get("token") || "";
  const modeFromQuery = query.get("mode");
  const pathname = location.pathname.toLowerCase();

  // Robust mode resolution
  let mode = "login";
  if (pathname === "/verificar-email") {
    mode = "verify";
  } else if (pathname === "/restablecer-password") {
    mode = "reset";
  } else if (
    pathname === "/forgot-password" ||
    pathname === "/recuperar-password" ||
    modeFromQuery === "forgot"
  ) {
    mode = "forgot";
  } else if (
    pathname === "/registro" ||
    pathname === "/register" ||
    modeFromQuery === "register"
  ) {
    mode = "register";
  } else {
    mode = "login";
  }

  const [form, setForm] = useState(initialForm);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(() => mode === "verify" && Boolean(tokenFromQuery));
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Verification & reset dev helper links
  const [devActionUrl, setDevActionUrl] = useState("");
  const [needsVerificationEmail, setNeedsVerificationEmail] = useState("");
  const [resendingEmail, setResendingEmail] = useState(false);
  const [actionComplete, setActionComplete] = useState(false);

  // Clear feedback when switching modes
  useEffect(() => {
    setMessage("");
    setError("");
    setDevActionUrl("");
    setNeedsVerificationEmail("");
    setActionComplete(false);
  }, [pathname, modeFromQuery]);

  // Handle automatic email verification when token is present
  useEffect(() => {
    if (mode !== "verify" || !tokenFromQuery) return;
    setLoading(true);
    verifyEmail(tokenFromQuery)
      .then((response) => {
        setMessage(response.message || "¡Email verificado con éxito!");
        setActionComplete(true);
      })
      .catch((err) => {
        setError(err.response?.data?.error || "El enlace de verificación no es válido o ya expiró.");
        if (err.response?.data?.email) {
          setNeedsVerificationEmail(err.response.data.email);
        }
      })
      .finally(() => setLoading(false));
  }, [mode, tokenFromQuery]);

  const updateField = (event) => {
    setForm((prev) => ({ ...prev, [event.target.name]: event.target.value }));
  };

  const handleResendVerification = async (targetEmail) => {
    const emailToSend = targetEmail || form.email;
    if (!emailToSend?.trim()) {
      setError("Por favor ingresá tu email para solicitar el reenvío.");
      return;
    }
    setError("");
    setMessage("");
    setResendingEmail(true);
    try {
      const response = await resendVerification(emailToSend.trim());
      setMessage(response.message || "Enlace enviado. Revisá tu casilla de correo.");
      if (response.verificationUrl) {
        setDevActionUrl(response.verificationUrl);
      }
    } catch (err) {
      setError(err.response?.data?.error || "No se pudo reenviar la verificación. Inténtalo más tarde.");
    } finally {
      setResendingEmail(false);
    }
  };

  const submit = async (event) => {
    event.preventDefault();
    setError("");
    setMessage("");
    setDevActionUrl("");
    setLoading(true);

    try {
      if (mode === "reset") {
        if (form.password.length < 8) {
          setError("La contraseña debe tener al menos 8 caracteres.");
          setLoading(false);
          return;
        }
        if (form.password !== form.confirmPassword) {
          setError("Las contraseñas no coinciden.");
          setLoading(false);
          return;
        }

        const activeToken = (tokenFromQuery || form.resetCode).trim().toLowerCase();
        if (!activeToken) {
          setError("Debes ingresar el código o token de recuperación.");
          setLoading(false);
          return;
        }

        const response = await resetPassword({
          token: activeToken,
          password: form.password,
        });
        setMessage(response.message || "¡Contraseña actualizada con éxito! Ya podés iniciar sesión.");
        setActionComplete(true);
      } else if (mode === "register") {
        if (form.password.length < 8) {
          setError("La contraseña debe tener al menos 8 caracteres.");
          setLoading(false);
          return;
        }
        if (form.password !== form.confirmPassword) {
          setError("Las contraseñas no coinciden.");
          setLoading(false);
          return;
        }

        const response = await registerUser({
          nombre: form.nombre,
          apellido: form.apellido,
          email: form.email,
          password: form.password,
          telefono: form.telefono,
        });

        setMessage(response.message || "Registro exitoso. Revisá tu email para activar la cuenta.");
        if (response.verificationUrl) {
          setDevActionUrl(response.verificationUrl);
        }
        setActionComplete(true);
      } else if (mode === "forgot") {
        if (!form.email.trim()) {
          setError("Por favor ingresá tu email.");
          setLoading(false);
          return;
        }

        const response = await requestPasswordReset(form.email.trim());
        setMessage(response.message || "Si el email está registrado, recibirás un correo con las instrucciones.");
        if (response.resetUrl) {
          setDevActionUrl(response.resetUrl);
        }
        setActionComplete(true);
      } else {
        // Mode: login
        const response = await loginUser({
          email: form.email.trim(),
          password: form.password,
        });

        storeLogin(response.usuario, response.token);
        navigate(response.usuario.rol === "ADMIN" ? "/admin" : "/");
      }
    } catch (requestError) {
      const respData = requestError.response?.data;
      const errorMsg = respData?.error || "Ocurrió un error inesperado. Por favor, intentá nuevamente.";
      setError(errorMsg);

      if (respData?.needsVerification) {
        setNeedsVerificationEmail(respData.email || form.email);
      }
    } finally {
      setLoading(false);
    }
  };

  // Render titles and subtitles
  const getHeader = () => {
    switch (mode) {
      case "verify":
        return {
          title: "Verificación de Cuenta",
          subtitle: "Activando tu acceso en GraffiArt.",
        };
      case "reset":
        return {
          title: "Nueva Contraseña",
          subtitle: tokenFromQuery
            ? "Ingresá tu nueva clave (mínimo 8 caracteres)."
            : "Ingresá tu código de recuperación y tu nueva clave.",
        };
      case "forgot":
        return {
          title: "¿Olvidaste tu contraseña?",
          subtitle: "Ingresá tu correo electrónico para recibir las instrucciones de recuperación.",
        };
      case "register":
        return {
          title: "Creá tu cuenta",
          subtitle: "Diseñá y personalizá tu gabinete ideal en GraffiArt.",
        };
      default:
        return {
          title: "Iniciar sesión",
          subtitle: "Ingresá con tu cuenta para continuar.",
        };
    }
  };

  const { title, subtitle } = getHeader();

  return (
    <main className="flex min-h-[calc(100vh-60px)] items-center justify-center bg-neutral-100 px-4 py-10">
      <section className="w-full max-w-md rounded-2xl border border-neutral-200 bg-white p-7 shadow-lg">
        {/* Brand Header */}
        <div className="flex items-center justify-between pb-4 border-b border-neutral-100">
          <Link
            to="/"
            className="text-lg font-bold tracking-wider text-neutral-900 hover:text-blue-600 transition-colors"
          >
            GRAFFIART
          </Link>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-blue-50 text-blue-700">
            {mode === "login" || mode === "register" ? "Acceso Seguro" : "Recuperación"}
          </span>
        </div>

        {/* Tab switch between Login and Register */}
        {(mode === "login" || mode === "register") && (
          <div className="mt-6 flex rounded-xl bg-neutral-100 p-1">
            <button
              type="button"
              onClick={() => {
                navigate("/auth");
                setForm(initialForm);
              }}
              className={`flex-1 py-2 text-center text-sm font-medium rounded-lg transition-all ${
                mode === "login"
                  ? "bg-white text-neutral-900 shadow-sm font-semibold"
                  : "text-neutral-500 hover:text-neutral-900"
              }`}
            >
              Iniciar sesión
            </button>
            <button
              type="button"
              onClick={() => {
                navigate("/auth?mode=register");
                setForm(initialForm);
              }}
              className={`flex-1 py-2 text-center text-sm font-medium rounded-lg transition-all ${
                mode === "register"
                  ? "bg-white text-neutral-900 shadow-sm font-semibold"
                  : "text-neutral-500 hover:text-neutral-900"
              }`}
            >
              Registrarme
            </button>
          </div>
        )}

        {/* Heading */}
        <div className="mt-6 mb-5">
          <h1 className="text-2xl font-bold tracking-tight text-neutral-900">{title}</h1>
          <p className="mt-1 text-sm text-neutral-500">{subtitle}</p>
        </div>

        {/* Success Alert */}
        {message && (
          <div className="mb-5 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800">
            <div className="flex items-start gap-2">
              <span className="text-emerald-600 font-bold text-base">✓</span>
              <div className="flex-1 font-medium">{message}</div>
            </div>
          </div>
        )}

        {/* Error Alert */}
        {error && (
          <div className="mb-5 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">
            <div className="flex items-start gap-2">
              <span className="text-red-600 font-bold text-base">⚠</span>
              <div className="flex-1">
                <p className="font-medium">{error}</p>

                {/* Offer resend verification button when blocked by unverified email */}
                {(needsVerificationEmail || error.includes("verificá tu email")) && (
                  <div className="mt-3 pt-3 border-t border-red-200">
                    <button
                      type="button"
                      disabled={resendingEmail}
                      onClick={() => handleResendVerification(needsVerificationEmail || form.email)}
                      className="inline-flex items-center justify-center rounded-lg bg-red-600 px-3 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-red-700 transition disabled:opacity-50"
                    >
                      {resendingEmail ? "Enviando enlace..." : "Reenviar correo de verificación"}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Dev Mode Helper Callout */}
        {devActionUrl && (
          <div className="mb-5 rounded-xl border border-amber-300 bg-amber-50 p-4 text-sm text-amber-900 shadow-sm">
            <div className="flex items-center gap-1.5 font-semibold text-amber-800">
              <span>⚡</span> Modo de Prueba / Desarrollo
            </div>
            <p className="mt-1 text-xs text-amber-700">
              Podés completar la acción directamente haciendo clic en el siguiente enlace:
            </p>
            <div className="mt-2.5">
              <a
                href={devActionUrl}
                className="inline-block rounded-lg bg-amber-600 px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-amber-700 transition"
              >
                {mode === "register" || mode === "verify" || needsVerificationEmail
                  ? "Activar cuenta ahora →"
                  : "Restablecer contraseña ahora →"}
              </a>
            </div>
          </div>
        )}

        {/* EMAIL VERIFICATION VIEW */}
        {mode === "verify" && (
          <div className="space-y-4">
            {loading && (
              <div className="py-6 text-center text-sm text-neutral-500">
                <div className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-neutral-300 border-t-neutral-900 mb-2"></div>
                <p>Verificando tu cuenta...</p>
              </div>
            )}

            {!tokenFromQuery && !loading && (
              <div className="space-y-3">
                <p className="text-sm text-neutral-600">
                  Ingresá tu correo para que te reenviemos un enlace de activación:
                </p>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleResendVerification(form.email);
                  }}
                  className="space-y-3"
                >
                  <label className="block text-left text-sm font-medium text-neutral-700">
                    Email
                    <input
                      type="email"
                      name="email"
                      value={form.email}
                      onChange={updateField}
                      required
                      placeholder="tu@email.com"
                      className="mt-1 w-full rounded-lg border border-neutral-300 px-3 py-2.5 text-sm outline-none focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900"
                    />
                  </label>
                  <button
                    type="submit"
                    disabled={resendingEmail}
                    className="w-full rounded-lg bg-neutral-900 py-2.5 text-sm font-semibold text-white hover:bg-neutral-800 transition disabled:opacity-50"
                  >
                    {resendingEmail ? "Enviando..." : "Reenviar activación"}
                  </button>
                </form>
              </div>
            )}

            <div className="pt-3 text-center">
              <Link
                to="/auth"
                className="text-sm font-semibold text-neutral-900 hover:underline"
              >
                Volver a Iniciar Sesión
              </Link>
            </div>
          </div>
        )}

        {/* FORGOT PASSWORD POST-ACTION VIEW */}
        {mode === "forgot" && actionComplete && (
          <div className="space-y-4">
            <p className="text-sm text-neutral-600">
              Revisá tu casilla de correo. Si tenés el código de recuperación, podés ingresarlo directamente:
            </p>
            <div className="flex flex-col gap-2 pt-2">
              <Link
                to="/restablecer-password"
                className="w-full rounded-lg border border-neutral-300 py-2.5 text-center text-sm font-semibold text-neutral-800 hover:bg-neutral-50 transition"
              >
                Ingresar código de recuperación
              </Link>
              <button
                type="button"
                onClick={() => {
                  setActionComplete(false);
                  setMessage("");
                }}
                className="text-xs text-neutral-500 hover:text-neutral-900 underline mt-1"
              >
                Solicitar otro correo
              </button>
            </div>
          </div>
        )}

        {/* RESET PASSWORD SUCCESS VIEW */}
        {mode === "reset" && actionComplete && (
          <div className="pt-2 text-center">
            <Link
              to="/auth"
              className="inline-block w-full rounded-lg bg-neutral-900 py-2.5 text-center text-sm font-semibold text-white hover:bg-neutral-800 transition"
            >
              Iniciar sesión con la nueva contraseña
            </Link>
          </div>
        )}

        {/* MAIN FORMS (Login, Register, Forgot, Reset) */}
        {mode !== "verify" && (!actionComplete || mode === "login") && (
          <form className="space-y-4" onSubmit={submit}>
            {/* REGISTER: Name & Last Name */}
            {mode === "register" && (
              <div className="grid grid-cols-2 gap-3">
                <label className="block text-left text-xs font-semibold text-neutral-700">
                  Nombre
                  <input
                    type="text"
                    name="nombre"
                    value={form.nombre}
                    onChange={updateField}
                    required
                    placeholder="Juan"
                    className="mt-1 w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900"
                  />
                </label>
                <label className="block text-left text-xs font-semibold text-neutral-700">
                  Apellido
                  <input
                    type="text"
                    name="apellido"
                    value={form.apellido}
                    onChange={updateField}
                    required
                    placeholder="Pérez"
                    className="mt-1 w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900"
                  />
                </label>
              </div>
            )}

            {/* REGISTER: Phone */}
            {mode === "register" && (
              <label className="block text-left text-xs font-semibold text-neutral-700">
                Teléfono <span className="font-normal text-neutral-400">(opcional)</span>
                <input
                  type="tel"
                  name="telefono"
                  value={form.telefono}
                  onChange={updateField}
                  placeholder="+54 9 11 1234-5678"
                  className="mt-1 w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900"
                />
              </label>
            )}

            {/* EMAIL (Login, Register, Forgot) */}
            {mode !== "reset" && (
              <label className="block text-left text-xs font-semibold text-neutral-700">
                Email
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={updateField}
                  required
                  placeholder="ejemplo@correo.com"
                  className="mt-1 w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900"
                />
              </label>
            )}

            {/* RESET: Code input if token not in URL */}
            {mode === "reset" && !tokenFromQuery && (
              <label className="block text-left text-xs font-semibold text-neutral-700">
                Código o Token de recuperación
                <input
                  type="text"
                  name="resetCode"
                  value={form.resetCode}
                  onChange={updateField}
                  required
                  placeholder="Pegá el código recibido"
                  className="mt-1 w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900"
                />
              </label>
            )}

            {/* PASSWORD (Login, Register, Reset) */}
            {(mode === "login" || mode === "register" || mode === "reset") && (
              <div className="relative">
                <div className="flex items-center justify-between">
                  <label className="block text-left text-xs font-semibold text-neutral-700">
                    {mode === "reset" ? "Nueva Contraseña" : "Contraseña"}
                  </label>
                  {mode === "login" && (
                    <button
                      type="button"
                      onClick={() => navigate("/forgot-password")}
                      className="text-xs text-blue-600 hover:text-blue-800 hover:underline cursor-pointer"
                    >
                      ¿Olvidaste tu contraseña?
                    </button>
                  )}
                </div>
                <div className="relative mt-1">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={form.password}
                    onChange={updateField}
                    required
                    minLength={mode === "login" ? undefined : 8}
                    placeholder={mode === "login" ? "••••••••" : "Mínimo 8 caracteres"}
                    className="w-full rounded-lg border border-neutral-300 px-3 py-2 pr-10 text-sm outline-none focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-neutral-400 hover:text-neutral-700 cursor-pointer text-xs"
                    aria-label="Ver u ocultar contraseña"
                  >
                    {showPassword ? "Ocultar" : "Ver"}
                  </button>
                </div>
              </div>
            )}

            {/* CONFIRM PASSWORD (Register, Reset) */}
            {(mode === "register" || mode === "reset") && (
              <div className="relative">
                <label className="block text-left text-xs font-semibold text-neutral-700">
                  Confirmar Contraseña
                </label>
                <div className="relative mt-1">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    value={form.confirmPassword}
                    onChange={updateField}
                    required
                    minLength={8}
                    placeholder="Repetí la contraseña"
                    className="w-full rounded-lg border border-neutral-300 px-3 py-2 pr-10 text-sm outline-none focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword((prev) => !prev)}
                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-neutral-400 hover:text-neutral-700 cursor-pointer text-xs"
                    aria-label="Ver u ocultar contraseña"
                  >
                    {showConfirmPassword ? "Ocultar" : "Ver"}
                  </button>
                </div>
              </div>
            )}

            {/* SUBMIT BUTTON */}
            <button
              type="submit"
              disabled={loading}
              className="mt-2 w-full rounded-xl bg-neutral-900 py-3 text-sm font-semibold text-white shadow-md hover:bg-neutral-800 transition disabled:opacity-50 cursor-pointer"
            >
              {loading ? (
                <span className="inline-flex items-center gap-2">
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
                  Procesando...
                </span>
              ) : mode === "reset" ? (
                "Guardar nueva contraseña"
              ) : mode === "register" ? (
                "Crear mi cuenta"
              ) : mode === "forgot" ? (
                "Enviar enlace de recuperación"
              ) : (
                "Iniciar sesión"
              )}
            </button>
          </form>
        )}

        {/* FOOTER LINKS */}
        <div className="mt-6 pt-4 border-t border-neutral-100 text-center text-xs text-neutral-500">
          {mode === "forgot" || mode === "reset" ? (
            <p>
              ¿Recordaste tu contraseña?{" "}
              <Link
                to="/auth"
                className="font-semibold text-neutral-900 hover:underline"
              >
                Volver a Iniciar Sesión
              </Link>
            </p>
          ) : mode === "register" ? (
            <p>
              ¿Ya tenés una cuenta?{" "}
              <Link
                to="/auth"
                className="font-semibold text-neutral-900 hover:underline"
              >
                Iniciar sesión
              </Link>
            </p>
          ) : mode === "login" ? (
            <p>
              ¿No tenés una cuenta?{" "}
              <Link
                to="/auth?mode=register"
                className="font-semibold text-neutral-900 hover:underline"
              >
                Registrarme ahora
              </Link>
            </p>
          ) : null}
        </div>
      </section>
    </main>
  );
}
