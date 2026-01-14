import { useState } from "react"
import { useAuth } from "../../context/AuthContext"
import { useNavigate } from "react-router-dom";
import EventMessage from "../../shared/components/EventMessage";

function Signin(){

    const navigate = useNavigate();
    const { login } = useAuth()!;
    const [credentials,setCredentials] = useState({
        'username':'',
        'password':'',
    });
    const [status, setStatus] = useState('typing')
    const [error, setError] = useState<string | null>(null)

    const handleSubmit = async (form:FormData) => {
        status!=='submitting' ? setStatus('submitting') : status
        try{
            await login(credentials);
            navigate('/');
        }catch(error:any){
            setStatus('typing')
            setCredentials({...credentials, password:''})
            if (error.response){
                setError(`Error code ${error.status}: ${error.response.data.error}`)
            }else{
                setError('Network error or no response')
            }
        }
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
                    {error !== null && 
                        <EventMessage message={error}></EventMessage>
                    }
                    <div className="form-group">
                        <button disabled={status==='submitting' 
                            || credentials.username.length === 0 
                            || credentials.password.length === 0}>Sign in</button>
                    </div>
                </form>
            </div>
        </>
    )
}

export default Signin