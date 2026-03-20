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
                <div className="form-group">
                    <div className="form-row">
                        <label htmlFor="name">Name</label>
                    </div>
                    <div className="form-row">
                        <input type="text" name="name" id="name" onChange={(e) => setExercise({...exercise, name:e.target.value})}/>
                    </div>
                </div>
                <div className="form-group">
                    <div className="form-row">
                        <label htmlFor="description">Description</label>
                    </div>
                    <div className="form-row">
                        <textarea name="description" id="description" onChange={(e)=> setExercise({...exercise, description:e.target.value})}></textarea>
                    </div>
                </div>
                <div className="form-group">
                    <div className="form-row">
                        <label htmlFor="difficulty">Difficulty</label>
                    </div>
                    <div className="form-row">
                        <select name="difficulty" id="difficulty" onChange={(e) => setExercise({...exercise, difficulty:e.target.value})}>
                            <option value="ext">Extreme</option>
                            <option value="hig">High</option>
                            <option value="med">Medium</option>
                            <option value="low">Low</option>

                        </select>
                    </div>
                </div>
                <div className="form-group">
                    <div className="form-row">
                        <label htmlFor="category">Category</label>
                    </div>
                    <div className="form-row">
                        <select name="category" id="category" value={exercise.category} onChange={(e) => setExercise({...exercise, category:e.target.value})}>
                            <option value="str">Strength</option>
                            <option value="oth">Other</option>
                            <option value="car">Cardio</option>
                            <option value="flx">Flexibility</option>
                            <option value="res">Resistance</option>
                        </select>
                    </div>
                </div>
                {exercise.category === 'str' ?
                    <>
                        <div className="form-group">
                            <div className="form-row">
                                <label htmlFor="focus_area">Focus area</label>
                            </div>
                            <div className="form-row">
                                <select name="focus_area" id="focus_area" value={exercise.focus_area} onChange={(e) => setExercise({...exercise, focus_area:e.target.value})}>
                                    <option value="arm">Arms</option>
                                    <option value="bac">Back</option>
                                    <option value="cht">Chest</option>
                                    <option value="leg">Legs</option>
                                    <option value="shd">Shoulder</option>
                                    <option value="oth">Other</option>
                                </select>
                            </div>
                        </div>
                        <div className="form-group">
                            <div className="form-row">
                                <label htmlFor="series">Recommended series</label>
                            </div>
                            <div className="form-row">
                                <input type="number" name="series" id="series" onChange={(e) => setExercise({...exercise, series: Number(e.target.value)})}/>
                            </div>
                        </div>
                        <div className="form-group">
                            <div className="form-row">
                                <label htmlFor="repetitions">Recommended reps</label>
                            </div>
                            <div className="form-row">
                                <input type="number" name="repetitions" id="repetitions" onChange={(e) => setExercise({...exercise, repetitions: Number(e.target.value)})}/>
                            </div>
                        </div>
                        <div className="form-group">
                            <div className="form-row">
                                <label htmlFor="weight">Recommended weight</label>
                            </div>
                            <div className="form-row">
                                <input type="number" name="weight" id="weight" onChange={(e) => setExercise({...exercise, weight: Number(e.target.value)})}/>
                            </div>
                        </div>
                    </>
                : exercise.category === 'car' ?
                    <>
                    <div className="form-group">
                        <div className="form-row">
                            <label htmlFor="distance">Recommended distance (km)</label>
                        </div>
                        <div className="form-row">
                            <input type="number" name="distance" id="distance" onChange={(e) => setExercise({...exercise, distance: Number(e.target.value)})}/>
                        </div>
                    </div>      
                    <div className="form-group">
                        <div className="form-row">
                            <label htmlFor="duratin">Recommended duration (minutes)</label>
                        </div>
                        <div className="form-row">
                            <input type="number" name="duration" id="duration" onChange={(e) => setExercise({...exercise, duration: Number(e.target.value)})}/>
                        </div>
                    </div>              
                    </>
                : exercise.category === 'flx'
                }
                {isError &&
                    <EventMessage message={error.message} style="error compact"></EventMessage>
                }
                <div className="form-group">
                    <div className="row justify-content-center">
                        <div className="col-8">
                            <button className="btn-full" disabled={isPending || handleFormStatus()}>Create</button>
                        </div>
                    </div>
                </div>
            </form>
        </Popup>
    )
}

export default ExerciseCreatePopup