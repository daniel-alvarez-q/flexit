import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import EventMessage from "../../shared/components/EventMessage";
import Table from "../../shared/components/Table";
import type { columnConfig } from "../../shared/components/Table/table.types";
import type { WorkoutSession } from "../workout/workout.types";
import ContentSection from "../../shared/components/ContentSection";

function Home(){

    const {user, axios_instance} = useAuth()!
    const [workoutSessions, setWorkoutSessions] = useState<WorkoutSession[]|null>(null)
    const [error,setError] = useState<string|null>(null)
    const columns: columnConfig<WorkoutSession>[]=[
        {key: 'id', header:'Id'},
        {key: 'workout_name', header:"Workout"},
        {key: 'start_time', header:"Start Time"},
        {key: 'end_time', header:"End Time"}
    ]

    useEffect(()=>{
        axios_instance.get('api/workoutsessions')
            .then(async (response) => {
                const sessions = response.data.slice(0,10);
                
                // Fetch workout details for each session
                const sessionsWithWorkouts = await Promise.all(
                    sessions.map(async (session: WorkoutSession) => {
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
            <div className="row justify-content-center">
                <div className="col-12">
                    {
                    error ?
                    <EventMessage message={error} style='full-width-error'></EventMessage>
                    : workoutSessions && workoutSessions.length > 0 ?
                    <ContentSection title="Latest workout sessions">
                        <Table<WorkoutSession> data={[...workoutSessions].reverse()} columns={columns}></Table>
                    </ContentSection>
                    :<EventMessage style="loading"></EventMessage>
                    }
                </div>
            </div>
        </>
    )
}

export default Home