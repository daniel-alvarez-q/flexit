import { AxiosError } from "axios"
import { useEffect, useState, type FormEvent } from "react"
import { useAuth } from "../../context/AuthContext"
import { useParams } from "react-router-dom"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import type { Workout } from "../workouts/workouts.types"
import type { Exercise } from "../exercises/exercises.types"
import type { WorkoutSession } from "./workout.types"
import type { ExerciseLog } from "./workout.types"
import ContentSection from "../../shared/components/ContentSection"
import EventMessage from "../../shared/components/EventMessage"
import Popup from "../../shared/components/Popup"
import WorkoutExerciseList from "./views/WorkoutExerciseList"
import ExercisePreview from "./views/ExercisePreview"
import ExerciseCreatePopup from "./views/ExerciseCreatePopup"
import WorkoutSessionList from "./views/WorkoutSessionList"
import CurrentSessionPanel from "./views/CurrentSessionPanel"
import { getDifficultyLabel } from "../../shared/utils/constants/difficulty"
import './workout.css'
import SessionCreatePopup from "./views/SessionCreatePopup"

function WorkoutDetails(){
    
    // Data-bounded states
    const [exercises, setExercises] = useState<Record<number,Exercise>>({})

    // Component behavior states
    const [creatingExercise, setCreatingExercise] = useState<boolean>(false)
    const [activeSession, setActiveSession] = useState<WorkoutSession|null>(null)
    const [creatingLog, setCreatingLog] = useState<boolean>(false)
    const [selectedExercise, setSelectedExercise] = useState<number|null>(null)
    const [error, setError] = useState<string|null>(null)
    const {axios_instance} = useAuth()!
    const params = useParams()

    // Fetch queries initial data load
    const fetch_workout = async () => {
        return await axios_instance.get(`api/workout/${params.workoutId}`).then((r) => {
            const w:Workout = r.data
            return {...w, difficulty:getDifficultyLabel(w.difficulty)}
        })
    }

    const fetch_exercises = async()=>{
        return await axios_instance.get(`api/workout/${params.workoutId}/exercises`).then(r=>r.data)
    }

    const fetch_sessions = async():Promise<WorkoutSession[]> => {
        return await axios_instance.get(`api/workout/${params.workoutId}/sessions`).then(r=>{
            const data = r.data
            if(data.length){
                const sessions:WorkoutSession[] = data.map((session:WorkoutSession) =>{
                    const start = new Date(session.start_time)
                    let end = null
                    if(session.end_time){
                        end = new Date(session.end_time).toLocaleString()  
                    }
                    return {...session, 
                        start_time: start.toLocaleString(), 
                        end_time: end, 
                        exercise_instances:session.exercise_logs.length
                    }
                })

                const active = sessions.find(s=>!s.end_time)

                if(active){
                    setActiveSession(active)
                } else {
                    setActiveSession(null)
                }
                return sessions
            }else{
                setActiveSession(null)
                const sessions:WorkoutSession[] = []
                return sessions
            }
        })
    }

    //Data fetch
    const {isError, isPending, error:tanstackError ,data:workout} = useQuery({
        queryKey:['workout', params.workoutId],
        queryFn: fetch_workout,
    })

    const workoutId = Number(params.workoutId)

    const {data:tanstackExercises} = useQuery({
        queryKey:['workout',workoutId,'exercises'],
        queryFn: fetch_exercises,
        enabled:!!workoutId
    })

    const {isError:isErrorSessions, isPending:isPendingSessions, error:errorSessions, data:sessions} = useQuery<WorkoutSession[]>({
        queryKey:['workout', workoutId, 'sessions'],
        queryFn: fetch_sessions,
        enabled:!!workoutId,
    })

    //Error management
    useEffect(()=>{
        console.log(error)
    },[error])

    //Visual elements
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

    if(isPending){
        return(
            <div className="row">
                <div className="col-12">
                    <br />
                    <EventMessage style="loading" />
                </div>
            </div>
        )
    }

    if(isError){
        return(
            <div className="row">
            <div className="col-12">
                <br />
                <EventMessage style="error" message={tanstackError.message}/>
            </div>
        </div>
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
                            <CurrentSessionPanel session={activeSession!} exercises={tanstackExercises!} workoutId={Number(params.workoutId)} logPopupDisplayHandler={setCreatingLog}/>
                        </div>
                        <div className="col-12">
                            <ContentSection title="Past sessions">
                                <div className="workout-table">
                                    <WorkoutSessionList sessions={sessions!} isError={isErrorSessions} isPending={isPendingSessions} error={errorSessions!}/>
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
        {exercises && selectedExercise &&
            <ExercisePreview id={selectedExercise} displayFlagHandler={setSelectedExercise} errorHandler={setError}/>
        }
        {exercises && activeSession && creatingLog &&
            <SessionCreatePopup workoutId={workoutId} session={activeSession} exercises={exercises} popupHandler={setCreatingLog}/>    
        }
        </>
    )
}

export default WorkoutDetails