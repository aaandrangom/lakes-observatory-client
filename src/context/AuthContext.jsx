import React, { createContext, useState, useEffect, useContext } from 'react';
import { useNavigate, useLocation } from "react-router-dom";
import { Auth } from '../services/auth';

const AuthContext = createContext();

const isPublicRoute = (path) => {
    const publicPaths = [
        '/',
        '/sign-in',
        '/forgot-password',
        '/link-expired',
        '/concept',
        '/sign-up',
        '/activities',
        '/news',
        '/auth-required',
        /^\/change-password\/.*/,
        /^\/account-verified\/.*/
    ];

    return publicPaths.some(publicPath => {
        return typeof publicPath === 'string' ? publicPath === path : publicPath.test(path);
    });
};

const routeExists = (path) => {
    const validRoutes = [
        '/',
        '/sign-in',
        '/forgot-password',
        '/link-expired',
        '/concept',
        '/sign-up',
        '/activities',
        '/news',
        '/data',
        '/admin/dashboard',
        '/admin/manage-data/lakes',
        '/admin/manage-data/parameters',
        '/admin/manage-data/measurements',
        '/admin/upload-data',
        '/data/repositories',
        '/profile',
        '/regular-user',
        '/admin/activity-log',
        '/auth-required',
        '/admin/settings/email-sender'
    ];

    return validRoutes.includes(path) ||
        /^\/change-password\/.*/.test(path) ||
        /^\/account-verified\/.*/.test(path) ||
        /^\/data\/repositories\/.*/.test(path);
};

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

        if (!routeExists(currentPath)) {
            setLoading(false);
            return;
        }

        if (!isPublicRoute(currentPath)) {
            checkAuthStatus();
        } else {
            setLoading(false);
        }
    }, [location.pathname]);

    const signInAction = async (email, password) => {
        try {
            const response = await Auth.SignIn(email, password);

            if (response.status === 200) {
                const userRoles = response.data.body.roles.map(role => role.role_name);
                setIsAuthenticated(true);
                setRoles(userRoles);
                setUserId(response.data.body.user.id);

                const destination = location.state?.from;
                if (destination) {
                    navigate(destination, { replace: true });
                } else {
                    navigate(userRoles.includes('admin') ? '/admin/dashboard' : '/regular-user', { replace: true });
                }
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
            console.log(response)
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