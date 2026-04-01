import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend} from 'chart.js';
import { useAuth } from "../../context/AuthContext";
import { getCategoryLabel } from "../../shared/utils/constants/category";
import type { Exercise, ExerciseTimeseries } from "../exercises/exercises.types";
import type { ExerciseLog } from "../workout/workout.types";
import type { Params } from "react-router-dom";
import type { columnConfig } from "../../shared/components/Table/table.types";
import type { ChartData, Point } from "chart.js";
import ContentSection from "../../shared/components/ContentSection";
import EventMessage from "../../shared/components/EventMessage";
import KpiCard from "../../shared/components/KpiCard";
import Table from "../../shared/components/Table";


function ExerciseDetail(){

    ChartJS.register( CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

    type exerciseMetrics = {
        'associated workouts':number[];
        'total logs':number[];
        'logs current month':number[];
    }

    const log_columns:columnConfig<ExerciseLog>[] = [
            {key:'log_time', header:'Log time'},
            {key:'series', header:'Series'},
            {key:'repetitions', header:'Reps'},
            {key:'weight', header:'Weight'}
    ]

    const params:Readonly<Params<string>> = useParams()
    const {axios_instance} = useAuth()!
    const [logs,setLogs] = useState<Array<ExerciseLog>|null>(null)
    const [metrics, setMetrics] = useState<exerciseMetrics|null>(null)
    const [chartData, setChartData] = useState<ChartData<"line", (number | Point | null)[], unknown>|null>(null)

    // Chart configuration
    const options = {
        responsive: true,
        interaction: {
            mode: 'index' as const,
            intersect: false,
        },
        stacked: false,
        // plugins: {
        //     title: {
        //     display: true,
        //     text: 'Chart.js Line Chart - Multi Axis',
        //     },
        // },
        scales: {
            y: {
                type: 'linear' as const,
                display: true,
                position: 'left' as const,
            },
            y1: {
                type: 'linear' as const,
                display: true,
                position: 'right' as const,
                grid: {
                    drawOnChartArea: false,
                },
            },
            x:{
                display:false,
                ticks: {
                    minRotation: 0,
                    maxRotation: 0
                }
            }
        },
    };

    // Data fetch, with query_params 
    const {isPending, isError, error, data:exercise} = useQuery({
        queryKey:['exercise', params.exerciseId],
        queryFn: async ():Promise<Exercise> =>{
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
            const timeseries:ExerciseTimeseries|null = exercise.timeseries
            if(timeseries){
                const labels:string[] = (Object.keys(timeseries))
                setChartData({
                    labels,
                    datasets: [
                        {
                            label: '1RM',
                            data: labels.map((label:string)=> {
                                return timeseries[label]['1RM']
                            }),
                            borderColor: 'rgb(250 75 42)',
                            
                            yAxisID: 'y'
                        },
                        {
                            label: 'Volume',
                            data: labels.map((label:string)=> {
                                return timeseries[label]['volume']
                            }),
                            borderColor: 'rgb(215 243 31)',
                            yAxisID: 'y1'
                        },
                    ],
                })
            }
        }
    },[exercise])

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
        <div className="row mb-4">
            <div className="col-12">
                <ContentSection title="Timeseries metrics">
                    {chartData ?
                    <Line data={chartData} options={options}></Line>
                    :<EventMessage style="warning" message="At least two exercise logs are required to track these metrics."/>}
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