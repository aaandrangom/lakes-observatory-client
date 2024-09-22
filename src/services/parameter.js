import apiClient from './client.js';

export const Parameters = {
    async getAll() {
        try {
            const url = 'parameters/';
            const response = await apiClient.get(
                url
            );
            return response;
        } catch (error) {
            return error.response;
        }
    },

    async getById(id) {
        try {
            const url = `parameters/${id}`;
            const response = await apiClient.get(
                url
            );
            return response;
        } catch (error) {
            return error.response;
        }
    },

    async create(data) {
        try {
            const url = `parameters`;
            const response = await apiClient.post(
                url,
                data
            );
            return response;
        } catch (error) {
            return error.response;
        }
    },

    async update(id, updates) {
        try {
            const url = `parameters/${id}`;
            const response = await apiClient.put(
                url,
                updates
            );
            return response;
        } catch (error) {
            return error.response;
        }
    },

    async delete(id) {
        try {
            const url = `parameters/${id}`;
            const response = await apiClient.delete(
                url
            );
            return response;
        } catch (error) {
            return error.response;
        }
    }
}