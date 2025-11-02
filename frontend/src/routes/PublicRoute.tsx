import { Navigate } from "react-router-dom";
import { useAppSelector } from "../store/hooks/hooks";

interface PublicRouteProps {
  children: React.ReactNode;
}

const PublicRoute = ({ children }: PublicRouteProps) => {
  const { isAuth } = useAppSelector((state) => state.user);

  if (isAuth) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};

export default PublicRoute;
