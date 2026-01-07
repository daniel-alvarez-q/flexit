import axios from "axios";

const instance = axios.create({
    baseURL: 'http://127.0.0.1:8000/',
});

instance.interceptors.request.use(
    config => {
        //Add token or custom headers if needed
        config.headers['Authorization'] = 'Bearer 74fd5d5d7d1b1ff6685b58917f0b477d76db80d3b5526d25ad1a407ca62c82a2';
        return config;
    },
    error => {
        return Promise.reject(error)
    }
);

instance.interceptors.response.use(
    response => response,
    error => {
        if (error.response && error.response.status === 401){
            //Handle unauthorized access globally
            console.error('Unauthorized access');
        }
        return Promise.reject(error);
    }
);

export default instance;