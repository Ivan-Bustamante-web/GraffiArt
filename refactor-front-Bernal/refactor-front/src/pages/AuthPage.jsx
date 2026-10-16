import { Link, useLocation, useNavigate } from "react-router";
import AuthForm from "../auth/AuthForm";
import AuthModeTabs from "../auth/AuthModeTabs";
import AuthResultView from "../auth/AuthResultView";
import { getAuthHeading, getAuthMode } from "../auth/authPageConfig";
import Feedback from "../components/Feedback";
import FormLayout from "../components/FormLayout";
import useAuthFlow from "../hooks/useAuthFlow";
import authService from "../services/authService";
import { LOGIN } from "../types/LOGIN";

export default function AuthPage({ onLoginSuccess }) {
  const location = useLocation();
  const navigate = useNavigate();
  const query = new URLSearchParams(location.search);
  const token = query.get("token") || "";
  const mode = getAuthMode(location.pathname, query.get("mode"));
  const { title, subtitle } = getAuthHeading(mode, Boolean(token));
  const {form, message, error, loading, actionComplete, onFieldChange, resetForm, onSubmit, showFormAgain,
  } = useAuthFlow({ mode, token, service: authService, onLoginSuccess });

  const badgeLabel =
    mode === "login" || mode === "register"
      ? LOGIN.badge.access
      : LOGIN.badge.recovery;
  const isResultView =
    actionComplete && (mode === "forgot" || mode === "reset");
  const footer =
    mode === "forgot" || mode === "reset" ? (
      <p>
        {LOGIN.footer.forgotLogin}{" "}
        <Link
          to="/auth"
          className="font-semibold text-neutral-900 hover:underline"
        >
          {LOGIN.relogin}
        </Link>
      </p>
    ) : mode === "register" ? (
      <p>
        {LOGIN.hasAccount}{" "}
        <Link
          to="/auth"
          className="font-semibold text-neutral-900 hover:underline"
        >
          {LOGIN.relogin}
        </Link>
      </p>
    ) : (
      <p>
        {LOGIN.hasntAccount}{" "}
        <Link
          to="/auth?mode=register"
          className="font-semibold text-neutral-900 hover:underline"
        >
          {LOGIN.register.submit}
        </Link>
      </p>
    );

  return (
    <FormLayout className="flex items-center justify-center bg-neutral-100">
      <section className="w-full max-w-md rounded-2xl border border-neutral-200 bg-white p-7 shadow-lg">
        <header className="flex items-center justify-end border-b border-neutral-100 pb-4">
          <span className="rounded-full bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-700">
            {badgeLabel}
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

        {isResultView ? (
          <AuthResultView
            mode={mode}
            recoveryLink={
              <Link
                to="/restablecer-password"
                className="w-full rounded-lg border border-neutral-300 py-2.5 text-center text-sm font-semibold text-neutral-800 transition hover:bg-neutral-50"
              >
                {LOGIN.forgot.recoveryLink}
              </Link>
            }
            loginLink={
              <Link
                to="/auth"
                className="inline-block w-full rounded-lg bg-neutral-900 py-2.5 text-center text-sm font-semibold text-white transition hover:bg-neutral-800"
              >
                {LOGIN.relogin}
              </Link>
            }
            onRequestAnotherEmail={showFormAgain}
          />
        ) : !actionComplete ? (
          <AuthForm
            mode={mode}
            form={form}
            onFieldChange={onFieldChange}
            onSubmit={onSubmit}
            isLoading={loading}
            hasResetToken={Boolean(token)}
            onForgotPassword={() => navigate("/forgot-password")}
          />
        ) : null}

        {footer && (
          <footer className="mt-6 border-t border-neutral-100 pt-4 text-center text-xs text-neutral-500">
            {footer}
          </footer>
        )}
      </section>
    </FormLayout>
  );
}


// import { Link, useLocation, useNavigate } from "react-router";
// import AuthModeTabs from "../auth/AuthModeTabs";
// import VerificationNotice from "../auth/VerificationNotice";
// import AuthForm from "../auth/AuthForm";
// import FormLayout from "../components/FormLayout";
// import AuthResultView from "../auth/AuthResultView";
// import VerifyEmailView from "../auth/VerifyEmailView";
// import { getAuthMode } from "../auth/authPageConfig";
// import useAuthFlow from "../hooks/useAuthFlow";
// import authService from "../services/authService";
// import { LOGIN } from "../types/LOGIN";

// export default function AuthPage({ onLoginSuccess }) {
//   const location = useLocation();
//   const navigate = useNavigate();
//   const query = new URLSearchParams(location.search);
//   const token = query.get("token") || "";
//   const mode = getAuthMode(location.pathname, query.get("mode"));

//   const {
//     form,
//     message,
//     error,
//     loading,
//     devActionUrl,
//     needsVerificationEmail,
//     resendingEmail,
//     actionComplete,
//     onFieldChange,
//     resetForm,
//     onSubmit,
//     handleResendVerification,
//     requestAnotherEmail,
//   } = useAuthFlow({ mode, token, service: authService, onLoginSuccess });
// console.log("mode", mode);
//   const { title, subtitle } = LOGIN;

//   const footer =
//     mode === "forgot" || mode === "reset" ? (
//       <p>
//         ¿Recordaste tu contraseña?{" "}
//         <Link
//           to="/auth"
//           className="font-semibold text-neutral-900 hover:underline"
//         >
//          {LOGIN.relogin}
//         </Link>
//       </p>
//     ) : mode === "register" ? (
//       <p>
//         {LOGIN.hasAccount}
//         <Link
//           to="/auth"
//           className="font-semibold text-neutral-900 hover:underline"
//         >
//          {LOGIN.title}
//         </Link>
//       </p>
//     ) : mode === "login" ? (
//       <p>
//         {LOGIN.hasntAccount}
//         <Link
//           to="/auth?mode=register"
//           className="font-semibold text-neutral-900 hover:underline"
//         >
//           Registrarme ahora
//         </Link>
//       </p>
//     ) : null;

//   const isResultView =
//     actionComplete && (mode === "forgot" || mode === "reset");
//   const badgeLabel =
//     mode === "login" || mode === "register" ? "Acceso Seguro" : "Recuperación";

//   return (
//     <FormLayout className="flex items-center justify-center bg-neutral-100">
//       <section className="w-full max-w-md rounded-2xl border border-neutral-200 bg-white p-7 shadow-lg">
//         <header className="flex items-center justify-end border-b border-neutral-100 pb-4">
//           <span className="rounded-full bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-700">
//             {badgeLabel}
//           </span>
//         </header>

//         <AuthModeTabs mode={mode} onModeChange={resetForm} />

//         <div className="mb-5 mt-6">
//           <h1 className="text-2xl font-bold tracking-tight text-neutral-900">
//             {title}
//           </h1>
//           <p className="mt-1 text-sm text-neutral-500">{subtitle}</p>
//         </div>

//         <VerificationNotice
//           message={message}
//           error={error}
//           devActionUrl={devActionUrl}
//           mode={mode}
//           needsVerificationEmail={needsVerificationEmail}
//           email={form.email}
//           resendingEmail={resendingEmail}
//           onResendVerification={handleResendVerification}
//         />

//         {mode === "verify" ? (
//           <VerifyEmailView
//             isLoading={loading}
//             hasToken={Boolean(token)}
//             email={form.email}
//             onEmailChange={onFieldChange}
//             onResendVerification={handleResendVerification}
//             isResending={resendingEmail}
//             loginLink={
//               <Link
//                 to="/auth"
//                 className="text-sm font-semibold text-neutral-900 hover:underline"
//               >
//                 Volver a Iniciar Sesión
//               </Link>
//             }
//           />
//         ) : isResultView ? (
//           <AuthResultView
//             mode={mode}
//             recoveryLink={
//               <Link
//                 to="/restablecer-password"
//                 className="w-full rounded-lg border border-neutral-300 py-2.5 text-center text-sm font-semibold text-neutral-800 transition hover:bg-neutral-50"
//               >
//                 Ingresar código de recuperación
//               </Link>
//             }
//             loginLink={
//               <Link
//                 to="/auth"
//                 className="inline-block w-full rounded-lg bg-neutral-900 py-2.5 text-center text-sm font-semibold text-white transition hover:bg-neutral-800"
//               >
//                 Iniciar sesión con la nueva contraseña
//               </Link>
//             }
//             onRequestAnotherEmail={requestAnotherEmail}
//           />
//         ) : (!actionComplete || mode === "login") ? (
//           <AuthForm
//             mode={mode}
//             form={form}
//             onFieldChange={onFieldChange}
//             onSubmit={onSubmit}
//             isLoading={loading}
//             hasResetToken={Boolean(token)}
//             onForgotPassword={() => navigate("/forgot-password")}
//           />
//         ) : null}

//         {footer && (
//           <footer className="mt-6 border-t border-neutral-100 pt-4 text-center text-xs text-neutral-500">
//             {footer}
//           </footer>
//         )}
//       </section>
//     </FormLayout>
//   );
// }