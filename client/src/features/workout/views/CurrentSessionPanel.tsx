import type { ExerciseLog, WorkoutSession } from "../workout.types";
import type { Exercise } from "../../exercises/exercises.types";
import type { columnConfig } from "../../../shared/components/Table/table.types";
import { getCategoryLabel } from "../../../shared/utils/constants/category";
import Table from "../../../shared/components/Table";
import EventMessage from "../../../shared/components/EventMessage";
import { useEffect, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "../../../context/AuthContext";
import ContentSection from "../../../shared/components/ContentSection";
import '../workout.css'

type currentSessionPanelProps = {
    session:WorkoutSession;
    exercises:Exercise[];
    workoutId:number;
    logPopupDisplayHandler:React.Dispatch<boolean>
}

const exercise_log_columns: columnConfig<Partial<ExerciseLog>>[] = [
        {key: 'exercise_name', header:'Exercise'},
        {key: 'exercise_category', header:'Category'},
        {key: 'log_time', header:'Log time'}
    ]

function CurrentSessionPanel({workoutId,exercises,session,logPopupDisplayHandler}:currentSessionPanelProps){

    //State and auxiliary constants & variables
    const [sessionError, setSessionError] = useState<string|null>(null)
    const [logs, setLogs] = useState<ExerciseLog[]>([])
    
    const {axios_instance} = useAuth()!
    const queryClient = useQueryClient()

    //API-bounded actions
    const update_session = async(session?:WorkoutSession) =>{
        setSessionError(null)
        if(session){
            const payload = {...session, 
                end_time: new Date().toISOString(), 
                exercise_logs:[]}
            return await axios_instance.patch(`api/workoutsession/${session.id}`,payload).then(r =>r)
        }
        else{
            const payload = {
                workout:workoutId, 
                start_time: new Date().toLocaleString()}
            return await axios_instance.post(`api/workoutsessions`,payload).then(r =>r)
        }
    }

    const sessionMutation = useMutation({
        mutationFn: update_session,
    })

    useEffect(() => {
        if(sessionMutation.isError){
            setSessionError(sessionMutation.error.message)
        }
    }, [sessionMutation.isError, sessionMutation.error])

    useEffect(() => {
        if(sessionMutation.isSuccess){
            queryClient.invalidateQueries({
                queryKey:['workout', workoutId, 'sessions']
            })
        }
    }, [sessionMutation.isSuccess, queryClient, workoutId])

    //Logs processing from active session
    useEffect(() =>{
        if(session){
            const processedLogs = session.exercise_logs.map((log:ExerciseLog)=>{
                const exercise = exercises.find(e=>e.id==log.exercise)
                const date = new Date(log.log_time).toLocaleString()
                return({...log,exercise_name:exercise?.name, exercise_category:getCategoryLabel(exercise?.category), log_time:date})
            })
            console.log(`CONVERTED LOGS: ${JSON.stringify(processedLogs)} | ${processedLogs.length}`)
            setLogs(processedLogs)
        } else {
            setLogs([])
        }
    }, [session, exercises])
    

    const handleSessionAction = ()=>{
        if(session){
            sessionMutation.mutate(session)
        }else{
            sessionMutation.mutate(undefined)
        }   
    }


    //Rendering
    
    
    return <>
        <ContentSection title="Current session">
            <div className="workout-table">
                {!session? <EventMessage style="info" message="Start your workout session to begin logging exercises"></EventMessage>:
                
                !logs.length ?
                    <EventMessage style="warning" message="No exercises have been logged"></EventMessage> 
                    :<Table<Partial<ExerciseLog>> data={logs} columns={exercise_log_columns}/>
                }
                <br />
                <div className="row g-3 w-100 mx-0">
                    {session &&
                        <div className="col-6">
                            <button className="btn-md btn-full" onClick={()=> logPopupDisplayHandler(true)}>Log exercise</button>
                        </div>
                    }
                    {exercises &&
                    <div className={session ? "col-6" : "col-12"}>
                        <button className={session ? "btn-md btn-full btn-alert" : "btn-md btn-full"} disabled={Object.keys(exercises).length === 0} onClick={()=> handleSessionAction()}>{!session ? 'Start a new session' : 'End session'}</button>
                    </div>
                    }
                </div>
            </div>
        </ContentSection>
    </>
}

export default CurrentSessionPanel