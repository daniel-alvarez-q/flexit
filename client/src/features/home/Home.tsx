import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import axios_instance from "../../request_interceptor";
import EventMessage from "../../shared/components/EventMessage";
import Table from "../../shared/components/Table";
import type { columnConfig } from "../../shared/components/Table/table.types";
import ContentSection from "../../shared/components/ContentSection";


type workoutSessionsType = {
    id:number;
    workout:number;
    workout_name:string;
    exercise_logs:object[];
    user:number;
    start_time:string;
    end_time:string;
    workout_data: object;
};

function Home(){

    const {user} = useAuth()!
    const [workoutSessions, setWorkoutSessions] = useState<workoutSessionsType[]|null>(null)
    const [error,setError] = useState<string|null>(null)
    const columns: columnConfig<workoutSessionsType>[]=[
        {key: 'id', header:'Id'},
        {key: 'workout_name', header:"Workout"},
        {key: 'start_time', header:"Start Time"},
        {key: 'end_time', header:"End Time"}
    ]


    useEffect(()=>{
        axios_instance.get('api/workoutsessions')
            .then(async (response) => {
                const sessions = response.data;
                
                // Fetch workout details for each session
                const sessionsWithWorkouts = await Promise.all(
                    sessions.map(async (session: workoutSessionsType) => {
                        try {
                            const workoutResponse = await axios_instance.get(`api/workout/${session.workout}`);
                            return {
                                ...session,
                                workout_name: workoutResponse.data.name,
                                workout_data: workoutResponse.data
                            };
                        } catch (err) {
                            console.error(`Failed to fetch workout ${session.workout}:`, err);
                            return {
                                ...session,
                                workout_name: 'Unknown',
                                workout_data: {}
                            };
                        }
                    })
                );
                
                setWorkoutSessions(sessionsWithWorkouts);
                console.log(sessionsWithWorkouts)
            })
            .catch(error => {
                setError(error.message);
                console.error(error);
            });
    },[user])

    return(
        <>
            <div className="row">
                {user ? <div className="template-title">Welcome, {user}</div> : <div className="template-title">Welcome!</div>}
            </div>
            <div className="row">
            {
                error ?
                <EventMessage message={error} style='full-width-error'></EventMessage>
                : workoutSessions ?
                <ContentSection title="Latest workout sessions">
                    <Table<workoutSessionsType> data={workoutSessions} columns={columns}></Table>
                </ContentSection>
                :<EventMessage style="loading"></EventMessage>
            }
            </div>
        </>
    )
}

export default Home