import axios from "axios";

const api = axios.create({
  baseURL: "/api", // Proxy will handle localhost:5001
  headers: {
    "Content-Type": "application/json",
  },
});

export const fileService = {
  getFileSystem: () => api.get("/files"),
  createFileNode: (name, type, parentId) =>
    api.post("/files", { name, type, parentId }),
  deleteFileNode: (id) => api.delete(`/files/${id}`),
  updateFileNode: (id, data) => api.put(`/files/${id}`, data),
  getProblem: (fileId) => api.get(`/problems/${fileId}`),
  createProblem: (fileId) => api.post("/problems", { fileId }),
  updateProblem: (fileId, data) => api.put(`/problems/${fileId}`, data),
  analyzeCode: (code, language) => api.post("/ai/analyze", { code, language }),
  importProblem: (url) => api.post("/problems/import", { url }),
};

export default api;
