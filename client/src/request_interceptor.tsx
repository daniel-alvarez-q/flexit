import axios from 'axios'
import { useAuth } from './context/AuthContext';

const { API_URL } = useAuth()!

const axios_instance = axios.create({
    baseURL: API_URL,
});

axios_instance.interceptors.request.use(
    config => {
        //Add token or custom headers if needed
        config.headers['Authorization'] = `Bearer ${localStorage.getItem('access-token')}`;
        return config
    },
    error => {
        return Promise.reject(error)
    }
);

axios_instance.interceptors.response.use(
    response => response,
    error => {
        if (error.response && error.response.status === 401){
            //Handle unauthorized access globally
            console.error('Unauthorized access');
        }
        return Promise.reject(error);
    }
);

export default axios_instance;