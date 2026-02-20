import { useState } from "react"
import { useAuth } from "../../../context/AuthContext"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import type { WorkoutCreate } from "../workouts.types"
import EventMessage from "../../../shared/components/EventMessage"
import Popup from "../../../shared/components/Popup"

//Props type
type WorkoutCreateProps = {
    error:string|null,
    errorHandler:React.Dispatch<React.SetStateAction<string | null>>,
    displayFlagHandler:React.Dispatch<React.SetStateAction<boolean>>
}

//Component function
function WorkoutCreateForm ({error, errorHandler, displayFlagHandler}:WorkoutCreateProps) {

    //Helpers
    const initialize_workout = ()=>{
        return {name:'', description:'', difficulty:''}
    }

    //Data-bounded states
    const {axios_instance} = useAuth()!
    const [newWorkout, setNewWorkout] = useState<WorkoutCreate>(initialize_workout())
    const queryClient = useQueryClient()

    //Logic

    const create_workout = async ()=>{
        const response = await axios_instance.post('api/workouts',newWorkout).then(r => r);
        return response.data
    }

    const workout_mutation = useMutation({
            mutationFn: create_workout,
            onSuccess:(data)=>{
                console.log(data)
                queryClient.invalidateQueries({queryKey:['workouts']})
                displayFlagHandler(false)
            },
            onError:(error)=>{
                console.log(error)
                errorHandler(error.message)
            },

        })

    const handleWorkoutSubmit = async (e:React.FormEvent)=>{
        e.preventDefault();
        workout_mutation.mutate()
        
    }

    const handleFormState = () =>{
        let state:boolean = false
        if(!newWorkout.name.length || !newWorkout.difficulty.length){
            state=true
        }
        return state
    }

    return <Popup title="New workout" onClose={()=> {displayFlagHandler(false); errorHandler(null)}}>   
                <form onSubmit={handleWorkoutSubmit}>
                    <div className="form-group">
                        <div className="form-row">
                            <label htmlFor="name">Workout title</label>
                        </div>
                        <div className="form-row">
                            <input type="text" name="name" id="name" onChange={(e) => setNewWorkout({...newWorkout, name:e.target.value})}/>
                        </div>
                    </div>
                    <div className="form-group">
                        <div className="form-row">
                            <label htmlFor="">Workout description</label>
                        </div>
                        <div className="form-row">
                            <textarea  name="description" id="description" onChange={(e) => setNewWorkout({...newWorkout, description:e.target.value})}></textarea>
                        </div>
                    </div>
                    <div className="form-group">
                        <div className="form-row">
                            <label htmlFor="difficulty">Difficulty</label>
                        </div>
                        <div className="form-row">
                            <select name="difficulty" id="difficulty" onChange={(e) => setNewWorkout({...newWorkout, difficulty:e.target.value})}>
                                <option value="ext">Extreme</option>
                                <option value="hig">High</option>
                                <option value="med">Medium</option>
                                <option value="low">Low</option>
                            </select>
                        </div>
                    </div>
                    <div className="form-group">
                        <div className="form-row">
                            <label htmlFor="source_url">Source url</label>
                        </div>
                        <div className="form-row">
                            <input type="url" name="source_url" id="source_url" onChange={(e) => setNewWorkout({...newWorkout, source_url:e.target.value})}/>
                        </div>
                    </div>
                    { error &&
                        <div className="form-group">
                            <div className="form-row">
                                <EventMessage message={error} style="error compact"></EventMessage>
                            </div>
                        </div>
                    }
                    <div className="form-group">
                        <div className="form-row">
                            <button className="btn-full" disabled={handleFormState()}>Create</button>
                        </div>
                    </div>
                </form>
            </Popup>
}

export default WorkoutCreateForm