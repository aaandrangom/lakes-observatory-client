import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from './AuthContext';
import AuthRequired from '../components/common/AuthRequired';

const PrivateRoutes = ({ requiredRoles }) => {
    const { isAuthenticated, roles, loading } = useAuth();

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (!isAuthenticated) {
        return <AuthRequired />;
    }

    const hasRequiredRole = requiredRoles.some(role => roles.includes(role));

    if (!hasRequiredRole) {
        return <Navigate to="/notfound" replace />;
    }

    return <Outlet />;
};

export default PrivateRoutes;