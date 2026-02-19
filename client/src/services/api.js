import axios from 'axios';

const api = axios.create({
    baseURL: '/api', // Proxy will handle localhost:5001
    headers: {
        'Content-Type': 'application/json'
    }
});

export const fileService = {
    getFileSystem: () => api.get('/files'),
    createFileNode: (name, type, parentId) => api.post('/files', { name, type, parentId }),
    deleteFileNode: (id) => api.delete(`/files/${id}`),
    updateFileNode: (id, data) => api.put(`/files/${id}`, data),
    getProblem: (fileId) => api.get(`/files/${fileId}/problem`),
    updateProblem: (fileId, data) => api.put(`/files/${fileId}/problem`, data)
};

export default api;
