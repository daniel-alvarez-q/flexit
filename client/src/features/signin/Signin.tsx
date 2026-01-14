import { useState } from "react"
import { useAuth } from "../../context/AuthContext"
import { useNavigate } from "react-router-dom";

function Signin(){

    const navigate = useNavigate()

    const { login, user } = useAuth()!;
    
    const [credentials,setCredentials] = useState({
        'username':'',
        'password':'',
    })

    const handleSubmit = async (form:FormData) => {
        try{
            await login(credentials);
            navigate('/');
        }catch(error:any){
            if (error.response){
                console.error(`Error code ${error.status}: ${error.response.data.error}`)
            }else{
                console.error('Network error or no response')
            }
        }
        // navigate('/')
    }  

    return(
        <>
            <div className="row">
                <h1>Login</h1>
            </div>
            <div className="row">
                <form action={handleSubmit} className="form-md">
                    <div className="form-group">
                        <div className="form-row">
                            <label htmlFor="username">Username</label>
                        </div>
                        <div className="form-row">
                            <input 
                                type="text" 
                                value={credentials.username} 
                                name="username"
                                onChange={(e)=>setCredentials({...credentials, username:e.target.value})}
                            />
                        </div>
                    </div>
                    <div className="form-group">
                        <div className="form-row">
                            <label htmlFor="password">Password</label>
                        </div>
                        <div className="form-row">
                            <input 
                                type="password" 
                                value={credentials.password} 
                                name="password"
                                onChange={(e)=>setCredentials({...credentials, password:e.target.value})}
                            />
                        </div>
                    </div>
                    <div className="form-group">
                        <button>Sign in</button>
                    </div>
                </form>
            </div>
        </>
    )
}

export default Signin