import { AxiosError } from "axios"
import { useEffect, useState, type FormEvent } from "react"
import { useAuth } from "../../context/AuthContext"
import { useParams } from "react-router-dom"
import type { Workout } from "../workouts/workouts.types"
import type { Exercise } from "../exercises/exercises.types"
import type { WorkoutSession } from "./workout.types"
import type { columnConfig } from "../../shared/components/Table/table.types"
import type { ExerciseLog } from "./workout.types"
import ContentSection from "../../shared/components/ContentSection"
import EventMessage from "../../shared/components/EventMessage"
import Popup from "../../shared/components/Popup"
import Table from "../../shared/components/Table"
import WorkoutExerciseList from "./views/WorkoutExerciseList"
import ExercisePreview from "./views/ExercisePreview"
import ExerciseCreatePopup from "./views/ExerciseCreatePopup"
import './workout.css'

function WorkoutDetails(){
    
    // Data-bounded states
    const [workout,setWorkout] = useState<Workout|null>(null)
    const [exercises, setExercises] = useState<Record<number,Exercise>>({})
    const [sessions, setSessions] = useState<WorkoutSession[]>([])
    const [activeSession, setActiveSession] = useState<WorkoutSession|null>(null)
    const [exerciseLogs, setExerciseLogs] = useState<Record<number,Partial<ExerciseLog>[]>>({})
    const [exerciseLog, setExerciseLog] = useState<Partial<ExerciseLog>>({})
    // Component behavior states
    const [creatingExercise, setCreatingExercise] = useState<boolean>(false)
    const [creatingLog, setCreatingLog] = useState<boolean>(false)

    const [selectedExercise, setSelectedExercise] = useState<number|null>(null)

    const [error, setError] = useState<string|null>(null)
    const {axios_instance} = useAuth()!
    const params = useParams()

    // Other
    const session_columns: columnConfig<WorkoutSession>[]=[
        {key: 'id', header:'Id'},
        {key: 'start_time', header:"Start Time"},
        {key: 'end_time', header:"End Time"}
    ]

    const exercise_log_columns: columnConfig<Partial<ExerciseLog>>[] = [
        {key: 'exercise_name', header:'Exercise'},
        {key: 'exercise_category', header:'Category'},
        {key: 'log_time', header:'Log time'}
    ]

    // Effects for initial data load

    const fetch_sessions = async(id:number) =>{
        setError(null)
        await axios_instance.get(`api/workout/${id}/sessions`).then(response =>{
            setSessions(response.data)
            if(response.data && response.data.length > 0) {
                if (!response.data[0].end_time){
                setActiveSession(response.data[0])
                }else{
                    setActiveSession(null)
                }
            }
        }).catch(error => {
            console.log(error)
            setError(error.message)
        })
    }

    const fetch_workout = async () => {
        console.log(`ENV: ${import.meta.env.VITE_BACKEND_URL}`)
        setError(null)
        await axios_instance.get(`api/workout/${params.workoutId}`).then(async response =>{
            setWorkout(response.data)
        }).catch(error=>{
            setError(error.message)
            console.error(error)
        })
    }

    const create_session = async(data:object) => {
        setError(null)
        return await axios_instance.post(`api/workoutsessions`,data).then(response =>{
            console.log(response)
            return response.data
        }).catch(error => {
            console.error(error)
            setError(error.message)
            return null
        })
    }

    const update_session = async(id:number, data:Partial<WorkoutSession>) => {
        setError(null)
        await axios_instance.patch(`api/workoutsession/${id}`,data).then(response =>{
            console.log(response)
        }).catch(error => {
            console.error(error)
            setError(error.message)
        })
    }

    const create_exercise_log = async(data:Partial<ExerciseLog>) =>{
        setError(null)
        try{
            await axios_instance.post('api/exerciselogs', data=data)
            return true
        }catch(error){
            if(error instanceof AxiosError ){
                console.error(error)
                setError(error.message)
                return false
            }else{
                setError('Internal client or network connectivity error')
                return false
            }
        }
    }

    useEffect(()=>{
        const load = async()=>{
        //workout
        await fetch_workout()
        //Workout sessions
        await fetch_sessions(Number(params.workoutId))
        }

        load()
    },[params.workoutId])

    useEffect(()=>{
        let processed_logs: Record<number, Partial<ExerciseLog>[]> = {}
        
        if (sessions){
            // console.log(`Sessions ${sessions}`)
            sessions.forEach((session)=> {
                if (session.exercise_logs && session.exercise_logs.length && Object.keys(exercises).length){
                    let logs = session.exercise_logs.map((log)=>{
                        return {...log, exercise_name:exercises[log.exercise].name, exercise_category:exercises[log.exercise].category}
                    })
                    processed_logs[session.id] = logs
                }
                
            })
            setExerciseLogs(processed_logs)
        }else{
            setExerciseLogs({})
        }
        
    }, [exercises, sessions])

    //Event handlers
    const handleSessionAction = async () =>{
        setError(null)
        console.log(activeSession?.end_time)
        if(activeSession){
            const session_termination_data:Partial<WorkoutSession> = {
                'end_time': new Date().toISOString()
            }
            await update_session(activeSession.id, session_termination_data)
            await fetch_sessions(Number(params.workoutId))
        }else{
            const session_init_data:Partial<WorkoutSession> = {
                'workout':Number(params.workoutId),
                'start_time': new Date().toISOString(),
            }
            await create_session(session_init_data)
            await fetch_sessions(Number(params.workoutId))
        }
    }

    const handleExerciseLogSubmit = async(e:FormEvent) =>{
        e.preventDefault()
        const payload = {...exerciseLog, 'session': Number(activeSession?.id), log_time:(new Date()).toISOString()}
        console.log(payload)
        if (await create_exercise_log(payload)){
            await setCreatingLog(false)
            await setExerciseLog({})
            await fetch_sessions(Number(params.workoutId))
        }
    }

    // Visual elements
     const workout_details = (workout: Workout)=>{
        return(
            <div className="workout-detail">
                <div className="workout-attribute">
                    <strong>Description: </strong>{workout.description}
                </div>
                <div className="workout-attribute">
                    <strong>Difficulty: </strong>{workout.difficulty}
                </div>
                {workout.source_url &&
                    <div className="workout-attribute">
                        <strong>Source: </strong><a href={workout.source_url} target="_blank">{workout.source_url}</a>
                    </div>
                }
            </div>
        )
    }

    const session_exercise_form = (exercises:Record<number,Exercise>) =>{
        return(
            <form action="" className="workout-sessions-form" onSubmit={e=> handleExerciseLogSubmit(e)}>
                <div className="row g-2">
                    <div className="col-12 col-lg-3">
                        <label htmlFor="exercise">Exercise</label>
                        <select name="exercise" id="exercise" onChange={e => setExerciseLog({...exerciseLog, exercise:Number(e.target.value)})}>
                            {Object.values(exercises)?.map(exercise =>
                                <option key={exercise.id} value={exercise.id}>{exercise.name}</option>
                            )}
                        </select>
                    </div>
                    {
                    exerciseLog.exercise ?
                    <>
                    {exercises[exerciseLog.exercise].category === 'str' ?
                        <>
                            <div className="col-6 col-lg-3">
                                <label htmlFor="series">Series</label>
                                <input type="number" id="series" name="series" min="0" onChange={e => setExerciseLog({...exerciseLog, 'series':Number(e.target.value)})}/>
                            </div>
                            <div className="col-6 col-lg-3">
                                <label htmlFor="reps">Repetitions</label>
                                <input type="number" name="reps" id="reps" min="0" onChange={e => setExerciseLog({...exerciseLog, 'repetitions':Number(e.target.value)})}/>
                            </div>
                            <div className="col-6 col-lg-3">
                                <label htmlFor="weight">Weight</label>
                                <input type="number" name="weight" id="weight" min="0" step="0.1" onChange={e => setExerciseLog({...exerciseLog, 'weight':Number(e.target.value)})}/>
                            </div>
                        </>
                        : 
                        exercises[exerciseLog.exercise].category === 'car' ?
                        <>
                            <div className="col-6 col-lg-3">
                                <label htmlFor="distance">Distance (km)</label>
                                <input type="number" id="distance" name="distance" onChange={e => setExerciseLog({...exerciseLog, 'distance':Number(e.target.value)})}/>
                            </div>
                            <div className="col-6 col-lg-3">
                                <label htmlFor="duration">Duration (minutes)</label>
                                <input type="number" id="duration" name="duration" onChange={e => setExerciseLog({...exerciseLog, 'duration':Number(e.target.value)})}/>
                            </div>                            
                        </>
                        : null}
                        <div className="col-12 col-lg-6">
                            <label htmlFor="notes">Notes</label>
                            <textarea id="notes" name="notes" onChange={e => setExerciseLog({...exerciseLog, 'notes':e.target.value})}></textarea>
                        </div>  
                    </>
                    : null
                    }
                </div>
                {error &&
                <div className="row">
                    <div className="col-12">
                        <EventMessage message={error} style="error compact"></EventMessage>
                    </div>
                </div>
                }
                <div className="row">
                    <div className="col-6 justify-content-center">
                        <button className="btn-md">Log</button>
                    </div>
                </div>
            </form>
        )
    }
    
    return(
        <>
        { workout ?
        <>
            <div className="row">
                <div className="template-title">{`${workout.name}`}</div>
            </div>
            <div className="row g-3">
                <div className="col-12 col-sm-5">
                    <div className="row g-3">
                        <div className="col-12">
                            <ContentSection title="Workout details">
                                {workout_details(workout)}
                            </ContentSection>
                        </div>
                        <div className="col-12">
                            <ContentSection title="Current session">
                                <div className="workout-sessions">
                                    {activeSession && activeSession.exercise_logs.length === 0 ?
                                        <EventMessage style="warning" message="No exercises have been logged"></EventMessage>    
                                    :activeSession && activeSession?.exercise_logs.length > 0 &&
                                        <Table<Partial<ExerciseLog>> data={exerciseLogs[activeSession.id] || []} columns={exercise_log_columns}></Table>
                                    }
                                    <div className="row g-3">
                                        {activeSession &&
                                            <div className="col-6">
                                                <button className="btn-md btn-full" onClick={()=> setCreatingLog(!creatingLog)}>Log exercise</button>
                                            </div>
                                        }
                                        <div className={activeSession ? "col-6" : "col-12"}>
                                            <button className={activeSession ? "btn-md btn-full btn-alert" : "btn-md btn-full"} disabled={Object.keys(exercises).length === 0} onClick={()=> handleSessionAction()}>{!activeSession ? 'Start a new session' : 'End session'}</button>
                                        </div>
                                    </div>
                                    
                                </div>
                                
                            </ContentSection>
                        </div>
                        <div className="col-12">
                            <ContentSection title="Past sessions">
                                <div className="workout-sessions-table">
                                    <Table<WorkoutSession> data={sessions} columns={session_columns}></Table>
                                </div>
                            </ContentSection>
                        </div>
                    </div>
                </div>
                <div className="col-12 col-sm-7">
                    {exercises &&
                        <ContentSection title="Exercises">
                            <WorkoutExerciseList 
                                workoutId={workout.id} 
                                exercisesHandler={setExercises}
                                exerciseCreateFlagHandler={setCreatingExercise}
                                exercisePreviewFlagHandler={setSelectedExercise}
                            />
                        </ContentSection>
                    }
                </div>
            </div>
        </>
        :
        <div className="row">
            <div className="col-12">
                <br />
                <EventMessage style="loading"></EventMessage>
            </div>
        </div>}
        {workout && creatingExercise &&
            <ExerciseCreatePopup displayHandler={setCreatingExercise} errorHandler={setError} workoutId={workout.id}/>
        }
        {activeSession && exercises && creatingLog &&
            <Popup title="Log exercise" onClose={()=> {setCreatingLog(!creatingLog); setError(null);}}>{session_exercise_form(exercises)}</Popup>
        }
        {exercises && selectedExercise &&
            <ExercisePreview id={selectedExercise} displayFlagHandler={setSelectedExercise} errorHandler={setError}/>
        }
        </>
    )
}

export default WorkoutDetails