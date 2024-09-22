import React, { createContext, useState, useEffect, useContext } from 'react';
import { useNavigate } from "react-router-dom";
import { Auth } from '../services/auth';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [roles, setRoles] = useState(null);
    const [userId, setUserId] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

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
            console.error('Error checking auth status:', error);
            setIsAuthenticated(false);
            setRoles(null);
            setUserId(null);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        checkAuthStatus();
    }, []);

    const signInAction = async (email, password) => {
        try {
            const response = await Auth.SignIn(email, password);
            if (response.status === 200) {
                await checkAuthStatus();

                if (roles && roles.includes('admin')) {
                    navigate('/administration');
                } else {
                    navigate('/regular-user');
                }
            }
            return response;
        } catch (error) {
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
                navigate('/');
            }
            return response;
        } catch (error) {
            throw error;
        }
    };

    useEffect(() => {
        const handleUnauthorized = () => {
            setIsAuthenticated(false);
            setRoles(null);
            setUserId(null);
            navigate('/sign-in');
        };

        window.addEventListener('unauthorizedAccess', handleUnauthorized);

        return () => {
            window.removeEventListener('unauthorizedAccess', handleUnauthorized);
        };
    }, [navigate]);

    return (
        <AuthContext.Provider value={{ isAuthenticated, roles, userId, isAdmin, signInAction, logoutAction, checkAuthStatus, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
