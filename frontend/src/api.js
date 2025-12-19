import axios from 'axios';

const api = axios.create({
  baseURL: 'https://canvas-builder-backend.onrender.com/api/canvas'
});

export default api;
