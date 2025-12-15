import axios from 'axios';
import { API_URL } from '../env/env.js';

const axiosInstance = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

axiosInstance.interceptors.request.use(
    (config) => {
        try {
            const raw = localStorage.getItem('persist:auth');
            console.log(raw, 'raw');
            if (raw) {
                const parsed = JSON.parse(raw);
                const auth = {
                    token: parsed.token ? JSON.parse(parsed.token) : null,
                    user: parsed.user ? JSON.parse(parsed.user) : null,
                };

                if (auth.token) {
                    config.headers['Authorization'] = `Bearer ${auth.token}`;
                }

                if (auth.user) {
                    config.headers['X-User'] = JSON.stringify(auth.user);
                }
            }
        } catch (error) {
            console.warn('Failed to parse auth from localStorage', error);
        }

        return config;
    },
    (error) => Promise.reject(error)
);

export default axiosInstance;
