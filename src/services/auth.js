import apiClient from './client.js';

export const Auth = {
    async SignIn(email, password) {
        try {
            const url = 'users/signIn';
            const response = await apiClient.post(
                url,
                {
                    email: email,
                    password: password
                }
            );

            return response;
        } catch (error) {
            return error.response;
        }
    },

    async Logout() {
        try {
            const url = 'users/logout';
            const response = await apiClient.post(url);
            return response;
        } catch (error) {
            return error.response;
        }
    },

    async forgotPassword(email) {
        try {
            const url = 'users/send-password-recovery-email';
            const response = await apiClient.post(url,
                {
                    email: email
                }
            );

            return response;
        } catch (error) {
            return error.response;
        }
    },

    async recoverPassword(token, password) {
        try {
            const url = `users/reset-password/${token}`;
            const response = await apiClient.post(url, {
                password: password
            });

            return response;
        } catch (error) {
            return error.response;
        }
    },

    async isTokenExpired(token) {
        try {
            const url = `users/token-expired/${token}`;
            const response = await apiClient.get(url);
            return response;
        } catch (error) {
            return error.response;
        }
    },

    async fetchCountries() {
        try {
            const url = `users/all/countries`;
            const response = await apiClient.get(url);
            return response;
        } catch (error) {
            return error.response;
        }
    },

    async signUp(user) {
        try {
            const url = `users/signUp`;
            const response = await apiClient.post(url,
                user
            );
            return response;
        } catch (error) {
            return error.response;
        }
    },

    async accountVerified(token) {
        try {
            const url = `users/confirm/${token}`;
            const response = await apiClient.get(url);
            return response;
        } catch (error) {
            return error.response;
        }
    },

    async checkAuthStatus() {
        try {
            const url = 'users/get/current';
            const response = await apiClient.get(url);
            return response;
        } catch (error) {
            return error.response;
        }
    },

    async getUserById(id) {
        try {
            const url = `users/${id}`;
            const response = await apiClient.get(url);
            return response;
        } catch (error) {
            return error.response;
        }
    },

    async sendEmailVerificationAgain(email, full_name, user_id) {
        try {
            const url = `users/send-email-verification`;
            const response = await apiClient.post(url,
                {
                    email: email,
                    full_name: full_name,
                    user_id: user_id
                }
            );
            return response;
        } catch (error) {
            return error.response;
        }
    }
}