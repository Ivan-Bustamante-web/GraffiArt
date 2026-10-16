import AuthPage from "./AuthPage";
import { useNavigate } from "react-router";
import { useAuthStore } from "../store/authStore";

export default function LoginPage() {
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);

  const handleLoginSuccess = (response) => {
    login(response.usuario, response.token);
    navigate(response.usuario.rol === "ADMIN" ? "/admin" : "/");
  };

  return <AuthPage onLoginSuccess={handleLoginSuccess} />;
}
