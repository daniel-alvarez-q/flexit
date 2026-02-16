import {createContext, useContext, useState, useEffect, useMemo, type ReactNode} from "react";
import { readRuntimeConfig } from "../config/runtimeConfig";
import axios, { type AxiosInstance } from 'axios'

type AuthContextType = {
    login: (credentials: LoginCredentials) => Promise<void>;
    logout: () => Promise<void>;
    user: string | null;
    API_URL:string;
    axios_instance:AxiosInstance;
} | null;

type AuthProviderProps = { children: ReactNode};

type LoginCredentials = {
    username: string;
    password: string;
};

//Create empty context
const AuthContext = createContext<AuthContextType>(null)

export const AuthProvider = ({children}:AuthProviderProps) => {
    const [user, setUser] = useState<string | null>(null)
    const [loading, setLoading] = useState(true)
    const environment_config = useMemo(()=> readRuntimeConfig(),[])
    const API_URL:string = environment_config.API_URL

    //Axios instance 
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

    //Check localStorage for existing user on app load
    useEffect(()=>{
        const storedUser = localStorage.getItem('username');
        const tokenExpiry = localStorage.getItem('access-token-expiration')

        if (tokenExpiry){
            if(new Date() >= new Date(tokenExpiry)){
                console.log(`Auth token has expired, status: ${loading}`) //Unnecessary use of loading, to be removed
                localStorage.removeItem('access-token')
                localStorage.removeItem('access-token-expiration')
                localStorage.removeItem('username')
                user!==null ? setUser(null) : user   
                setLoading(true)
            }
        }

        if(storedUser){
            setUser(storedUser);
        };
        setLoading(false)
    },[])

    //Login function (store tokens in localStorage)
    const login = async (credentials: LoginCredentials) => {
        //Send credentials (username and password)
        try{
            const response = await axios.post(`${API_URL}/login`, credentials);
            const {token,expiry,user} = response.data
            //Save token in local storage
            localStorage.setItem('access-token',token)
            localStorage.setItem('access-token-expiration', expiry)
            localStorage.setItem('username', user.username)
            setUser(user.username);
        }catch(error){
            throw error
        }
    };

    const logout = async () => {
        localStorage.removeItem('access-token')
        localStorage.removeItem('access-token-expiration')
        localStorage.removeItem('username')
        user!==null ? setUser(null) : user
    }

    return (
        <AuthContext.Provider value={{login, logout, user, API_URL, axios_instance}}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = ()=>{
    return useContext(AuthContext);
}

