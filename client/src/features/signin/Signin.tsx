import { useState, type FormEvent } from "react"
import { useAuth } from "../../context/AuthContext"
import { useNavigate } from "react-router-dom";
import Popup from "../../shared/components/Popup";
import EventMessage from "../../shared/components/EventMessage";

type SigninParams = {
    displayHandler:React.Dispatch<boolean>
}

function Signin({displayHandler}:SigninParams){

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
            displayHandler(false)
            navigate(0) //Reloads current route, courtesy of react-router!
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
        <Popup title="Sigin" onClose={()=> displayHandler(false)}>
            <form onSubmit={(e) => handleSubmit(e)}>
                <div className="row g-3 justify-content-center">
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
                    <div className="col-8">
                        <button className="btn-full" disabled={logging
                            || credentials.username.length === 0 
                            || credentials.password.length === 0}>Sign in</button>
                    </div>
                </div>
            </form>
        </Popup>
    )
}

export default Signin