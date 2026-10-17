import { ROUTES } from "./ROUTES";

export const AUTH_INITIAL_FORM = {
  nombre: "",
  apellido: "",
  email: "",
  password: "",
  confirmPassword: "",
  telefono: "",
};

export const LOGIN = {
  title: "Iniciar sesión",
  subtitle: "Ingresá con tu cuenta para continuar.",
  relogin: "Iniciar sesión",
  hasAccount: "¿Ya tenés una cuenta?",
  hasntAccount: "¿No tenés una cuenta?",
  badge: {
    access: "Acceso Seguro",
  },
  register: {
    title: "Creá tu cuenta",
    subtitle: "Diseñá y personalizá tu gabinete ideal en GraffiArt.",
    tab: "Registrarme",
    submit: "Crear mi cuenta",
    success: "Registro exitoso. Ya podés iniciar sesión.",
  },
  form: {
    name: "Nombre",
    surname: "Apellido",
    phone: "Teléfono",
    optional: "(opcional)",
    email: "Email",
    password: "Contraseña",
    confirmPassword: "Confirmar Contraseña",
    showPassword: "Ver contraseña",
    hidePassword: "Ocultar contraseña",
    showConfirmPassword: "Ver confirmación de contraseña",
    hideConfirmPassword: "Ocultar confirmación de contraseña",
    namePlaceholder: "Mateo",
    surnamePlaceholder: "Bernal",
    phonePlaceholder: "+54 9 11 1234-5678",
    emailPlaceholder: "ejemplo@correo.com",
    passwordPlaceholder: "••••••••",
    passwordMinPlaceholder: "Mínimo 8 caracteres",
    confirmPasswordPlaceholder: "Repetí la contraseña",
    processing: "Procesando...",
  },
  ERRORS: {
    email: "Ingrese un correo electrónico válido",
    password: "La contraseña debe tener al menos 6 caracteres",
    passwordMin: "La contraseña debe tener al menos 8 caracteres.",
    passwordMismatch: "Las contraseñas no coinciden.",
    request: "Ocurrió un error. Por favor, intentá nuevamente.",
    unsupportedMode: (mode) => `Modo de autenticación no soportado: ${mode}`,
  },
  REQUIRED: {
    email: "El correo electrónico es obligatorio",
    password: "La contraseña es obligatoria",
  },
};

export const AUTH_TABS = [
  { id: "login", to: ROUTES.login, label: LOGIN.title },
  { id: "register", to: ROUTES.register, label: LOGIN.register.tab },
];
