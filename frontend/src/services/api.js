// src/services/api.js
import axios from 'axios';

// Aqui definimos o endereço padrão do nosso Backend Spring Boot
const api = axios.create({
    baseURL: 'http://localhost:8080/api'
});

export default api;