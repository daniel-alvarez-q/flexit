import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend} from 'chart.js';
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
import ExerciseEditPopup from "./views/ExerciseEditPopup";
import ExerciseChartComponent from "./views/ExerciseChart";
import ExerciseDeletePopup from "./views/ExerciseDelete";
import './exerciseDetail.css'


function ExerciseDetail(){

    const params:Readonly<Params<string>> = useParams()
    const {axios_instance} = useAuth()!
    const [logs,setLogs] = useState<Array<ExerciseLog>|null>(null)
    const [metrics, setMetrics] = useState<exerciseMetrics|null>(null)
    const [editingExercise, setEditingExercise] = useState<boolean>(false)
    const [deletingExercise, setDeletingExercise] = useState<boolean>(false)
    const [isDeleted, setIsDeleted] = useState<boolean>(false)

    const navigate = useNavigate()

    ChartJS.register( CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

    type exerciseMetrics = {
        'associated workouts':number[];
        'total logs':number[];
        'logs current month':number[];
    }

    const str_log_columns:columnConfig<ExerciseLog>[] = [
            {key:'log_time', header:'Log time'},
            {key:'series', header:'Series'},
            {key:'repetitions', header:'Reps'},
            {key:'weight', header:'Weight'}
    ]

    const car_log_columns:columnConfig<ExerciseLog>[] = [
        {key:'log_time', header:'Date'},
        {key:'distance', header:'Distance (km)'},
        {key:'duration', header:'Duration (mins)'},
    ]

    // Data fetch, with query_params 

    const {isPending, isError, error, data:exercise} = useQuery({
        queryKey:['exercise', params.exerciseId],
        queryFn: async (context):Promise<Exercise> =>{
            console.log(context.client)
            let query_params = {
                include:'logs,workouts_full,kpis,timeseries'
            }
            let exercise:Exercise = (await axios_instance.get(`api/exercise/${params.exerciseId}`,{params:query_params})).data
            return {...exercise, 
                category_full:getCategoryLabel(exercise.category)
            }
        }
    })


    // Set state based on fetched data
    useEffect(()=>{
        if(exercise){
            if(exercise.logs.length){
                const processed_logs:ExerciseLog[] = exercise.logs.map((log:ExerciseLog) =>{
                return {...log, log_time:new Date(log.log_time).toLocaleString()}
                })
                setLogs(processed_logs)
            }
            setMetrics({
                'associated workouts': [exercise.kpis.associated_workouts ?? 0, 0],
                'total logs': [exercise.kpis.total_logs ?? 0, 0],
                'logs current month': [exercise.kpis.logs_current_month ?? 0,0]
            })          
        }
    },[exercise])

    useEffect(()=>{
        if(isDeleted){
            navigate(-1)
        }
    },[isDeleted])

    // Managing of visual states depending on fetch status
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
            <div className="template-header">
                <div className="template-title">{exercise?.name}</div>
                <div className="template-actions">
                    <button className="btn-template-header" onClick={()=> setEditingExercise(true)}>Update</button>
                    <button className="btn-template-header" onClick={()=> setDeletingExercise(true)}>Delete</button>
                </div>
            </div>
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
        <div className="row mb-4">
            <div className="col-12">
                <ContentSection title="Timeseries metrics">
                    {/* {chartData ?
                    <Line data={chartData} options={options}></Line>
                    :<EventMessage style="warning" message="At least two exercise logs are required to track these metrics."/>} */}
                    <ExerciseChartComponent timeseries={exercise.timeseries} category={exercise.category} />
                </ContentSection>
            </div>
        </div>
        <div className="row">
            <div className="col-12 col-lg-8">
            <ContentSection title='Logged sessions'>
                {logs ?
                <Table data={logs} columns={exercise.category == 'str' ? str_log_columns : car_log_columns}/>
                :<EventMessage style="warning" message="There are no logs for this exercise."/>}
            </ContentSection>
            </div>
        </div>
        {editingExercise &&
            <ExerciseEditPopup displayHandler={setEditingExercise} exercise={exercise}/>
        }
        {deletingExercise &&
            <ExerciseDeletePopup displayHandler={setDeletingExercise} exerciseId={exercise.id} deleteFlagHandler={setIsDeleted}/>
        }
    </>
    )
}

export default ExerciseDetail