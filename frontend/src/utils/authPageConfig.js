import { LOGIN } from "../constants/LOGIN";
import { ROUTES } from "../constants/ROUTES";

export const getAuthMode = (pathname) =>
  pathname.toLowerCase() === ROUTES.register ? "register" : "login";

export const getAuthHeading = (mode) =>
  mode === "register"
    ? { title: LOGIN.register.title, subtitle: LOGIN.register.subtitle }
    : { title: LOGIN.title, subtitle: LOGIN.subtitle };
