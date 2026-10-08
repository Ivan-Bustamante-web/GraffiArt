import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

export default function AdminRoute({ children }) {
  const { usuario } = useAuthStore();

  if (!usuario) {
    return <Navigate to="/login" replace />;
  }

  if (usuario.rol !== 'ADMIN') {
    return <Navigate to="/" replace />;
  }

  return children;
}
