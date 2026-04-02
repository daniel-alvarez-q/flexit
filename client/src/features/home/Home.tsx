import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import type { columnConfig } from "../../shared/components/Table/table.types";
import type { WorkoutSession } from "../workout/workout.types";
import type { Workout } from "../workouts/workouts.types";
import ContentSection from "../../shared/components/ContentSection";
import EventMessage from "../../shared/components/EventMessage";
import Table from "../../shared/components/Table";
import KpiCard from "../../shared/components/KpiCard";
import './home.css'

function Home(){
    const {user, axios_instance} = useAuth()!
    const navigate = useNavigate()
    const columns: columnConfig<WorkoutSession>[]=[
        {key: 'workout_name', header:"Workout"},
        {key: 'start_time', header:"Date"},
        {key: 'exercise_instances', header:'Exercises'},
        {key: 'duration', header:'Duration (mins)'},
    ]

    const {isPending, isError ,error, data:sessions} = useQuery({
        queryKey:['latest_sessions'],
        queryFn: async ():Promise<WorkoutSession[]> =>{
            const response:WorkoutSession[] = await axios_instance.get('api/workoutsessions').then(async r=>{
                if(r.data.length){
                    const s = await Promise.all(r.data.slice(0,10).map(async(s:WorkoutSession)=>{
                        const w:Workout = await axios_instance.get(`api/workout/${s.workout}`).then(r=>r.data)
                        const start_time = new Date(s.start_time)
                        let end_time = null
                        let duration = 0
                        if(s.end_time){
                            end_time = new Date(s.end_time)
                            duration = Number(((end_time.getTime() - start_time.getTime())/60000).toFixed(2))  
                        }
                        return {...s, 
                            workout_name:[w.name], 
                            start_time: start_time.toLocaleDateString(), 
                            end_time: end_time?.toLocaleDateString(), 
                            exercise_instances:s.exercise_logs.length,
                            duration:duration
                        }
                        })
                )
                    return s
                }else{
                    return []
                }
            })
            return response
        }
    })

    const {data:kpis} = useQuery({
        queryKey:['userKpis'],
        queryFn: async () => {
            const data = await axios_instance.get('api/user/metrics').then(r=>r.data)
            // console.log(`${JSON.stringify(data)}`)
            const kpis = {
                'Completed sessions':[data['total_sessions'], 0],
                'Completed exercises' : [data['total_exercise_logs'],0],
                'Completed sessions (7 days)':[data['session_count_current_week'], data['session_count_last_week']],
                'Completed exercises (7 days)': [data['logs_current_week'], data['logs_last_week']],
                'Active minutes (7 days)':[data['session_minutes_current_week'], data['session_minutes_last_week']],
                'Total volume (7 days)': [data['total_volume_current_week'], data['total_volume_last_week']]
            }
            return kpis
        }
    })

    //Handlers
    const signup_action = () =>{
        navigate('/signup')
    }

    //Visuals
    if(!user){
        return(
            <>
                <div className="row">
                    <div className="template-header">
                        <div className="template-title">Welcome to FlexIt!</div>
                    </div>
                </div>
                <div className="row justify-content-center">
                    <div className="col-12">
                        <ContentSection>
                            <p><strong>FlexIt!</strong> is an experimental fitness tracker designed as a convenient companionship for those who are ready to take their daily fitness routine to the next level. 
                                <strong> FlexIt!</strong> helps you plan your sessions, track your performance, and detect opportunities for improving your workouts, unlocking untold levels of performance.</p>
                            <p>Feeling curious? Create a new account and start exploring the features we have to offer!</p>
                            <button className="btn-md" onClick={() => signup_action()}>Create an account</button>
                        </ContentSection>
                    </div>
                </div>
            </>
        )
    }

    if(user && isPending){
        return (
        <>
        <div className="row mb-3">
            <div className="template-header">
                <div className="template-title">Welcome, {user}</div>
            </div>
        </div>
            <div className="row mb-3">
                <div className="col-12">
                    <EventMessage style="loading"></EventMessage>
                </div>
            </div>
        </>
        )
    }

    if(user && isError){
        return(
        <>
        <div className="row mb-3">
            <div className="template-header">
                <div className="template-title">Welcome, {user}</div>
            </div>
        </div>
        <div className="row mb-3">
            <div className="col-12">
                <EventMessage message={error.message} style='full-width-error'></EventMessage>
            </div>
        </div>
        </>
        )
    }

    return(
        <>
            <>
                <div className="row">
                    <div className="template-header">
                        <div className="template-title">Welcome, {user}</div>
                    </div>
                </div>
                <div className="row mb-3 gy-3 justify-content-center">
                    <div className="col-12 col-lg-4">
                        {kpis &&
                            <ContentSection title="Your stats">
                                <div className="row g-2">
                                    {Object.entries(kpis).map(((k,i) => 
                                    <div className="col-6" key={i}>
                                        <KpiCard label={k[0]} value={k[1][0]} delta_reference={k[1][1]}/>
                                    </div>
                                    ))}
                                </div>
                            </ContentSection>
                        }
                    </div>
                    <div className="col-12 col-lg-8">
                        {sessions!.length ?
                        <ContentSection title="Latest workout sessions">
                            <Table<WorkoutSession> data={sessions!} columns={columns}></Table>
                        </ContentSection>
                        :<EventMessage style="warning" message="No sessions have been logged, create one through any existing workout."></EventMessage>
                        }
                    </div>
                </div>
            </>
        </>
    )
}

export default Home