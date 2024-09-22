import React, { Suspense, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Auth } from '../../services/auth';

const TokenVerification = ({ children }) => {
    const { token } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        const verifyToken = async () => {
            try {
                const response = await Auth.isTokenExpired(token);
                if (response.status === 200) {
                    const isExpired = response.data.body;
                    if (isExpired) {
                        navigate("/link-expired", { replace: true });
                    }
                } else {
                    navigate("/link-expired", { replace: true });
                }
            } catch (error) {
                navigate("/link-expired", { replace: true });
            }
        };
        verifyToken();
    }, [token, navigate]);

    return null;
};

export default TokenVerification;
