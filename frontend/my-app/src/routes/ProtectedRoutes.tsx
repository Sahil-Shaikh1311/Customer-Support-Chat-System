
import type { JSX } from "react";
import { Navigate } from "react-router-dom";

interface ProtectedRouteProps {
  children: JSX.Element;
  role: "agent" | "customer";
}

export default function ProtectedRoute({ children, role, }: ProtectedRouteProps) {
  
  const token = localStorage.getItem("accessToken");
  const userRole = localStorage.getItem("role");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (userRole !== role) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
