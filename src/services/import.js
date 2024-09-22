import apiClient from './client.js';

export const Imports = {
    async uploadExcel(file) {
        try {
            const url = `import/upload`;
            const response = await apiClient.post(
                url,
                file,
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
    }
}