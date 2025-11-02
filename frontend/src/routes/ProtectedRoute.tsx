import type { ReactNode } from "react";
import { useAppSelector } from "../store/hooks/hooks";
import { Navigate } from "react-router";

interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { isAuth } = useAppSelector((state) => state.user);

  if (!isAuth) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
