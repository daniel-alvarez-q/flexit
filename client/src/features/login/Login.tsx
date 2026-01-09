import {useState,useEffect} from "react"
import instance from "../../auth_interceptor"
import type {UserLoginType}  from "./login.types"

function Login(){
    
    const [token,setToken] = useState(null)
    const [error,setError] = useState(null)
    var data:UserLoginType

    useEffect(() => {
        if (token) {
            console.log('Token updated:', token)
        }
    }, [token])

    function login(loginData:FormData){
        data = {
            'username': loginData.get('username'),
            'password': loginData.get('password'),
        }
        instance.post('/login', data).then(response=>{
            console.log(response.data)
            setToken(response.data.token)
        }).catch(error => {
            console.log(`Error code ${error.status}: ${error.response.data.error}`)
        })
    }

    return(
        <>
            <div className="row">
                <h1>Login</h1>
            </div>
            <div className="row">
                <form action={login} className="form-md">
                    <div className="form-group">
                        <div className="form-row">
                            <label htmlFor="username">Username</label>
                        </div>
                        <div className="form-row">
                            <input type="text" name="username"/>
                        </div>
                    </div>
                    <div className="form-group">
                        <div className="form-row">
                            <label htmlFor="password">Password</label>
                        </div>
                        <div className="form-row">
                            <input type="text" name="password"/>
                        </div>
                    </div>
                    <div className="form-group">
                        <button>Login</button>
                    </div>
                </form>
            </div>
        </>
    )
}

export default Login