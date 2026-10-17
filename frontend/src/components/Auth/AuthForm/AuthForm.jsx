import { useState } from "react";
import Button from "../../Button/Button";
import TextField from "../../TextField/TextField";
import { LOGIN } from "../../../constants/LOGIN";

// Formulario de acceso. Cambia sus campos según el modo: iniciar sesión o registrarse.
// Props:
//   mode: qué formulario mostrar: login o register
//   form: valores que el usuario escribió
//   onFieldChange: se ejecuta cada vez que el usuario escribe
//   onSubmit: se ejecuta al enviar el formulario
//   isLoading: true mientras se espera la respuesta del servidor
const AuthForm = ({ mode, form, onFieldChange, onSubmit, isLoading }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const isLogin = mode === "login";
  const submitLabel = isLogin ? LOGIN.title : LOGIN.register.submit;

  return (
    <form className="space-y-4" onSubmit={onSubmit}>
      {mode === "register" && (
        <div className="grid grid-cols-2 gap-3">
          <TextField
            label={LOGIN.form.name}
            id="auth-nombre"
            type="text"
            name="nombre"
            value={form.nombre}
            onChange={onFieldChange}
            required
            autoComplete="given-name"
            placeholder={LOGIN.form.namePlaceholder}
          />
          <TextField
            label={LOGIN.form.surname}
            id="auth-apellido"
            type="text"
            name="apellido"
            value={form.apellido}
            onChange={onFieldChange}
            required
            autoComplete="family-name"
            placeholder={LOGIN.form.surnamePlaceholder}
          />
        </div>
      )}

      {mode === "register" && (
        <TextField
          label={
            <>
              {LOGIN.form.phone}{" "}
              <span className="font-normal text-neutral-400">
                {LOGIN.form.optional}
              </span>
            </>
          }
          id="auth-telefono"
          type="tel"
          name="telefono"
          value={form.telefono}
          onChange={onFieldChange}
          autoComplete="tel"
          placeholder={LOGIN.form.phonePlaceholder}
        />
      )}

      <TextField
        label={LOGIN.form.email}
        id="auth-email"
        type="email"
        name="email"
        value={form.email}
        onChange={onFieldChange}
        required
        autoComplete="email"
        placeholder={LOGIN.form.emailPlaceholder}
      />

      <TextField
        label={LOGIN.form.password}
        id="auth-password"
        inputAction={
          <Button
            variant="passwordToggle"
            type="button"
            onClick={() => setShowPassword((visible) => !visible)}
            aria-label={
              showPassword
                ? LOGIN.form.hidePassword
                : LOGIN.form.showPassword
            }
            aria-pressed={showPassword}
          >
            {showPassword
              ? LOGIN.form.hidePassword
              : LOGIN.form.showPassword}
          </Button>
        }
        type={showPassword ? "text" : "password"}
        name="password"
        value={form.password}
        onChange={onFieldChange}
        required
        minLength={isLogin ? undefined : 8}
        autoComplete={isLogin ? "current-password" : "new-password"}
        placeholder={
          isLogin
            ? LOGIN.form.passwordPlaceholder
            : LOGIN.form.passwordMinPlaceholder
        }
      />

      {!isLogin && (
        <TextField
          label={LOGIN.form.confirmPassword}
          id="auth-confirm-password"
          inputAction={
            <Button
              variant="passwordToggle"
              type="button"
              onClick={() => setShowConfirmPassword((visible) => !visible)}
              aria-label={
                showConfirmPassword
                  ? LOGIN.form.hideConfirmPassword
                  : LOGIN.form.showConfirmPassword
              }
              aria-pressed={showConfirmPassword}
            >
              {showConfirmPassword
                ? LOGIN.form.hidePassword
                : LOGIN.form.showPassword}
            </Button>
          }
          type={showConfirmPassword ? "text" : "password"}
          name="confirmPassword"
          value={form.confirmPassword}
          onChange={onFieldChange}
          required
          minLength={8}
          autoComplete="new-password"
          placeholder={LOGIN.form.confirmPasswordPlaceholder}
        />
      )}

      <Button
        variant="primary"
        type="submit"
        disabled={isLoading}
      >
        {isLoading ? (
          <span className="inline-flex items-center gap-2">
            <span
              aria-hidden="true"
              className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"
            />
            {LOGIN.form.processing}
          </span>
        ) : (
          submitLabel
        )}
      </Button>
    </form>
  );
};

export default AuthForm;