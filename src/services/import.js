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
    },

    async generateExcel(selectedLake, selectedParameter, selectedYear) {
        try {
            const endPoitn = 'import/excel/generate';
            const response = await apiClient.get(endPoitn, {
                params: {
                    lakeId: selectedLake,
                    parameterId: selectedParameter,
                    year: selectedYear
                },
                responseType: 'blob'
            });


            const contentDisposition = response.headers['content-disposition'];
            console.log('Content-Disposition header:', contentDisposition);

            let fileName = 'file.xlsx';

            if (contentDisposition) {
                const filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
                const matches = filenameRegex.exec(contentDisposition);
                console.log('Regex matches:', matches);
                if (matches != null && matches[1]) {
                    fileName = matches[1].replace(/['"]/g, '');
                }
            }


            const blob = new Blob([response.data],
                { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', fileName);
            document.body.appendChild(link);
            link.click();
            link.parentNode.removeChild(link);
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Error generating Excel:', error);
            return error.response;
        }
    }
}