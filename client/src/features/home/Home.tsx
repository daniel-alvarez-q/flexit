import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
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
    const navigate = useNavigate()
    const columns: columnConfig<WorkoutSession>[]=[
        {key: 'id', header:'Id'},
        {key: 'workout_name', header:"Workout"},
        {key: 'start_time', header:"Start Time"},
        {key: 'end_time', header:"End Time"}
    ]

    useEffect(()=>{
        if(user){
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
        }
    },[user])

    const signup_action = () =>{
        navigate('/signup')
    }

    return(
        <>
            {user ?
                <>
                    <div className="row">
                        <div className="template-title">Welcome, {user}</div>
                    </div>
                    <div className="row justify-content-center">
                        <div className="col-12">
                            {
                            error ?
                            <EventMessage message={error} style='full-width-error'></EventMessage>
                            : workoutSessions ? workoutSessions.length ?
                            <ContentSection title="Latest workout sessions">
                                <Table<WorkoutSession> data={[...workoutSessions].reverse()} columns={columns}></Table>
                            </ContentSection>
                            :<EventMessage style="warning" message="No sessions have been logged, create one through any existing workout."></EventMessage>
                            :<EventMessage style="loading"></EventMessage>
                            }
                        </div>
                    </div>
                </>
                :<>
                    <div className="row">
                        <div className="template-title">Welcome to FlexIt!</div>
                    </div>
                    <div className="row justify-content-center">
                        <div className="col-12 col-md-8">
                            <ContentSection>
                                <p><strong>FlexIt!</strong> is an experimental fitness tracker designed as a convenient companionship for those who are ready to take their daily fitness routine to the next level. 
                                    <strong> FlexIt!</strong> helps you plan your sessions, track your performance, and detect opportunities for improving your workouts, unlocking untold levels of performance</p>
                                <p>Feeling curious? Create a new account and start exploring the features we have to offer!</p>
                                <button className="btn-md" onClick={() => signup_action()}>Create an account</button>
                            </ContentSection>
                        </div>
                    </div>
                </>
            }
        </>
    )
}

export default Home