import {createContext, useContext, useState, useEffect} from "react";
import type { ReactNode } from "react";
import axios from 'axios'

const BASE_URL:string = `${import.meta.env.VITE_BACKEND_URL}`

type AuthContextType = {
    login: (credentials: LoginCredentials) => Promise<void>;
    logout: () => Promise<void>;
    user: string | null
} | null;

type AuthProviderProps = { children: ReactNode };

type LoginCredentials = {
    username: string;
    password: string;
};

//Create empty context
const AuthContext = createContext<AuthContextType>(null)

export const AuthProvider = ({children}:AuthProviderProps) => {
    const [user, setUser] = useState<string | null>(null)
    const [loading, setLoading] = useState(true)

    //Check localStorage for existing user on app load
    useEffect(()=>{
        const storedUser = localStorage.getItem('username');
        const tokenExpiry = localStorage.getItem('access-token-expiration')

        if (tokenExpiry){
            if(new Date() >= new Date(tokenExpiry)){
                console.log('Auth token has expired')
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
            const response = await axios.post(`${BASE_URL}/login`, credentials);
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
        <AuthContext.Provider value={{login, logout, user}}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = ()=>{
    return useContext(AuthContext);
}

