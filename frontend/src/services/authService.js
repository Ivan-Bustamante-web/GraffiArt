import {
  loginUser,
  registerUser,
  requestPasswordReset,
  resetPassword,
  verifyEmail,
  resendVerification,
} from "./authApi";

export const login = async (email, password) => {
  return loginUser({ email, password });
};

export const register = async (datos) => {
  return registerUser(datos);
};

export {
  loginUser,
  registerUser,
  requestPasswordReset,
  resetPassword,
  verifyEmail,
  resendVerification,
};
