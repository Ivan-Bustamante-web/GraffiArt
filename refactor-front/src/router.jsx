import { createBrowserRouter, Navigate } from "react-router";
import { Login, Register } from "./pages";

export const router = createBrowserRouter([
  { index: true, element: <Navigate to="/login" replace /> },
  { path: "/login", element: <Login /> },
  { path: "/register", element: <Register /> },
]);
