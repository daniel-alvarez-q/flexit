import axios from 'axios'

const axios_instance = axios.create({
    baseURL: 'http://127.0.0.1:8000/',
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