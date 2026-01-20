import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import axios_instance from "../../request_interceptor";
import EventMessage from "../../shared/components/EventMessage";
import HorizontalCard from "../../shared/components/HorizontalCard";
import Table from "../../shared/components/Table";
import type { columnConfig } from "../../shared/components/Table/table.types";


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
            })
            .catch(error => {
                setError(error.message);
                console.error(error);
            });
    },[user])
    //         workoutSessions.forEach(session => {
    //             axios_instance.get(`api/workout/${session.workout}`).then(response =>{
    //                 session.workout_data=response.data
    //                 console.log(session)
    //             }).catch(error =>{
    //                 console.error(error)
    //             })
    //         })
    //         }
    //     }, [workoutSessions])
    

    return(
        <>
            <h1>Latest workout sessions</h1>
            <div className="row">
            {
                error ?
                <EventMessage message={error} style='full-width-error'></EventMessage>
                : workoutSessions ?
                <Table<workoutSessionsType> data={workoutSessions} columns={columns}></Table>
                :<EventMessage style="loading"></EventMessage>
            }
            </div>
        </>
    )
}

export default Home