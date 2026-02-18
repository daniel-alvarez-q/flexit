import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import EventMessage from "../../shared/components/EventMessage";
import Table from "../../shared/components/Table";
import type { columnConfig } from "../../shared/components/Table/table.types";
import type { WorkoutSession } from "../workout/workout.types";
import type { Workout } from "../workouts/workouts.types";
import ContentSection from "../../shared/components/ContentSection";

function Home(){
    const {user, axios_instance} = useAuth()!
    const navigate = useNavigate()
    const columns: columnConfig<WorkoutSession>[]=[
        {key: 'workout_name', header:"Workout"},
        {key: 'exercise_instances', header:'# of Exercises'},
        {key: 'start_time', header:"Start Time"},
        {key: 'end_time', header:"End Time"}
    ]

    const {isPending, isError ,error, data:sessions} = useQuery({
        queryKey:['latest_sessions'],
        queryFn: async ():Promise<WorkoutSession[]> =>{
            const response:WorkoutSession[] = await axios_instance.get('api/workoutsessions').then(async r=>{
                if(r.data.length){
                    const s = await Promise.all(r.data.slice(0,10).map(async(s:WorkoutSession)=>{
                        const w:Workout = await axios_instance.get(`api/workout/${s.workout}`).then(r=>r.data)
                        console.log(s)
                        return {...s, workout_name:[w.name], exercise_instances:[s.exercise_logs.length],start_time:new Date(s.start_time).toLocaleString(),end_time:new Date(s.end_time).toLocaleString()}
                    }))
                    return s
                }else{
                    return []
                }
            })
            return response
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
                    <div className="template-title">Welcome to FlexIt!</div>
                </div>
                <div className="row justify-content-center">
                    <div className="col-12 col-md-8">
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
        <div className="row">
            <div className="template-title">Welcome, {user}</div>
        </div>
            <div className="row">
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
        <div className="row">
            <div className="template-title">Welcome, {user}</div>
        </div>
        <div className="row">
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
                    <div className="template-title">Welcome, {user}</div>
                </div>
                <div className="row justify-content-center">
                    <div className="col-12">
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