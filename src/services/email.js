import apiClient from './client.js';

export const Email = {
    async getOne() {
        try {
            const url = 'email-sender-config';
            const response = await apiClient.get(url);
            return response;
        } catch (error) {
            return error.response;
        }
    },

    async decryptPassword(password) {
        try {
            const url = 'email-sender-config/decrypt';
            const response = await apiClient.post(url,
                {
                    password: password,
                }
            );
            return response;
        } catch (error) {
            return error.response;
        }
    },

    async testEmail(data) {
        try {
            const url = 'email-sender-config/test-email';
            const response = await apiClient.post(url, data);
            return response;
        } catch (error) {
            return error.response;
        }
    },

    async post(data) {
        try {
            const url = 'email-sender-config';
            const response = await apiClient.post(
                url,
                data
            );
            return response;
        } catch (error) {
            return error.response;
        }
    },

    async update(data, id) {
        try {
            const url = `email-sender-config/${id}`;
            const response = await apiClient.put(
                url,
                data
            );
            return response;
        } catch (error) {
            return error.response;
        }
    },

    async delete(id) {
        try {
            const url = `email-sender-config/${id}`;
            const response = await apiClient.delete(
                url
            );
            return response;
        } catch (error) {
            return error.response;
        }
    }
}