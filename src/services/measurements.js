import apiClient from './client.js';

export const Measurements = {
    async getAll() {
        try {
            const url = 'measurements/';
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
            const url = `measurements/${id}`;
            const response = await apiClient.put(
                url,
                updates
            );
            return response;
        } catch (error) {
            return error.response;
        }
    },

    async getYears() {
        try {
            const url = 'measurements/years';
            const response = await apiClient.get(
                url
            );
            return response;
        } catch (error) {
            return error.response;
        }
    },

    async getValuesByYear(lake_id, parameter_id, year) {
        try {
            const url = `measurements/${lake_id}/${parameter_id}/${year}`;
            const response = await apiClient.get(
                url
            );
            return response;
        } catch (error) {
            return error.response;
        }
    }
}