import { useState, type FormEvent } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import type { UserCreate } from "./singup.types"
import { useAuth } from "../../context/AuthContext"
import Popup from "../../shared/components/Popup"
import EventMessage from "../../shared/components/EventMessage"

type SignupParams = {
    displayFlagHandler:React.Dispatch<boolean>;
}

function Signup({displayFlagHandler}:SignupParams){
    //Helpers
    const createEmptyUser = ()=> {
        return {'username':'', 'password':'', 'email':''}
    }
    const navigate = useNavigate()
    const {API_URL} = useAuth()!

    //State
    const [creating, setCreating] = useState<boolean>(false)
    const [userForm, setUserForm] = useState<UserCreate>(createEmptyUser())
    const [error, setError] = useState<string|null>(null)

    // Handlers
    const handleSubmit = async (e:FormEvent) => {
        e.preventDefault() 
        setError(null)
        setCreating(true)
        try{
            const response = await axios.post(`${API_URL}/api/users`, userForm)
            console.log(`Response ${response}`)
            setUserForm(createEmptyUser())
            displayFlagHandler(false)
            navigate('/signin')
        }catch(error){
            console.log(error)
            if (axios.isAxiosError(error)) {
                setError(String(JSON.stringify(error.response?.data)))
            } else {
                setError('An unexpected error occurred')
            }
            setCreating(false)
        }
    }

    const handleFormState = ()=>{
        let state = false
        if(creating || !userForm.username.length || !userForm.password.length || !userForm.email.length){
            state = true
        }
        return state
    }

    return(
        <Popup title="Signup" onClose={()=> displayFlagHandler(false)}>
            <form onSubmit={(e) => handleSubmit(e)}>
                <div className="row g-3 justify-content-center">
                    <div className="col-12">
                        <label htmlFor="username">Username</label>
                        <input type="text" name="username" id="username" onChange={(e) => setUserForm({...userForm, 'username':e.target.value})}/>
                    </div>
                    <div className="col-12">
                        <label htmlFor="email">Email</label>
                        <input type="text" name="email" id="email" onChange={(e)=> setUserForm({...userForm, 'email':e.target.value})}/>
                    </div>
                    <div className="col-12">
                        <label htmlFor="first_name">First name</label>
                        <input type="text" name="first_name" id="first_name" onChange={(e)=> setUserForm({...userForm, 'first_name':e.target.value})}/>
                    </div>
                    <div className="col-12">
                        <label htmlFor="last_name">Last Name</label>
                        <input type="text" name="last_name" id="last_name" onChange={(e)=> setUserForm({...userForm, 'last_name':e.target.value})}/>
                    </div>
                    <div className="col-12">
                        <label htmlFor="password">Password</label>
                        <input type="password" name="password" id="password" onChange={(e)=> setUserForm({...userForm, 'password':e.target.value})}/>
                    </div>
                    {error &&
                        <div className="col-12">
                            <EventMessage message={error} style="error compact"></EventMessage>
                        </div>
                    }
                    <div className="col-8">
                        <button className="btn-full" disabled={handleFormState()}>Submit</button>
                    </div>
                </div>
            </form>
        </Popup>
    )
}

export default Signup