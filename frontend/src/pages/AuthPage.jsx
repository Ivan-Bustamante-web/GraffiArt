import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { loginUser, registerUser, requestPasswordReset, resetPassword, verifyEmail } from "../services/authApi";

const initialForm = { nombre: "", apellido: "", email: "", password: "", telefono: "" };

function AuthPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const query = new URLSearchParams(location.search);
  const token = query.get("token");
  const isVerification = location.pathname === "/verificar-email";
  const isReset = location.pathname === "/restablecer-password";
  const [mode, setMode] = useState(location.pathname === "/registro" ? "register" : "login");
  const [form, setForm] = useState(initialForm);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isVerification || !token) return;
    setLoading(true);
    verifyEmail(token)
      .then((response) => setMessage(response.message))
      .catch((requestError) => setError(requestError.response?.data?.error || "No se pudo verificar el email"))
      .finally(() => setLoading(false));
  }, [isVerification, token]);

  const updateField = (event) => setForm({ ...form, [event.target.name]: event.target.value });

  const submit = async (event) => {
    event.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);
    try {
      if (isReset) {
        const response = await resetPassword({ token, password: form.password });
        setMessage(response.message);
      } else if (mode === "register") {
        const response = await registerUser(form);
        setMessage(response.message);
      } else if (mode === "forgot") {
        const response = await requestPasswordReset(form.email);
        setMessage(response.message);
      } else {
        const response = await loginUser({ email: form.email, password: form.password });
        localStorage.setItem("graffiart_token", response.token);
        navigate("/");
      }
    } catch (requestError) {
      setError(requestError.response?.data?.error || "Ocurrió un error. Intentá nuevamente.");
    } finally {
      setLoading(false);
    }
  };

  if (isVerification) {
    return <AuthShell title="Verificación de email"><Status message={message} error={error} loading={loading} /><Link className="text-sm font-medium text-neutral-900 underline" to="/auth">Ir a iniciar sesión</Link></AuthShell>;
  }

  const title = isReset ? "Elegí una nueva contraseña" : mode === "register" ? "Creá tu cuenta" : mode === "forgot" ? "Recuperá tu contraseña" : "Bienvenido a GraffiArt";
  const submitLabel = isReset ? "Cambiar contraseña" : mode === "register" ? "Registrarme" : mode === "forgot" ? "Enviar enlace" : "Iniciar sesión";

  return (
    <AuthShell title={title}>
      <p className="mb-6 text-sm text-neutral-500">{isReset ? "Usá al menos 8 caracteres." : "Diseñá y comprá tu gabinete personalizado."}</p>
      {message && <p className="mb-4 rounded-md bg-emerald-50 p-3 text-sm text-emerald-700">{message}</p>}
      {error && <p className="mb-4 rounded-md bg-red-50 p-3 text-sm text-red-700">{error}</p>}
      <form className="space-y-4" onSubmit={submit}>
        {mode === "register" && !isReset && <div className="grid grid-cols-2 gap-3"><Field label="Nombre" name="nombre" value={form.nombre} onChange={updateField} /><Field label="Apellido" name="apellido" value={form.apellido} onChange={updateField} /></div>}
        {mode === "register" && !isReset && <Field label="Teléfono (opcional)" name="telefono" value={form.telefono} onChange={updateField} required={false} />}
        {mode !== "register" && !isReset && <Field label="Email" name="email" type="email" value={form.email} onChange={updateField} />}
        {mode === "register" && <Field label="Email" name="email" type="email" value={form.email} onChange={updateField} />}
        {(mode === "login" || mode === "register" || isReset) && <Field label="Contraseña" name="password" type="password" value={form.password} onChange={updateField} minLength={8} />}
        <button className="w-full rounded-md bg-neutral-900 px-4 py-3 text-sm font-medium text-white transition hover:bg-neutral-700 disabled:opacity-50" disabled={loading || (isReset && !token)}>{loading ? "Procesando..." : submitLabel}</button>
      </form>
      {!isReset && mode === "login" && <button className="mt-5 text-sm text-neutral-600 underline" type="button" onClick={() => { setMode("forgot"); setMessage(""); setError(""); }}>¿Olvidaste tu contraseña?</button>}
      {!isReset && <p className="mt-6 text-sm text-neutral-600">{mode === "register" ? "¿Ya tenés cuenta?" : "¿No tenés cuenta?"} <button className="font-medium text-neutral-900 underline" type="button" onClick={() => setMode(mode === "register" ? "login" : "register")}>{mode === "register" ? "Iniciar sesión" : "Registrarme"}</button></p>}
    </AuthShell>
  );
}

function Field({ label, required = true, ...props }) {
  return <label className="block text-left text-sm font-medium text-neutral-700">{label}<input className="mt-1 w-full rounded-md border border-neutral-300 px-3 py-2.5 font-normal outline-none focus:border-neutral-900" required={required} {...props} /></label>;
}

function Status({ message, error, loading }) {
  if (loading) return <p className="mb-5 text-sm text-neutral-500">Validando enlace...</p>;
  if (error) return <p className="mb-5 rounded-md bg-red-50 p-3 text-sm text-red-700">{error}</p>;
  return <p className="mb-5 rounded-md bg-emerald-50 p-3 text-sm text-emerald-700">{message}</p>;
}

function AuthShell({ title, children }) {
  return <main className="flex min-h-screen items-center justify-center bg-neutral-100 px-4 py-10"><section className="w-full max-w-md rounded-lg border border-neutral-200 bg-white p-7 shadow-sm"><Link className="text-sm font-semibold tracking-wide text-neutral-900" to="/">GRAFFIART</Link><h1 className="mt-8 text-3xl font-semibold text-neutral-900">{title}</h1>{children}</section></main>;
}

export default AuthPage;