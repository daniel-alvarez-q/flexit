import { useEffect, useState } from "react"
import { useAuth } from "../../context/AuthContext"
import { useParams } from "react-router-dom"
import { useQuery } from "@tanstack/react-query"
import type { Workout } from "../workouts/workout.types"
import type { Exercise } from "../exercises/exercises.types"
import type { WorkoutSession } from "../workouts/workout.types"
import ContentSection from "../../shared/components/ContentSection"
import EventMessage from "../../shared/components/EventMessage"
import ExercisePreview from "./views/ExercisePreview"
import ExerciseCreatePopup from "./views/ExerciseCreatePopup"
import ExerciseAssociatePopup from "./views/ExerciseAssociatePopup"
import ExerciseLogCreatePopup from "./views/ExerciseLogCreatePopup"
import WorkoutSessionList from "./views/WorkoutSessionList"
import CurrentSessionPanel from "./views/CurrentSessionPanel"
import { getDifficultyLabel } from "../../shared/utils/constants/difficulty"
import { getCategoryLabel } from "../../shared/utils/constants/category"
import { getFocusLabel } from "../../shared/utils/constants/exercise_focus"
import ExerciseListPanel from "./views/ExerciseListPanel"
import './workout.css'


function WorkoutDetails(){
    
    //Shared tools & params
    const {axios_instance} = useAuth()!
    const params = useParams()

    //Component behavior states
    const [workoutExercises, setWorkoutExercises] = useState(Array<Exercise>)
    const [activeSession, setActiveSession] = useState<WorkoutSession|null>(null)
    const [selectedExercise, setSelectedExercise] = useState<number|null>(null)
    const [error, setError] = useState<string|null>(null)
    const [creatingExercise, setCreatingExercise] = useState<boolean>(false)
    const [creatingLog, setCreatingLog] = useState<boolean>(false)
    const [associatingExercise, setAssociatingExercise] = useState<boolean>(false)

    //Param-passed workoutId
    const workoutId = Number(params.workoutId)

    //Fetch queries
    const fetch_workout = async():Promise<Workout> => {
        return await axios_instance.get(`api/workout/${params.workoutId}`).then((r) => {
            const w:Workout = r.data
            return {...w, difficulty:getDifficultyLabel(w.difficulty)}
        })
    }

    const fetch_exercises = async():Promise<Exercise[]>=>{
        return await axios_instance.get(`api/exercises`).then(r=>{
            let data:Exercise[] = r.data
             return data.map(e=>{
                return {...e, 
                    category_full:getCategoryLabel(e.category),
                    focus_area_full:getFocusLabel(e.focus_area || '')
                    }
                })
        })
    }

    const fetch_sessions = async():Promise<WorkoutSession[]> => {
        return await axios_instance.get(`api/workout/${params.workoutId}/sessions`).then(r=>{
            const data = r.data
            if(data.length){
                const sessions:WorkoutSession[] = data.map((session:WorkoutSession) =>{
                    const start_time = new Date(session.start_time)
                    let end_time = null
                    let duration = 0
                    if(session.end_time){
                        end_time = new Date(session.end_time)
                        duration = Number(((end_time.getTime() - start_time.getTime())/60000).toFixed(2))  
                    }
                    return {...session, 
                        start_time: start_time.toLocaleDateString(), 
                        end_time: end_time?.toLocaleDateString(), 
                        exercise_instances:session.exercise_logs.length,
                        duration:duration
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
    const workout = useQuery({
        queryKey:['workout', Number(params.workoutId)],
        queryFn: fetch_workout,
    })

    const exercises = useQuery({
        queryKey:['exercises'],
        queryFn: fetch_exercises,
        enabled:!!workoutId
    })

    useEffect(()=>{
        if(exercises.data){
            let e:Exercise[] = exercises.data.filter((e)=>e.workouts?.includes(workoutId))
            setWorkoutExercises(e)
        }
    }, [exercises.data])

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
                    &#128221; <strong>Description: </strong>{workout.description}
                </div>
                <div className="workout-attribute">
                    &#128202; <strong>Difficulty: </strong>{workout.difficulty}
                </div>
                {workout.source_url &&
                    <div className="workout-attribute">
                        &#128279; <strong><a href={workout.source_url} target="_blank">Source link</a></strong>
                    </div>
                }
            </div>
        )
    }

    if(workout.isPending){
        return(
            <div className="row">
                <div className="col-12">
                    <br />
                    <EventMessage style="loading" />
                </div>
            </div>
        )
    }

    if(workout.isError){
        return(
            <div className="row">
            <div className="col-12">
                <br />
                <EventMessage style="error" message={workout.error.message}/>
            </div>
        </div>
        )
    }
    
    return(
        <>
        { workout.data ?
        <>
            <div className="row">
                <div className="template-header">
                    <div className="template-title">{`${workout.data.name}`}</div>
                </div>
            </div>
            <div className="row">
                <div className="col-md-5">
                    <div className="row">
                        <div className="col-12 mb-4">
                            <ContentSection title="Workout details">
                                {workout_details(workout.data)}
                            </ContentSection>
                        </div>
                        <div className="col-12 mb-4">
                            <CurrentSessionPanel session={activeSession!} exercises={exercises.data??[]} workoutId={Number(params.workoutId)} logPopupDisplayHandler={setCreatingLog}/>
                        </div>
                        <div className="col-12 mb-4">
                            <WorkoutSessionList sessions={sessions!} isError={isErrorSessions} isPending={isPendingSessions} error={errorSessions!}/>
                        </div>
                    </div>
                </div>
                <div className="col-md-7">
                    {workoutExercises &&
                        <ExerciseListPanel       
                            exercises={workoutExercises}
                            isPending={exercises.isPending} //Inconsistent state coupling, needs to be synched with workoutExercises
                            isError={exercises.isError}     //Inconsistent state coupling, needs to be synched with workoutExercises
                            error={exercises.error}         //Inconsistent state coupling, needs to be synched with workoutExercises
                            exerciseCreateFlagHandler={setCreatingExercise}
                            exerciseAssociateFlagHandler={setAssociatingExercise}
                            exercisePreviewFlagHandler={setSelectedExercise}
                        />
                    }
                </div>
            </div>
        </>
        :
        <div className="row">
            <div className="col">
                <br />
                <EventMessage style="loading"></EventMessage>
            </div>
        </div>}
        {workout.data && creatingExercise &&
            <ExerciseCreatePopup displayHandler={setCreatingExercise} errorHandler={setError} workoutId={workout.data.id}/>
        }
        {workoutExercises && selectedExercise &&
            <ExercisePreview id={selectedExercise} displayFlagHandler={setSelectedExercise} errorHandler={setError}/>
        }
        {workoutExercises && activeSession && creatingLog &&
            <ExerciseLogCreatePopup workoutId={workoutId} session={activeSession} exercises={workoutExercises} popupHandler={setCreatingLog}/>    
        }
        {workout.data && exercises.data && associatingExercise &&
            <ExerciseAssociatePopup workout={workout.data} exercises={exercises.data} closeHandler={setAssociatingExercise}/>
        }
        </>
    )
}

export default WorkoutDetails