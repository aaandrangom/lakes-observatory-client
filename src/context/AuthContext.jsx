import React, { createContext, useState, useEffect, useContext } from 'react';
import { useNavigate, useLocation } from "react-router-dom";
import { Auth } from '../services/auth';
import { isPublicRoute, routeExists } from '../config/routes';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [roles, setRoles] = useState(null);
    const [userId, setUserId] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const location = useLocation();

    const isAdmin = roles ? roles.includes('admin') : false;

    const checkAuthStatus = async () => {
        try {
            const response = await Auth.checkAuthStatus();
            if (response.status === 200) {
                setIsAuthenticated(true);
                setRoles(response.data.body.user.roles);
                setUserId(response.data.body.user.id);
            } else {
                setIsAuthenticated(false);
                setRoles(null);
                setUserId(null);
            }
        } catch (error) {
            console.error('Error checking authentication status:', error);
            setIsAuthenticated(false);
            setRoles(null);
            setUserId(null);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const currentPath = location.pathname;

        if (!loading) {
            if (!isPublicRoute(currentPath) && !isAuthenticated) {
                navigate('/auth-required', { state: { from: currentPath } });
            }
        } else {
            checkAuthStatus();
        }
    }, [location.pathname, isAuthenticated, loading]);

    const signInAction = async (email, password) => {
        try {
            const response = await Auth.SignIn(email, password);

            if (response.status === 200) {
                const userRoles = response.data.body.roles.map(role => role.role_name);
                setIsAuthenticated(true);
                setRoles(userRoles);
                setUserId(response.data.body.user.id);

                const destination = location.state?.from || (userRoles.includes('admin') ? '/admin/dashboard' : '/regular-user');
                navigate(destination, { replace: true });
            }
            return response;
        } catch (error) {
            console.error('Error en signInAction:', error);
            throw new Error('Se produjo un error inesperado. Por favor, inténtalo más tarde.');
        }
    };

    const logoutAction = async () => {
        try {
            const response = await Auth.Logout();
            if (response.status === 200) {
                setIsAuthenticated(false);
                setRoles(null);
                setUserId(null);
                navigate('/sign-in');
            }
            return response;
        } catch (error) {
            console.error('Error during logout:', error);
            throw new Error('Se produjo un error inesperado. Por favor, inténtalo más tarde.');
        }
    };

    useEffect(() => {
        const handleUnauthorizedAccess = () => {
            const currentPath = window.location.pathname;

            if (!routeExists(currentPath)) {
                return;
            }

            if (!isPublicRoute(currentPath) && !loading && !isAuthenticated) {
                navigate('/auth-required', { state: { from: currentPath } });
            }
        };

        window.addEventListener('unauthorizedAccess', handleUnauthorizedAccess);

        return () => {
            window.removeEventListener('unauthorizedAccess', handleUnauthorizedAccess);
        };
    }, [navigate, isAuthenticated, loading]);

    return (
        <AuthContext.Provider value={{
            isAuthenticated,
            roles,
            userId,
            isAdmin,
            signInAction,
            logoutAction,
            checkAuthStatus,
            loading
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);