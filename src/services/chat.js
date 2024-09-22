import apiClient from './client.js';

export const Chat = {
    async chat(message) {
        try {
            const url = `gemini/chat`;
            const response = await apiClient.post(
                url,
                {
                    message: message
                }
            );
            return response;
        } catch (error) {
            return error.response;
        }
    }
}