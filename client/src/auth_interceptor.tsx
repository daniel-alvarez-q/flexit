import axios from "axios";

const instance = axios.create({
    baseURL: 'http://127.0.0.1:8000/',
});

instance.interceptors.request.use(
    config => {
        //Add token or custom headers if needed
        config.headers['Authorization'] = 'Bearer fd5194198bb7cd54909fccbe1e3e9c5d4b279053d7cfec2fcd4add4716c13b9b';
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