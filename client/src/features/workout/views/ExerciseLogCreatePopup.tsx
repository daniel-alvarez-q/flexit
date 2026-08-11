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
    const [submitting, setSubmitting] = useState<boolean>(false)
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
            setSubmitting(false)
            setFormError(logMutation.error.message)
        }
    },[logMutation.isError, queryClient, workoutId])

    //Handlers
    const handleFormStatus = ()=>{
        let state = true
        if(newLog.exercise && !submitting){
            state = false
        }
        return state
    }

    const handleExerciseLogSubmit = async(e:FormEvent) =>{
        e.preventDefault()
        setSubmitting(true)
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
                
                    <div className="mb-2">
                        <label htmlFor="exercise" className="form-label">Exercise</label>
                        <select className="form-control" name="exercise" id="exercise" onChange={e => setNewLog({...newLog, exercise:Number(e.target.value)})}>
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
                            <div className="mb-2">
                                <label htmlFor="series" className="form-label">Series (units)</label>
                                <input type="number" className="form-control" id="series" name="series" min="0" onChange={e => setNewLog({...newLog, 'series':Number(e.target.value)})}/>
                            </div>
                            <div className="mb-2">
                                <label htmlFor="reps" className="form-label">Reps (units)</label>
                                <input type="number" className="form-control" name="reps" id="reps" min="0" onChange={e => setNewLog({...newLog, 'repetitions':Number(e.target.value)})}/>
                            </div>
                            <div className="mb-2">
                                <label htmlFor="weight" className="form-label">Weight (kg)</label>
                                <input type="number" className="form-control" name="weight" id="weight" min="0" step="0.1" onChange={e => setNewLog({...newLog, 'weight':Number(e.target.value)})}/>
                            </div>
                        </>
                        : 
                        exercises[newLog.exercise].category === 'car' ?
                        <>
                            <div className="mb-2">
                                <label htmlFor="distance" className="form-label">Distance (km)</label>
                                <input type="number" className="form-control" id="distance" name="distance" onChange={e => setNewLog({...newLog, 'distance':Number(e.target.value)})}/>
                            </div>
                            <div className="mb-2">
                                <label htmlFor="duration" className="form-label">Duration (minutes)</label>
                                <input type="number" className="form-control" id="duration" name="duration" onChange={e => setNewLog({...newLog, 'duration':Number(e.target.value)})}/>
                            </div>                            
                        </>
                        : null}
                        <div className="mb-2">
                            <label htmlFor="notes" className="form-label">Notes</label>
                            <textarea id="notes" className="form-control" name="notes" onChange={e => setNewLog({...newLog, 'notes':e.target.value})}></textarea>
                        </div>  
                    </>
                    : null
                    }
                
                {formError &&
                    <div className="mb-2">
                        <EventMessage message={formError} style="error compact"></EventMessage>
                    </div>
                }
                <div className="row justify-content-center">
                    <div className="col-7">
                        <button className="btn-full" disabled={handleFormStatus()}>Log</button>
                    </div>
                </div>
            </form>
        )
    }

    return <Popup title="Log exercise" onClose={()=> {popupHandler(false); setFormError(null);}}>{session_exercise_form(processed_exercises)}</Popup>
}

export default ExerciseLogCreatePopup