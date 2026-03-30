import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { getCategoryLabel } from "../../shared/utils/constants/category";
import type { Exercise } from "../exercises/exercises.types";
import type { ExerciseLog } from "../workout/workout.types";
import type { Params } from "react-router-dom";
import type { columnConfig } from "../../shared/components/Table/table.types";
import ContentSection from "../../shared/components/ContentSection";
import EventMessage from "../../shared/components/EventMessage";
import KpiCard from "../../shared/components/KpiCard";
import Table from "../../shared/components/Table";


function ExerciseDetail(){

    type exerciseMetrics = {
        'associated workouts':number[];
        'total logs':number[];
        'logs current month':number[];
    }

    const log_columns:columnConfig<ExerciseLog>[] = [
            {key:'log_time', header:'Log time'},
            {key:'series', header:'Series'},
            {key:'repetitions', header:'Repetitions'},
            {key:'weight', header:'Weight'}
    ]

    const params:Readonly<Params<string>> = useParams()
    const {axios_instance} = useAuth()!
    const [logs,setLogs] = useState<Array<ExerciseLog>|null>(null)
    const [metrics, setMetrics] = useState<exerciseMetrics|null>(null)

    const {isPending, isError, error, data:exercise} = useQuery({
        queryKey:['exercise', params.exerciseId],
        queryFn: async ():Promise<Exercise> =>{
            let query_params = {
                include:'logs,workouts_full,kpis'
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
            setMetrics({
                'associated workouts': [exercise.kpis.associated_workouts ?? 0, 0],
                'total logs': [exercise.kpis.total_logs ?? 0, 0],
                'logs current month': [exercise.kpis.logs_current_month ?? 0,0]
            })
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
        <div className="row mb-4">
            <div className="col-12">
                <ContentSection title="Exercise KPIs">
                    <div className="row g-3">
                        {metrics && Object.entries(metrics).map((k,i)=>{
                        return (<div className="col-6 col-lg-4" key={i}>
                            <KpiCard label={k[0]} value={k[1][0]} delta_reference={k[1][1]}/>
                        </div>)
                    })}
                </div>
                </ContentSection>
            </div>
        </div>
        <div className="row">
            <div className="col-12 col-lg-8">
            <ContentSection title='Logged sessions'>
                {logs ?
                <Table data={logs} columns={log_columns}/>
                :<EventMessage style="warning" message="There are no logs for this exercise."/>}
            </ContentSection>
            </div>
        </div>
    </>
    )
}

export default ExerciseDetail