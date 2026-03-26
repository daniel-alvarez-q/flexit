import { useParams } from "react-router-dom";
import type { Params } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useQuery } from "@tanstack/react-query";
import type { Exercise } from "../exercises/exercises.types";
import type { ExerciseLog } from "../workout/workout.types";
import { getCategoryLabel } from "../../shared/utils/constants/category";
import EventMessage from "../../shared/components/EventMessage";
import KpiCard from "../../shared/components/KpiCard";
import { useEffect, useState } from "react";


function ExerciseDetail(){
    const params:Readonly<Params<string>> = useParams()
    const {axios_instance} = useAuth()!
    const [logs,setLogs] = useState<Array<ExerciseLog>|null>(null)

    const {isPending, isError, error, data:exercise} = useQuery({
        queryKey:['exercise', params.exerciseId],
        queryFn: async ():Promise<Exercise> =>{
            let query_params = {
                include:'logs'
            }
            let exercise:Exercise = (await axios_instance.get(`api/exercise/${params.exerciseId}`,{params:query_params})).data
            return {...exercise, 
                category_full:getCategoryLabel(exercise.category)
            }
        }
    })

    useEffect(()=>{
        if(exercise){
            setLogs(exercise.logs)
        }
    },[exercise])

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
                <EventMessage style="error" message={error.message}/>
            </div>
        </div>
        )
    }
    
    return(
    <>
        <div className="row">
            <div className="template-title">{exercise?.name}</div>
        </div>
        <div className="row">
            <div className="col-4">
                <KpiCard label="test" value={250} delta_reference={50}/>
            </div>
            <div className="col-4">
                <KpiCard label="test" value={250} delta_reference={50}/>
            </div>
            <div className="col-4">
                <KpiCard label="test" value={250} delta_reference={50}/>
            </div>
        </div>
        <div className="row">
            <p>{exercise.name}</p>
            <ul>
                {logs && logs.map((l:ExerciseLog) => <li>{l.log_time}</li>)}
            </ul>
        </div>
        
    </>
    )
}

export default ExerciseDetail