import apiClient from './client.js';

export const Logs = {
    async getAll(user_id, limit, page) {
        try {
            const url = 'logs';
            const response = await apiClient.get(url, {
                params: {
                    user_id,
                    limit,
                    page
                }
            });
            return response;
        } catch (error) {
            return error.response;
        }
    }
}