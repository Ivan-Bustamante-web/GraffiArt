import { createBrowserRouter, Navigate } from "react-router";
import { ROLES } from "./constants/APP";
import { ROUTES } from "./constants/ROUTES";
import Layout from "./components/Layout/Layout";
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute";
import {
  Admin,
  AdminCategorias,
  AdminProductos,
  Carrito,
  Configurator,
  Home,
  Inventario,
  Login,
  Perfil,
  ProductoDetalle,
  Productos,
  Register,
} from "./pages";

export const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      { index: true, element: <Home /> },
      { path: ROUTES.configurator, element: <Configurator /> },
      { path: ROUTES.products, element: <Productos /> },
      { path: ROUTES.productDetailPattern, element: <ProductoDetalle /> },
      { path: ROUTES.cart, element: <Carrito /> },

      { path: ROUTES.login, element: <Login /> },
      { path: ROUTES.register, element: <Register /> },
      { path: ROUTES.forgotPassword, element: <Login /> },
      { path: ROUTES.resetPassword, element: <Login /> },

      {
        element: <ProtectedRoute />,
        children: [{ path: ROUTES.profile, element: <Perfil /> }],
      },
      {
        element: <ProtectedRoute role={ROLES.admin} />,
        children: [
          { path: ROUTES.admin, element: <Admin /> },
          { path: ROUTES.adminCategories, element: <AdminCategorias /> },
          { path: ROUTES.adminProducts, element: <AdminProductos /> },
          { path: ROUTES.inventory, element: <Inventario /> },
        ],
      },

      { path: "*", element: <Navigate to={ROUTES.home} replace /> },
    ],
  },
]);
