
import { Navigate } from "react-router-dom";
import { useAuth } from "../auth/LoggedInUserContext";

type ProtectedRouteProps = {
    children: React.ReactNode;
    allowedRoles?: string[];
};

const ProtectedRoute = ({ children, allowedRoles }: ProtectedRouteProps) => {
    const { user, loading } = useAuth();

    if (loading) {
        
        return <div className="min-h-screen flex items-center justify-center">Yükleniyor...</div>;
    }

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    if (allowedRoles && !allowedRoles.includes(user.role || "")) {
        return <Navigate to="/" replace />;
    }

    return <>{children}</>;
};

export default ProtectedRoute;