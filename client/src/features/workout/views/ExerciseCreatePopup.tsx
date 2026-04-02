import { useState, type FormEvent } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "../../../context/AuthContext";
import type { ExerciseCreate } from "../../exercises/exercises.types";
import Popup from "../../../shared/components/Popup";
import EventMessage from "../../../shared/components/EventMessage";

type ExerciseListCreateParams = {
    displayHandler:React.Dispatch<boolean>;
    errorHandler:React.Dispatch<string|null>;
    workoutId?:number;
}

function ExerciseCreatePopup({displayHandler, errorHandler, workoutId}:ExerciseListCreateParams){

    //Helpers
    const set_exercise = ()=>{
        if(workoutId){
            return {category:'str', difficulty:'ext', workouts:[workoutId]}
        }
        return {category:'str', difficulty:'ext'}
    }

    //Data bounded states
    const [exercise, setExercise] = useState<ExerciseCreate>(set_exercise())
    const {axios_instance} = useAuth()!
    const queryClient = useQueryClient()

    //Data fetch
    const {mutate, isError, isPending, error} = useMutation(
        {
            mutationKey:['exerciseCreate'],
            mutationFn: (exercise:ExerciseCreate)=>{
                const response = axios_instance.post('api/exercises', exercise).then(r=>r)
                console.log(response)
                return response
            },
            onSuccess: async ()=>{
                setExercise(set_exercise())
                await Promise.all([
                    queryClient.invalidateQueries({
                        queryKey:['workout', workoutId, 'exercises']
                    }),
                    queryClient.invalidateQueries({
                        queryKey:['workout', workoutId, 'sessions']
                    }),
                    //To be deleted!! This dependency derives from loading exercises within the exerciseList component.
                    queryClient.invalidateQueries({
                        queryKey:['workoutExercises']
                    })
                ])
                displayHandler(false)
            },
            onError: (error)=>{
                errorHandler(error?.message)
            }
        }   
    )

    //Handlers
    const submitHander = (e:FormEvent)=>{
       e.preventDefault()
       mutate(exercise)
    }

    const handleFormStatus = ()=>{
        let status = true
        if(exercise.name && exercise.description && exercise.category){
            status = false
        }
        return status
    }

    return(
        <Popup title="New exercise" onClose={()=> {displayHandler(false); errorHandler(null);}}>
            <form onSubmit={(e) => submitHander(e)}>
                <div className="mb-1">
  
                    <label htmlFor="name" className="form-label">Name</label>
                    <input type="text" className="form-control" name="name" id="name" onChange={(e) => setExercise({...exercise, name:e.target.value})}/>

                </div>
                <div className="mb-1">
                    <label htmlFor="description" className="form-label">Description</label>
                    <textarea name="description" className="form-control" id="description" onChange={(e)=> setExercise({...exercise, description:e.target.value})}></textarea>
                </div>

                <div className="mb-1">
                    <label htmlFor="difficulty" className="form-label">Difficulty</label>
                    <select name="difficulty" className="form-control" id="difficulty" onChange={(e) => setExercise({...exercise, difficulty:e.target.value})}>
                        <option value="ext">Extreme</option>
                        <option value="hig">High</option>
                        <option value="med">Medium</option>
                        <option value="low">Low</option>
                    </select>
                </div>
                <div className="mb-1">
                        <label htmlFor="category" className="form-label">Category</label>
                        <select name="category" className="form-control" id="category" value={exercise.category} onChange={(e) => setExercise({...exercise, category:e.target.value})}>
                            <option value="str">Strength</option>
                            <option value="oth">Other</option>
                            <option value="car">Cardio</option>
                            <option value="flx">Flexibility</option>
                            <option value="res">Resistance</option>
                        </select>
                </div>
                {exercise.category === 'str' ?
                    <>
                        <div className="mb-1">
                            <label htmlFor="focus_area" className="form-label">Focus area</label>
                            <select name="focus_area" className="form-control" id="focus_area" value={exercise.focus_area} onChange={(e) => setExercise({...exercise, focus_area:e.target.value})}>
                                <option value="arm">Arms</option>
                                <option value="bac">Back</option>
                                <option value="cht">Chest</option>
                                <option value="leg">Legs</option>
                                <option value="shd">Shoulder</option>
                                <option value="oth">Other</option>
                            </select>
                        </div>
                        <div className="mb-1">
                            <label htmlFor="series" className="form-label">Series (units)</label>
                            <input type="number" className="form-control" name="series" id="series" onChange={(e) => setExercise({...exercise, series: Number(e.target.value)})}/>
                        </div>
                        <div className="mb-1">
                            <label htmlFor="repetitions" className="form-label">Reps (units)</label>
                            <input type="number" className="form-control" name="repetitions" id="repetitions" onChange={(e) => setExercise({...exercise, repetitions: Number(e.target.value)})}/>
                        </div>
                    </>
                : exercise.category === 'car' ?
                    <>
                    <div className="mb-1">
                        <label htmlFor="distance" className="form-label">Distance (km)</label>
                        <input type="number" className="form-control" name="distance" id="distance" onChange={(e) => setExercise({...exercise, distance: Number(e.target.value)})}/>
                    </div>      
                    <div className="mb-1">
                        <label htmlFor="duratin" className="form-label">Duration (minutes)</label>
                        <input type="number" className="form-control" name="duration" id="duration" onChange={(e) => setExercise({...exercise, duration: Number(e.target.value)})}/>
                    </div>              
                    </>
                : exercise.category === 'flx'
                }
                {isError &&
                    <EventMessage message={error.message} style="error compact"></EventMessage>
                }
                    <div className="row justify-content-center">
                        <div className="col-6">
                            <button className="btn-full" disabled={isPending || handleFormStatus()}>Create</button>
                        </div>
                </div>
            </form>
        </Popup>
    )
}

export default ExerciseCreatePopup