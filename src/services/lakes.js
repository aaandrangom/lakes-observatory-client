import apiClient from './client.js';

export const Lakes = {
    async getAll() {
        try {
            const url = 'lakes/';
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
            const url = `lakes/${id}`;
            const response = await apiClient.get(
                url
            );
            return response;
        } catch (error) {
            return error.response;
        }
    },

    async update(id, updates) {
        try {
            const url = `lakes/${id}`;
            const response = await apiClient.put(
                url,
                updates,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                }
            );
            return response;
        } catch (error) {
            return error.response;
        }
    },

    async create(data) {
        try {
            const url = `lakes`;
            const response = await apiClient.post(
                url,
                data,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                }
            );
            return response;
        } catch (error) {
            return error.response;
        }
    },

    async delete(id) {
        try {
            const url = `lakes/${id}`;
            const response = await apiClient.delete(
                url
            );
            return response;
        } catch (error) {
            return error.response;
        }
    },

    async getProvinces() {
        try {
            const url = 'others/provinces';
            const response = await apiClient.get(
                url
            );
            return response;
        } catch (error) {
            return error.response;
        }
    },

    async getCities(province_id) {
        try {
            const url = `others/provinces/cities/${province_id}`;
            const response = await apiClient.get(
                url
            );
            return response;
        } catch (error) {
            return error.response;
        }
    }
}