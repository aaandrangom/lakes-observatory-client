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
        '/regular-user', // Asegúrate de incluir esta ruta
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

                if (userRoles.includes('admin')) {
                    navigate('/admin/dashboard');
                } else {
                    navigate('/regular-user');
                }
            }
            return response;
        } catch (error) {
            console.error('Error in signInAction:', error);
            throw error;
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
            throw error;
        }
    };

    useEffect(() => {
        const handleUnauthorizedAccess = () => {
            const currentPath = window.location.pathname;

            if (!routeExists(currentPath)) {
                return;
            }

            if (!isPublicRoute(currentPath) && !loading && !isAuthenticated) {
                console.log('Redirecting to sign-in due to unauthorized access:', currentPath);
                navigate('/sign-in');
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
