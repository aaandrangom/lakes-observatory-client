import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from './AuthContext';

const PrivateRoutes = ({ requiredRoles }) => {
    const { isAuthenticated, roles, loading } = useAuth();

    if (loading) {
        return <div>Cargando...</div>;
    }

    if (!isAuthenticated) {
        return <Navigate to="/sign-in" replace />;
    }

    const hasRequiredRole = requiredRoles.some(role => roles.includes(role));

    if (!hasRequiredRole) {
        return <Navigate to="/notfound" replace />;
    }

    return <Outlet />;
};

export default PrivateRoutes;
