import { useEffect, useState, type FormEvent } from "react";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { useAuth } from "../../../context/AuthContext";
import type { Exercise } from "../../exercises/exercises.types";
import type { WorkoutSession, ExerciseLog } from "../workout.types";
import Popup from "../../../shared/components/Popup";
import EventMessage from "../../../shared/components/EventMessage";

type exerciseLogCreatePopupProps = {
    workoutId:number;
    exercises:Exercise[];
    session:WorkoutSession;
    popupHandler:React.Dispatch<boolean>
}

function ExerciseLogCreatePopup({workoutId,exercises,session,popupHandler}:exerciseLogCreatePopupProps){

    const [formError, setFormError] = useState<string|null>(null)
    const [newLog, setNewLog] = useState<Partial<ExerciseLog>>({})

    const {axios_instance} = useAuth()!
    const queryClient = useQueryClient()

    //May not be needed! Check if it can be replaced by using "find" method on default array
    const processed_exercises:Record<number,Exercise> = exercises.reduce((acc:Record<number,Exercise>,exercise:Exercise) =>{
        acc[exercise.id] = exercise
        return acc
    },{})

    const create_exercise_log = async(log:Partial<ExerciseLog>) =>{
        setFormError(null)
        return await axios_instance.post('api/exerciselogs', log).then(r=>r)
    }

    const logMutation = useMutation({
            mutationFn: create_exercise_log
        })
    
    useEffect(()=>{
        if(logMutation.isSuccess){
            popupHandler(false)
            setNewLog({})
            queryClient.invalidateQueries({
                queryKey:['workout', workoutId, 'sessions']
            })
        }
    },[logMutation.isSuccess, queryClient, workoutId])

    useEffect(()=>{
        if(logMutation.isError){
            setFormError(logMutation.error.message)
        }
    },[logMutation.isError, queryClient, workoutId])

    //Handlers
    const handleFormStatus = ()=>{
        let state = true
        if(newLog.exercise){
            state = false
        }
        return state
    }

    const handleExerciseLogSubmit = async(e:FormEvent) =>{
        e.preventDefault()
        const logPayload: Partial<ExerciseLog> = {
            ...newLog,
            session: Number(session?.id),
            log_time: new Date().toISOString()
        }
        logMutation.mutate(logPayload)
    }

    const session_exercise_form = (exercises:Record<number,Exercise>) =>{
        return(
            <form action="" className="workout-sessions-form" onSubmit={e=> handleExerciseLogSubmit(e)}>
                <div className="row g-2">
                    <div className="col-12 col-lg-6">
                        <label htmlFor="exercise">Exercise</label>
                        <select name="exercise" id="exercise" onChange={e => setNewLog({...newLog, exercise:Number(e.target.value)})}>
                            {Object.values(processed_exercises)?.map(exercise =>
                                <option key={exercise.id} value={exercise.id}>{exercise.name}</option>
                            )}
                        </select>
                    </div>
                    {
                    newLog.exercise ?
                    <>
                    {exercises[newLog.exercise].category === 'str' ?
                        <>
                            <div className="col-6">
                                <label htmlFor="series">Series (units)</label>
                                <input type="number" id="series" name="series" min="0" onChange={e => setNewLog({...newLog, 'series':Number(e.target.value)})}/>
                            </div>
                            <div className="col-6">
                                <label htmlFor="reps">Repetitions (units)</label>
                                <input type="number" name="reps" id="reps" min="0" onChange={e => setNewLog({...newLog, 'repetitions':Number(e.target.value)})}/>
                            </div>
                            <div className="col-6">
                                <label htmlFor="weight">Weight (kg)</label>
                                <input type="number" name="weight" id="weight" min="0" step="0.1" onChange={e => setNewLog({...newLog, 'weight':Number(e.target.value)})}/>
                            </div>
                        </>
                        : 
                        exercises[newLog.exercise].category === 'car' ?
                        <>
                            <div className="col-6">
                                <label htmlFor="distance">Distance (km)</label>
                                <input type="number" id="distance" name="distance" onChange={e => setNewLog({...newLog, 'distance':Number(e.target.value)})}/>
                            </div>
                            <div className="col-6">
                                <label htmlFor="duration">Duration (minutes)</label>
                                <input type="number" id="duration" name="duration" onChange={e => setNewLog({...newLog, 'duration':Number(e.target.value)})}/>
                            </div>                            
                        </>
                        : null}
                        <div className="col-12">
                            <label htmlFor="notes">Notes</label>
                            <textarea id="notes" name="notes" onChange={e => setNewLog({...newLog, 'notes':e.target.value})}></textarea>
                        </div>  
                    </>
                    : null
                    }
                </div>
                {formError &&
                <div className="row">
                    <div className="col-12">
                        <EventMessage message={formError} style="error compact"></EventMessage>
                    </div>
                </div>
                }
                <div className="row justify-content-center">
                    <div className="col-6">
                        <button className="btn-full" disabled={handleFormStatus()}>Log</button>
                    </div>
                </div>
            </form>
        )
    }

    return <Popup title="Log exercise" onClose={()=> {popupHandler(false); setFormError(null);}}>{session_exercise_form(processed_exercises)}</Popup>
}

export default ExerciseLogCreatePopup