import { useState, type FormEvent } from "react"
import { useAuth } from "../../context/AuthContext"
import { useNavigate } from "react-router-dom";
import EventMessage from "../../shared/components/EventMessage";

function Signin(){

    const navigate = useNavigate();
    const [logging, setLogging] = useState<boolean>(false)
    const { login } = useAuth()!;
    const [credentials,setCredentials] = useState({
        'username':'',
        'password':'',
    });
    const [error, setError] = useState<string | null>(null)

    const handleSubmit = async (e:FormEvent) => {
        e.preventDefault()
        setLogging(true)
        setError(null)
        try{
            await login(credentials);
            navigate('/');
        }catch(error:any){
            setCredentials({...credentials, password:''})
            if (error.response){
                setError(`Error code ${error.status}: ${error.response.data.error}`)
            }else{
                setError('Network error or no response')
            }
            setLogging(false)
        }
    }  

    return(
        <>
            <div className="row">
                <div className="template-title">Sign in</div>
            </div>
            <div className="row justify-content-center">
                <div className="col-12 col-sm-6">
                    <form onSubmit={(e) => handleSubmit(e)}>
                        <div className="row g-3">
                            <div className="col-12">
                                <label htmlFor="username">Username</label>
                                <input 
                                    type="text" 
                                    value={credentials.username} 
                                    name="username"
                                    onChange={(e)=>setCredentials({...credentials, username:e.target.value})}
                                />
                            </div>
                            <div className="col-12">
                                <label htmlFor="password">Password</label>
                                <input 
                                        type="password" 
                                        value={credentials.password} 
                                        name="password"
                                        onChange={(e)=>setCredentials({...credentials, password:e.target.value})}
                                    />
                            </div>
                            {error && 
                                    <div className="col-12">
                                        <EventMessage message={error} style='error compact'></EventMessage>
                                    </div>
                            }
                            <div className="col-12">
                                <button className="btn-full" disabled={logging
                                    || credentials.username.length === 0 
                                    || credentials.password.length === 0}>Sign in</button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </>
    )
}

export default Signin